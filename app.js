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
    member: "736953950317838427",
    bots: "736953890557263882"
}

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
///////////////////////////////// Starboard /////////////////////////////////

client.on('messageReactionAdd', async (reaction, user) => {
    const handleStarboard = async () => {
        const starboard = client.channels.cache.find(channel => channel.name.toLowerCase() === '〘🌟〙【starboard】');
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
        if(reaction.message.channel.name.toLowerCase() === '〘🌟〙【starboard】') return;
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
    const handleStarboard = async () => {
        const starboard = client.channels.cache.find(channel => channel.name.toLowerCase() === '〘🌟〙【starboard】');
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
        if(reaction.message.channel.name.toLowerCase() === '〘🌟〙【starboard】') return;
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
  welChannel.send("Добро пожаловать", attachment)
  });

  client.on("guildMemberRemove", async member => {
  let leaveChannel = client.channels.cache.get("664901915326414879")

    if(leaveChannel === null) {
      return;
    }

  let img = await canvas.leave({ username: member.user.username, discrim: member.user.discriminator, avatarURL: member.user.displayAvatarURL({ format: "png" }) });
  const attachment = new Discord.MessageAttachment(img, "leave.png")
  leaveChannel.send(attachment)
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
