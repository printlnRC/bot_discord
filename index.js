
const { Client, GatewayIntentBits } = require("discord.js");
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
        }
    ]);
    console.log("Le bot est prêt !");
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
});


// Reconnait les gros mots
bot.on("messageCreate", async (message) => {
  // Ignorer les bots
  if (message.author.bot) return;

  // ID du salon à surveiller
  const CHANNEL_ID = process.env.CHANNEL_ID; // Remplace par l'ID de ton salon

  if (message.channel.id !== CHANNEL_ID) return;

  const motsCles = ["test", "secret", "alerte"];
  const contenu = message.content.toLowerCase();

  for (const mot of motsCles) {
    if (contenu.includes(mot)) {
      await message.channel.send(`⚠️ ${message.author.username} surveille ton l'angage : **${mot}**`);
      const contentLog = `Date: ${new Date().toISOString()}, Utilisateur: ${message.author.username}, Mot détecté: ${mot}, Message: ${message.content}\n`;
      fs.writeFile('log/logs.txt', contentLog, err => {
        if (err) console.error('Erreur lors de l\'écriture dans le fichier de log:', err);
      });
      break;
    }
  }
});

