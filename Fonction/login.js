const { Client, GatewayIntentBits } = require("discord.js");
require("dotenv").config();

const bot = new Client({
  intents: [
    GatewayIntentBits.Guilds,        // Nécessaire pour que le bot puisse interagir avec les serveurs
    GatewayIntentBits.GuildMembers,  // Important pour détecter les nouveaux membres
    GatewayIntentBits.GuildMessages, // Nécessaire pour interagir avec les messages
    GatewayIntentBits.MessageContent // Nécessaire si tu veux interagir avec des messages
  ]
});

async function startBot() {
  try {
    await bot.login(process.env.TOKEN); // Remplace par ton token sécurisé
    console.log("Connecté au bot !");
  } catch (error) {
    console.error("Impossible de se connecter au bot -", error);
  }
}

module.exports = { bot, startBot };