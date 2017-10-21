'use strict';
var unirest = require("unirest");
var Alexa = require('alexa-sdk');

var APP_ID = "amzn1.ask.skill.d73464c9-7de3-45c2-9064-df6cc9d95d6d";
var SKILL_NAME = "Trump Quotes";
var HELP_MESSAGE = "You can ask Trump for a Quote by saying tell me a quote";
var HELP_REPROMPT = "You can ask trump for a quote by saying tell me a quote or you can quit by saying quit.";
var STOP_MESSAGE = "Goodbye.";

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        var speechOutput = "Welcome to Trump Quotes! "+HELP_MESSAGE;
        this.emit(':ask', speechOutput, HELP_REPROMPT);
    },
    'Trump': function () {
        var self = this;
        handleRequest(function(speechOutput) {
            self.emit(':tellWithCard', speechOutput, SKILL_NAME, speechOutput);
         });
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
    var speechOutput = "";
    var req = unirest("GET", "http://api.whatdoestrumpthink.com/api/v1/quotes/random");

    req.end(function (res) {
      if (res.error) throw new Error(res.error);
      console.log(res.body);
      callback(res.body.message);
    });
}
