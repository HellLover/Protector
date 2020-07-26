exports.run = (client, message, args, ops) => {
  if (!client.lockit) client.lockit = [];
  if (!message.member.hasPermission("MANAGE_CHANNELS")) return message.reply({ embed: {color: "RED", description: "<a:error:721634593605812306> | You don't have permission!"}});

    message.channel.createOverwrite(message.guild.id, {
      SEND_MESSAGES: true
    }).then(() => {
      message.channel.send('<a:check:721634592930660372> | Channel unlocked!');
      delete client.lockit[message.channel.id];
    }).catch(error => {
      console.log(error);
    })
  };

exports.help = {
  name: 'channel-unlock',
  description: "Unlock the channel"
}

exports.conf = {
          aliases: ["unlock-channel"],
          cooldown: 3
}
