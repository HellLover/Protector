///////////////////////////////// General /////////////////////////////////

const Discord = require("discord.js");
const Protector = require("./handlers/ClientBuilder.js");
const client = new Protector({ partials: ['MESSAGE', 'REACTION']});
const { token, prefix, ownerID } = require('./config.json');
const { MessageEmbed } = require("discord.js");
const { CanvasSenpai } = require("canvas-senpai");
const canva = new CanvasSenpai();
const Canvacord = require("canvacord");
const canvas = new Canvacord();
const logs = require("discord-logs");
logs(client)
const db = require("quick.db");

exportData();
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

  xp(message);

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

   if(message.content.startsWith(`${prefix}rank`)) {
     let user =
       message.mentions.users.first() ||
       client.users.cache.get(args[0]) ||
       match(args.join(" ").toLowerCase(), message.guild) ||
       message.author;

       let background = args[1];

       let level = db.get(`guild_${message.guild.id}_level_${user.id}`) || 0;
       level = level.toString();
       let xp = db.get(`guild_${message.guild.id}_xp_${user.id}`) || 0;
       let neededXP = level * 500 + 500;
       let every = db
         .all()
         .filter(i => i.ID.startsWith(`guild_${message.guild.id}_xptotal_`))
         .sort((a, b) => b.data - a.data);
       let rank = every.map(x => x.ID).indexOf(`guild_${message.guild.id}_xptotal_${message.author.id}`) + 1;
       rank = rank.toString();
       const card = await canvas.rank({
         username: user.username,
         discrim: user.discriminator,
         status: user.presence.status,
         currentXP: xp.toString(),
         neededXP: neededXP.toString(),
         rank: '#' + rank,
         level: level,
         avatarURL: user.displayAvatarURL({ format: "png" }),
         background: background
      });
       const attachment = new Discord.MessageAttachment(card, "rank.png");
       return message.channel.send(attachment);
    }

   if(message.content.startsWith(`${prefix}lb`)) {
     let data = db.all().filter(i => i.ID.startsWith("xptotal_")).sort((a, b) => b.data - a.data);
    if (data.length < 1) return message.channel.send({ embed: { color: "RED", description: "Пока что нет лидеров для этого сервера."}});
    let myrank = data.map(m => m.ID).indexOf(`xp_${message.author.id}`) + 1 || "N/A";
    data.length = 10;
    let lb = [];
    for (let i in data)  {
        let id = data[i].ID.split("_")[1];
        let user = await client.users.fetch(id);
        user = user ? user.tag : "Неизвестный Пользователь#0000";
        let rank = data.indexOf(data[i]) + 1;
        let level = db.get(`guild_${message.guild.id}_level_${id}`);
        let xp = data[i].data;
        let xpreq = level * 500 + 500;
        lb.push({
            user: { id, tag: user },
            rank,
            level,
            xp,
            xpreq
        });
    };

    const embed = new MessageEmbed()
    .setTitle("Статистика уровней для сервера HellLover Team")
    .setColor("#00ffff")
    lb.forEach(d => {
        embed.addField(`<a:RAOGmedal:730828703071731783> ${d.rank}. ${d.user.tag} (ID: ${d.user.id})`, `— **Уровень** - ${d.level}\n— **XP** - ${d.xp} / ${d.xpreq}`);
    });
    embed.setFooter(`Ваша позиция в топе: ${myrank} место`, message.author.displayAvatarURL());
    embed.setTimestamp()
    return message.channel.send(embed);

   }

});

///////////////////////////////// Functions /////////////////////////////////

function xp(message) {
  if(message.content.startsWith(prefix)) return;
  if(message.author.bot) return;
  if(message.channel.id === '736291709792550973') return;
  const channel = client.channels.cache.get('739777580781142046');
  const randomNum = Math.floor(Math.random() * 10) + 15;
    db.add(`guild_${message.guild.id}_xp_${message.author.id}`, randomNum);
    db.add(`guild_${message.guild.id}_xptotal_${message.guild.id}`, randomNum);
    let level = db.get(`guild_${message.guild.id}_level_${message.author.id}`) || 1;
    let xp = db.get(`guild_${message.guild.id}_xp_${message.author.id}`);
    let neededXP = level * 500;
    if(neededXP < xp) {
      let newLevel = db.add(`guild_${message.guild.id}_level_${message.author.id}`, 1);
      db.subtract(`guild_${message.guild.id}_xp_${message.author.id}`, neededXP);
      channel.send({ embed: { color: "RANDOM", description: `Поздравляю, ${message.author}, ты достиг нового уровня ${newLevel}!`, footer: "pr.rank для просмотра ранга"}})
    }
  }

function match(msg, i) {
  if (!msg) return undefined;
  if (!i) return undefined;
  let user = i.members.cache.find(
    m =>
      m.user.username.toLowerCase().startsWith(msg) ||
      m.user.username.toLowerCase() === msg ||
      m.user.username.toLowerCase().includes(msg) ||
      m.displayName.toLowerCase().startsWith(msg) ||
      m.displayName.toLowerCase() === msg ||
      m.displayName.toLowerCase().includes(msg)
  );
  if (!user) return undefined;
  return user.user;
}

function exportData() {
    const data = db.all();
    mongo.import(data).then(() => {
        console.log("Successfully exported quick.db data to quickmongo!");
    });
}

///////////////////////////////// Starboard /////////////////////////////////

client.on('messageReactionAdd', async (reaction, user) => {
    const handleStarboard = async () => {
        const starboard = client.channels.cache.find(channel => channel.name.toLowerCase() === '🌟╟starboard');
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
        if(reaction.message.channel.name.toLowerCase() === '🌟╟starboard') return;
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
        const starboard = client.channels.cache.find(channel => channel.name.toLowerCase() === '🌟╟starboard');
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
        if(reaction.message.channel.name.toLowerCase() === '🌟╟starboard') return;
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

  const channel = member.guild.channels.cache.get('664901915326414879');
    if (!channel) return;

   let data = await canva.welcome(member, { link: "https://free4kwallpapers.com/uploads/originals/2019/12/23/such-a-cool-view-and-a-satisfying--wallpaper.jpg" })

    const attachment = new Discord.MessageAttachment(
      data,
      "welcome-image.png"
    );

    channel.send(
      `<:owner:730001880339447859> Добро пожаловать на сервер, ${member.user}!\n<:text:736281232689594449> Советую прочитать <#602519139231334414>.`,
      attachment
    );

  });

client.on('guildMemberRemove', async member => {

    const channel = client.channels.cache.get('664901915326414879');

  let embed = new MessageEmbed() //define embed
  .setAuthor(member.user.tag, member.user.displayAvatarURL())
  .setColor("#ff2050")
  .setThumbnail(member.user.avatarURL({ size: 2048, dynamic: true}))
  .setDescription(`${member} покинул сервер **${member.guild.name}**`)
  .setTimestamp()
  .setFooter(`Осталось ${member.guild.memberCount} участников`, member.guild.iconURL())
  .setImage('https://lh3.googleusercontent.com/proxy/9Nv25nOLtjiQZDSBXSP37bWdTopMibSpOkEfMg0ySwQBXjD7G_4NZFHKxROl5hpaUnwJDBWaODKA1iPIP7BoRt5kSQHKMGyN4SbuaIZwEb6X1YGoLYxCejJB')

  channel.send(embed)

  if(member.guild.id !== stats.serverID) return;
      client.channels.cache.get(stats.total).setName(`Всего участников: ${member.guild.memberCount}`);
      client.channels.cache.get(stats.member).setName(`Людей: ${member.guild.members.cache.filter(m => !m.user.bot).size}`);
      client.channels.cache.get(stats.bots).setName(`Ботов: ${member.guild.members.cache.filter(m => m.user.bot).size}`);

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
                .addField("Содержание", message.content)
                .addField("ID", `\`\`\`css\nUser: ${message.author.id}\nMessage: ${message.id}\n\`\`\``)
                .setTimestamp();
            channel.send(embed);
        }
    }
});

client.on("guildMemberRoleAdd", (member, role) => {
  const channel = client.channels.cache.get("736937914805649419");
  const embed = new Discord.MessageEmbed()
  .setAuthor(`${member.user.tag}`, member.user.displayAvatarURL({ dynamic: true }))
    .setThumbnail("https://lh3.googleusercontent.com/proxy/Vmg5YcXo6ppsUliFI7yuynNu5CyS3evV63iwtBsu4XvykjGIczobOa6se7NcpBMyavRjtUSc3Dh0oygQXtp4_vgxn1BbY0jBpfcawGvqAJMjFKkme15rF_RmUarEA-vOB0dPwa9ry714LnHElSStXpx7AGjFDgsBTSwBlzmLTMY")
  .setTitle("Добавлена роль")
  .setColor(0xff0000)
  .addField("Кому", `${member.user}`)
  .addField("Какая роль", `${role}`)
  .setTimestamp()
  .setFooter("Protector")
  channel.send(embed)
})

client.on("guildMemberRoleRemove", (member, role) => {
  const channel = client.channels.cache.get("736937914805649419");
  const embed = new Discord.MessageEmbed()
  .setAuthor(`${member.user.tag}`, member.user.displayAvatarURL({ dynamic: true }))
    .setThumbnail("https://lh3.googleusercontent.com/proxy/Vmg5YcXo6ppsUliFI7yuynNu5CyS3evV63iwtBsu4XvykjGIczobOa6se7NcpBMyavRjtUSc3Dh0oygQXtp4_vgxn1BbY0jBpfcawGvqAJMjFKkme15rF_RmUarEA-vOB0dPwa9ry714LnHElSStXpx7AGjFDgsBTSwBlzmLTMY")
  .setTitle("Стырена роль")
  .setColor(0xff0000)
  .addField("У кого", `${member.user}`)
  .addField("Какая роль", `${role}`)
  .setTimestamp()
  .setFooter("Protector")
  channel.send(embed)
})

client.on("guildMemberNicknameUpdate", (member, oldNickname, newNickname) => {
  const channel = client.channels.cache.get("739897234094817321");
  const embed = new Discord.MessageEmbed()
  .setAuthor(`${member.user.tag}`, member.user.displayAvatarURL({ dynamic: true }))
  .setThumbnail("https://lh3.googleusercontent.com/proxy/Vmg5YcXo6ppsUliFI7yuynNu5CyS3evV63iwtBsu4XvykjGIczobOa6se7NcpBMyavRjtUSc3Dh0oygQXtp4_vgxn1BbY0jBpfcawGvqAJMjFKkme15rF_RmUarEA-vOB0dPwa9ry714LnHElSStXpx7AGjFDgsBTSwBlzmLTMY")
  .setDescription(`${member.user} сменил никнейм`)
  .setColor(0xff0000)
  .addField("Старый никнейм", `${oldNickname}`)
  .addField("Новый никнейм", `${newNickname}`)
  .setTimestamp()
  .setFooter("Protector")
  channel.send(embed)
})

client.on("messageContentEdited", (message, oldContent, newContent) => {
  const channel = client.channels.cache.get("736937914805649419");
  const embed = new Discord.MessageEmbed()
  .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
  .setThumbnail("https://lh3.googleusercontent.com/proxy/Vmg5YcXo6ppsUliFI7yuynNu5CyS3evV63iwtBsu4XvykjGIczobOa6se7NcpBMyavRjtUSc3Dh0oygQXtp4_vgxn1BbY0jBpfcawGvqAJMjFKkme15rF_RmUarEA-vOB0dPwa9ry714LnHElSStXpx7AGjFDgsBTSwBlzmLTMY")
  .setDescription(`[Сообщение](${message.url}) было изменено от пользователя ${message.author}`)
  .setColor(0xff0000)
  .addField("Старое сообщение", `${oldContent}`)
  .addField("Новое сообщение", `${newContent}`)
  .setTimestamp()
  .setFooter("Protector")
  channel.send(embed)
})

client.on("userAvatarUpdate", (user, oldAvatarURL, newAvatarURL) => {
  const channel = client.channels.cache.get("739897234094817321");
  const embed = new Discord.MessageEmbed()
  .setAuthor(`${user.tag}`, user.displayAvatarURL({ dynamic: true }))
  .setThumbnail("https://lh3.googleusercontent.com/proxy/Vmg5YcXo6ppsUliFI7yuynNu5CyS3evV63iwtBsu4XvykjGIczobOa6se7NcpBMyavRjtUSc3Dh0oygQXtp4_vgxn1BbY0jBpfcawGvqAJMjFKkme15rF_RmUarEA-vOB0dPwa9ry714LnHElSStXpx7AGjFDgsBTSwBlzmLTMY")
  .setDescription(`Пользователь ${user} сменил аватарку`)
  .setColor(0xff0000)
  .addField("Ссылка старой аватарки", `[Ссылка на неё](${oldAvatarURL})`)
  .addField("Ссылка новой аватарки", `[Ссылка на неё](${newAvatarURL})`)
  .setTimestamp()
  .setFooter("Protector")
  channel.send(embed)
})

///////////////////////////////// Login /////////////////////////////////

client.login(process.env.token)
