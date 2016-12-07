var secrets = require('./secrets');
var triggers = require('./triggers');
var Discord = require("discord.js");
var bot = new Discord.Client();

var musicBotUsername = 'Stallion Bot';
var musicThread = '128947606393978880';
var musicChannel = null;
var logChannel = null;
var voiceChannel = null;

var checkForResponseMessage = (msg, responseTrigger) => {
  if (msg.content.toLowerCase().startsWith(responseTrigger)) {
    //noinspection JSUnresolvedFunction
    msg.channel.sendMessage(triggers[responseTrigger]);
  }
};

var verifyMusicBotMessage = msgContent => {
  return msgContent.includes("Enqueued") || msgContent.includes("added by") || msgContent.includes('is now playing ');
};

bot.on("message", msg => {
  for (var property in triggers) {
    //noinspection JSUnresolvedFunction
    if(triggers.hasOwnProperty(property)) {
        checkForResponseMessage(msg, property);
    }
  }

  //noinspection JSUnresolvedFunction
  if(msg.content.startsWith("!mt") || msg.content.startsWith("!music-thread")) {
    var msgArgs = msg.content.split(' ');
    msgArgs.shift();
    if(msgArgs[0] !== undefined) {
      msg.channel.sendMessage('*Fetching last ' + msgArgs[0] + ' songs from the music thread*');
      musicChannel.fetchMessages({limit: msgArgs[0]})
        .then(messages => {
          voiceChannel.join()
            .then( () => {
              messages.array().forEach(function(val) {
                var url = val.content;
                if(url.startsWith('http')) {
                  msg.channel.sendMessage('!play ' + url);
                }
              });
              setTimeout(function() {
                voiceChannel.leave();
              }, 30000);
            })
        })
        .catch(console.error);
    }
  }

  if(msg.author.username === musicBotUsername && verifyMusicBotMessage(msg.content)) {
    logChannel.sendMessage(msg.content);
  }
});

bot.on('ready', () => {
  console.log('I am ready!');
  logChannel = bot.channels.find(val => val.name === 'djbot-log');
  musicChannel = bot.channels.find(val => val.id === musicThread);
  voiceChannel = bot.channels.find(val => val.name === 'shogun-audio-afk');
});

bot.login(secrets.token);