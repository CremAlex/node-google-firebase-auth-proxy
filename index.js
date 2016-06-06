var express = require('express')
  , request = require('request')
  , cors = require('cors')
  , FirebaseTokenGenerator = require("firebase-token-generator")
  , app = express();

module.exports = function(config) {
  var tokenGenerator = new FirebaseTokenGenerator(config.firebase_secret);

  app.use(cors());

  app.get('/', function(req, res, next){
    console.log(req.query.id_token);
    var token = req.query.id_token;
    request('https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=' + token, function (error, response, body) {
      console.log(body);
      if (!error && response.statusCode == 200) {
        //valid token
        var tokenInfo = JSON.parse(body);
        console.log(tokenInfo.hd);
        //check whether aud contains clientid and hd, if provided, matches configured hd
        //TODO typeChecker aud always a String??
        const validTokenId = tokenInfo && tokenInfo.aud ? tokenInfo.aud.indexOf(config.client_id) > -1 : false;
        if( validTokenId && ( !config.hd || tokenInfo.hd === config.hd ) ) {
          var firebaseTokenInfo = {
            uid           : tokenInfo.sub,
            email         : tokenInfo.email,
            name          : tokenInfo.name,
            hd            : tokenInfo.hd,
            locale        : tokenInfo.locale,
            picture       : tokenInfo.picture ? tokenInfo.picture : null
          };
          var firebaseToken = tokenGenerator.createToken(firebaseTokenInfo);
          res.json({valid: true, token: firebaseToken});
        } else {
          res.json({valid: false});
        }
      } else {
        res.json({valid: false});
      }
    });
  });

  return app;
}
