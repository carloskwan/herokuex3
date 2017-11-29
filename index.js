const express = require('express')
const https = require("https")
const bodyParser = require('body-parser')
const app = express()
const request = require("request")
const rp = require('request-promise');
app.use(bodyParser.json())
app.set('port', (process.env.PORT || 5000))

const dialogs = require('./dialogs')

const REQUIRE_AUTH = true
const AUTH_TOKEN = 'an-example-token'

let dialogObject;
let givenName;
let lastName;
let conversationSessionID;


app.get('/', function (req, res) {
  res.send('Use the /webhook endpoint.')
})
app.get('/webhook', function (req, res) {
  res.send('You must POST your request')
})



app.post('/webhook', function (req, res) {
  // we expect to receive JSON data from api.ai here.
  // the payload is stored on req.body
  //console.log("user ID: "+req.body.originalRequest.data.user.userId)
  //console.log("conversation ID: "+req.body.originalRequest.data.conversation.conversationId)
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

      var options = {
        uri: 'http://hope.westus.cloudapp.azure.com:8585/v1/userRegistration',
        headers: {
          'Accept': 'application/json'
        }
        //json: true // Automatically parses the JSON string in the response
      };
      rp(options)
        .then(function (object) {

          //dialogObject=JSON.parse(object);
          dialogObject = JSON.parse(object);
          //console.log(dialogObject);
          webhookReply = "Welcome to NeuHope"
          res.status(200).json({
            /*
            "speech": "",
            "messages": [
            {
            "type": 0,
            "speech": "webhookReply"
            },
            {
            "type": 0,
            "speech": "What can I do for you?"
            }
            ],
            "source": "webhook"
            */

            source: 'webhook',
            speech: webhookReply,
            displayText: webhookReply

            /*
            "messages": [
              {
                "displayText": "Text response",
                "platform": "google",
                "textToSpeech": "Audio response",
                "type": "simple_response"
              },
              {
                "displayText": "Text response 2",
                "platform": "google",
                "textToSpeech": "Audio response 2",
                "type": "simple_response"
              },
            ]
            */
          })


        })
        .catch(function (err) {
          // API call failed...
        });




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
          //console.log(repos.status);
          phrase = 'This comes from an external API: ' + repos.status;
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
      //dialogObject=dialogs;
      //webhookReply = dialogObject.messages[2].message;//dialogs.messages[0].message;

      //webhookReply = dialogObject.messages[0].message;
      var options = {
        method: 'POST',
        uri: 'http://hope.westus.cloudapp.azure.com:8585:8585/v1/userDataInOutRequest',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: {
          "userToken": "ABwppHFa4wfa31rzy1ONC2ULZ7XkJN1taFEIdK7HWUseka21l2WdVOHG7GwQqnq4mMhbajvm0bQ921sIKDY",
          "language":"en",
            "userData": {
          
              "attributes": [
          
              ]
            }

        },
        json: true // Automatically parses the JSON string in the response
      };
      console.log(options.body);
      rp(options)
        .then(function (object) {
          //console.log(repos.status);
          //phrase = 'This comes from an external API: ' + repos.status;
          /* webhookReply = phrase;
          res.status(200).json({
            source: 'webhook',
            speech: webhookReply,
            displayText: webhookReply
          }) */
          let answer = JSON.parse(object);
          conversationSessionID=answer.conversationSessionID;
          console.log(conversationSessionID);
          webhookReply = dialogs.dialogs.messages[0].message;
          res.status(200).json({
            source: 'webhook',
            speech: webhookReply,
            displayText: webhookReply
          })
        })
        .catch(function (err) {
          // API call failed...
        });

        /*
      webhookReply = dialogs.dialogs.messages[0].message;
      res.status(200).json({
        source: 'webhook',
        speech: webhookReply,
        displayText: webhookReply
      })
      */
    },
    'userType': () => {

      //webhookReply = dialogObject.messages[1].message;//dialogs.messages[0].message;
      webhookReply = dialogs.dialogs.messages[1].message;
      res.status(200).json({
        source: 'webhook',
        speech: webhookReply,
        displayText: webhookReply
      })
    },
    'phoneNumber': () => {
      //webhookReply = dialogObject.messages[4].message
      console.log(parameters['telephone']);

      //webhookReply = dialogObject.messages[2].message;//dialogs.messages[0].message;
      webhookReply = dialogs.dialogs.messages[2].message;
      res.status(200).json({
        source: 'webhook',
        speech: webhookReply,
        displayText: webhookReply
      })
    },
    'validationCode': () => {
      //webhookReply = dialogObject.messages[1].message+" "+
      webhookReply = dialogObject.messages[3].message;//dialogs.messages[0].message;
      res.status(200).json({
        source: 'webhook',
        speech: webhookReply,
        displayText: webhookReply
      })
    },
    'userName': () => {
      givenName = parameters['given-name'];
      webhookReply = dialogObject.messages[4].message;//dialogs.messages[0].message;
      res.status(200).json({
        source: 'webhook',
        speech: webhookReply,
        displayText: webhookReply
      })
    },
    'lastName': () => {
      lastName = parameters['last-name'];
      webhookReply = dialogObject.messages[5].message;
      webhookReply = webhookReply.replace("$userFirstName", givenName);
      webhookReply = webhookReply.replace("$userLastName", lastName);



      //webhookReply = "under construction";//dialogs.messages[0].message;
      /*
      res.status(200).json({
        
        source: 'webhook',
        speech: webhookReply,
        displayText: webhookReply
      })
      */

      let webhookReply2 = dialogObject.messages[6].message;
      webhookReply2 = webhookReply2.replace("$userFirstName", givenName);
      webhookReply2 = webhookReply2.replace("$userLastName", lastName);
      res.status(200).json({
        "messages": [
          {
            "displayText": webhookReply,
            "platform": "google",
            "textToSpeech": webhookReply,
            "type": "simple_response"
          },
          {
            "displayText": webhookReply2,
            "platform": "google",
            "textToSpeech": webhookReply2,
            "type": "simple_response"
          },
        ]
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
