const env = require('../shared/env');
const request = require('request');
const Promise = require('bluebird');

SubmitToServer = (batchListBytes) => {
  return new Promise((resolve, reject) => {
    request.post({
      url: env.urlToPost,
      body: batchListBytes,
      headers: { 'Content-Type': 'application/octet-stream' }
    }, (err, response) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      console.log("response body", response.body);
      resolve(response.body)
    })
  })
}




module.exports = { SubmitToServer }

