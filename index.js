require('dotenv').load();
'use strict';

var unirest = require("unirest");
var Alexa = require('alexa-sdk');
var Speech = require('ssml-builder');

var APP_ID = process.env.ID;
var SKILL_NAME = "dotGAMES";
var HELP_MESSAGE = "What game would you like to play?";
var HELP_REPROMPT = "You are still using dot games.";
var STOP_MESSAGE = "Goodbye.";

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        var speechOutput = "Welcome to dot Games!"+HELP_MESSAGE;
        this.emit(':ask', speechOutput, HELP_REPROMPT);
    },

    //USER-DEFINED INTENTS
    'CreateGame': function () {
        var ALEXA_ID = this.event.context.System.device.deviceId;
        var gameType = this.event.request.intent.slots.Game.value;
        var speechOutput = "Starting " + this.event.request.intent.slots.Game.value;

        var self = this;


        unirest.post('https://dotgames.atodd.io/api/create/party')
        .headers({'Content-Type': 'multipart/form-data'})
        .field("alexa-id", ALEXA_ID)
        .field("game-name", gameType)
        .end(function (response) {
          var party_code = response.body.party_code + '';
          var speech = new Speech();
          speech.say("Your lobby pin is: ");
          for(var i = 0; i < party_code.length; i++)
          {
            speech.pause('.25s');
            speech.say(party_code[i]);
          }
          var speechOutput = speech.ssml(true);
          //var speechOutput = "Lobby PIN: " + party_code;
          self.emit(':tell', speechOutput);
        })










        //var req = unirest("POST", "http://api.whatdoestrumpthink.com/api/v1/quotes/random");
        /*req.end(function (res) {
          if (res.error) throw new Error(res.error);
          console.log(res.body);
          callback("Hello World");
        });*/
    },

    //BUILT-IN ALEXA INTENTS
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', HELP_MESSAGE, HELP_REPROMPT);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', STOP_MESSAGE);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', STOP_MESSAGE);
    },
    'Unhandled': function () {
        var speechOutput = "I didn't understand what you said. Please try again.";
        this.emit(':ask', speechOutput, STOP_MESSAGE);
    },
};
