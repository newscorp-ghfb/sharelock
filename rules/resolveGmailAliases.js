function (user, context, callback) {
  // Check for clientName
  if (context.clientName !== 'YOUR CLIENT NAME') {
    return callback(null, user, context);
  }

  // Check for strategy
  if (context.connection !== 'google-oauth2') {
    return callback(null, user, context);
  }

  var Axios = require('axios');
  var identityProvider = user.identities[0];
  var googleAPIUrl = 'https://people.googleapis.com/v1/people/me?personFields=emailAddresses';
  
  Axios
    .get(googleAPIUrl, {
      headers: {
        Authorization: 'Bearer ' + identityProvider.access_token 
      }
    })
    .then(function (response) {
      user.aliases = (response.data.emailAddresses || []).map(function (email) {
        return email.value;
      });
      callback(null, user, context);   
    })
    .catch(function () {
        callback(null, user, context);   
    });
}