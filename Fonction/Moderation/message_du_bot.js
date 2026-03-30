const { incrementUser } = require("./Moderation/find_word");


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