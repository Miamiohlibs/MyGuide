#!/bin/bash

# cd into script directory
cd "$(dirname "$0")"

# create a "die" function
die() { echo "$*" 1>&2 ; exit 1; }

# setup directories if needed 
CACHE=./cache/
SUBJ=./cache/subjects
if [ ! -d "$CACHE" ]; then 
    mkdir $CACHE;
fi
if [ ! -d "$SUBJ" ]; then
    mkdir $SUBJ;
fi

# get configuration variables
KEY=`node utilities/getLibGuidesConf.js --api_key`
SITE_ID=`node utilities/getLibGuidesConf.js --site_id`
if [ -z "$KEY" ] || [ $KEY = "" ] # if key is missing or empty
    then die "Fatal error: LibGuides.api_key not defined in config/default.json"
fi
if [ -z "$SITE_ID" ] || [ $SITE_ID = "" ] # if key is missing or empty
    then die "Fatal error: LibGuides.site_id not defined in config/default.json"
fi
AUTH="&site_id=$SITE_ID&key=$KEY"
BAK="./cache/Subjects.bak.js"
FILE="./cache/Subjects.js"

# get token from LibGuide
TOKEN=$(curl --location --request POST 'https://lgapi-us.libapps.com/1.2/oauth/token' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data-urlencode "client_id=${SITE_ID}" \
  --data-urlencode "client_secret=${KEY}" \
  --data-urlencode "grant_type=client_credentials" | jq -r '.access_token')
if [ -z "$TOKEN" ] || [ $TOKEN = "" ] # if key is missing or empty
    then die "Fatal error: LibGuides access token not received"
fi

# if Subjects file exists already, create backup before downloading a new one
if [ -f ${FILE} ]
then
    cp ${FILE} ${BAK}
fi

# fetch subjects from LibGuides
URL="https://lgapi-us.libapps.com/1.2/subjects"
echo $URL
if hash json_pp 2>/dev/null; then
    CONTENT=$(curl  -gL $URL --header "Authorization: Bearer ${TOKEN}"  | json_pp)
else 
    CONTENT=$(curl  -gL $URL --header "Authorization: Bearer ${TOKEN}" )
fi
echo "const subjects = $CONTENT;" > $FILE
echo "module.exports = subjects;" >> $FILE

# fetch Librarians from LibGuides
FILE="./cache/LibrariansTemp.js"
URL="https://lgapi-us.libapps.com/1.2/accounts?expand[]=subjects&expand[]=profile"
if hash json_pp 2>/dev/null; then
    CONTENT=$(curl -gL $URL --header "Authorization: Bearer ${TOKEN}"| json_pp)
else 
    CONTENT=$(curl -gL $URL --header "Authorization: Bearer ${TOKEN}")
fi
echo "const librarians = $CONTENT;" > $FILE
echo "module.exports = librarians;" >> $FILE

# fetch Guides from LibGuides
FILE="./cache/Guides.js"
URL="https://lgapi-us.libapps.com/1.2/guides?expand=subjects,tags"
if hash json_pp 2>/dev/null; then
    CONTENT=$(curl -gL $URL --header "Authorization: Bearer ${TOKEN}" | json_pp)
else 
    CONTENT=$(curl -gL $URL --header "Authorization: Bearer ${TOKEN}")
fi
echo "const guides = $CONTENT;" > $FILE
echo "module.exports = guides;" >> $FILE

# fetch Databases from LibGuides
FILE="./cache/Databases.js"
URL="https://lgapi-us.libapps.com/1.2/assets?asset_types[]=10&expand=subjects,friendly_url"
if hash json_pp 2>/dev/null; then
    CONTENT=$(curl -gL $URL --header "Authorization: Bearer ${TOKEN}" | json_pp)
else 
    CONTENT=$(curl -gL $URL --header "Authorization: Bearer ${TOKEN}")
fi
echo "const databases = $CONTENT;" > $FILE
echo "module.exports = databases;" >> $FILE

# clean up extra html content etc from Librarians.js
node ./helpers/runCleanCache > ./cache/Librarians.js

# create each subject's file in ./cache/subjects/
node utilities/updateSubjectCache.js 

# node ./utilities/compareLGSubjects.js
# no equivalent script built yet
# do we need it?

# audit subjectCodes for syntax error detection, duplication, missing content, etc
node ./utilities/auditSubjectData.js

