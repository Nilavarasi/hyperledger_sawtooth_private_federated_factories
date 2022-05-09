const env = require('../shared/env');
const request = require('request');

SubmitToServer = (batchListBytes) => {
  if (batchListBytes == null) {
    try {
      var geturl = 'http://rest-api:8008/state/b14deb'   //endpoint used to retrieve data from an address in Sawtooth blockchain
      console.log("Getting from: " + geturl);
      let response = await fetch(geturl, {
        method: 'GET',
      })
      let responseJson = await response.json();
      var data = responseJson.data;
      var newdata = new Buffer(data, 'base64').toString();
      return newdata;
    }
    catch (error) {
      console.error(error);
    }
  } else {
    request.post({
      url: env.urlToPost,
      body: batchListBytes,
      headers: { 'Content-Type': 'application/octet-stream' }
    }, (err, response) => {
      if (err) return console.log(err);
      console.log(response.body);
      return response.body
    })
  }

}



module.exports = { SubmitToServer }

