
const { Client, GatewayIntentBits } = require("discord.js");
const { channel } = require("node:diagnostics_channel");
const fs = require('node:fs');

const bot = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,  // Important pour détecter les nouveaux membres
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent // Nécessaire si tu veux interagir avec des messages
    ]
});

console.log("Connexion au bot...");

require("dotenv").config();


bot.login(process.env.TOKEN) // Remplace par ton token sécurisé
    .then(() => console.log("Connecté au bot !"))
    .catch((error) => console.log("Impossible de se connecter au bot - " + error));

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
    if (channel) {
      channel.send(`🚨 <@${userId}> a utilisé des mots interdits **${count} fois** !`);
    }
  }
}

function timeUntilNewYear(interaction) {
  const now = new Date();
  const currentYear = now.getFullYear();
  
  // Créer la date du 1er janvier de l'année suivante
  const nextNewYear = new Date(currentYear + 1, 0, 1, 0, 0, 0, 0);
  
  // Calculer le temps en millisecondes jusqu'au Nouvel An
  const timeUntilNewYearMs = nextNewYear.getTime() - now.getTime();
  interaction.reply(`⏰ Prochain Nouvel An prévu dans ${Math.floor(timeUntilNewYearMs / 1000)} secondes`);
}

function checkAndScheduleNewYearMessage() {
  const now = new Date();
  const currentYear = now.getFullYear();
  
  // Créer la date du 1er janvier de l'année suivante
  const nextNewYear = new Date(currentYear + 1, 0, 1, 0, 0, 0, 0);
  
  // Calculer le temps en millisecondes jusqu'au Nouvel An
  const timeUntilNewYear = nextNewYear.getTime() - now.getTime();
  
  console.log(`⏰ Prochain Nouvel An prévu dans ${Math.floor(timeUntilNewYear / 1000)} secondes`);
  
  // Programmer l'envoi du message
  setTimeout(() => {
    sendNewYearMessageToAll();
    // Reprogrammer pour chaque année
    checkAndScheduleNewYearMessage();
  }, timeUntilNewYear);
}

function sendNewYearMessageToAll() {
  bot.guilds.cache.forEach(guild => {
    // Cherche un canal général pour envoyer le message
    const channel = guild.channels.cache.find(ch => 
      ch.name === 'général' || 
      ch.name === 'general' || 
      ch.name === 'announcements' || 
      ch.name === 'annonces'
    );
    
    if (channel && channel.isTextBased()) {
      guild.members.fetch().then(members => {
        const memberList = members
          .filter(m => !m.user.bot)
          .map(m => m.toString())
          .join(', ');
        
        channel.send({  
          content: `🎆 **BONNE ANNÉE À TOUS !** 🎆 @everyone Que cette nouvelle année vous apporte bonheur, santé et succès! 🎉🥳`,
          allowedMentions: { parse: [] }
        });

      }).catch(err => console.log("Erreur lors de la récupération des membres:", err));
    }
  });
}
