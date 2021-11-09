const config = require('config');
const ConnectCas = require('node-cas-client');

const casClient = new ConnectCas({
    ignore: [
      /\/ignore/
	     ],
    match: [],
    servicePrefix: config.get('CAS.servicePrefix'),
    serverPath: config.get('CAS.serverPath'),
    paths: {
	    validate: '/cas/validate',
	    serviceValidate: '/cas/serviceValidate',
	    proxy: '',
	    login: '/cas/login',
	    logout: '/cas/logout',
	    proxyCallback: ''
	},
    redirect: false,
    gateway: false,
    renew: false,
    slo: true,
    cache: {
	    enable: false,
	    ttl: 5 * 60 * 1000,
	    filter: []
	},
    fromAjax: {
	    header: 'x-client-ajax',
	    status: 418
	}
});
    
module.exports = casClient;
