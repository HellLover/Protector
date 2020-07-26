const Discord = require("discord.js"), cooldowns = new Discord.Collection();
// cooldowns will store the user when they are still in the cooldown mode.

module.exports = async (client, message) => {
  // Prevent any chit-chats with other bots, or by himself.
  if (message.author.bot || message.author === client.user) return;

  let prefix = client.config.prefix;

  let inviteLink = ["discord.gg/", "discord.com/invite", "discordapp.com/invite"];

  if(message.author.id === '544225039470428160') return;

 if (inviteLink.some(word => message.content.toLowerCase().includes(word))) {
   await message.delete();
   return message.channel.send({ embed: { color: "RED", description: `${message.author} you can't send invites to another servers!`}})
   .then(m => m.delete({timeout: 10000})) // Add this if you want the message automatically deleted.
 }

  // If the user doesn't doing any to the bot, return it.
  if (!message.content.startsWith(prefix)) return;

  let args = message.content.slice(prefix.length).trim().split(/ +/g);
  let msg = message.content.toLowerCase();
  let cmd = args.shift().toLowerCase();
  let sender = message.author;

  // Many people don't know what is message.flags.
  // We've already seen a bot who has a message.flags or they would called, parameter things.
  message.flags = []
  while (args[0] && args[0][0] === "+") {
    message.flags.push(args.shift().slice(1)); // Example: /play -soundcloud UP pice
  }

  let commandFile = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
  if (!commandFile) return; // If the commands doesn't exist, ignore it. Don't send any warning on this.

  // This will set a cooldown to a user after typing a command.
  if (!cooldowns.has(commandFile.help.name)) cooldowns.set(commandFile.help.name, new Discord.Collection());

  const member = message.member,
        now = Date.now(),
        timestamps = cooldowns.get(commandFile.help.name),
        cooldownAmount = (commandFile.conf.cooldown || 3) * 5000;

  if (!timestamps.has(member.id)) {
    if (!client.config.owners.includes(message.author.id)) {
      // If the user wasn't you or other owners that stored in config.json
      timestamps.set(member.id, now);
    }
  } else {
    const expirationTime = timestamps.get(member.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 5000;
      return message.channel.send({ embed: { color: "RED", description: `Cool down! You have to wait another **${timeLeft.toFixed(1)}** seconds.`}});
    }

    timestamps.set(member.id, now);
    setTimeout(() => timestamps.delete(member.id), cooldownAmount); // This will delete the cooldown from the user by itself.
  }

  try {
    if (!commandFile) return;
    commandFile.run(client, message, args);
  } catch (error) {
    console.log(error.message);
  } finally {
    // If you want to really know, who is typing or using your bot right now.
    const embed = new Discord.MessageEmbed()
    .setColor(0xff0000)
    .setTitle("Used a command!")
    .addField(`Member:`,`\`\`\` ${sender.tag}\`\`\``)
    .addField(`ID:`,`\`\`\` (${sender.id})\`\`\``)
    .addField(`Command:`,`\`\`\`${cmd}\`\`\``)
    .setTimestamp()
    client.channels.cache.get('730062542616920162').send(embed);
  }
}
