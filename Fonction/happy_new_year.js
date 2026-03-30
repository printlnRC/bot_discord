const { bot } = require("./login"); // On importe le bot depuis l'autre fichier

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
  
  // Node.js setTimeout accepte max ~2^31-1 ms (~24.8 jours)
  const MAX_TIMEOUT = 2147483647;

  const scheduleNext = (delay) => {
    setTimeout(() => {
      if (delay >= MAX_TIMEOUT) {
        // si c'est encore trop loin, on re-planifie en fragment
        checkAndScheduleNewYearMessage();
        return;
      }

      sendNewYearMessageToAll();
      // Reprogrammer pour l’année suivante
      checkAndScheduleNewYearMessage();
    }, delay);
  };

  if (timeUntilNewYear > MAX_TIMEOUT) {
    scheduleNext(MAX_TIMEOUT);
  } else {
    scheduleNext(timeUntilNewYear);
  }
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

module.exports = { timeUntilNewYear, checkAndScheduleNewYearMessage };