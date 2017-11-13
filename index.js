const express = require('express')
const https = require("https")
const bodyParser = require('body-parser')
const app = express()
const request = require("request")
const rp = require('request-promise');
app.use(bodyParser.json())
app.set('port', (process.env.PORT || 5000))

const dialogs= require('./dialogs')

const REQUIRE_AUTH = true
const AUTH_TOKEN = 'an-example-token'

let dialogObject;


app.get('/', function (req, res) {
  res.send('Use the /webhook endpoint.')
})
app.get('/webhook', function (req, res) {
  res.send('You must POST your request')
})



app.post('/webhook', function (req, res) {
  // we expect to receive JSON data from api.ai here.
  // the payload is stored on req.body
  //console.log(req.body)
  // An action is a string used to identify what needs to be done in fulfillment
  let action = req.body.result.action; // https://dialogflow.com/docs/actions-and-parameters

  // Parameters are any entites that Dialogflow has extracted from the request.
  const parameters = req.body.result.parameters; // https://dialogflow.com/docs/actions-and-parameters

  // Contexts are objects used to track and store conversation state
  const inputContexts = req.body.result.contexts; // https://dialogflow.com/docs/contexts

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

  let webhookReply = "empty reply";
  const actionHandlers = {
    // The default welcome intent has been matched, welcome the user (https://dialogflow.com/docs/events#default_welcome_intent)

    'input.welcome': () => {
      /*
      var options = {
        uri: 'http://187.189.90.215:8585/v1/userRegistration',
        headers: {
          'Accept': 'application/json'
      }
        //json: true // Automatically parses the JSON string in the response
      };
      rp(options)
        .then(function (object) {
          console.log("call to neuhope server");dialogObject=dialogs;
          
          
          
        })
        .catch(function (err) {
          // API call failed...
        });
        */
        webhookReply = "Welcome from Heroku"
        res.status(200).json({
          source: 'webhook',
          speech: webhookReply,
          displayText: webhookReply
        })
        
      
    },
    // The default fallback intent has been matched, try to recover (https://dialogflow.com/docs/intents#fallback_intents)
    'input.unknown': () => {

    },
    'createAccount': () => {

    },
    // Default handler for unknown or undefined actions
    'default': () => {
      webhookReply = "This is a default response"
      res.status(200).json({
        source: 'webhook',
        speech: webhookReply,
        displayText: webhookReply
      })
    },
    'sayName': () => {
      var userName = parameters['given-name']
      let phrase = "hi";
      var options = {
        uri: 'https://dog.ceo/api/breeds/list/all',
        json: true // Automatically parses the JSON string in the response
      };
      rp(options)
        .then(function (repos) {
          console.log(repos.status);
          phrase = 'This comes from an external API: '+ repos.status;
          webhookReply = phrase;
          res.status(200).json({
            source: 'webhook',
            speech: webhookReply,
            displayText: webhookReply
          })
        })
        .catch(function (err) {
          // API call failed...
        });
    },
    'registerUser': () => {
      dialogObject=dialogs;
      webhookReply = dialogObject.dialogs.messages[0].message;//dialogs.messages[0].message;
      res.status(200).json({
        source: 'webhook',
        speech: webhookReply,
        displayText: webhookReply
      })
    },
    'userType': () => {
      
      webhookReply = dialogObject.dialogs.messages[1].message;//dialogs.messages[0].message;
      res.status(200).json({
        source: 'webhook',
        speech: webhookReply,
        displayText: webhookReply
      })
    },
    'phoneNumber': () => {
      
      webhookReply = dialogObject.dialogs.messages[2].message;//dialogs.messages[0].message;
      res.status(200).json({
        source: 'webhook',
        speech: webhookReply,
        displayText: webhookReply
      })
    }
  };

  // If undefined or unknown action use the default handler
  if (!actionHandlers[action]) {
    action = 'default';
  }

  // Run the proper handler function to handle the request from Dialogflow
  actionHandlers[action]();

})

app.listen(app.get('port'), function () {
  console.log('* Webhook service is listening on port:' + app.get('port'))
})
