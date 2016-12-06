var secrets = require('./secrets');
var triggers = require('./triggers');
var Discord = require("discord.js");
var bot = new Discord.Client();

var checkForResponseMessage = function(msg, responseTrigger) {
  //noinspection JSUnresolvedFunction
    if (msg.content.toLowerCase().startsWith(responseTrigger)) {
      msg.channel.sendMessage(triggers[responseTrigger]);
  }
};

var verifyMusicBotMessage = function(msgContent) {
    //noinspection JSUnresolvedFunction
    return msgContent.includes("Enqueued") || msgContent.includes("added by") || msgContent.includes('Now ');
};

var musicBotUsername = 'Stallion Bot';

bot.on("message", function(msg) {
    for (var property in triggers) {
        //noinspection JSUnresolvedFunction
        if(triggers.hasOwnProperty(property)) {
            checkForResponseMessage(msg, property);
        }
    }

    if(msg.author.username === musicBotUsername && verifyMusicBotMessage(msg.content)) {
    	bot.channels.last().sendMessage(msg.content);
    }
});

bot.on('ready', function() {
  console.log('I am ready!');
});

bot.login(secrets.token);