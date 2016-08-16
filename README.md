## Usage

The google-firebase-auth-proxy-module provides a single function which takes a config-object as first parameter and returns an express app-instance:
```js
var authProxy = require('./index');

var config = {
  firebase_secret   : process.env.firebase_secret,
  client_id         : process.env.client_id,
  hd                : process.env.hd || null
};
//DO NOT push this file with your config variables /!\
authProxy(config).listen(process.env.PORT || 5000);
```

## Heroku deployment

first clone this project `git clone https://github.com/CremAlex/proxy-whiteboard.git`

make sur heroku is installed

login to heroku `heroku login`

then create your heroku app `heroku create $name --region eu` specify the region by default it is hosted in the us

define your config variables like this `heroku config:set client_id='new_client_id'`

config variables to define : 
 * client_id : google id to verify token sent by the client
 * PORT : port
 * firebase_secret : firebase secret key to generate custom auth token
 * hd : Hosted domain, check the domain of the e-mail used for the connection.

`heroku config` to see actual config

`git push heroku master` to push code on Heroku now you can use it
