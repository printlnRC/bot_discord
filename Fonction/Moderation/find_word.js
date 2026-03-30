const fs = require('node:fs');
const { bot } = require("../login");

function incrementUser(userId) {
  let users = {};

  if (fs.existsSync('log/user.json')) {
    users = JSON.parse(fs.readFileSync('log/user.json', 'utf8'));
  }

  users[userId] = (users[userId] || 0) + 1;

  fs.writeFileSync('log/user.json', JSON.stringify(users, null, 2));

  checkUser(userId, users[userId]);
}

function checkUser(userId, count) {
  const CHANNEL_ID = process.env.CHANNEL_ID;
  if (count >= 3) {
    const channel = bot.channels.cache.get(CHANNEL_ID);
    MuteUser(userId);
    if (channel) {
      channel.send(`🚨 <@${userId}> a utilisé des mots interdits **${count} fois** !`);
    }
  }
}

function MuteUser(userId) {
  const guilds = bot.guilds.cache;
  guilds.forEach(guild => {
    const member = guild.members.cache.get(userId);
    if (member) {
      const targetChannel = guild.channels.cache.get(process.env.CHANNEL_ID) || guild.systemChannel;
      let muteRole = guild.roles.cache.find(role => role.name === "Muted");
      const notify = (msg) => {
        if (targetChannel && targetChannel.isTextBased()) {
          targetChannel.send(msg).catch(() => {});
        }
      };

      if (!muteRole) {
        guild.roles.create({
          name: "Muted",
          permissions: []
        }).then(role => {
          guild.channels.cache.forEach(channel => {
            channel.permissionOverwrites.edit(role, {
              SendMessages: false,
              Speak: false,
              AddReactions: false
            }).catch(() => {});
          });
          member.roles.add(role).catch(() => {});
          notify(`🔇 <@${userId}> a été muté pour utilisation excessive de mots interdits.`);
        }).catch(() => {});
      } else {
        member.roles.add(muteRole).catch(() => {});
        notify(`🔇 <@${userId}> a été muté pour utilisation excessive de mots interdits.`);
      }
    }
  });
}

module.exports = { incrementUser, checkUser, MuteUser };