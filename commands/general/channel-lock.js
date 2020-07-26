exports.run = (client, message, args, ops) => {
  if (!client.lockit) client.lockit = [];
  if (!message.member.hasPermission("MANAGE_CHANNELS")) return message.reply({ embed: {color: "RED", description: "<a:error:721634593605812306> | You don't have permissions for that!"}});

  message.channel.createOverwrite(message.guild.id, {
      SEND_MESSAGES: false
    })
      message.channel.send(`<a:check:721634592930660372> | **${message.author.username}** locked the channel.`);
  };

exports.help = {
  name: 'channel-lock',
  description: "Lock the channel",
}

exports.conf = {
          aliases: ["lock-channel"],
          cooldown: 3
}
