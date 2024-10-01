
const { Client, GatewayIntentBits } = require("discord.js");

const bot = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,  // Important pour détecter les nouveaux membres
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent // Nécessaire si tu veux interagir avec des messages
    ]
});

console.log("Connexion au bot...");

bot.login("TON_TOKEN") // Remplace par ton token sécurisé
    .then(() => console.log("Connecté au bot !"))
    .catch((error) => console.log("Impossible de se connecter au bot - " + error));

bot.on("ready", async () => {
    await bot.application.commands.set([
        {
            name: "ping",
            description: "Renvoie Pong!"
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

bot.on("interactionCreate", (interaction) => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === "ping") {
        interaction.reply("Pong!");
    }
});
