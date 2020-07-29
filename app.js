const Discord = require("discord.js");
const Protector = require("./handlers/ClientBuilder.js");
const client = new Protector({ partials: ['MESSAGE', 'REACTION']});
const { token, prefix } = require('./config.json');
const { MessageEmbed } = require("discord.js");
const guildInvites = new Map();
const { getPokemon } = require('./utils/pokemon');
const { CanvasSenpai } = require("canvas-senpai");
const canva = new CanvasSenpai();

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

if(message.content.toLowerCase().startsWith('pr.pokemon')) {

  if(!args[0]) return message.channel.send({ embed: { color: "RED", description: "You have to specify the pokemon name!"}})
        const pokemon = message.content.toLowerCase().split(" ")[1];
        try {
            const pokeData = await getPokemon(pokemon);
            const {
                sprites,
                stats,
                weight,
                name,
                id,
                base_experience,
                abilities,
                types
            } = pokeData;
            const embed = new MessageEmbed();
            embed.setColor(0x00ffff)
            embed.setTitle(`${name} #${id}`)
            embed.setThumbnail(`${sprites.front_default}`);
            stats.forEach(stat => embed.addField(stat.stat.name, stat.base_stat, true));
            types.forEach(type => embed.addField('Type', type.type.name, true));
            embed.addField('Weight', weight, true);
            embed.addField('Base Experience', base_experience, true);
            message.channel.send(embed);
        }
        catch(err) {
            message.channel.send({ embed: { color: "RED", description: `Pokemon ${pokemon} not found!`}});
        }
    }

  });

client.on('messageReactionAdd', async (reaction, user) => {
    const handleStarboard = async () => {
        const starboard = client.channels.cache.find(channel => channel.name.toLowerCase() === '🌟╟starboard');
        const msgs = await starboard.messages.fetch({ limit: 100 });
        const existingMsg = msgs.find(msg =>
            msg.embeds.length === 1 ?
            (msg.embeds[0].footer.text.startsWith(reaction.message.id) ? true : false) : false);
        if(existingMsg) existingMsg.edit(`${reaction.count} - 🌟`);
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

require("./handlers/module.js")(client);
require("./handlers/Event.js")(client);

client.package = require("./package.json");
client.on("warn", console.warn); // This will warn you via logs if there was something wrong with your bot.
client.on("error", console.error); // This will send you an error message via logs if there was something missing with your coding.

client.on('inviteCreate', async invite => guildInvites.set(invite.guild.id, await invite.guild.fetchInvites()));
client.on('ready', () => {
    client.guilds.cache.forEach(guild => {
        guild.fetchInvites()
            .then(invites => guildInvites.set(guild.id, invites))
            .catch(err => console.log(err));
    });
});

client.on('guildMemberAdd', async member => {

  var role = member.guild.roles.cache.find(role => role.name == 'Member');

  member.roles.add(role)

  let data = await canva.welcome(member, { link: "https://wallpapercave.com/wp/wp5128415.jpg" })


const attachment = new Discord.MessageAttachment(
  data,
  "welcome-image.png"
);

  if(member.guild.id !== stats.serverID) return;
    client.channels.cache.get(stats.total).setName(`Всего участников: ${member.guild.memberCount}`);
    client.channels.cache.get(stats.member).setName(`Людей: ${member.guild.members.cache.filter(m => !m.user.bot).size}`);
    client.channels.cache.get(stats.bots).setName(`Ботов: ${member.guild.members.cache.filter(m => m.user.bot).size}`);

    const cachedInvites = guildInvites.get(member.guild.id);
    const newInvites = await member.guild.fetchInvites();
    guildInvites.set(member.guild.id, newInvites);
    try {
        const usedInvite = newInvites.find(inv => cachedInvites.get(inv.code).uses < inv.uses);
        const embed = new MessageEmbed()
        .setAuthor(`${member.user.tag}`, member.user.displayAvatarURL({ dynamic: true }))
            .setColor("#0000ff")
            .setDescription(`${member.user} зашёл на сервер и он **${member.guild.memberCount}-й** участник на нашем сервере. \n Его пригласил ${usedInvite.inviter}. \n Число уиспользование этого инвайта: **${usedInvite.uses}**`)
            .setTimestamp()
            .addField("Инвайт ссылка", `${usedInvite.url}`)
            .setImage('attachment://welcome-image.png')
        const welcomeChannel = member.guild.channels.cache.find(channel => channel.id === '664901915326414879');
        if(welcomeChannel) {
            welcomeChannel.send({ embed, files: [attachment] });
        }
    }
    catch(err) {
        console.log(err);
    }

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
                .addField("ID", `\`\`\`css\nЮзер: ${message.author.id}\nСообщение: ${message.id}\n\`\`\``)
                .setTimestamp();
            channel.send(embed);
        }
    }
});

client.login(process.env.token)
