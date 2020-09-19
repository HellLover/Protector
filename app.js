///////////////////////////////// General /////////////////////////////////

const Discord = require("discord.js");
const Protector = require("./handlers/ClientBuilder.js");
const client = new Protector({ partials: ['MESSAGE', 'REACTION']});
const { token, prefix, ownerID } = require('./config.json');
const { MessageEmbed } = require("discord.js");
const Canvacord = require("canvacord");
const canvas = new Canvacord();
const logs = require("discord-logs");
logs(client)

///////////////////////////////// Defined tools /////////////////////////////////

let stats = {
    serverID: '602514533764038709',
    total: "736953819497365616",
    channels: "741266343361249330",
    roles: "741266387116228688"
}

const TempChannels = require("discord-temp-channels");
const tempChannels = new TempChannels(client);

tempChannels.registerChannel("747060794054934588", {
    childCategory: "747060407339974658",
    childAutoDeleteIfEmpty: true,
    childAutoDeleteIfOwnerLeaves: true,
    childMaxUsers: 5,
    childFormat: (member, count) => `Войс ${member.user.username}`
});

client.on('ready', async () => {
  client.user.setActivity(`HellLover Team`, {
    type: "STREAMING",
    url: "https://www.twitch.tv/samohelllover"
  })
  console.log(`${client.user.username} Is Online !`)
})

///////////////////////////////// Handlers and commands /////////////////////////////////

client.on('message', async message => {

let args = message.content.slice(prefix.length).trim().split(' ');
let cmd = args.shift().toLowerCase();
if (message.author.bot) return;
if(message.channel.type == "dm") return;
    
    function Check(str) {
    if (
      client.emojis.cache.find(emoji => emoji.name === str) ||
      message.guild.emojis.cache.find(emoji => emoji.name === str)
    ) {
      return true;
    } else {
      return false;
    }
  }
    if (message.content.startsWith(":") && message.content.endsWith(":")) {
    let EmojiName = message.content.slice(1, -1);

    if (Check(EmojiName) === true) {
      const channel = client.channels.cache.get(message.channel.id);
      try {
        let webhooks = await channel.fetchWebhooks();
        let webhook = webhooks.first();
        if (webhook === undefined || null || !webhook) {
          let Created = channel
            .createWebhook("HellLover")
            .then(async webhook => {
              const emoji =
                client.emojis.cache.find(e => e.name == EmojiName).id ||
                message.guild.emojis.cache.find(e => e.name === EmojiName).id;

              await webhook.send(`${client.emojis.cache.get(emoji)}`, {
                username: message.author.username,
                avatarURL: message.author.avatarURL({ dynamic: true })
              });
              message.delete();
            });
        }

        const emoji =
          client.emojis.cache.find(e => e.name == EmojiName).id ||
          message.guild.emojis.cache.find(e => e.name === EmojiName).id;

        await webhook.send(`${client.emojis.cache.get(emoji)}`, {
          username: message.author.username,
          avatarURL: message.author.avatarURL({ dynamic: true })
        });
        message.delete();
      } catch (error) {
        message.channel.send({ embed: { color: "RED", description: `Error: \n${error}` }});
      }
    }
  }


try {
  delete require.cache[require.resolve(`./commands/${cmd}.js`)]

  let ops = {
    ownerID: ownerID
  }
  let commandFile = require(`./commands/${cmd}.js`);
  commandFile.run(client, message, args, ops);
}

catch(e) {
   }
  
});

///////////////////////////////// ... /////////////////////////////////

client.on('messageReactionAdd', async (reaction, user) => {
     if (reaction.message.partial) await reaction.message.fetch();
     if (reaction.partial) await reaction.fetch();
  
  if (user.bot) return;
  if (!reaction.message.guild) return;
  if (reaction.message.guild.id !== "602514533764038709") return;
  
  if (reaction.message.id === "756903700592590938" || reaction.message.id === "756902515039010946") {
    if (reaction.emoji.name === "📹") {
      await reaction.message.guild.members.cache.get(user.id).roles.add("755370817805877338") // Новое видео
    }
    
    if (reaction.emoji.name === "🎉") {
      await reaction.message.guild.members.cache.get(user.id).roles.add("756897598048305233"); // Розыгрыши
    }
      
    if (reaction.emoji.name === "📰") {
      await reaction.message.guild.members.cache.get(user.id).roles.add("756605880384094219") // Новости
    }
      if (reaction.emoji.name === "❤️") {
      await reaction.message.guild.members.cache.get(user.id).roles.add("756896008608153621") // Valorant
    }
      if (reaction.emoji.name === "🧡") {
      await reaction.message.guild.members.cache.get(user.id).roles.add("756896059028013148") // GTA 5
    }
      if (reaction.emoji.name === "💚") {
      await reaction.message.guild.members.cache.get(user.id).roles.add("756896116426932314") // Minecraft
    }
      if (reaction.emoji.name === "💙") {
      await reaction.message.guild.members.cache.get(user.id).roles.add("756896379720302703") // Rocket League
    }
      if (reaction.emoji.name === "🤎") {
      await reaction.message.guild.members.cache.get(user.id).roles.add("756896454571720807") // Watch Dogs
    }
      if (reaction.emoji.name === "💜") {
      await reaction.message.guild.members.cache.get(user.id).roles.add("756896001691746435") // CS:GO
    }
      if (reaction.emoji.name === "🖤") {
      await reaction.message.guild.members.cache.get(user.id).roles.add("756896006884425728") // PUBG
    }
  } else {
    return;
  }
    const handleStarboard = async () => {
        const starboard = client.channels.cache.find(channel => channel.name.toLowerCase() === '〘🌟〙・starboard');
        const msgs = await starboard.messages.fetch({ limit: 100 });
        const existingMsg = msgs.find(msg =>
            msg.embeds.length === 1 ?
            (msg.embeds[0].footer.text.startsWith(reaction.message.id) ? true : false) : false);
        if(existingMsg) existingMsg.edit(`${reaction.count} - 🌟 ${reaction.message}`);
        else {
            const embed = new MessageEmbed()
                .setAuthor(reaction.message.author.tag, reaction.message.author.displayAvatarURL())
                .setColor(0xff0000)
                .addField('Ссылка', `[Ссылка на сообщение](${reaction.message.url})`)
                .setThumbnail("https://pngimg.com/uploads/star/star_PNG41495.png")
                .setDescription(reaction.message.content)
                .setTimestamp()
                .setFooter(reaction.message.id + ' - ');
            if(starboard)
                starboard.send('1 - 🌟', embed);
        }
    }
    if(reaction.emoji.name === '🌟') {
        if(reaction.message.channel.name.toLowerCase() === '〘🌟〙・starboard') return;
        if(reaction.message.partial) {
            await reaction.fetch();
            await reaction.message.fetch();
            handleStarboard();
        }
        else
            handleStarboard();
    }
});

client.on('messageReactionRemove', async (reaction, user) => {
     if (reaction.message.partial) await reaction.message.fetch();
     if (reaction.partial) await reaction.fetch();
  
  if (user.bot) return;
  if (!reaction.message.guild) return;
  if (reaction.message.guild.id !== "602514533764038709") return;
  
  if (reaction.message.id === "756903700592590938" || reaction.message.id === "756902515039010946") {
    if (reaction.emoji.name === "📹") {
      await reaction.message.guild.members.cache.get(user.id).roles.remove("755370817805877338") // Новое видео
    }
    
    if (reaction.emoji.name === "🎉") {
      await reaction.message.guild.members.cache.get(user.id).roles.remove("756897598048305233"); // Розыгрыши
    }
      
    if (reaction.emoji.name === "📰") {
      await reaction.message.guild.members.cache.get(user.id).roles.remove("756605880384094219") // Новости
    }
      if (reaction.emoji.name === "❤️") {
      await reaction.message.guild.members.cache.get(user.id).roles.remove("756896008608153621") // Valorant
    }
      if (reaction.emoji.name === "🧡") {
      await reaction.message.guild.members.cache.get(user.id).roles.remove("756896059028013148") // GTA 5
    }
      if (reaction.emoji.name === "💚") {
      await reaction.message.guild.members.cache.get(user.id).roles.remove("756896116426932314") // Minecraft
    }
      if (reaction.emoji.name === "💙") {
      await reaction.message.guild.members.cache.get(user.id).roles.remove("756896379720302703") // Rocket League
    }
      if (reaction.emoji.name === "🤎") {
      await reaction.message.guild.members.cache.get(user.id).roles.remove("756896454571720807") // Watch Dogs
    }
      if (reaction.emoji.name === "💜") {
      await reaction.message.guild.members.cache.get(user.id).roles.remove("756896001691746435") // CS:GO
    }
      if (reaction.emoji.name === "🖤") {
      await reaction.message.guild.members.cache.get(user.id).roles.remove("756896006884425728") // PUBG
    }
  } else {
    return;
  }
    const handleStarboard = async () => {
        const starboard = client.channels.cache.find(channel => channel.name.toLowerCase() === '〘🌟〙・starboard');
        const msgs = await starboard.messages.fetch({ limit: 100 });
        const existingMsg = msgs.find(msg =>
            msg.embeds.length === 1 ?
            (msg.embeds[0].footer.text.startsWith(reaction.message.id) ? true : false) : false);
        if(existingMsg) {
            if(reaction.count === 0)
                existingMsg.delete({ timeout: 2500 });
            else
                existingMsg.edit(`${reaction.count} - 🌟`)
        };
    }
    if(reaction.emoji.name === '🌟') {
        if(reaction.message.channel.name.toLowerCase() === '〘🌟〙・starboard') return;
        if(reaction.message.partial) {
            await reaction.fetch();
            await reaction.message.fetch();
            handleStarboard();
        }
        else
            handleStarboard();
    }
});

///////////////////////////////// Handlers /////////////////////////////////

require("./handlers/module.js")(client);
require("./handlers/Event.js")(client);

client.package = require("./package.json");
client.on("warn", console.warn); // This will warn you via logs if there was something wrong with your bot.
client.on("error", console.error); // This will send you an error message via logs if there was something missing with your coding.

///////////////////////////////// Weclome and Leave messages /////////////////////////////////

client.on('guildMemberAdd', async member => {

  var role = member.guild.roles.cache.find(role => role.name == 'Member');

  member.roles.add(role)

  let welChannel = client.channels.cache.get("664901915326414879")

    if(welChannel === null) {
      return;
    }

  let img = await canvas.welcome({ username: member.user.username, discrim: member.user.discriminator, avatarURL: member.user.displayAvatarURL({ format: "png" }) });
  const attachment = new Discord.MessageAttachment(img, "welcome.png")
  welChannel.send(attachment)
    
    if(member.guild.id !== stats.serverID) return;
      client.channels.cache.get(stats.total).setName(`Всего участников: ${member.guild.memberCount}`);
      client.channels.cache.get(stats.channels).setName(`Каналов: ${member.guild.channels.cache.size}`);
      client.channels.cache.get(stats.roles).setName(`Ролей: ${member.guild.roles.cache.size}`);
  });

  client.on("guildMemberRemove", async member => {
  let leaveChannel = client.channels.cache.get("755756966453706822")

    if(leaveChannel === null) {
      return;
    }

  let img = await canvas.leave({ username: member.user.username, discrim: member.user.discriminator, avatarURL: member.user.displayAvatarURL({ format: "png" }) });
  const attachment = new Discord.MessageAttachment(img, "leave.png")
  leaveChannel.send(attachment)
      
      if(member.guild.id !== stats.serverID) return;
      client.channels.cache.get(stats.total).setName(`Всего участников: ${member.guild.memberCount}`);
      client.channels.cache.get(stats.channels).setName(`Каналов: ${member.guild.channels.cache.size}`);
      client.channels.cache.get(stats.roles).setName(`Ролей: ${member.guild.roles.cache.size}`);
      
})

///////////////////////////////// Logs ///////////////////////////////////

client.on('messageDelete', message => {
    if(!message.partial) {
        const channel = client.channels.cache.get('736937914805649419');
        if(!message.content) return;
        if(channel) {
            const embed = new MessageEmbed()
                .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL())
                .setColor(0xff0000)
                .setDescription(`Сообщение было удалено в <#${message.channel.id}>`)
                .addField("Пользователь", message.author)
                .addField("Содержание", message.content)
                .addField("ID", `\`\`\`css\nUser: ${message.author.id}\nMessage: ${message.id}\n\`\`\``)
                .addField("Дата", message.createdAt.toLocaleString())
                .setFooter("Protector", "https://media2.giphy.com/media/VelhTbcFUDdDOrmFUL/giphy.gif")
            channel.send(embed);
        }
    }
});

client.on("guildMemberRoleAdd", (member, role) => {
  const channel = client.channels.cache.get("736937914805649419");
  const embed = new Discord.MessageEmbed()
  .setAuthor(`${member.user.tag}`, member.user.displayAvatarURL({ dynamic: true }))
  .setThumbnail(member.user.displayAvatarURL({ size: 2048, dynamic: true }))
  .setDescription(`Пользователю ${member.user} было добавлено роль ${role}.`)
  .setColor(0xff0000)
  .setTimestamp()
  .setFooter("Protector", "https://media2.giphy.com/media/VelhTbcFUDdDOrmFUL/giphy.gif")
  channel.send(embed)
})

client.on("guildMemberRoleRemove", (member, role) => {
  const channel = client.channels.cache.get("736937914805649419");
  const embed = new Discord.MessageEmbed()
  .setAuthor(`${member.user.tag}`, member.user.displayAvatarURL({ dynamic: true }))
  .setThumbnail(member.user.displayAvatarURL({ size: 2048, dynamic: true }))
  .setDescription(`У пользователя ${member.user} было убрано роль ${role}.`)
  .setColor(0xff0000)
  .setTimestamp()
  .setFooter("Protector", "https://media2.giphy.com/media/VelhTbcFUDdDOrmFUL/giphy.gif")
  channel.send(embed)
})

client.on("guildMemberNicknameUpdate", (member, oldNickname, newNickname) => {
  const channel = client.channels.cache.get("739897234094817321");
  const embed = new Discord.MessageEmbed()
  .setAuthor(`${member.user.tag}`, member.user.displayAvatarURL({ dynamic: true }))
  .setThumbnail(member.user.displayAvatarURL({ size: 2048, dynamic: true }))
  .setDescription(`${member.user} сменил никнейм`)
  .setColor(0xff0000)
  .addField("Старый никнейм", `${oldNickname}`)
  .addField("Новый никнейм", `${newNickname}`)
  .setTimestamp()
  .setFooter("Protector", "https://media2.giphy.com/media/VelhTbcFUDdDOrmFUL/giphy.gif")
  channel.send(embed)
})

client.on("messageContentEdited", (message, oldContent, newContent) => {
  const channel = client.channels.cache.get("736937914805649419");
  const embed = new Discord.MessageEmbed()
  .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
  .setThumbnail(message.author.displayAvatarURL({ size: 2048, dynamic: true }))
  .setDescription(`[Сообщение](${message.url}) было изменено от пользователя ${message.author}`)
  .setColor(0xff0000)
  .addField("Старое сообщение", `${oldContent}`)
  .addField("Новое сообщение", `${newContent}`)
  .addField("Дата", message.createdAt.toLocaleString())
  .setFooter("Protector", "https://media2.giphy.com/media/VelhTbcFUDdDOrmFUL/giphy.gif")
  channel.send(embed)
})

client.on("userAvatarUpdate", (user, oldAvatarURL, newAvatarURL) => {
  const channel = client.channels.cache.get("739897234094817321");
  const embed = new Discord.MessageEmbed()
  .setAuthor(`${user.tag}`, user.displayAvatarURL({ dynamic: true }))
  .setThumbnail(user.displayAvatarURL({ size: 2048, dynamic: true }))
  .setDescription(`Пользователь ${user} сменил аватарку`)
  .setColor(0xff0000)
  .addField("Ссылка старой аватарки", `[Ссылка на неё](${oldAvatarURL})`)
  .addField("Ссылка новой аватарки", `[Ссылка на неё](${newAvatarURL})`)
  .setTimestamp()
  .setFooter("Protector", "https://media2.giphy.com/media/VelhTbcFUDdDOrmFUL/giphy.gif")
  channel.send(embed)
})

///////////////////////////////// Login /////////////////////////////////

client.login(process.env.token)
