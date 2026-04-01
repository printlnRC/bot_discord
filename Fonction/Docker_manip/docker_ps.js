function dockerPs(interaction) {
    var exec = require('child_process').exec;

    exec('docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}"', (error, stdout, stderr) => {
        if (error) {
            console.error(`Erreur lors de l'exécution de la commande: ${error}`);
            interaction.reply("Une erreur est survenue lors de l'exécution de la commande Docker.");
            return;
        }
        if (stderr) {
            console.error(`Erreur dans la sortie standard: ${stderr}`);
            interaction.reply("Une erreur est survenue dans la sortie de la commande Docker.");
            return;
        }

        // Envoyer le résultat dans Discord
        const response = `\`\`\`${stdout}\`\`\``; // Formater en bloc de code pour une meilleure lisibilité
        interaction.reply(response);
    });
}

module.exports = { dockerPs };