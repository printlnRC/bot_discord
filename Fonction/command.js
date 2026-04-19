const { bot } = require("./login");
const { timeUntilNewYear, checkAndScheduleNewYearMessage } = require("./happy_new_year");
const { dockerPs } = require("./Docker_manip/docker_ps");
const { docker_compose_up } = require("./Docker_manip/docker_compose_up");
const { cd, cd_folder } = require("./Travel_in_pc/moove");


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
        },
        {
            name: "chdir",
            description: "Change le répertoire de travail actuel au dossier parent"
        },
        {
            name: "cd_folder",
            description: "Change le répertoire de travail actuel à un dossier spécifique",
            options: [
                {
                    name: "folder",
                    description: "Nom ou chemin du dossier cible",
                    type: 3,
                    required: true
                }
            ]
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
    if (interaction.commandName === "chdir") {
        const success = cd();
        if (success) {
            interaction.reply("Le répertoire de travail a été changé vers le dossier parent.");
        } else {
            interaction.reply("Erreur : impossible de changer de répertoire.");
        }
    }
    if (interaction.commandName === "cd_folder") {
        const folder = interaction.options.getString("folder");
        const success = cd_folder(folder);
        if (success) {
            interaction.reply(`Le répertoire de travail a été changé vers ${folder}.`);
        } else {
            interaction.reply(`Erreur : impossible de changer vers ${folder}.`);
        }
    }
});

