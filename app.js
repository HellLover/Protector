const Discord = require("discord.js");
const Protector = require("./handlers/ClientBuilder.js");
const client = new Protector();
const { token, prefix } = require('./config.json');
const { MessageEmbed } = require("discord.js");

const ownerID = "544225039470428160"

let stats = {
    serverID: '602514533764038709',
    total: "736953819497365616",
    member: "736953950317838427",
    bots: "736953890557263882"
}

client.on('ready', () => {
  client.user.setActivity(`HellLover Staff Only`, {
    type: "WATCHING"
  })
  console.log(`${client.user.username} Is Online !`)
});

client.on('message', async message => {

let args = message.content.slice(prefix.length).trim().split(' ');
let cmd = args.shift().toLowerCase();
if (message.author.bot) return;
if(message.content.startsWith(prefix))

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

require("./handlers/module.js")(client);
require("./handlers/Event.js")(client);

client.package = require("./package.json");
client.on("warn", console.warn); // This will warn you via logs if there was something wrong with your bot.
client.on("error", console.error); // This will send you an error message via logs if there was something missing with your coding.

client.on('guildMemberAdd', async member => {

  const channel = client.channels.cache.get('664901915326414879');
  var role = member.guild.roles.cache.find(role => role.name == 'Member');

  member.roles.add(role)

  let embed = new MessageEmbed() //define embed
  .setAuthor(member.user.tag, member.user.displayAvatarURL())
  .setColor("#ff2050")
  .setThumbnail(member.user.avatarURL({ size: 2048, dynamic: true}))
  .setDescription(`Привет, ${member}, добро пожаловать на сервер **${member.guild.name}**\n У нас теперь **${member.guild.memberCount}** участников`)
  .setImage('https://cdn.discordapp.com/attachments/728238563816374333/732206161172103188/13801100022.gif')

  channel.send(embed)

  if(member.guild.id !== stats.serverID) return;
    client.channels.cache.get(stats.total).setName(`Всего участников: ${member.guild.memberCount}`);
    client.channels.cache.get(stats.member).setName(`Людей: ${member.guild.members.cache.filter(m => !m.user.bot).size}`);
    client.channels.cache.get(stats.bots).setName(`Ботов: ${member.guild.members.cache.filter(m => m.user.bot).size}`);

})

client.on('guildMemberRemove', async member => {

    const channel = client.channels.cache.get('664901915326414879');

  let embed = new MessageEmbed() //define embed
  .setAuthor(member.user.tag, member.user.displayAvatarURL())
  .setColor("#ff2050")
  .setThumbnail(member.user.avatarURL({ size: 2048, dynamic: true}))
  .setDescription(`${member} покинул сервер **${member.guild.name}**\n Осталось **${member.guild.memberCount}** участников`)
  .setImage('https://lh3.googleusercontent.com/proxy/9Nv25nOLtjiQZDSBXSP37bWdTopMibSpOkEfMg0ySwQBXjD7G_4NZFHKxROl5hpaUnwJDBWaODKA1iPIP7BoRt5kSQHKMGyN4SbuaIZwEb6X1YGoLYxCejJB')

  channel.send(embed)

  if(member.guild.id !== stats.serverID) return;
      client.channels.cache.get(stats.total).setName(`Всего участников: ${member.guild.memberCount}`);
      client.channels.cache.get(stats.member).setName(`Людей: ${member.guild.members.cache.filter(m => !m.user.bot).size}`);
      client.channels.cache.get(stats.bots).setName(`Ботов: ${member.guild.members.cache.filter(m => m.user.bot).size}`);

})

client.on('messageDelete', message => {
    if(!message.partial) {
        const channel = client.channels.cache.get('736937914805649419');
        if(!message.content) return;
        if(channel) {
            const embed = new MessageEmbed()
                .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL())
                .setColor(0xff0000)
                .setDescription(`Message deleted in <#${message.channel.id}>`)
                .addField("Content", message.content)
                .addField("ID", `\`\`\`css\nUser: ${message.author.id}\nMessage: ${message.id}\n\`\`\``)
                .setTimestamp();
            channel.send(embed);
        }
    }
});

client.login(token)
