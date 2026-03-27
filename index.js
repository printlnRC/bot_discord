const { Client, GatewayIntentBits } = require("discord.js");
const { channel } = require("node:diagnostics_channel");
const fs = require('node:fs');
const { bot, startBot } = require("./Fonction/login");
const { timeUntilNewYear, checkAndScheduleNewYearMessage } = require("./Fonction/happy_new_year");

startBot();

// Un seul événement "ready"
bot.on("ready", async () => {

    const guild = bot.guilds.cache.get("SERER_ID"); // Remplace par l'ID de ton serveur

    await bot.application.commands.set([
        {
            name: "ping",
            description: "Renvoie Pong!"
        },
        {
            name: "salut",
            description: "Renvoie Bonjour à toi + nom du joueur!"
        },
        {
            name: "nouvelan",
            description: "dans combien de temps le nouvel an?"
        }
    ]);
    console.log("Le bot est prêt !");
    
    // Vérification et programmation du message de Nouvel An automatique
    checkAndScheduleNewYearMessage();
});

// Message de bienvenue pour les nouveaux membres
bot.on("guildMemberAdd", member => {
    const channel = member.guild.channels.cache.find(ch => ch.name === 'nouveau'); // Utilise "nouveau"
    if (!channel) return;

    channel.send(`Bienvenue sur le serveur, ${member}! 🎉`);
});

// Un seul événement "interactionCreate" avec les deux commandes
bot.on("interactionCreate", (interaction) => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === "ping") {
        interaction.reply("Pong!");
    }


    if (interaction.commandName === "salut") {
        interaction.reply(`Bonjour à toi, ${interaction.user.username}!`);
    }

    if (interaction.commandName === "nouvelan") {
      timeUntilNewYear(interaction);
    }
});



bot.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const CHANNEL_ID = process.env.CHANNEL_ID;
  if (message.channel.id !== CHANNEL_ID) return;

  const motsCles = ["test", "secret", "alerte"];
  const contenu = message.content.toLowerCase();

  const motDetecte = motsCles.find(mot => contenu.includes(mot));
  if (!motDetecte) return;

  await message.channel.send(
    `⚠️ ${message.author.username}, surveille ton langage : **${motDetecte}**`
  );

  // Log général
  fs.appendFileSync(
    'log/logs.txt',
    `Date: ${new Date().toISOString()}, User: ${message.author.username}, Mot: ${motDetecte}, Message: ${message.content}\n`
  );

  incrementUser(message.author.id);
});

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
      let muteRole = guild.roles.cache.find(role => role.name === "Muted");
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
            });
          });
          member.roles.add(role);
          channel.send(`🔇 <@${userId}> a été muté pour utilisation excessive de mots interdits.`);
        });
      } else {
        member.roles.add(muteRole);
        channel.send(`🔇 <@${userId}> a été muté pour utilisation excessive de mots interdits.`);
      }
    }
  });
}


