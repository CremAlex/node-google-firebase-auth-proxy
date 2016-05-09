var authProxy = require('./index');
//var config = require('./config');

var config = {
  firebase_secret : process.env.firebase_secret,
  client_id :  process.env.client_id
};

authProxy(config).listen(process.env.PORT || 5000);
