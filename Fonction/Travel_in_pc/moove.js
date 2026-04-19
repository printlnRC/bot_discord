const fs = require('node:fs');


function cd() {
    try {
        process.chdir('..');
        console.log('Répertoire changé vers :', process.cwd());
        return true;
    } catch (error) {
        console.error('Erreur lors du changement de répertoire :', error);
        return false;
    }
}

function cd_folder(folder) {
    try {
        process.chdir(folder);
        console.log('Répertoire changé vers :', process.cwd());
        return true;
    } catch (error) {
        console.error('Erreur lors du changement de répertoire :', error);
        return false;
    }
}

module.exports = { cd, cd_folder };