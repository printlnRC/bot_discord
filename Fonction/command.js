const { bot } = require("./login");
const { timeUntilNewYear, checkAndScheduleNewYearMessage } = require("./happy_new_year");
const { dockerPs } = require("./Docker_manip/docker_ps");
const { docker_compose_up } = require("./Docker_manip/docker_compose_up");


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
        },
        {
            name: "docker_ps",
            description: "Affiche les conteneurs Docker en cours d'exécution"
        },
        {
            name: "docker_compose_up",
            description: "Démarre les services définis dans le fichier docker-compose.yml"
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

    if (interaction.commandName === "docker_ps") {
        dockerPs(interaction);
    }
    if (interaction.commandName === "docker_compose_up") {
        docker_compose_up();
        interaction.reply("Les services Docker sont en cours de démarrage...");
    }
});

