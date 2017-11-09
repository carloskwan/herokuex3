const express = require('express')
const https = require("https")
const bodyParser = require('body-parser')
const app = express()
const request = require("request")
const rp = require('request-promise');
app.use(bodyParser.json())
app.set('port', (process.env.PORT || 5000))

const REQUIRE_AUTH = true
const AUTH_TOKEN = 'an-example-token'

app.get('/', function (req, res) {
  res.send('Use the /webhook endpoint.')
})
app.get('/webhook', function (req, res) {
  res.send('You must POST your request')
})

app.post('/webhook', function (req, res) {
  // we expect to receive JSON data from api.ai here.
  // the payload is stored on req.body
  console.log(req.body)

  // we have a simple authentication
  if (REQUIRE_AUTH) {
    if (req.headers['auth-token'] !== AUTH_TOKEN) {
      return res.status(401).send('Unauthorized')
    }
  }

  // and some validation too
  if (!req.body || !req.body.result || !req.body.result.parameters) {
    return res.status(400).send('Bad Request')
  }

  // the value of Action from api.ai is stored in req.body.result.action
  console.log('* Received action -- %s', req.body.result.action)

  // parameters are stored in req.body.result.parameters
  var userName = req.body.result.parameters['given-name']

  let phrase = "hi";
  /*
  let url =
  "https://maps.googleapis.com/maps/api/geocode/json?address=Florence";
request.get(url, (error, response, body) => {
  
});
*/
/*
const url =
"https://maps.googleapis.com/maps/api/geocode/json?address=Florence";
https.get(url, res => {
res.setEncoding("utf8");
let body = "";
res.on("data", data => {
  body += data;
});
res.on("end", () => {
  body = JSON.parse(body);
  phrase = body.results[0].formatted_address;  
});
});
*/

var options = {
  uri: 'https://maps.googleapis.com/maps/api/geocode/json?address=Florence',
  
  json: true // Automatically parses the JSON string in the response
};

rp(options)
  .then(function (repos) {
      console.log(repos.results[0].formatted_address);
      phrase=repos.results[0].formatted_address
  })
  .catch(function (err) {
      // API call failed...
  });

  var webhookReply = 'Hello ' + userName + '! Welcome from the webhook.' +phrase;

  // the most basic response
  res.status(200).json({
    source: 'webhook',
    speech: webhookReply,
    displayText: webhookReply
  })
})

app.listen(app.get('port'), function () {
  console.log('* Webhook service is listening on port:' + app.get('port'))
})
