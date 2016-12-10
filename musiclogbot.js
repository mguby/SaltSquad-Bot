var secrets = require('./secrets');
var triggers = require('./triggers');
var Discord = require("discord.js");
var bot = new Discord.Client();

var BOT_CHANNEL_JOIN_TIME = 30000;
var MUSIC_BOT_USERNAME = 'Stallion Bot';
var MUSIC_THREAD = '128947606393978880';
var MUSIC_CHANNEL = null;
var LOG_CHANNEL = null;
var VOICE_CHANNEL = null;

var checkForResponseMessage = (aMsg, aResponseTrigger) => {
  if (aMsg.content.toLowerCase().startsWith(aResponseTrigger)) {
    //noinspection JSUnresolvedFunction
    aMsg.channel.sendMessage(triggers[aResponseTrigger]);
  }
};

var getCommandArgs  = aMsgContent => {
  var myMsgArgs = aMsgContent.split(' ');
  myMsgArgs.shift();
  return myMsgArgs;
};

var verifyMusicBotMessage = aMsgContent => {
  return aMsgContent.includes("Enqueued") || aMsgContent.includes("added by") || aMsgContent.includes('is now playing ');
};

bot.on("message", aMsg => {
  for (var myProperty in triggers) {
    //noinspection JSUnresolvedFunction
    if(triggers.hasOwnProperty(myProperty)) {
        checkForResponseMessage(aMsg, myProperty);
    }
  }

  //noinspection JSUnresolvedFunction
  if(aMsg.content.startsWith("!mt") || aMsg.content.startsWith("!music-thread")) {
    var myMsgArgs = getCommandArgs(aMsg.content);
    var myLimit = myMsgArgs[0] !== undefined ? myMsgArgs : 1;

    aMsg.channel.sendMessage('*Fetching last ' + myLimit + ' songs from the music thread*');

    var myQuery = { limit: myLimit }; // TODO add querying to command
    MUSIC_CHANNEL.fetchMessages(myQuery)
    .then(aMessages => {
      VOICE_CHANNEL.join()
      .then( () => {
        aMessages.array().forEach(function(val) {
          var myUrl = val.content;
          if(myUrl.contains('http')) {
            // var myUrlStart = myUrl.indexOf('http');
            // var trimmedBeginningUrl = myUrl.substr(myUrlStart);
            // var trimmedUrl = trimmedBeginningUrl.substr(0, trimmedBeginningUrl.indexOf(' '))
            aMsg.channel.sendMessage('!play ' + myUrl.substr(myUrl.indexOf('http'))); // get end of link
          }
        });
        setTimeout(() => VOICE_CHANNEL.leave(), BOT_CHANNEL_JOIN_TIME);
      })
    })
    .catch(console.error);
  }

  if(aMsg.author.username === MUSIC_BOT_USERNAME && verifyMusicBotMessage(aMsg.content)) {
    LOG_CHANNEL.sendMessage(aMsg.content);
  }
});

bot.on('ready', () => {
  console.log('I am ready!');
  LOG_CHANNEL = bot.channels.find(val => val.name === 'djbot-log');
  MUSIC_CHANNEL = bot.channels.find(val => val.id === MUSIC_THREAD);
  var user = bot.users.find('username', MUSIC_BOT_USERNAME);
  VOICE_CHANNEL = bot.channels.find(val => val.type === 'voice' && val.members.exists('user', user));
});

bot.login(secrets.token);