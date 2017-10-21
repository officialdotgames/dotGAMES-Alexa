'use strict';
var unirest = require("unirest");
var Alexa = require('alexa-sdk');

var APP_ID = process.env.ID;
var SKILL_NAME = "dotGAMES";
var HELP_MESSAGE = "What game would you like to play?";
var HELP_REPROMPT = "You are still using dot games.";
var STOP_MESSAGE = "Goodbye.";

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        var speechOutput = "Welcome to dot Games! "+HELP_MESSAGE;
        this.emit(':ask', speechOutput, HELP_REPROMPT);
    },
    'PlayGame': function () {
        var intentObj = this.intent;
        var game = intentObj.slots.Game.value;
        var speechOutput = "Starting " + intentObj;
        this.emit(':tell', speechOutput, STOP_MESSAGE);
    },
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

function handleRequest(callback) {
    /*var speechOutput = "";
    var req = unirest("GET", "http://api.whatdoestrumpthink.com/api/v1/quotes/random");*/

    //req.end(function (res) {
    //  if (res.error) throw new Error(res.error);
    //  console.log(res.body);
      callback("Hello World");
    //});
}
