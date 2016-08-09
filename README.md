## Usage

The google-firebase-auth-proxy-module provides a single function which takes a config-object as first parameter and returns an express app-instance:
```js
var config = {
  firebase_secret   : process.env.firebase_secret,
  client_id         : process.env.client_id,
  hd                : process.env.hd || null
};

//start server
authProxy.listen(8080); //the auth-proxy is now running on port 8080
```

## Heroku deploiment

heroku config to see actual config

heroku config:set client_id='client_id' to push new config var

git push heroku master after commited all changes to update the proxy



The client-side usage is documented in test/index.html. You have to perform an ordinary google-login using the google signin-api:
```html
<div id="my-signin2"></div>
<script>
  function renderButton() {
    gapi.signin2.render('my-signin2', {
      'scope': 'https://www.googleapis.com/auth/plus.login',
      'width': 200,
      'height': 50,
      'longtitle': true,
      'theme': 'dark',
      'onsuccess': onSuccess,
      'onfailure': onFailure
    });
  }
</script>
<script src="https://apis.google.com/js/platform.js?onload=renderButton" async defer></script>
```

In the `onSuccess` callback you have to obtain the id-token and send it to the auth-proxy via AJAX. The server has CORS activated, it doesn't matter where it's hosted. The auth-proxy checks whether the token is valid and is issued for the correct app and hd. If this is true, it creates a new firebase-token and returns it to the client. The format of the answer is the following json-object:
```js
{
  valid: true,
  token: 'issuedfirebasetoken'
}
```

```js
function onSuccess(googleUser) {
  console.log('Logged in as: ' + googleUser.getBasicProfile().getName());
  $.ajax('http://localhost:8081', {
    method: 'GET',
    data: {
      id_token: googleUser.getAuthResponse().id_token
    },
    success: function(data) {
      console.log(data);
      if(data.valid) {
        //TODO login to firebase using data.token
      } else {
        //TODO error-handling
      }
    }
  });
}
```

You can now use `data.token` to validate against the firebase-service. The token contains the following values (you can use them in the `auth`-object in firebase rules, see https://www.firebase.com/docs/security/api/rule/auth.html):
```js
{
  uid: 'google-id of the user',
  email: 'email-adress of the user',
  given_name: 'firstname of the user',
  family_name: 'lastname of the user'
}
```
