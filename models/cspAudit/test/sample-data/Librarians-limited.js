const objectsArray = [
  [
    '//libapps.s3.amazonaws.com/accounts/8191/profiles/5522/Librarian.png',
    'http://widgetla.com',
    '',
    '',
  ],
  ['http://anotherexample.com/image.png', '', '//widgetlc.com', ''],
  [
    '//libapps.s3.amazonaws.com/accounts/1811/profiles/5521/LibrarianName.jpg',
    '<script src="//v2.libanswers.com/load_chat.php?hash=e084d77b7dacbaf5ae7d026a72749e85"></script>\n' +
      '<div id="libchat_e084d77b7dacbaf5ae7d026a72749e85"></div>',
    '<script>\n' +
      'jQuery.getScript("https://api3.libcal.com/js/myscheduler.min.js", function() {\n' +
      `    jQuery("#mysched_48344").LibCalMySched({iid: 425, lid: 0, gid: 0, uid: 48344, width: 560, height: 680, title: 'Make an Appointment', domain: 'https://api3.libcal.com'});\n` +
      '});\n' +
      '</script>\n' +
      '\n' +
      '<!-- Place the following link anywhere in your page. Make sure the id "mysched_48344" matches with the above code: jQuery("#mysched_48344")  //-->\n' +
      '<button id="mysched_48344" href="#" class="mysched">Schedule Appointment</button>\n' +
      '<!-- Below is optional button styling  //-->\n' +
      '\n',
    '<script>\n' +
      '$(() => {\n' +
      `let emailAddress = $(".s-lib-profile-email a").attr('title');\n` +
      "let emailDiv = '<div>'+emailAddress+'</div>';\n" +
      "let websiteLogo = $('.s-lib-profile-contact a .fa-bookmark');\n" +
      "let skypeLogo = $('.s-lib-profile-contact a .fa-skype');\n" +
      'if (websiteLogo.length > 0) { \n' +
      '    $(websiteLogo).parent().before(emailDiv);\n' +
      '} else if (skypeLogo.length > 0) {\n' +
      '    $(skypeLogo).parent().before(emailDiv);\n' +
      '} else { \n' +
      '    $(".s-lib-profile-contact").append(emailDiv);\n' +
      '}\n' +
      '});\n' +
      '</script>',
  ],
];
module.exports = objectsArray;
