function docker_compose_up() {
    var exec = require('child_process').exec;

    exec('docker-compose up -d', (error, stdout, stderr) => {
        if (error) {
            console.error(`Erreur lors de l'exécution de la commande: ${error}`);
            return;
        }
        if (stderr) {
            console.error(`Erreur dans la sortie standard: ${stderr}`);
            return;
        }

        // Afficher le résultat dans la console
        console.log(`Résultat de la commande:\n${stdout}`);
    });
}

module.exports = { docker_compose_up };