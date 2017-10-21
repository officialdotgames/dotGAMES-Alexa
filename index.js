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
        .field("alexa_id", ALEXA_ID)
        .field("game_name", gameType)
        .end(function (response) {
          var speech = new Speech();
          console.log(response.statusCode);
          if(response.statusCode != 200){
            speech.say("Could not create game");
            var speechOutput = speech.ssml(true);
            self.emit(':tell', speechOutput);
          }
          else{
            var party_code = response.body.party_code + '';
            speech.say("Your lobby pin is: ");
            for(var i = 0; i < party_code.length; i++)
            {
              speech.pause('.25s');
              speech.say(party_code[i]);
            }
            var speechOutput = speech.ssml(true);
            self.emit(':tell', speechOutput);
          }
        })
    },

    'StartGame': function () {
      var ALEXA_ID = this.event.context.System.device.deviceId;
      var self = this;
      unirest.post('https://dotgames.atodd.io/api/party/start')
      .headers({'Content-Type': 'multipart/form-data'})
      .field("alexa_id", ALEXA_ID)
      .end(function (response) {
        console.log(ALEXA_ID);
        var speech = new Speech();
        console.log(response.statusCode);
        if(response.statusCode != 200){
          speech.say("Could not start game");
          var speechOutput = speech.ssml(true);
          self.emit(':tell', speechOutput);
        }
        else{
          speech.say("Game started successfully, please follow on screen instructions");
          var speechOutput = speech.ssml(true);
          self.emit(':tell', speechOutput);
        }
      })
    },

    'ReadLib': function () {
      var ALEXA_ID = this.event.context.System.device.deviceId;
      var self = this;

      unirest.get('https://dotgames.atodd.io/api/madlib')
      .headers({'Content-Type': 'multipart/form-data'})
      .field("alexa_id", ALEXA_ID)
      .end(function (response) {
        var lines = response.body.lines;
        var speech = new Speech();
        for(var i = 0; i < lines.length; i++)
        {
          speech.pause('.35s');
          speech.say(lines[i]);
        }
        var speechOutput = speech.ssml(true);
        self.emit(':tell', speechOutput);
      })
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
