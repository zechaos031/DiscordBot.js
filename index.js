/*Ne touchez c'est valeurs que si vous êtes sur de ce que vous faites !*/
const Discord = require('discord.js');
const client = new Client({ disableEveryone: true });
client.login(process.env.TOKEN);
client.on('ready', () => {
	client.user.setActivity(`+status`, {type: "WATCHING"});
	client.user.setStatus("idle");
    console.log(`Connecté en tant que ${client.user.tag}`)
    console.log("Serveurs:")
    client.guilds.forEach((guild) => {
    console.log(`- ${guild.name} (${guild.id})`)
    })
})

let prefix = "+"

client.on("message", message => {
    if (message.author.bot) return;
    if (message.content.indexOf(prefix) !== 0) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    if (command === "status") {
        const embed = new Discord.RichEmbed()
            .setColor(`#F7DF1E`)
            .setAuthor(`Alex Animate Mp4#2361`, `https://cdn.discordapp.com/avatars/609174280734900226/507b6332d85e3b0fe62c0304b3810961.png?size=128`)
            .setThumbnail('https://cdn.discordapp.com/avatars/629968935709835284/f2d26035222b118520a1db9681bbe111.png')
            .setTitle('DiscordBot.Js est en maintenance !')
            .setDescription(`Bonjour, de nombreux problème ont été détecter sur DiscordBot.Js.\nAu niveau de la base de donnée, des commandes et du hosting.\nDonc j'ai décider de mettre DiscordBot.Js en maintenance le temps que je modifie le code source.\nil aura une toute nouvelle allure avec cette mise à jour qui vas être effectuer dans quelque jours !\nVous pouvez tout même être informer des actualités de DiscordBot.Js en effectuant la commande +news.\nMerci de votre compréhension, Alex Animate Mp4.`)
            .setTimestamp()
        message.channel.send(embed);
    }
    if (command === "news") {
        const channelexist = message.guild.channels.find(x => x.name === "actualités-discordbotjs")
        const everyoneRole = client.guilds.get(message.guild.id).roles.find(x => x.name === '@everyone');
        const news_name = "actualités-discordbotjs";
            if(channelexist) return message.reply(`Le salon d'acutalités de DiscordBot.Js existe dejà !`)
        message.guild.createChannel(news_name, { type: "text" })
        .then(r => {
            r.overwritePermissions(message.author.id, { SEND_MESSAGES: true });
            r.overwritePermissions(client.user.id, { SEND_MESSAGES: true });
            r.overwritePermissions(everyoneRole, { SEND_MESSAGES: false });
            r.send(`>>> **IMPORTANT** ne jamais supprimer ou renommer ce salon !\nSi vous renommez le nom ou supprimer le salon, Vous n'aurez pas accés aux actualités de DiscordBot.Js !`)
        })
        }
        if(command === "send-news") {
            if (message.author.id !== process.env.OWNERID) return message.reply("Désolé, Vous n'avez pas les permissions !")
            let message_all = args.slice(0).join(' ');
            const embed = new Discord.RichEmbed()
            .setColor(`${config.colorembed}`)
            .setTitle('Actualités DiscordBot.Js')
            .setDescription(`${message_all}`)
            .setTimestamp()
            .setFooter('Actualités DiscordBot.Js Release Version');
        client.channels.findAll('name', 'actualités-discordbotjs').map(channel => channel.send({embed}))
        }
});
