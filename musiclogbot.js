var secrets = require('./secrets');
var triggers = require('./triggers');
var Discord = require("discord.js");
var bot = new Discord.Client();

var BOT_CHANNEL_JOIN_TIME = 30000;
var MUSIC_BOT_USERNAME = 'Stallion Bot';
var MUSIC_THREAD = '128947606393978880';
var DJ_CHANNEL = null;
var MUSIC_CHANNEL = null;
var LOG_CHANNEL = null;
var VOICE_CHANNEL = null;
var STOP_POSTING_ROLE = null;
var STOP_TALKING_ROLE = null;

var checkForResponseMessage = (aMsg, aResponseTrigger) => {
  if (aMsg.content.toLowerCase().startsWith(aResponseTrigger)) {
    //noinspection JSUnresolvedFunction
    aMsg.channel.send(triggers[aResponseTrigger]);
  }
};

var getCommandArgs  = aMsgContent => {
  var myMsgArgs = aMsgContent.split(' ');
  myMsgArgs.shift();
  return myMsgArgs;
};

var verifyMusicBotMessage = aMsgContent => {
  return (aMsgContent.includes("your song") && aMsgContent.includes('is now playing in'))
    || aMsgContent.includes("Now Playing:");
};

function removeStopRole(member, msg, role) {
  member.roles.remove(role);
  msg.channel.send("<@" +emember.user.id + "> can post again");
}


bot.on("message", aMsg => {
  for (var myProperty in triggers) {
    //noinspection JSUnresolvedFunction
    if(triggers.hasOwnProperty(myProperty)) {
        checkForResponseMessage(aMsg, myProperty);
    }
  }

  if(aMsg.content.startsWith("stop posting")) {
    var myUser = aMsg.mentions.users.first();
    const myDeleteEmoji = bot.emojis.cache.find(emoji => emoji.name === 'deletenephew');
    if(typeof myUser !== 'undefined') {
      aMsg.channel.send("Does <@" + myUser.id + "> need to stop posting? Need 6 <:deletenephew:" + myDeleteEmoji.id + "> votes in 30 seconds").then((myVote) => {
        myVote.react(myDeleteEmoji);
        const filter = (reaction, user) => {
          return reaction.emoji.name === 'deletenephew';
        };
        myVote.awaitReactions(filter, {max: 6, time: 30000, errors: ['time']})
          .then(collected => {
            var myMember = aMsg.mentions.members.first();
            const myCeelo = bot.emojis.cache.find(emoji => emoji.name === 'ceelo');
            console.log(myMember);
            myMember.roles.add(STOP_POSTING_ROLE);
            aMsg.channel.send("<:ceelo:" + myCeelo + "> <@" + myUser.id + "> Bro stop posting for 10 minutes");
            setTimeout(removeStopRole, 600000, myMember, aMsg, STOP_POSTING_ROLE);
          })
          .catch(collected => {
            const myYikesEmoji = bot.emojis.cache.find(emoji => emoji.name === 'yikes');
            aMsg.channel.send("Time's up, not enough votes for <@" + myUser.id + "> <:yikes:" + myYikesEmoji + ">");
          });
      });
    }
  }

    if(aMsg.content.startsWith("stop talking")) {
    var myUser = aMsg.mentions.users.first();
    const myDeleteEmoji = bot.emojis.cache.find(emoji => emoji.name === 'deletenephew');
    if(typeof myUser !== 'undefined') {
      aMsg.channel.send("Does <@" + myUser.id + "> need to stop talking? Need 6 <:deletenephew:" + myDeleteEmoji.id + "> votes in 30 seconds").then((myVote) => {
        myVote.react(myDeleteEmoji);
        const filter = (reaction, user) => {
          return reaction.emoji.name === 'deletenephew';
        };
        myVote.awaitReactions(filter, {max: 6, time: 30000, errors: ['time']})
          .then(collected => {
            var myMember = aMsg.mentions.members.first();
            const myCeelo = bot.emojis.cache.find(emoji => emoji.name === 'ceelo');
            console.log(myMember);
            myMember.roles.add(STOP_TALKING_ROLE);
            aMsg.channel.send("<:ceelo:" + myCeelo + "> <@" + myUser.id + "> Bro stop talking for 10 minutes");
            setTimeout(removeStopRole, 600000, myMember, aMsg, STOP_TALKING_ROLE);
          })
          .catch(collected => {
            const myYikesEmoji = bot.emojis.cache.find(emoji => emoji.name === 'yikes');
            aMsg.channel.send("Time's up, not enough votes for <@" + myUser.id + "> <:yikes:" + myYikesEmoji + ">");
          });
      });
    }
  }
});

bot.on('ready', () => {
  STOP_POSTING_ROLE = bot.guilds.cache.find(myVar => myVar.name === 'SaltSquad').roles.cache.find(role => role.id === '384153116615901185');
  STOP_TALKING_ROLE = bot.guilds.cache.find(myVar => myVar.name === 'SaltSquad').roles.cache.find(role => role.id === '792080302657896488');
  console.log(STOP_TALKING_ROLE);
  console.log('I am ready!');
});

bot.login(secrets.token);
