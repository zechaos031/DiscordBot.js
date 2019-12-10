/*Ne touchez c'est valeurs que si vous êtes sur de ce que vous faites !*/
const { Client, RichEmbed, Emoji, MessageReaction } = require('discord.js');
const Discord = require('discord.js');
const client = new Client({ disableEveryone: true });
const dl = require('discord-leveling');
const Canvas = require('canvas');
const snekfetch = require('snekfetch');
const db = require('quick.db')
const ms = require('parse-ms')
const config = require("./config.js");
const guildConf = require('./config.json');
const fs = require("fs");
require('events').EventEmitter.defaultMaxListeners = 0;
var Long = require("long");
var dernierAppel = new Array();
client.music = require("./music");
client.music.start(client, {
	youtubeKey: config.youtubeapikey,
	botPrefix: config.prefix + config.prefixMusic,
  
	play: {
	  usage: "{{config.prefix + config.prefixMusic}}play some tunes",
	  exclude: false  
	},
  
	anyoneCanSkip: true,
  
	ownerOverMember: true,
	ownerID: config.ownerID,
  
	cooldown: {
	  enabled: false
	}
  });
client.login(config.botToken);
client.on('ready', (guild) => {
		client.user.setActivity(`Mon prefix est ${config.prefix}`, {type: "WATCHING"});
		client.user.setStatus("online");
    console.log("Connecté en tant que " + client.user.tag)
    console.log("Serveurs:")
    client.guilds.forEach((guild) => {
        console.log(" - " + guild.name)
        if (!guildConf[guild.id]) {
            guildConf[guild.id] = {
                prefix: config.prefix,
            }
            }
             fs.writeFile('./config.json', JSON.stringify(guildConf, null, 2), (err) => {
                 if (err) console.log(err)
            })
        })
})
const getDefaultChannel = (guild) => {
	if(guild.channels.has(guild.id))
	  return guild.channels.get(guild.id)
	const generalChannel = guild.channels.find(channel => channel.name === "general");
	if (generalChannel)
	  return generalChannel;
	return guild.channels
	 .filter(c => c.type === "text" &&
	   c.permissionsFor(guild.client.user).has("SEND_MESSAGES"))
	 .sort((a, b) => a.position - b.position ||
	   Long.fromString(a.id).sub(Long.fromString(b.id)).toNumber())
	 .first();
}

function timeConverter(timestamp)
{
        var a = new Date(timestamp);
        var tabMois = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
        var annee = a.getFullYear();
        var mois = tabMois[a.getMonth()];
        var date = a.getDate();
        var heure = a.getHours();
        if(heure <= 10) {
            heure = `0${a.getHours()}`
        }
        var min = a.getMinutes();
        if(min <= 10) {
            min = `0${a.getMinutes()}`
        }
        var sec = a.getSeconds();
        if(sec <= 10) {
            sec = `0${a.getSeconds()}`
        }
        var time = + date + ' ' + mois + ' ' + annee + ' à ' + heure + 'h' + min + ':' + sec ;
        return time;
}

client.on('guildCreate', (guild) => {
    if (!guildConf[guild.id]) {
	guildConf[guild.id] = {
        prefix: config.prefix,
	}
    }
     fs.writeFile('./config.json', JSON.stringify(guildConf, null, 2), (err) => {
     	if (err) console.log(err)
    })
});

client.on('guildDelete', (guild) => {
     delete guildConf[guild.id];
     fs.writeFile('./config.json', JSON.stringify(guildConf, null, 2), (err) => {
     	if (err) console.log(err)
	})
});

if (config.botToken === '')
    throw new Error("La propriété 'botToken' n'est pas définie dans le fichier config.js. Fais-le s'il te plaît !");

client.on('error', console.error);

/*Welcome Message*/
client.on('guildMemberAdd', async member => {
    if(member.guild.id === "264445053596991498") return;
	const channel = getDefaultChannel(member.guild);
    const name = member.displayName.length > 20 ? member.displayName.substring(0, 20) + "..." : member.displayName;
    const server = member.guild.name.length > 11 ? member.guild.name.substring(0, 11) + "..." : member.guild.name;
    const memberCount = member.guild.memberCount.length > 8 ? member.guild.memberCount.substring(0, 8) + "..." : member.guild.memberCount;
	const canvas = Canvas.createCanvas(700, 250);
	const ctx = canvas.getContext('2d');

	const background = await Canvas.loadImage(`${config.picturewelcomeleave}`);
	ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

	ctx.strokeStyle = '#74037b';
	ctx.strokeRect(0, 0, canvas.width, canvas.height);

	ctx.font = '26px sans-serif';
	ctx.fillStyle = '#ffffff';
	ctx.fillText(`Bienvenue dans ${server},`, canvas.width / 2.5, canvas.height / 3.5);

	ctx.font = '26px sans-serif';
	ctx.fillStyle = '#ffffff';
    ctx.fillText(`${name}#${member.user.discriminator}`, canvas.width / 2.5, canvas.height / 1.8);
    
    ctx.font = '26px sans-serif';
	ctx.fillStyle = '#ffffff';
	ctx.fillText(`On est ${memberCount} membres !`, canvas.width / 2.5, canvas.height / 1.3);

	ctx.beginPath();
	ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
	ctx.closePath();
	ctx.clip();

	const { body: buffer } = await snekfetch.get(member.user.displayAvatarURL);
	const avatar = await Canvas.loadImage(buffer);
	ctx.drawImage(avatar, 25, 25, 200, 200);

    const attachment = new Discord.Attachment(canvas.toBuffer(), 'welcome-image.png');
    
    var message_aléatoire = Math.round(Math.random()*30);
    var reponse;
    if(message_aléatoire == 0){
        message_aléatoire = `Bienvenue ${member}. ${client.user} t'accueil avec enthousiasme !`;
    }
    if(message_aléatoire == 1){
        message_aléatoire = `Hello, mon chou ! ${member} est arrivé(e) !`;
    }
    if(message_aléatoire == 2){
        message_aléatoire = `${member} a rejoint le serveur. Restez un instant et écoutez-moi.`;
    }
    if(message_aléatoire == 3){
        message_aléatoire = `${member} vient de se glisser dans le serveur.`;
    }
    if(message_aléatoire == 4){
        message_aléatoire = `Je n'abandonnerai jamais ${member}. Je ne laisserai jamais tomber ${member}.`;
    }
    if(message_aléatoire == 5){
        message_aléatoire = `${member} a rejoint votre fine équipe.`;
    }
    if(message_aléatoire == 6){
        message_aléatoire = `${member} vient de rejoindre le serveur... enfin, je crois !`;
    }
    if(message_aléatoire == 7){
        message_aléatoire = `Bienvenue ${member}. Laissez vos armes près de la porte.`;
    }
    if(message_aléatoire == 8){
        message_aléatoire = `${member} vient d'arriver. Tenez ma bière.`;
    }
    if(message_aléatoire == 9){
        message_aléatoire = `Son altesse ${member} est arrivée !`;
    }
    if(message_aléatoire == 10){
        message_aléatoire = `J'me présente, je m'appelle ${member}.`;
    }
    if(message_aléatoire == 11){
        message_aléatoire = `${member} est arrivé(e). La fête est finie.`;
    }
    if(message_aléatoire == 12){
        message_aléatoire = `${member} a rejoint le serveur ! C'est super efficace !`;
    }
    if(message_aléatoire == 13){
        message_aléatoire = `C'est un oiseau ! C'est un avion ! Ha, non, c'est juste ${member}.`;
    }
    if(message_aléatoire == 14){
        message_aléatoire = `${member} vient d'arriver. Il est trop OP - nerf plz.`;
    }
    if(message_aléatoire == 15){
        message_aléatoire = `Oh mon dieu ! C'est ${member} ! Nous sommes sauvés !`;
    }
    if(message_aléatoire == 16){
        message_aléatoire = `Bienvenue, ${member}. On espère que vous avez apporté de la pizza.`;
    }
    if(message_aléatoire == 17){
        message_aléatoire = `${member} vient de rejoindre le serveur. Tout le monde, faites semblant d'être occupés !`;
    }
    if(message_aléatoire == 18){
        message_aléatoire = `${member} a bondi dans le serveur. Un vrai petit kangourou !`;
    }
    if(message_aléatoire == 19){
        message_aléatoire = `Un ${member} sauvage apparaît.`;
    }
    if(message_aléatoire == 20){
        message_aléatoire = `Joueur ${member} prêt.`;
    }
    if(message_aléatoire == 21){
        message_aléatoire = `Hé ! Écoutez ! ${member}. nous a rejoint !`;
    }
    if(message_aléatoire == 22){
        message_aléatoire = `${member} vient de rejoindre le serveur. Besoin de soins, s'il vous plaît !`;
    }
    if(message_aléatoire == 23){
        message_aléatoire = `Un ${member} est apparu dans le serveur.`;
    }
    if(message_aléatoire == 24){
        message_aléatoire = `${member} vient de prendre place dans le bus de combat.`;
    }
    if(message_aléatoire == 25){
        message_aléatoire = `Voici ${member} ! Loué soit le Soleil ! \[T]/`;
    }
    if(message_aléatoire == 26){
        message_aléatoire = `Tenez-vous bien. ${member} a rejoint le serveur.`;
    }
    if(message_aléatoire == 27){
        message_aléatoire = `C'est dangereux d'y aller seul, emmenez ${member} !`;
    }
    if(message_aléatoire == 28){
        message_aléatoire = `Bienvenue, ${member}. Nous vous attendions ( ͡° ͜ʖ ͡°)`;
    }
    if(message_aléatoire == 29){
        message_aléatoire = `Challenger en approche - ${member} est apparu(e) !`;
    }
    if(message_aléatoire == 30){
        message_aléatoire = `Où est ${member} ? Dans le serveur !`;
    }
    const message_bienvenue_aléatoire = message_aléatoire;

    channel.send(`${message_bienvenue_aléatoire}`, attachment);
    console.log(`${member.user.username}`, "est arrivés dans " + `${member.guild.name}`)
});

/*Leave Messages*/
client.on("guildMemberRemove", async member =>{
    if(member.guild.id === "264445053596991498") return;
    const channel = getDefaultChannel(member.guild);
    const name = member.displayName.length > 13 ? member.displayName.substring(0, 13) + "..." : member.displayName;
    const server = member.guild.name.length > 21 ? member.guild.name.substring(0, 21) + "..." : member.guild.name;
    const memberCount = member.guild.memberCount.length > 8 ? member.guild.memberCount.substring(0, 8) + "..." : member.guild.memberCount;
	const canvas = Canvas.createCanvas(700, 250);
	const ctx = canvas.getContext('2d');

	const background = await Canvas.loadImage(`${config.picturewelcomeleave}`);
	ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

	ctx.strokeStyle = '#74037b';
	ctx.strokeRect(0, 0, canvas.width, canvas.height);

	ctx.font = '26px sans-serif';
	ctx.fillStyle = '#ffffff';
	ctx.fillText(`${name}#${member.user.discriminator} a quitté\n${server}`, canvas.width / 2.5, canvas.height / 2.5);
    
    ctx.font = '26px sans-serif';
	ctx.fillStyle = '#ffffff';
	ctx.fillText(`On est ${memberCount} membres !`, canvas.width / 2.5, canvas.height / 1.3);

	ctx.beginPath();
	ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
	ctx.closePath();
	ctx.clip();

	const { body: buffer } = await snekfetch.get(member.user.displayAvatarURL);
	const avatar = await Canvas.loadImage(buffer);
	ctx.drawImage(avatar, 25, 25, 200, 200);

    const attachment = new Discord.Attachment(canvas.toBuffer(), 'leave-image.png');
	channel.send(attachment);
	console.log(`${member.user.username}` + " a quitté " + `${member.guild.name}`)
	dl.Delete(member.user.id)
});

client.on('message', async message => {
	if (message.content === '+join') {
		client.emit('guildMemberAdd', message.member || await message.guild.fetchMember(message.author));
	}
});

client.on('message', async message => {
	if (message.content === '+quit') {
		client.emit('guildMemberRemove', message.member || await message.guild.fetchMember(message.author));
	}
});

/*Server Info*/
client.on("message", message => {
    if (message.author.bot) return;
    if (message.content.indexOf(guildConf[message.guild.id].prefix) !== 0) return;
    const args = message.content.slice(guildConf[message.guild.id].prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    if (command === "server-info") {
        let verifLevels = ["Aucun", "Faible", "Moyen", "(╯°□°）╯︵  ┻━┻", "┻━┻ミヽ(ಠ益ಠ)ノ彡┻━┻"];
        let region = {
            "brazil": "Brésil",
            "eu-central": "Europe Central",
            "singapore": "Singapour",
            "us-central": "États-Unis Central",
            "sydney": "Sydney",
            "us-east": "Est des États-Unis",
            "us-south": "Sud des États-Unis",
            "us-west": "Ouest des États-Unis",
            "eu-west": "Europe de l'Ouest",
            "vip-us-east": "VIP U.S. East ?",
            "london": "Londres",
            "amsterdam": "Amsterdam",
            "hongkong": "Hong Kong"
        };
        var emojis;
        if (message.guild.emojis.size === 0) {
            emojis = 'Aucun';
        } else {
            emojis = message.guild.emojis.size;
        }
        let online = message.guild.members.filter(member => member.user.presence.status !== 'offline');
        var verified;
        if(message.guild.verified === false) {
            verified = "Non";
        } else {
            verified = "Oui";
        }
        var afk_channel;
        if(message.guild.afkChannel) {
            afk_channel = message.guild.afkChannel;
        } else {
            afk_channel = "Aucun";
        }
        var afk_channelid;
        if(message.guild.afkChannelID) {
            afk_channelid = message.guild.afkChannelID;
        } else {
            afk_channelid = "Aucun";
        }
        var avaible;
        if(message.guild.available) {
            avaible = "Oui";
        } else {
            avaible = "Non";
        }
        const embed = new Discord.RichEmbed()
            .setColor(`${config.colorembed}`)
            .setThumbnail('' + message.guild.iconURL + '')
            .setTitle('Serveur Info')
            .addField("Nom du serveur", `${message.guild.name}`, true)
            .addField("ID du serveur", `${message.guild.id}`, true)
            .addField("Propriétaire", `${message.guild.owner}`, true)
            .addField("Région", region[message.guild.region], true)
            .addField("Salons", `${message.guild.channels.size}`, true)
            .addField("Emojis", `${emojis}`, true)
            .addField("Rôles", `${message.guild.roles.size}`, true)
            .addField(`Salon AFK`, `${afk_channel}`, true)
            .addField(`ID du Salon AFK`, `${afk_channelid}`, true)
            .addField("Délai avant AFK", message.guild.afkTimeout / 60 + ' minutes', true)
            .addField("Niveaux de vérification", verifLevels[message.guild.verificationLevel], true)
            .addField(`Verifié`, `${verified}`, true)
            if(guildConf[message.guild.id].serverinvite) {
                embed.addField(`Server invite`, `${guildConf[message.guild.id].serverinvite}`, true)
            } else {
                embed.addField(`Server invite`, `Aucun`, true)
            }
            embed.addField("Total de membres", `${message.guild.memberCount - message.guild.members.filter(m => m.user.bot).size}`, true)
            embed.addField("Bots", `${message.guild.members.filter(m => m.user.bot).size}`, true)
            embed.addField("En ligne", `${online.size}`, true)
            embed.addField(`Crée le`, `${timeConverter(message.guild.createdAt)}`, true)
            embed.addField(`Vous avez rejoind le`, `${timeConverter(message.member.joinedAt)}`, true)
            embed.setTimestamp()
            embed.setFooter('Server info Release Version');
        message.channel.send(embed);
    }
});

/*User Info*/
client.on("message", message => {
    if (message.author.bot) return;
    if (message.content.indexOf(guildConf[message.guild.id].prefix) !== 0) return;
    const args = message.content.slice(guildConf[message.guild.id].prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    let user = message.author;
    const member = message.mentions.members.first() || message.guild.members.get(args[0]) || message.member;
    if (command === "user-info") {
        var botuser;
        if(member.user.bot) {
            botuser = "Oui";
        } else {
            botuser = "Non";
        }
        const embed = new Discord.RichEmbed()
            .setColor(`${config.colorembed}`)
            .setThumbnail('' + member.user.displayAvatarURL + '')
            .setTitle('Utlisateur Info')
            .addField("Pseudo", `${member}`, true)
            .addField("ID", `${member.id}`, true)
            .addField("Bot", `${botuser}`, true)
            .addField("Crée le", `${timeConverter(member.user.createdAt)}`, true)
            .addField("Rejoind le", `${timeConverter(member.joinedAt)}`, true)
            .addField("Dernier message", `${member.user.lastMessage}`, true)
            .addField("Dernier message ID", `${member.user.lastMessageID}`, true)
            .addField("Status", `${member.user.presence.status}`, true)
            .addField("Status de jeux", `${member.presence.game ? member.presence.game.name : 'Aucun'}`, true)
            .addField("Rôles", `${member.roles.map(roles => `${roles.name}`).join(', ')}`, true)
            .setTimestamp()
            .setFooter('User info Release Version');
        message.channel.send(embed);
    }
});

/*Bot Info*/
client.on("message", message => {
    if (message.author.bot) return;
    if (message.content.indexOf(guildConf[message.guild.id].prefix) !== 0) return;
    const args = message.content.slice(guildConf[message.guild.id].prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    if (command === "bot-info") {
        const embed = new Discord.RichEmbed()
            .setColor(`${config.colorembed}`)
            .setThumbnail('' + client.user.displayAvatarURL + '')
            .setTitle('Bot Info', true)
            .addField("Nom du bot", `${client.user}`, true)
            .addField("ID du bot", `${client.user.id}`, true)
            .addField("Version du bot", `${config.version}`, true)
            .addField("Crée le", `${timeConverter(client.user.createdAt)}`, true)
            .addField("Connecté depuis le", `${timeConverter(client.readyAt)}`, true)
            if(client.guilds.size <= 2) {
                embed.addField("Sur", `${client.guilds.size} Serveur`, true)
            }
            else {
                embed.addField("Sur", `${client.guilds.size} Serveurs`, true)
            }
            embed.addField("Developpeur", `${config.creator}`, true)
            embed.addField("Site web", `https://discordbotjs.github.io/DiscordBot.js-Website.io/`, true)
            embed.addField("Serveur Support", `${config.invitesupport}`, true)
            embed.addField("Dépôts Github", `https://github.com/DiscordBotJs/DiscordBot.Js`, true)
            embed.addField(`Vidéo Présentation`, `${config.videopresentation}`, true)
            embed.setTimestamp()
            embed.setFooter('Bot info Release Version');
        message.channel.send(embed);
    }
});

/*Channel Info*/
client.on("message", message => {
    if (message.author.bot) return;
    if (message.content.indexOf(guildConf[message.guild.id].prefix) !== 0) return;
    const args = message.content.slice(guildConf[message.guild.id].prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const channel = message.mentions.channels.first() || message.channel;
    const channelTypes = {
        dm: 'Message privés',
        group: 'Groupe privés',
        text: 'Salon textuel',
        voice: 'Salon vocal',
        category: 'Catégorie',
        news: `Actualités`,
        store: 'Magasins',
        unknown: 'Inconnue',
    };
    if (command === "channel-info") {
        const embed = new Discord.RichEmbed()
            .setColor(`${config.colorembed}`)
            .setTitle('Channel Info', true)
            .addField("Nom du salon", channel.type === 'dm' ? `<@${channel.recipient.username}>` : channel.name, true)
            .addField("Id", channel.id, true)
            .addField("Crée le", timeConverter(channel.createdAt), true)
            .addField("NSFW", channel.nsfw ? 'Oui' : 'Non', true)
            .addField("Catégories", channel.parent ? channel.parent.name : 'Aucun', true)
            .addField("Type", channelTypes[channel.type], true)
            .addField("Topic", channel.topic || 'Aucun', true)
            .setTimestamp()
            .setFooter('Channel info Release Version');
        message.channel.send(embed);
    }
});

/*Role Info*/
client.on("message", message => {
    if (message.author.bot) return;
    if (message.content.indexOf(guildConf[message.guild.id].prefix) !== 0) return;
    const args = message.content.slice(guildConf[message.guild.id].prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const role = message.mentions.roles.first() || message.guild.roles.get(args[0]);
    if (command === "role-info") {
        if (!role) {
            return message.reply('Veuillez rentrez un role !');
        }
        const embed = new Discord.RichEmbed()
            .setColor(`${config.colorembed}`)
            .setTitle('Channel Info', true)
            .addField("Nom du rôle", role.name, true)
            .addField("Id", role.id, true)
            .addField("Position", role.calculatedPosition, true)
            .addField("Crée le", timeConverter(role.createdAt), true)
            .addField("Epinglés", role.hoist ? 'Oui' : 'Non', true)
            .addField("Mentionable", role.mentionable ? 'Oui' : 'Non', true)
            .addField("Permissions", role.permissions, true)
            .addField("Couleur", role.color, true)
            .addField("Couleur en Hexadécimal", role.hexColor, true)
            .setTimestamp()
            .setFooter('Role info Release Version');
        message.channel.send(embed);
    }
});

/*Server List*/
client.on("message", message => {
    if (message.author.bot) return;
    if (message.content.indexOf(guildConf[message.guild.id].prefix) !== 0) return;
    const args = message.content.slice(guildConf[message.guild.id].prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    if (command === "server-list") {
        message.channel.send(client.guilds.map(r => r.name + ` | **${r.memberCount}** membres | Propriétaire ${r.owner} | Région ${r.region}`));
    }
});

/*Server Invite*/
client.on("message", async message => {
    if (message.author.bot) return;
    if (message.content.indexOf(guildConf[message.guild.id].prefix) !== 0) return;
    if (!message.member.hasPermission('CREATE_INSTANT_INVITE'))
	  return message.reply("Désolé, Vous n'avez pas les permissions !");
    const args = message.content.slice(guildConf[message.guild.id].prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const invite = await message.channel.createInvite({
        maxAge: 0,
        maxUses: 0
    })
    if (command === "server-invite") {
            guildConf[message.guild.id] = {
                prefix: `${guildConf[message.guild.id].prefix}`,
                serverinvite: `${invite}`
            }
             fs.writeFile('./config.json', JSON.stringify(guildConf, null, 2), (err) => {
                 if (err) console.log(err)
            })
        message.channel.send(`Lien d'invitation: ${invite}`);
    }
});

/*Kick*/
client.on("message", async message => {
	if(message.author.bot) return;
	if(message.content.indexOf(guildConf[message.guild.id].prefix) !== 0) return;
	const args = message.content.slice(guildConf[message.guild.id].prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();
	if(command === "kick") {
		if (!message.member.hasPermission('KICK_MEMBERS'))
	  return message.reply("Désolé, Vous n'avez pas les permissions !");

	  let target = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]))
	  let reason = args.slice(1).join(' ');

	  if(!target) return message.reply("S'il vous plait mentionné un membre valide !");

	  if(!target.kickable) return message.reply("Je ne peut pas kicker ce membre !\nai-je les permissions pour kicker des membres ?");

	  if(!reason) reason = "Aucune Raison";

	  const embed_kick_message = new Discord.RichEmbed()
		  .setColor(`${config.colorembed}`)
		  .setTitle('Vous avez était kicker !')
		  .addField("Auteur", `${message.author}`)
		  .addField("Auteur ID", `${message.author.id}`)
		  .addField("Serveur", `${message.guild.name}`)
		  .addField("Serveur ID", `${message.guild.id}`)
		  .addField("Salon", `${message.channel.name}`)
		  .addField("Salon ID", `${message.channel.id}`)
		  .addField("Raison", `${reason}`)
		  .setTimestamp()
		  .setFooter('Kick Release Version');

	  target.send(embed_kick_message);
	  console.log(`${message.author.tag}` + " a kicker " + `${target.user.username}` + " car: " + `${reason}`)
	  setTimeout(function(){ 
		target.kick(reason)
	}, 1000);
  }
});

/*Ban*/
client.on("message", message => {
	if(message.author.bot) return;
	if(message.content.indexOf(guildConf[message.guild.id].prefix) !== 0) return;
	const args = message.content.slice(guildConf[message.guild.id].prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();
	if(command === "ban") {
		if (!message.member.hasPermission('BAN_MEMBERS'))
	  return message.reply("Désolé, Vous n'avez pas les permissions !");

	  let target = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]))
	  let reason = args.slice(1).join(' ');

	  if(!target) return message.reply("S'il vous plait mentionné un membre valide !");

	  if(!target.bannable) return message.reply("Je ne peut pas kicker ce membre !\nai-je les permissions pour kicker des membres ?");

	  if(!reason) reason = "Aucune Raison";

	  const embed_ban_message = new Discord.RichEmbed()
		  .setColor(`${config.colorembed}`)
		  .setTitle('Vous avez était bannie !')
		  .addField("Auteur", `${message.author}`)
		  .addField("Auteur ID", `${message.author.id}`)
		  .addField("Serveur", `${message.guild.name}`)
		  .addField("Serveur ID", `${message.guild.id}`)
		  .addField("Salon", `${message.channel.name}`)
		  .addField("Salon ID", `${message.channel.id}`)
		  .addField("Raison", `${reason}`)
		  .setTimestamp()
		  .setFooter('Ban Release Version');

	  target.send(embed_ban_message);
	  console.log(`${message.author.tag}` + " a bannie " + `${target.user.username}` + " car: " + `${reason}`)
	  setTimeout(function(){ 
		target.ban(reason)
	}, 1000);
  }
});

/*Report*/
client.on("message", async(message) => {
	if(message.author.bot) return;
	if(message.content.indexOf(guildConf[message.guild.id].prefix) !== 0) return;
	const args = message.content.slice(guildConf[message.guild.id].prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();
	if(command === "report") {
	if (!message.member.hasPermission('KICK_MEMBERS'))
	return message.reply("Désolé, Vous n'avez pas les permissions !");

	let target = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]))
	let reason = args.slice(1).join(' ');

	if(!target) return message.reply("S'il vous plait mentionné un membre valide !");
	if(!reason) reason = "Aucune Raison";

	const embed_report = new Discord.RichEmbed()
		  .setColor(`${config.colorembed}`)
		  .setTitle('Logs Report')
		  .addField("Membre", `${target.user}`)
		  .addField("Membre ID", `${target.user.id}`)
		  .addField("Auteur", `${message.author}`)
		  .addField("Auteur ID", `${message.author.id}`)
		  .addField("Raison", `${reason}`)
		.setTimestamp()
		.setFooter('Report Release Version');

	const embed_report_message = new Discord.RichEmbed()
		  .setColor(`${config.colorembed}`)
		  .setTitle('Vous avez était reporté !')
		  .addField("Auteur", `${message.author}`)
		  .addField("Auteur ID", `${message.author.id}`)
		  .addField("Serveur", `${message.guild.name}`)
		  .addField("Serveur ID", `${message.guild.id}`)
		  .addField("Salon", `${message.channel.name}`)
		  .addField("Salon ID", `${message.channel.id}`)
		  .addField("Raison", `${reason}`)
		  .setTimestamp()
		  .setFooter('Report Release Version');

	const LogsChannel = message.guild.channels.find(channel => channel.name === "📄logs");
            const LogsChannelID = message.guild.channels.get(config.logs)
            if (LogsChannel) {
            LogsChannel.send(embed_report)
            }
            else if(!LogsChannel) {
            if (!LogsChannelID) return message.reply("Impossible de trouver le salon Logs !");
            LogsChannelID.send(embed_report)
            }
	message.channel.send(`Signalement effectué ${message.author} !`);
	target.send(embed_report_message);
	console.log(`${message.author.tag}` + " a reporté " + `${target.user.username}` + " car: " + `${reason}`)
	}
});

/*Mute*/
client.on("message", async message => {
	if(message.author.bot) return;
	if(message.content.indexOf(guildConf[message.guild.id].prefix) !== 0) return;
	const args = message.content.slice(guildConf[message.guild.id].prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();
	if(command === "mute") {
		if (!message.member.hasPermission(["MANAGE_ROLES", "MUTE_MEMBERS", "MANAGE_CHANNELS"]))
	  return message.reply("Désolé, Vous n'avez pas les permissions !");

	  let target = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]))
	  let muteRole = message.guild.roles.find(`name`, "Muted");
	  let reason = args.slice(1).join(' ');

		  if(!muteRole) {
			try{
				muteRole = await message.guild.createRole({
					name: "Muted",
					color: "#514f48",
					permissions: []
				})
				message.guild.channels.forEach(async (channel, id) => {
					await channel.overwritePermissions(muteRole, {
						SEND_MESSAGES: false,
						ADD_REACTIONS: false,
						SEND_TTS_MESSAGES: false,
						ATTACH_FILES: false,
						SPEAK: false
					})
				})
			} catch(e) {
				console.log(e.stack);
			}
		}

	  if(!target) return message.reply("S'il vous plait mentionné un membre valide !");

	  if(!reason) reason = "Aucune Raison";

	  const embed1 = new Discord.RichEmbed()
		  .setColor(`${config.colorembed}`)
		  .setTitle('Vous êtes mute !')
		  .addField("Auteur", `${message.author}`)
		  .addField("Auteur ID", `${message.author.id}`)
		  .addField("Serveur", `${message.guild.name}`)
		  .addField("Serveur ID", `${message.guild.id}`)
		  .addField("Salon", `${message.channel.name}`)
		  .addField("Salon ID", `${message.channel.id}`)
		  .addField("Raison", `${reason}`)
		  .setTimestamp()
		  .setFooter('Mute Release Version');

		  const embed3 = new Discord.RichEmbed()
		  .setColor(`${config.colorembed}`)
		  .setTitle('Logs Mute')
		  .addField("Auteur", `${message.author}`)
		  .addField("Auteur ID", `${message.author.id}`)
		  .addField("Salon", `${message.channel.name}`)
		  .addField("Salon ID", `${message.channel.id}`)
		  .addField("Raison", `${reason}`)
		  .setTimestamp()
		  .setFooter('Mute Release Version');

		  if (!target.roles.has(muteRole.id)) {
			target.addRole(muteRole)
				target.send(embed1);
				const LogsChannel = message.guild.channels.find(channel => channel.name === "📄logs");
            			const LogsChannelID = message.guild.channels.get(config.logs)
            				if (LogsChannel) {
                				LogsChannel.send(embed3)
            				}
            				else if(!LogsChannel) {
            					if (!LogsChannelID) return message.reply("Impossible de trouver le salon Logs !");
                					LogsChannelID.send(embed3)
            				}
				console.log(`${message.author.tag}` + " a mute " + `${target.user.username}` + " car: " + `${reason}`)
			} else {
				message.channel.send(target.user + ` est déjà mute !`);
			  }
	}
});

/*Unmute*/
client.on("message", async message => {
	if(message.author.bot) return;
	if(message.content.indexOf(guildConf[message.guild.id].prefix) !== 0) return;
	const args = message.content.slice(guildConf[message.guild.id].prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();
	if(command === "unmute") {
		if (!message.member.hasPermission(["MANAGE_ROLES", "MUTE_MEMBERS", "MANAGE_CHANNELS"]))
	  return message.reply("Désolé, Vous n'avez pas les permissions !");

	  let target = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]))
	  let muteRole = message.guild.roles.find(`name`, "Muted");
	  let reason = args.slice(1).join(' ');

	  if(!target) return message.reply("S'il vous plait mentionné un membre valide !");

	  if(!reason) reason = "Aucune Raison";

		  const embed2 = new Discord.RichEmbed()
		  .setColor(`${config.colorembed}`)
		  .setTitle(`Vous n'êtes plus mute !`)
		  .addField("Auteur", `${message.author}`)
		  .addField("Auteur ID", `${message.author.id}`)
		  .addField("Serveur", `${message.guild.name}`)
		  .addField("Serveur ID", `${message.guild.id}`)
		  .addField("Salon", `${message.channel.name}`)
		  .addField("Salon ID", `${message.channel.id}`)
		  .addField("Raison", `${reason}`)
		  .setTimestamp()
		  .setFooter('Unmute Release Version');

		  const embed4 = new Discord.RichEmbed()
		  .setColor(`${config.colorembed}`)
		  .setTitle(`Logs Unmute:`)
		  .addField("Auteur", `${message.author}`)
		  .addField("Auteur ID", `${message.author.id}`)
		  .addField("Salon", `${message.channel.name}`)
		  .addField("Salon ID", `${message.channel.id}`)
		  .addField("Raison", `${reason}`)
		  .setTimestamp()
		  .setFooter('Unmute Release Version');

		  if (target.roles.has(muteRole.id)) {
			target.removeRole(muteRole)
				target.send(embed2);
				const LogsChannel = message.guild.channels.find(channel => channel.name === "📄logs");
            			const LogsChannelID = message.guild.channels.get(config.logs)
            				if (LogsChannel) {
                				LogsChannel.send(embed4)
            				}
            				else if(!LogsChannel) {
            					if (!LogsChannelID) return message.reply("Impossible de trouver le salon Logs !");
                					LogsChannelID.send(embed4)
            				}
				console.log(`${message.author.tag}` + " a unmute " + `${target.user.username}` + " car: " + `${reason}`)
			} else {
				message.channel.send(target.user + ` n'as pas était mute !`);
			  }
		  }
});

/*Bot Vote*/
client.on("message", message => {
	  if(message.author.bot) return;
	  if(message.content.indexOf(guildConf[message.guild.id].prefix) !== 0) return;
	  const args = message.content.slice(guildConf[message.guild.id].prefix.length).trim().split(/ +/g);
      const command = args.shift().toLowerCase();
	  if(command === "bot-vote") {
        const embed = new Discord.RichEmbed()
        .setColor(`${config.colorembed}`)
        .setTitle(`Voter pour DiscordBot.Js`)
        .setDescription(`Voter sur top.gg: https://top.gg/bot/629968935709835284/vote`)
        message.channel.send(embed);
	}
});

/*Pierre, Feuille, Ciseaux*/
client.on("message", (message) => {
    if(message.author.bot) return;
    if(message.content.indexOf(guildConf[message.guild.id].prefix) !== 0) return;
    const args = message.content.slice(guildConf[message.guild.id].prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    if(command === "chifoumi") {
        let rps = ["ciseaux", "feuille", "pierre"];
let i;
if(!rps.includes(args[0])) return message.reply("S'il vous plaît, choisisez soit Pierre, Feuille ou Ciseaux.");
if(args[0].includes("pierre")) {
i = 2;
}
if(args[0].includes("feuille")) {
i = 1;
}
if(args[0].includes("ciseaux")) {
i = 0;
}
if(rps[i]) {
let comp = Math.floor((Math.random() * 3) + 1);
let comp_res = parseInt(comp) - parseInt("1");
let comp_val = rps[parseInt(comp_res)];
  if(i === comp_res) {
    return message.channel.send(`Vous avez choisi **${args [0]}** et j'ai choisi **${comp_val}**, il y a égalités.\nVous voulez réessayer ?`); 
  }
  if(i > comp_res) {
    return message.channel.send(`Vous avez choisi **${args [0]}** et j'ai choisi **${comp_val}**, j'ai gagné !\nBien joué.`);
  } 
  if(i < comp_res) {
    return message.channel.send(`Vous avez choisi **${args [0]}** et j'ai choisi **${comp_val}**, j'ai perdu !\nFélicitations pour avoir gagné !`);
  }
}
  }
});

/*Clear*/
client.on("message", async message => {
	if(message.author.bot) return;
	if(message.content.indexOf(guildConf[message.guild.id].prefix) !== 0) return;
	const args = message.content.slice(guildConf[message.guild.id].prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();
	if(command === "clear") {
		if (!message.member.hasPermission('MANAGE_MESSAGES'))
		return message.reply("Désolé, Vous n'avez pas les permissions !");

		const deleteCount = parseInt(args[0], 10);
		if(!deleteCount || deleteCount < 2 || deleteCount > 100)
		  return message.reply("S'il vous plait entrez le nombre de message que vous voulez supprimer entre 2 est 100 !");

		const fetched = await message.channel.fetchMessages({limit: deleteCount});
		message.channel.bulkDelete(fetched)
		  .catch(error => message.reply(`Je ne peut pas supprimer des messages car: ${error}`));
  }
});

/*Ping*/
client.on("message", message => {
	if(message.author.bot) return;
	if(message.content.indexOf(guildConf[message.guild.id].prefix) !== 0) return;
	const args = message.content.slice(guildConf[message.guild.id].prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();
	if(command === "ping") {
	  const embed = new Discord.RichEmbed()
	  .setColor(`${config.colorembed}`)
	  .setTitle(`Ping Info`)
	  .setDescription(`Temp de latence avec le serveur ${message.createdTimestamp - Date.now()} ms\nTemp de latence avec l'API de Discord ${Math.round(client.ping)} ms`)
	  message.channel.send(embed);
  }
});

/*Say*/
client.on("message", message => {
	if(message.author.bot) return;
	if(message.content.indexOf(guildConf[message.guild.id].prefix) !== 0) return;
	const args = message.content.slice(guildConf[message.guild.id].prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();
	if(command === "say") {
	  if (!message.member.hasPermission('MANAGE_MESSAGES'))
	  return message.reply("Désolé, Vous n'avez pas les permissions !");
	  const sayMessage = args.join(` `);
	  if(!sayMessage) return message.reply("Veuillez spécifiez du texte")
	  message.delete().catch();
	  message.channel.send(sayMessage + `\nMessage de ${message.author}`);
  }
});

/*Markdown*/
client.on("message", message => {
  if(message.author.bot) return;
  if(message.content.indexOf(guildConf[message.guild.id].prefix) !== 0) return;
  const args = message.content.slice(guildConf[message.guild.id].prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if(command === "say-markdown") {
	  if (!message.member.hasPermission('MANAGE_MESSAGES'))
	  return message.reply("Désolé, Vous n'avez pas les permissions !");
	  const embed = new Discord.RichEmbed()
		.setColor(`${config.colorembed}`)
		.setTitle(`Markdown Help`)
		.addField(`${guildConf[message.guild.id].prefix}say-italic`, `*Italic*`)
		.addField(`${guildConf[message.guild.id].prefix}say-bold`, `**Gras**`)
		.addField(`${guildConf[message.guild.id].prefix}say-underline`, `__Souligné__`)
		.addField(`${guildConf[message.guild.id].prefix}say-strikethrough`, `~~Barré~~`)
		.addField(`${guildConf[message.guild.id].prefix}say-quotes`, `>>> Citations`)
		.addField(`${guildConf[message.guild.id].prefix}say-spoiler`, `||Spoiler||`)
		.addField(`${guildConf[message.guild.id].prefix}say-code`, `Visualisation Impossible`)
		.addField(`${guildConf[message.guild.id].prefix}say-code-block`, `Visualisation Impossible`)
		.addField(`${guildConf[message.guild.id].prefix}say-code-color`, `Pour effectuer cette commande, vous devez sauter une ligne après la langue définie !\nExemple: ${guildConf[message.guild.id].prefix}say-code-color Js ou autre langage\nVotre code en Js ou autre langage`)
		.setTimestamp()
		.setFooter('Markdown Release Version');
		message.channel.send(embed);
	}
if(command === "say-italic") {
  if (!message.member.hasPermission('MANAGE_MESSAGES'))
  return message.reply("Désolé, Vous n'avez pas les permissions !");
  const sayMessage = args.join(` `);
  if(!sayMessage) return message.reply("Veuillez spécifiez du texte")
  message.delete().catch();
  message.channel.send("*" + `${sayMessage}` + "*" + `\nMessage de ${message.author}`);
}
if(command === "say-bold") {
  if (!message.member.hasPermission('MANAGE_MESSAGES'))
  return message.reply("Désolé, Vous n'avez pas les permissions !");
  const sayMessage = args.join(` `);
  if(!sayMessage) return message.reply("Veuillez spécifiez du texte")
  message.delete().catch();
  message.channel.send("**" + `${sayMessage}` + "**" + `\nMessage de ${message.author}`);
}
if(command === "say-underline") {
  if (!message.member.hasPermission('MANAGE_MESSAGES'))
  return message.reply("Désolé, Vous n'avez pas les permissions !");
  const sayMessage = args.join(` `);
  if(!sayMessage) return message.reply("Veuillez spécifiez du texte")
  message.delete().catch();
  message.channel.send("__" + `${sayMessage}` + "__" + `\nMessage de ${message.author}`);
}
if(command === "say-strikethrough") {
  if (!message.member.hasPermission('MANAGE_MESSAGES'))
  return message.reply("Désolé, Vous n'avez pas les permissions !");
  const sayMessage = args.join(` `);
  if(!sayMessage) return message.reply("Veuillez spécifiez du texte")
  message.delete().catch();
  message.channel.send("~~" + `${sayMessage}` + "~~" + `\nMessage de ${message.author}`);
}
if(command === "say-quotes") {
  if (!message.member.hasPermission('MANAGE_MESSAGES'))
  return message.reply("Désolé, Vous n'avez pas les permissions !");
  const sayMessage = args.join(` `);
  if(!sayMessage) return message.reply("Veuillez spécifiez du texte")
  message.delete().catch();
  message.channel.send(">>> " + `${sayMessage}` + `\nMessage de ${message.author}`);
}
if(command === "say-spoiler") {
  if (!message.member.hasPermission('MANAGE_MESSAGES'))
  return message.reply("Désolé, Vous n'avez pas les permissions !");
  const sayMessage = args.join(` `);
  if(!sayMessage) return message.reply("Veuillez spécifiez du texte")
  message.delete().catch();
  message.channel.send("||" + `${sayMessage}` + "||" + `\nMessage de ${message.author}`);
}
if(command === "say-code") {
  if (!message.member.hasPermission('MANAGE_MESSAGES'))
  return message.reply("Désolé, Vous n'avez pas les permissions !");
  const sayMessage = args.join(` `);
  if(!sayMessage) return message.reply("Veuillez spécifiez du texte")
  message.delete().catch();
  message.channel.send("`" + `${sayMessage}` + "`" + `\nMessage de ${message.author}`);
}
if(command === "say-code-block") {
  if (!message.member.hasPermission('MANAGE_MESSAGES'))
  return message.reply("Désolé, Vous n'avez pas les permissions !");
  const sayMessage = args.join(` `);
  if(!sayMessage) return message.reply("Veuillez spécifiez du texte")
  message.delete().catch();
  message.channel.send("```\n" + `${sayMessage}` + "\n```" + `\nMessage de ${message.author}`);
}
if(command === "say-code-color") {
  if (!message.member.hasPermission('MANAGE_MESSAGES'))
  return message.reply("Désolé, Vous n'avez pas les permissions !");
  const sayColor = args.slice(0).join(' ');
  const sayMessage = args.slice(1).join(' ');
  if(!sayMessage) return message.reply("Veuillez spécifiez du texte")
  message.delete().catch();
  message.channel.send("```" + `${sayColor}` + "\n" + `${sayMessage}` +"\n```" + `\nMessage de ${message.author}`);
}
});

/*Logs Channel*/
client.on("message", message => {
    if (message.author.bot) return;
    if (message.content.indexOf(guildConf[message.guild.id].prefix) !== 0) return;
    const args = message.content.slice(guildConf[message.guild.id].prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const channelmention = message.mentions.channels.first() || message.channel;
    if (command === "logs-channel") {
        if (!message.member.hasPermission('VIEW_AUDIT_LOG')) return message.reply("Désolé, Vous n'avez pas les permissions !");
        const collectorchannel = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 10000 });
        collectorchannel.on('collect', message => {
        config.logs = channelmention;
        if (!config.logs) return message.reply("Impossible de trouver le canal Logs !");
        message.channel.send(`Les logs sont maintenant activés !\nSalon Logs: ${channelmention}`);
        })
    }
});

/*Help*/
client.on("message", message => {
    if(!message.guild || message.author.bot) return;
	if(message.content.indexOf(guildConf[message.guild.id].prefix) !== 0) return;
	const args = message.content.slice(guildConf[message.guild.id].prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();
	if(command === "help") {
	  const embed1 = new Discord.RichEmbed()
	        .setColor(`${config.colorembed}`)
	        .setTitle(`Aide Commande n°1`)
            .addField(`${guildConf[message.guild.id].prefix}server-info`, `Affiche les informations du serveur`)
            .addField(`${guildConf[message.guild.id].prefix}user-info`, `Afiiche vos informations non personnel`)
            .addField(`${guildConf[message.guild.id].prefix}bot-info`, `Affiche les informations du bot`)
            .addField(`${guildConf[message.guild.id].prefix}channel-info`, `Affiche les informations d'un salon`)
            .addField(`${guildConf[message.guild.id].prefix}role-info`, `Affiche les informations d'un rôle`)
	    .addField(`${guildConf[message.guild.id].prefix}server-list`, `Affiche les serveurs où le bot est connecté`)
	    .addField(`${guildConf[message.guild.id].prefix}server-invite`, `Commande permettant de générer un lien d'invitation du serveur`)
            .addField(`${guildConf[message.guild.id].prefix}kick`, `Commande permettant de kicker un membre`)
            .addField(`${guildConf[message.guild.id].prefix}ban`, `Commande permettant de bannir un membre`)
            .addField(`${guildConf[message.guild.id].prefix}report`, `Commande permettant de reporter un membre`)
            .addField(`${guildConf[message.guild.id].prefix}mute`, `Commande permettant de mettre en soudrine un membre`)
            .addField(`${guildConf[message.guild.id].prefix}unmute`, `Commande permettant d'enlever sourdine d'un membre`)
	    .addField(`${guildConf[message.guild.id].prefix}bot-vote`, `Commande permettant de voter pour DiscordBot.Js`)
        .addField(`${guildConf[message.guild.id].prefix}chifoumi`, `Commande permettant de jouer aux chifoumi`)
            .addField(`${guildConf[message.guild.id].prefix}clear`, `Commande permettant de supprimer des messsages`)
            .addField(`${guildConf[message.guild.id].prefix}ping`, `Commande permettant d'afficher le ping`)
            .addField(`${guildConf[message.guild.id].prefix}say`, `Commande permettant de faire parler le bot`)
            .addField(`${guildConf[message.guild.id].prefix}say-markdown`, `Commande permettant de faire parler le bot avec les markdown de discord`)
	    .addField(`${guildConf[message.guild.id].prefix}logs-channel`, `Commande permettant de configurer le salon Logs\n(Veuillez renseignez l'ID du channel !)`)
	    .addField(`${guildConf[message.guild.id].prefix}setup-server`, `Commande permettant de configurer un serveur`)
	    .addField(`${guildConf[message.guild.id].prefix}embed-help`, `Aide pour crée un embed`)
            .addField(`${guildConf[message.guild.id].prefix}poll-help`, `Aide pour crée un sondage`)
	    .addField(`${guildConf[message.guild.id].prefix}xp-help`, `Aide pour le système d'xp`)
            .addField(`${guildConf[message.guild.id].prefix + config.prefixMusic}help`, `Affiche les commandes de musique`)
      message.channel.send(embed1);
      const embed2 = new Discord.RichEmbed()
	        .setColor(`${config.colorembed}`)
	        .setTitle(`Aide Commande n°2`)
        .addField(`${guildConf[message.guild.id].prefix}new-prefix`, `Commande permettant de changer le prefix du bot`)
            .addField(`${guildConf[message.guild.id].prefix}money-help`, `Aide pour le système d'argent`)
	  message.channel.send(embed2);
	  }
});

/*Reaction Role*/
if (config.roles.length !== config.reactions.length)
    throw "La liste des rôles et la liste des réactions ne sont pas éxacte ! Veuillez vérifier ceci dans le fichier config.js";
        function generateMessages() {
            return config.roles.map((r, e) => {
                return {
                    role: r,
                    message: `Réagissez ci-dessous pour obtenir le rôle **"${r}"** !`,
                    emoji: config.reactions[e]
                };
            });
}

function generateEmbedFields() {
    return config.roles.map((r, e) => {
        return {
            emoji: config.reactions[e],
            role: r
        };
    });
}

client.on("message", message => {
    if (message.content === `${guildConf[message.guild.id].prefix}reaction-role-create`) {
        if (!message.member.hasPermission('MANAGE_ROLES'))
	return message.reply("Désolé, Vous n'avez pas les permissions !");

    if (message.author.bot) return;

    if (!message.guild) return;

    if (message.guild && !message.channel.permissionsFor(message.guild.me).missing('SEND_MESSAGES')) return;

    if ((message.author.id !== config.ownerID) && (message.content.toLowerCase() !== `${guildConf[message.guild.id].prefix}reaction-role-create`)) return;

    if (config.deleteSetupCMD) {
        const missing = message.channel.permissionsFor(message.guild.me).missing('MANAGE_MESSAGES');

        if (missing.includes('MANAGE_MESSAGES'))
            throw new Error("J'ai besoin de la permission pour supprimer votre commande ! Attribuez-moi l'autorisation 'Gérer les messages' sur ce salon !");
        message.delete().catch(O_o=>{});
    }

    const missing = message.channel.permissionsFor(message.guild.me).missing('MANAGE_MESSAGES');

    if (missing.includes('ADD_REACTIONS'))
        throw new Error("J'ai besoin de la permission pour ajouter des réactions aux messages ! Veuillez attribuer l'autorisation 'Ajouter des réactions' à ce salon !");

    if (!config.embed) {
        if (!config.initialMessage || (config.initialMessage === '')) 
            throw "La propriété 'initialMessage' n'est pas définie dans le fichier config.js. Fais-le s'il te plaît !";

        message.channel.send(config.initialMessage);

        const messages = generateMessages();
        for (const { role, message: msg, emoji } of messages) {
            if (!message.guild.roles.find(r => r.name === role))
                throw `Le rôle '${role}' n'existe pas !`;

            message.channel.send(msg).then(async m => {
                const customCheck = message.guild.emojis.find(e => e.name === emoji);
                if (!customCheck) await m.react(emoji);
                else await m.react(customCheck.id);
            }).catch(console.error);
        }
    } else {
        if (!config.embedMessage || (config.embedMessage === ''))
            throw "La propriété 'embedMessage' n'est pas définie dans le fichier config.js. Fais-le s'il te plaît !";
        if (!config.embedFooter || (config.embedMessage === ''))
            throw "La propriété 'embedFooter' n'est pas définie dans le fichier config.js. Fais-le s'il te plaît !";

        const roleEmbed = new RichEmbed()
            .setDescription(config.embedMessage)
            .setFooter(config.embedFooter);

        if (config.embedColor) roleEmbed.setColor(config.embedColor);

        if (config.embedThumbnail && (config.embedThumbnailLink !== '')) 
            roleEmbed.setThumbnail(config.embedThumbnailLink);
        else if (config.embedThumbnail && message.guild.icon)
            roleEmbed.setThumbnail(message.guild.iconURL);

        const fields = generateEmbedFields();
        if (fields.length > 25) throw "Le nombre maximum de rôles pouvant être définis pour un embed est de 25!";

        for (const { emoji, role } of fields) {
            if (!message.guild.roles.find(r => r.name === role))
                throw `Le rôle '${role}' n'existe pas !`;

            const customEmote = client.emojis.find(e => e.name === emoji);
            
            if (!customEmote) roleEmbed.addField(emoji, role, true);
            else roleEmbed.addField(customEmote, role, true);
        }

        message.channel.send(roleEmbed).then(async m => {
            for (const r of config.reactions) {
                const emoji = r;
                const customCheck = client.emojis.find(e => e.name === emoji);
                
                if (!customCheck) await m.react(emoji);
                else await m.react(customCheck.id);
            }
        });
    }
}
});

const events = {
	MESSAGE_REACTION_ADD: 'messageReactionAdd',
	MESSAGE_REACTION_REMOVE: 'messageReactionRemove',
};

client.on('raw', async event => {
    if (!events.hasOwnProperty(event.t)) return;

    const { d: data } = event;
    const user = client.users.get(data.user_id);
    const channel = client.channels.get(data.channel_id);

    const message = await channel.fetchMessage(data.message_id);
    const member = message.guild.members.get(user.id);

    const emojiKey = (data.emoji.id) ? `${data.emoji.name}:${data.emoji.id}` : data.emoji.name;
    let reaction = message.reactions.get(emojiKey);

    if (!reaction) {
        const emoji = new Emoji(client.guilds.get(data.guild_id), data.emoji);
        reaction = new MessageReaction(message, emoji, 1, data.user_id === client.user.id);
    }

    let embedFooterText;
    if (message.embeds[0]) embedFooterText = message.embeds[0].footer.text;

    if (
        (message.author.id === client.user.id) && (message.content !== config.initialMessage || 
        (message.embeds[0] && (embedFooterText !== config.embedFooter)))
    ) {

        if (!config.embed && (message.embeds.length < 1)) {
            const re = `\\*\\*"(.+)?(?="\\*\\*)`;
            const role = message.content.match(re)[1];

            if (member.id !== client.user.id) {
                const guildRole = message.guild.roles.find(r => r.name === role);
                if (event.t === "MESSAGE_REACTION_ADD") member.addRole(guildRole.id);
                else if (event.t === "MESSAGE_REACTION_REMOVE") member.removeRole(guildRole.id);
            }
        } else if (config.embed && (message.embeds.length >= 1)) {
            const fields = message.embeds[0].fields;

            for (const { name, value } of fields) {
                if (member.id !== client.user.id) {
                    const guildRole = message.guild.roles.find(r => r.name === value);
                    if ((name === reaction.emoji.name) || (name === reaction.emoji.toString())) {
                        if (event.t === "MESSAGE_REACTION_ADD") member.addRole(guildRole.id);
                        else if (event.t === "MESSAGE_REACTION_REMOVE") member.removeRole(guildRole.id);
                    }
                }
            }
        }
    }
});

/*Logs*/
client.on('messageDelete', async (message) => {
	if(message.content === "") message.content = "Visualisation Impossible"
	const embed = new Discord.RichEmbed()
		  //.setAuthor('' + client.user.username + '', '' + client.user.displayAvatarURL + '')
		  .setColor(`${config.colorembed}`)
		  .setTitle('Logs Message Supprimer')
		  .addField("Message", `${message.content}`)
		  .addField("Message ID", `${message.id}`)
		  .addField("Auteur", `${message.author}`)
		  .addField("Auteur ID", `${message.author.id}`)
		  .addField("Salon", `${message.channel.name}`)
		  .addField("Salon ID", `${message.channel.id}`)
		  .setTimestamp()
		  .setFooter('Logs Beta Version');
		  const LogsChannel = message.guild.channels.find(channel => channel.name === "📄logs");
        	  const LogsChannelID = message.guild.channels.get(config.logs)
        		if (LogsChannel) {
        			LogsChannel.send(embed)
        		}
        		else if(!LogsChannel) {
        			if (!LogsChannelID) return message.reply("Impossible de trouver le salon Logs !");
        				LogsChannelID.send(embed)
        		}
})

client.on('messageUpdate', async (oldMessage, newMessage) => {
	if (oldMessage.content === newMessage.content){
	return;
	}
	if(newMessage.content === "") newMessage.content = "Visualisation Impossible"
	const embed = new Discord.RichEmbed()
		  .setColor(`${config.colorembed}`)
		  .setTitle('Logs Message Editer')
		  .addField("Nouveau Message", `${newMessage.content}`)
		  .addField("Nouveau Message ID", `${newMessage.id}`)
		  .addField("Ancien Message", `${oldMessage.content}`)
		  .addField("Ancien Message ID", `${oldMessage.id}`)
		  .addField("Auteur", `${newMessage.author}`)
		  .addField("Auteur ID", `${newMessage.author.id}`)
		  .addField("Salon", `${newMessage.channel.name}`)
		  .addField("Salon ID", `${newMessage.channel.id}`)
		  .setTimestamp()
		  .setFooter('Logs Beta Version');
		  const LogsChannel = newMessage.guild.channels.find(channel => channel.name === "📄logs");
        	  const LogsChannelID = newMessage.guild.channels.get(config.logs)
        		if (LogsChannel) {
        			LogsChannel.send(embed)
        		}
        		else if(!LogsChannel) {
        			if (!LogsChannelID) return newMessage.reply("Impossible de trouver le salon Logs !");
        				LogsChannelID.send(embed)
        		}
})

client.on('channelCreate', async (channel, message) => {
    const channelTypes = {
        dm: 'Message privés',
        group: 'Groupe privés',
        text: 'Salon textuel',
        voice: 'Salon vocal',
        category: 'Catégorie',
        unknown: 'Inconnue',
    };
    let logs = await channel.guild.fetchAuditLogs({type: 10});
    let entry = logs.entries.first();
	const embed = new Discord.RichEmbed()
	  .setColor(`${config.colorembed}`)
	  .setTitle('Logs Salon Ajoutés')
	  .addField("Nom du salon", channel.type === 'dm' ? `<@${channel.recipient.username}>` : channel.name)
          .addField("ID", channel.id)
          .addField("Crée le", timeConverter(channel.createdAt))
          .addField("NSFW", channel.nsfw ? 'Oui' : 'Non')
          .addField("Catégories", channel.parent ? channel.parent.name : 'Aucun')
          .addField("Type", channelTypes[channel.type])
          .addField("Auteur", entry.executor)
          .addField("Auteur ID", entry.executor.id)
          //.addField("Raison", entry.reason || "Aucun")
		  .setTimestamp()
		  .setFooter('Logs Beta Version');
		  const LogsChannel = channel.guild.channels.find(channel => channel.name === "📄logs");
        	  const LogsChannelID = channel.guild.channels.get(config.logs)
        		if (LogsChannel) {
        			LogsChannel.send(embed)
        		}
        		else if(!LogsChannel) {
        			if (!LogsChannelID) return message.channel.send("Impossible de trouver le salon Logs !");
        				LogsChannelID.send(embed)
        		}
})

client.on('channelDelete', async (channel, message) => {
    const channelTypes = {
        dm: 'Message privés',
        group: 'Groupe privés',
        text: 'Salon textuel',
        voice: 'Salon vocal',
        category: 'Catégorie',
        unknown: 'Inconnue',
    };
    let logs = await channel.guild.fetchAuditLogs({type: 12});
    let entry = logs.entries.first();
	const embed = new Discord.RichEmbed()
	  .setColor(`${config.colorembed}`)
          .setTitle('Logs Salon Supprimés')
	  .addField("Nom du salon", channel.type === 'dm' ? `<@${channel.recipient.username}>` : channel.name)
          .addField("ID", channel.id)
          .addField("Crée le", timeConverter(channel.createdAt))
          .addField("NSFW", channel.nsfw ? 'Oui' : 'Non')
          .addField("Catégories", channel.parent ? channel.parent.name : 'Aucun')
          .addField("Type", channelTypes[channel.type])
          .addField("Topic", channel.topic || "Aucun")
          .addField("Auteur", entry.executor)
          .addField("Auteur ID", entry.executor.id)
		  .setTimestamp()
		  .setFooter('Logs Beta Version');
		  const LogsChannel = channel.guild.channels.find(channel => channel.name === "📄logs");
        	  const LogsChannelID = channel.guild.channels.get(config.logs)
        		if (LogsChannel) {
        			LogsChannel.send(embed)
        		}
        		else if(!LogsChannel) {
        			if (!LogsChannelID) return message.reply("Impossible de trouver le salon Logs !");
        				LogsChannelID.send(embed)
        		}
})

client.on('guildBanAdd', async (guild, user) => {
    let logs = await guild.fetchAuditLogs({type: 22});
    let entry = logs.entries.first();
	const embed = new Discord.RichEmbed()
	  .setColor(`${config.colorembed}`)
          .setTitle('Logs Membre Bannie')
	  .addField("Membre", user)
          .addField("Membre ID", user.id)
          .addField("Auteur", entry.executor)
          .addField("Auteur ID", entry.executor.id)
          .addField("Raison", entry.reason || "Aucun")
		  .setTimestamp()
		  .setFooter('Logs Beta Version');
		  const LogsChannel = guild.channels.find(channel => channel.name === "📄logs");
        	  const LogsChannelID = guild.channels.get(config.logs)
        		if (LogsChannel) {
        			    setTimeout(function(){
                        LogsChannel.send(embed)
                        }, 1000);
        		}
        		else if(!LogsChannel) {
        			if (!LogsChannelID) return user.reply("Impossible de trouver le salon Logs !");
                        LogsChannelID.send(embed)
                }
})

client.on('guildBanRemove', async (guild, user) => {
    let logs = await guild.fetchAuditLogs({type: 23});
    let entry = logs.entries.first();
	const embed = new Discord.RichEmbed()
	  .setColor(`${config.colorembed}`)
          .setTitle('Logs Membre Débannie')
	  .addField("Membre", user)
          .addField("Membre ID", user.id)
          .addField("Auteur", entry.executor)
          .addField("Auteur ID", entry.executor.id)
          .addField("Raison", entry.reason || "Aucun")
		  .setTimestamp()
		  .setFooter('Logs Beta Version');
		  const LogsChannel = guild.channels.find(channel => channel.name === "📄logs");
        	  const LogsChannelID = guild.channels.get(config.logs)
        		if (LogsChannel) {
                    LogsChannel.send(embed)
        		}
        		else if(!LogsChannel) {
                    if (!LogsChannelID) return user.reply("Impossible de trouver le salon Logs !");
                        LogsChannelID.send(embed)
                }
})

/*Poll*/
let emoji1id = ""
let emoji2id = ""
let emoji1text = ""
let emoji2text = ""
let time = ""
let question = ""
function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}
client.on("message", message => {
    if (message.author.bot) return;
    if (message.content.indexOf(guildConf[message.guild.id].prefix) !== 0) return;
    const args = message.content.slice(guildConf[message.guild.id].prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    if (command === "poll-test-stranger-things") {
        emoji1id = "612854454101999647"
        emoji2id = "612854453237841920"
        emoji1text = ":Onze:"
        emoji2text = ":Mike:"
        time = "1"
        question = "Onze ou Mike ?"
        message.channel.send(`Commande Test !`);
    }
    if (command === "poll-info") {
        emoji1text = args[0];
        emoji1id = args[1];
        emoji2text = args[2];
        emoji2id = args[3];
        time = args[4];
        question = args.slice(5).join(' ');
        if (!emoji1text) return message.reply("Vous devez définir le 1er émoji !")
        if (!emoji1id) return message.reply("Vous devez définir l'ID du 1er émoji !")
        if (!emoji2text) return message.reply("Vous devez définir le 2nd émoji !")
        if (!emoji2id) return message.reply("Vous devez définir l'ID du 2nd émoji !")
        if (!time) return message.reply("Vous devez définir un temps !")
        if (!question) return message.reply("Vous devez spécifier une question !")
        const embedpollinfo = new Discord.RichEmbed()
                    .setColor(`${config.colorembed}`)
                    .setTitle('Sondage Info')
                    .addField(`Emoji 1 Texte`, `${emoji1text}`)
                    .addField(`Emoji 1 ID`, `${emoji1id}`)
                    .addField(`Emoji 2 Texte`, `${emoji2text}`)
                    .addField(`Emoji 2 ID`, `${emoji2id}`)
                    .addField(`Temps`, `${time}`)
                    .addField(`Question`, `${question}`)
                    .setTimestamp()
                    .setFooter('Sondage Beta Version');
                message.channel.send(embedpollinfo)
    }
    if (command === "poll-reset") {
        emoji1text = ""
        emoji1id = ""
        emoji2text = ""
        emoji2id = ""
        time = ""
        question = ""
        message.channel.send("Les info du sondage ont été réinitialiser")
    }
    if (command === "poll-create") {
        if (!emoji1text) return message.reply("Vous devez définir le 1er émoji !")
        if (!emoji1id) return message.reply("Vous devez définir l'ID du 1er émoji !")
        if (!emoji2text) return message.reply("Vous devez définir le 2nd émoji !")
        if (!emoji2id) return message.reply("Vous devez définir l'ID du 2nd émoji !")
        if (!time) return message.reply("Vous devez définir un temps !")
        if (!question) return message.reply("Vous devez spécifier une question !")
        const emojiList = [emoji1id, emoji2id];
        if (!(isNaN(time)) && (time <= 1440)) {
            if (time >= 1) {
                const embedpollcreate = new Discord.RichEmbed()
                    .setColor(`${config.colorembed}`)
                    .setTitle('Sondage')
                    .addField(`${question}`, `Répondez avec ${emoji1text} ou ${emoji2text}`)
                    .addField(`Le sondage se termine dans`, `${time} minutes`)
                    .addField(`Sondage commencé par`, `${message.author}`)
                    .setTimestamp()
                    .setFooter('Sondage Beta Version');
                message.channel.send(embedpollcreate)
                    .then(async function (message) {
                        let reactionArray = [];
                        reactionArray[0] = await message.react(emojiList[0]);
                        reactionArray[1] = await message.react(emojiList[1]);
                        if (time) {
                            message.channel.fetchMessage(message.id)
                                .then(async function (message) {
                                    await sleep(time * 60000)
                                    const embedresult = new Discord.RichEmbed()
                                        .setColor(`${config.colorembed}`)
                                        .setTitle('Sondage')
                                        .addField(`Le vote ${question}`, `est maintenant terminé !`)
                                        .setTimestamp()
                                        .setFooter('Sondage Beta Version');
                                    message.channel.send(embedresult)
                                })
                        }
                    })
            } else {
                message.channel.send(`Impossible de commencer un vote moins d'une minute`);
            }
        } else {
            message.channel.send(`Impossible de commencer un vote plus d'un jour`);
        }
    }
    if (command === "poll-help") {
        const embedpollhelp = new Discord.RichEmbed()
            .setColor(`${config.colorembed}`)
            .setTitle('Aide Sondage')
            .addField(`${guildConf[message.guild.id].prefix}poll-info`, `Commande permettant de spécifier les options du sondage\nExemple: **${guildConf[message.guild.id].prefix}poll-info <votre 1er custom émoji ou émoji> <l'ID du 1er l'émoji> <votre 2nd custom émoji ou émoji> <l'ID du 2nd l'émoji> <Le temps en minutes> <La question>**\nRésultat: **${guildConf[message.guild.id].prefix}poll-info :Onze: 612854454101999647 :Mike: 612854453237841920 20 Onze ou Mike ?**`)
            .addField(`${guildConf[message.guild.id].prefix}poll-create`, `Commande permettant de crée un sondage`)
            .addField(`${guildConf[message.guild.id].prefix}poll-reset`, `Commande permettant de réinitialiser les info du sondage`)
            .setTimestamp()
            .setFooter('Sondage Beta Version');
        message.channel.send(embedpollhelp)
    }
});

/*Système d'xp*/
client.on('message', async message => {
    if (message.author.bot) return;
    const args = message.content.slice(guildConf[message.guild.id].prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    var profile = await dl.Fetch(message.author.id)
    var user = message.mentions.users.first() || message.author
    var output1 = await dl.Fetch(user.id)
    dl.AddXp(message.author.id, 10)
    if (profile.xp + 10 > 100) {
      await dl.AddLevel(message.author.id, 1)
      await dl.SetXp(message.author.id, 0)
      const embednewlvl = new Discord.RichEmbed()
            .setColor(`${config.colorembed}`)
            .setTitle('Xp Nouveau Niveaux !')
	        .setDescription(`${message.author}`)
            .addField(`Niveaux`, `${profile.level + 1}`)
            .setTimestamp()
            .setFooter('Xp Release Version');
        message.channel.send(embednewlvl)
    }

    if (command === 'xp-info') {
      const embedxpinfo = new Discord.RichEmbed()
            .setColor(`${config.colorembed}`)
            .setTitle('Xp Info')
	        .setDescription(`${message.author}`)
            .addField(`Niveaux`, `${output1.level}`)
            .addField(`Xp`, `${output1.xp}`)
            .setTimestamp()
            .setFooter('Xp Release Version');
        message.channel.send(embedxpinfo)
    }
   
    if (command === 'xp-setxp') {
      if (!message.member.hasPermission(["ADMINISTRATOR"])) return message.reply("Désolé, Vous n'avez pas les permissions !");
      var user = message.mentions.users.first() || message.author
      var amount = args[0]
      var output2 = await dl.SetXp(user.id, amount)
      const embedsetxp = new Discord.RichEmbed()
            .setColor(`${config.colorembed}`)
            .setTitle('Xp Reçue')
	        .setDescription(`${message.mentions.users.first()}`)
            .addField(`Xp Définie`, `${amount}`)
            .addField(`Auteur`, `${message.author}`)
            .setTimestamp()
            .setFooter('Xp Release Version');
        message.channel.send(embedsetxp)
    }
   
    if (command === 'xp-setlevel') {
      if (!message.member.hasPermission(["ADMINISTRATOR"])) return message.reply("Désolé, Vous n'avez pas les permissions !");
      var user = message.mentions.users.first() || message.author
      var amount = args[0]
      var output3 = await dl.SetLevel(user.id, amount)
      const embedsetlevel = new Discord.RichEmbed()
            .setColor(`${config.colorembed}`)
            .setTitle('Niveaux Reçue')
	        .setDescription(`${message.mentions.users.first()}`)
            .addField(`Niveaux Définie`, `${amount}`)
            .addField(`Auteur`, `${message.author}`)
            .setTimestamp()
            .setFooter('Xp Release Version');
        message.channel.send(embedsetlevel)
    }
   
    if (command === 'xp-leaderboard') {
      if (message.mentions.users.first()) {
        var output = await dl.Leaderboard({
            search: message.mentions.users.first().id
          })
        const embedxpstats1 = new Discord.RichEmbed()
            .setColor(`${config.colorembed}`)
            .setTitle('Xp Stats')
            .setDescription(`${message.mentions.users.first()}`)
            .addField(`Classement`, `${output.placement}`,)
            .addField(`Niveaux`, `${output1.level}`)
            .addField(`Xp`, `${output1.xp}`)
            .setTimestamp()
            .setFooter('Xp Release Version');
        message.channel.send(embedxpstats1)
      } else {
        dl.Leaderboard({
          limit: 3
        }).then(async users => {
          if (users[0]) var firstplace = await client.fetchUser(users[0].userid)
          if (users[1]) var secondplace = await client.fetchUser(users[1].userid)
          if (users[2]) var thirdplace = await client.fetchUser(users[2].userid)
          const embedxpstats2 = new Discord.RichEmbed()
            .setColor(`${config.colorembed}`)
            .setTitle('Xp Stats')
            .setDescription(`Classement`)
            .addField(`#1 - ${firstplace && firstplace.tag || 'Personne'}`, `Niveaux ${users[0] && users[0].level || 'Aucun'}\nXp ${users[0] && users[0].xp || 'Aucun'}`)
            .addField(`#2 - ${secondplace && secondplace.tag || 'Personne'}`, `Niveaux ${users[1] && users[1].level || 'Aucun'}\nXp ${users[1] && users[1].xp || 'Aucun'}`)
            .addField(`#3 - ${thirdplace && thirdplace.tag || 'Personne'}`, `Niveaux ${users[2] && users[2].level || 'Aucun'}\nXp ${users[2] && users[1].xp || 'Aucun'}`)
            .setTimestamp()
            .setFooter('Xp Release Version');
        message.channel.send(embedxpstats2)
        })
      }
    }
   
    if (command == 'xp-delete') {
        if (!message.member.hasPermission(["ADMINISTRATOR"])) return message.reply("Désolé, Vous n'avez pas les permissions !");
        var user = message.mentions.users.first()
        if (!user) return message.reply(`S'il vous plait mentionné un membre valide qui se trouve dans la base de donnée !`)
        var output = await dl.Delete(user.id)
        if (output.deleted == true) return message.reply('Le membre a bien était éffacé de la base de donnée')
    }

    if (command === "xp-help") {
        const xphelp = new Discord.RichEmbed()
            .setColor(`${config.colorembed}`)
            .setTitle('Aide Xp')
            .addField(`${guildConf[message.guild.id].prefix}xp-info`, `Commande permettant d'afficher le nombre d'xp et de niveau que vous avez`)
            .addField(`${guildConf[message.guild.id].prefix}xp-setxp`, `Commande permettant de définir le nombre d'xp d'un membre`)
            .addField(`${guildConf[message.guild.id].prefix}xp-setlevel`, `Commande permettant de définir le nombre de niveaux d'un membre`)
            .addField(`${guildConf[message.guild.id].prefix}xp-leaderboard`, `Commande permettant d'afficher le classement d'un/des membre(s)\nDeux façons de l'utiliser: ${guildConf[message.guild.id].prefix}xp-leaderboard ou\n${guildConf[message.guild.id].prefix}xp-leaderboard <nom de la personne>`)
            .addField(`${guildConf[message.guild.id].prefix}xp-delete`, `Commande permettant de supprimer un membre de la base de donnée`)
            .setTimestamp()
            .setFooter('Xp Release Version');
        message.channel.send(xphelp)
    }
})

/*Setup Serveur*/
client.on("message", async message => {
    if (message.author.bot) return;
    if (message.content.indexOf(guildConf[message.guild.id].prefix) !== 0) return;
    const args = message.content.slice(guildConf[message.guild.id].prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    if (command === "setup-server") {
        if (!message.member.hasPermission(["ADMINISTRATOR"]))
            return message.reply("Désolé, Vous n'avez pas les permissions !");
        
        message.reply("êtes vous sur de faire ça ?\nécrivez yes pour effectuez l'action, écrivez no pour annuler");
        const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 10000 });
        collector.on('collect', message => {
        if (message.content === "yes" && message.member.hasPermission(["ADMINISTRATOR"])) {
        let AdminRole = message.guild.roles.find(r => r.name === "Administrateur");
        let ModoRole = message.guild.roles.find(r => r.name === "Modérateur");
        let StaffRole = message.guild.roles.find(r => r.name === "Staff");
        let NotifRole = message.guild.roles.find(r => r.name === "Notifications");
        let BotRole = message.guild.roles.find(r => r.name === "Bot");
        let GeneraleCategory = message.guild.channels.find(c => c.name === "👥Général");
        let AccueilChannelr = message.guild.channels.find(c => c.name === "🎉accueil");
        let AnnoncesChannel = message.guild.channels.find(c => c.name === "📢annonces");
        let ProjetPubChannel = message.guild.channels.find(c => c.name === "✅projet-pub");
        let RolesChannel = message.guild.channels.find(c => c.name === "🔗rôles");
        let ReglesChannel = message.guild.channels.find(c => c.name === "⛔règles");
        let LogsChannelr = message.guild.channels.find(c => c.name === "📄logs");
        let BotCommandeChannel = message.guild.channels.find(c => c.name === "🤖bot-commande");
        let SalonTextuelCategory = message.guild.channels.find(c => c.name === "💬Salons textuels");
        let ChatTextuelChannel1 = message.guild.channels.find(c => c.name === "💬chat-textuel-n°1");
        let ChatTextuelChannel2 = message.guild.channels.find(c => c.name === "💬chat-textuel-n°2");
        let SalonVocauxCategory = message.guild.channels.find(c => c.name === "🔊Salons vocaux");
        let ChatVocalChannel1 = message.guild.channels.find(c => c.name === "🔊Chat Vocal #1");
        let ChatVocalChannel2 = message.guild.channels.find(c => c.name === "🔊Chat Vocal #2");
        let SalonStaffCategory = message.guild.channels.find(c => c.name === "🔧Salon Staff");
        let ChatTextuelChannel = message.guild.channels.find(c => c.name === "💬chat-textuel-staff");
        let BotCommandeStaffChannel = message.guild.channels.find(c => c.name === "🤖bot-commande-staff");
        let ChatVocalChannel = message.guild.channels.find(c => c.name === "🔊Chat Vocal Staff");
        let AFKCategory = message.guild.channels.find(c => c.name === "💤AFK");
        let AFKChannel = message.guild.channels.find(c => c.name === "💤AFK💤");

        if (!AdminRole) {
            try {
                AdminRole = message.guild.createRole({
                    name: "Administrateur",
                    color: "#FF0000",
                    managed: true,
                    mentionable: true,
                    hoist: true,
                    permissions: ["CREATE_INSTANT_INVITE","KICK_MEMBERS","BAN_MEMBERS","ADD_REACTIONS","VIEW_AUDIT_LOG",
                    "VIEW_CHANNEL","SEND_MESSAGES","SEND_TTS_MESSAGES","MANAGE_MESSAGES","EMBED_LINKS","ATTACH_FILES","READ_MESSAGE_HISTORY",
                    "MENTION_EVERYONE","USE_EXTERNAL_EMOJIS","CONNECT","SPEAK","MUTE_MEMBERS","DEAFEN_MEMBERS","MOVE_MEMBERS","USE_VAD",
                    "PRIORITY_SPEAKER","CHANGE_NICKNAME","MANAGE_NICKNAMES","MANAGE_WEBHOOKS","MANAGE_EMOJIS"]
                })
            } catch (e) {
                console.log(e.stack);
            }
        }

            if (!ModoRole) {
                try {
                    ModoRole = message.guild.createRole({
                        name: "Modérateur",
                        color: "#FF8C00",
                        managed: true,
                        mentionable: true,
                        hoist: true,
                        permissions: ["CREATE_INSTANT_INVITE","KICK_MEMBERS","BAN_MEMBERS","ADD_REACTIONS","VIEW_CHANNEL","SEND_MESSAGES"
                        ,"SEND_TTS_MESSAGES","MANAGE_MESSAGES","EMBED_LINKS","ATTACH_FILES","READ_MESSAGE_HISTORY","MENTION_EVERYONE"
                        ,"USE_EXTERNAL_EMOJIS","CONNECT","SPEAK","MUTE_MEMBERS","MOVE_MEMBERS","USE_VAD","PRIORITY_SPEAKER"
                        ,"CHANGE_NICKNAME","MANAGE_NICKNAMES"]
                    })
                } catch (e) {
                    console.log(e.stack);
                }
            }

                if (!StaffRole) {
                    try {
                        StaffRole = message.guild.createRole({
                            name: "Staff",
                            color: "#00FF00",
                            managed: true,
                            mentionable: true,
                            hoist: true,
                            permissions: ["KICK_MEMBERS","ADD_REACTIONS","VIEW_CHANNEL","SEND_MESSAGES","SEND_TTS_MESSAGES","EMBED_LINKS"
                            ,"ATTACH_FILES","READ_MESSAGE_HISTORY","USE_EXTERNAL_EMOJIS","CONNECT","SPEAK","MUTE_MEMBERS","USE_VAD"
                            ,"CHANGE_NICKNAME"]
                        })
                    } catch (e) {
                        console.log(e.stack);
                    }
                }

                    if (!NotifRole) {
                        try {
                            NotifRole = message.guild.createRole({
                                name: "Notifications",
                                color: "#1E90FF",
                                managed: true,
                                mentionable: true,
                                hoist: false,
                                permissions: ["ADD_REACTIONS","VIEW_CHANNEL","SEND_MESSAGES","EMBED_LINKS","READ_MESSAGE_HISTORY","CONNECT"
                                ,"SPEAK","USE_VAD"]
                            })
                        } catch (e) {
                            console.log(e.stack);
                        }
                    }

                        if (!BotRole) {
                            try {
                                BotRole = message.guild.createRole({
                                    name: "Bot",
                                    color: "#FFD700",
                                    managed: true,
                                    mentionable: true,
                                    hoist: true,
                                    permissions: ["ADMINISTRATOR","CREATE_INSTANT_INVITE","MANAGE_ROLES","MANAGE_CHANNELS","MANAGE_GUILD","KICK_MEMBERS","BAN_MEMBERS","ADD_REACTIONS","VIEW_AUDIT_LOG",
                                    "VIEW_CHANNEL","SEND_MESSAGES","SEND_TTS_MESSAGES","MANAGE_MESSAGES","EMBED_LINKS","ATTACH_FILES","READ_MESSAGE_HISTORY",
                                    "MENTION_EVERYONE","USE_EXTERNAL_EMOJIS","CONNECT","SPEAK","MUTE_MEMBERS","DEAFEN_MEMBERS","MOVE_MEMBERS","USE_VAD",
                                    "PRIORITY_SPEAKER","CHANGE_NICKNAME","MANAGE_NICKNAMES","MANAGE_WEBHOOKS","MANAGE_EMOJIS"]
                                })
                            } catch (e) {
                                console.log(e.stack);
                            }
                        }
                        setTimeout(function () {
			            const embedregles = new Discord.RichEmbed()
                        .setColor(`${config.colorembed}`)
                        .setTitle('Règles:')
                        .addField(`I – Comportement`, `1: Restez courtois, poli.
                        Vous pouvez être familier, nous ne vous demandons pas d’écrire comme Molière, mais aussi pas comme dans la cité (Seven Binks).
                        2: Pas de violence verbale gratuite.
                        Vous pouvez taquiner gentiment sans aller dans l’extrême.
                        Si cela reste dans la bonne humeur et le second degré nous le tolérons.
                        Si le staff estime que cela ne respecte plus la règle, vous risquez un kick ou un ban en fonction de l’humeur de la personne qui s'occupe de votre cas.`)
                        .addField(`II – Chat écrit/vocal`, `3: Pas de spam, sous peine de bannissement.
                        4: Pas de pub sur les différents chats (sauf celui #✔projet-pub), sous peine d’avertissement puis ban si l’avertissement n’est pas pris en compte.
                        4b: Seule les pub qui seront certifié par le Staff seront accepter, pour les certifiés veuillez nous contactez.`)
                        .addField(`III – Profil/Pseudo`, `5: Ne doit pas être ressemblant/confondu avec celui d’un membre du staff, sous peine d’avertissement puis ban si l’avertissement n’est pas pris en compte.
                        6: Ne doit pas contenir de propos racistes, homophobes, sexistes …
                        Sous peine d’avertissement puis ban si l’avertissement n’est pas pris en compte.
                        7: Ne doit pas avoir de caractère pornographique, sous peine d’avertissement puis ban si l’avertissement n’est pas pris en compte.`)
                        .addField(`IV - Contacter le staff`, `8: Si pour une quelconque raison, vous voulez contacter un membre du staff, mentionner @Staff, @Modérateur Ou @Administrateur.
                        9: Si vous voulez entrer dans l’équipe de modération, contactez les @Modérateur.
                        Afin de devenir membre du staff vous passerez un entretien afin de voir vos motivations et vos idées pour améliorer le serveur.
                        Ne stressez pas non plus, si vous êtes légitime ça se passera bien :).
                        Vous vous présenterez (Nom, Prénom, Âge etc ...)
                        Puis la décision du Staff vous sera donnée ultérieurement par message privé.`)
                        .setTimestamp()
                        .setFooter('Ces règles peuvent être soumises à des évolutions au cours du temps !');
                        config.roles = ["Notifications"],
                        config.reactions = ["🔔"]
                        const roleEmbed = new RichEmbed()
                        .setDescription(config.embedMessage)
                        .setFooter(config.embedFooter);
                        if (config.embedColor) roleEmbed.setColor(config.embedColor);

                        if (config.embedThumbnail && (config.embedThumbnailLink !== ''))
                            roleEmbed.setThumbnail(config.embedThumbnailLink);
                        else if (config.embedThumbnail && message.guild.icon)
                            roleEmbed.setThumbnail(message.guild.iconURL);
                        const fields = generateEmbedFields();
                            if (fields.length > 25) throw "Le nombre maximum de rôles pouvant être définis pour un embed est de 25!";

                        for (const { emoji, role }
                            of fields) {
                            if (!message.guild.roles.find(r => r.name === role))
                                throw `Le rôle '${role}' n'existe pas !`;
                        const customEmote = client.emojis.find(e => e.name === emoji);

                        if (!customEmote) roleEmbed.addField(emoji, role, true);
                            else roleEmbed.addField(customEmote, role, true);
                        }
                        if (!GeneraleCategory) {
                        message.guild.createChannel("👥Général","category").then(channel => {
                            channel.setPosition("0")
                            channel.overwritePermissions(message.guild.roles.find(r => r.name === '@everyone'), {
                                SEND_MESSAGES: false});
                            channel.overwritePermissions(message.guild.roles.find(r => r.name === 'Administrateur'), {
                                SEND_MESSAGES: true});
                            channel.overwritePermissions(message.guild.roles.find(r => r.name === 'Modérateur'), {
                                SEND_MESSAGES: true});
                            channel.overwritePermissions(message.guild.roles.find(r => r.name === 'Staff'), {
                                SEND_MESSAGES: true});
                            channel.overwritePermissions(message.guild.roles.find(r => r.name === 'Notifications'), {
                                SEND_MESSAGES: false})
                            channel.overwritePermissions(message.guild.roles.find(r => r.name === 'Bot'), {
                                SEND_MESSAGES: true});
                            })
                        }
                        if (!AccueilChannelr) {
                        message.guild.createChannel("🎉accueil","text").then(channel => {
                            let category = message.guild.channels.find(c => c.name == "👥Général" && c.type == "category");
                            channel.setParent(category.id);
                            channel.overwritePermissions(message.guild.roles.find(r => r.name === '@everyone'), {
                                SEND_MESSAGES: false});
                            channel.overwritePermissions(message.guild.roles.find(r => r.name === 'Administrateur'), {
                                SEND_MESSAGES: true});
                            channel.overwritePermissions(message.guild.roles.find(r => r.name === 'Modérateur'), {
                                SEND_MESSAGES: true});
                            channel.overwritePermissions(message.guild.roles.find(r => r.name === 'Staff'), {
                                SEND_MESSAGES: true});
                            channel.overwritePermissions(message.guild.roles.find(r => r.name === 'Notifications'), {
                                SEND_MESSAGES: false})
                            channel.overwritePermissions(message.guild.roles.find(r => r.name === 'Bot'), {
                                SEND_MESSAGES: true});
                            })
                        }
                        if (!AnnoncesChannel) {
                        message.guild.createChannel("📢annonces","text").then(channel => {
                            let category = message.guild.channels.find(c => c.name == "👥Général" && c.type == "category");
                            channel.setParent(category.id);
                            channel.overwritePermissions(message.guild.roles.find(r => r.name === '@everyone'), {
                                SEND_MESSAGES: false});
                            channel.overwritePermissions(message.guild.roles.find(r => r.name === 'Administrateur'), {
                                SEND_MESSAGES: true});
                            channel.overwritePermissions(message.guild.roles.find(r => r.name === 'Modérateur'), {
                                SEND_MESSAGES: true});
                            channel.overwritePermissions(message.guild.roles.find(r => r.name === 'Staff'), {
                                SEND_MESSAGES: true});
                            channel.overwritePermissions(message.guild.roles.find(r => r.name === 'Notifications'), {
                                SEND_MESSAGES: false})
                            channel.overwritePermissions(message.guild.roles.find(r => r.name === 'Bot'), {
                                SEND_MESSAGES: true});
                            })
                        }
                        if (!ProjetPubChannel) {
                        message.guild.createChannel("✅projet-pub","text").then(channel => {
                            let category = message.guild.channels.find(c => c.name == "👥Général" && c.type == "category");
                            channel.setParent(category.id);
                            })
                        }
                        if (!RolesChannel) {
                        message.guild.createChannel("🔗rôles","text").then(channel => {
                            let category = message.guild.channels.find(c => c.name == "👥Général" && c.type == "category");
                            channel.setParent(category.id);
                            channel.send(roleEmbed).then(async m => {
                                for (const r of config.reactions) {
                                    const emoji = r;
                                    const customCheck = client.emojis.find(e => e.name === emoji);
                
                                    if (!customCheck) await m.react(emoji);
                                    else await m.react(customCheck.id);
                                }
                            });
                            channel.overwritePermissions(message.guild.roles.find(r => r.name === '@everyone'), {
                                SEND_MESSAGES: false});
                            channel.overwritePermissions(message.guild.roles.find(r => r.name === 'Administrateur'), {
                                SEND_MESSAGES: true});
                            channel.overwritePermissions(message.guild.roles.find(r => r.name === 'Modérateur'), {
                                SEND_MESSAGES: true});
                            channel.overwritePermissions(message.guild.roles.find(r => r.name === 'Staff'), {
                                SEND_MESSAGES: true});
                            channel.overwritePermissions(message.guild.roles.find(r => r.name === 'Notifications'), {
                                SEND_MESSAGES: false})
                            channel.overwritePermissions(message.guild.roles.find(r => r.name === 'Bot'), {
                                SEND_MESSAGES: true});
                            })
                        }
                        if (!ReglesChannel) {
                        message.guild.createChannel("⛔règles","text").then(channel => {
                            let category = message.guild.channels.find(c => c.name == "👥Général" && c.type == "category");
                            channel.setParent(category.id);
                            channel.send(embedregles)
                            .then(async function (message) {
                                message.react("✅");
                            })
                            channel.overwritePermissions(message.guild.roles.find(r => r.name === '@everyone'), {
                                SEND_MESSAGES: false});
                            channel.overwritePermissions(message.guild.roles.find(r => r.name === 'Administrateur'), {
                                SEND_MESSAGES: true});
                            channel.overwritePermissions(message.guild.roles.find(r => r.name === 'Modérateur'), {
                                SEND_MESSAGES: true});
                            channel.overwritePermissions(message.guild.roles.find(r => r.name === 'Staff'), {
                                SEND_MESSAGES: true});
                            channel.overwritePermissions(message.guild.roles.find(r => r.name === 'Notifications'), {
                                SEND_MESSAGES: false})
                            channel.overwritePermissions(message.guild.roles.find(r => r.name === 'Bot'), {
                                SEND_MESSAGES: true});
                            })
                        }
                        if (!LogsChannelr) {
                        message.guild.createChannel("📄logs","text").then(channel => {
                            let category = message.guild.channels.find(c => c.name == "👥Général" && c.type == "category");
                            channel.setParent(category.id);
                            channel.overwritePermissions(message.guild.roles.find(r => r.name === '@everyone'), {
                                SEND_MESSAGES: false, VIEW_CHANNEL: false});
                            channel.overwritePermissions(message.guild.roles.find(r => r.name === 'Administrateur'), {
                                SEND_MESSAGES: true, VIEW_CHANNEL: true});
                            channel.overwritePermissions(message.guild.roles.find(r => r.name === 'Modérateur'), {
                                SEND_MESSAGES: false, VIEW_CHANNEL: false});
                            channel.overwritePermissions(message.guild.roles.find(r => r.name === 'Staff'), {
                                SEND_MESSAGES: false, VIEW_CHANNEL: false});
                            channel.overwritePermissions(message.guild.roles.find(r => r.name === 'Notifications'), {
                                SEND_MESSAGES: false, VIEW_CHANNEL: false});
                            channel.overwritePermissions(message.guild.roles.find(r => r.name === 'Bot'), {
                                SEND_MESSAGES: true, VIEW_CHANNEL: true});
                            })
                        }
                        if (!BotCommandeChannel) {
                        message.guild.createChannel("🤖bot-commande","text").then(channel => {
                            let category = message.guild.channels.find(c => c.name == "👥Général" && c.type == "category");
                            channel.setParent(category.id);
                            })
                        }
                        if (!SalonTextuelCategory) {
                        message.guild.createChannel("💬Salons textuels","category").then(channel => {
                            })
                        }
                        if (!ChatTextuelChannel1) {
                        message.guild.createChannel("💬chat-textuel-n°1","text").then(channel => {
                            let category = message.guild.channels.find(c => c.name == "💬Salons textuels" && c.type == "category");
                            channel.setParent(category.id);
                            })
                        }
                        if (!ChatTextuelChannel2) {
                        message.guild.createChannel("💬chat-textuel-n°2","text").then(channel => {
                            let category = message.guild.channels.find(c => c.name == "💬Salons textuels" && c.type == "category");
                            channel.setParent(category.id);
                            })
                        }
                        if (!SalonVocauxCategory) {
                        message.guild.createChannel("🔊Salons vocaux","category").then(channel => {
                            })
                        }
                        if (!ChatVocalChannel1) {
                        message.guild.createChannel("🔊Chat Vocal #1","voice").then(channel => {
                            let category = message.guild.channels.find(c => c.name == "🔊Salons vocaux" && c.type == "category");
                            channel.setParent(category.id);
                            })
                        }
                        if (!ChatVocalChannel2) {
                        message.guild.createChannel("🔊Chat Vocal #2","voice").then(channel => {
                            let category = message.guild.channels.find(c => c.name == "🔊Salons vocaux" && c.type == "category");
                            channel.setParent(category.id);
                            })
                        }
                        if (!SalonStaffCategory) {
                        message.guild.createChannel("🔧Salon Staff","category").then(channel => {
                            channel.overwritePermissions(message.guild.roles.find(r => r.name === '@everyone'), {
                                CONNECT: false, SEND_MESSAGES: false, VIEW_CHANNEL: false});
                            channel.overwritePermissions(message.guild.roles.find(r => r.name === 'Administrateur'), {
                                CONNECT: true, SEND_MESSAGES: true, VIEW_CHANNEL: true});
                            channel.overwritePermissions(message.guild.roles.find(r => r.name === 'Modérateur'), {
                                CONNECT: true, SEND_MESSAGES: true, VIEW_CHANNEL: true});
                            channel.overwritePermissions(message.guild.roles.find(r => r.name === 'Staff'), {
                                CONNECT: true, SEND_MESSAGES: true, VIEW_CHANNEL: true});
                            channel.overwritePermissions(message.guild.roles.find(r => r.name === 'Notifications'), {
                                CONNECT: false, SEND_MESSAGES: false, VIEW_CHANNEL: false});
                            channel.overwritePermissions(message.guild.roles.find(r => r.name === 'Bot'), {
                                CONNECT: true, SEND_MESSAGES: true, VIEW_CHANNEL: true});
                            })
                        }
                        if (!ChatTextuelChannel) {
                        message.guild.createChannel("💬chat-textuel-staff","text").then(channel => {
                            let category = message.guild.channels.find(c => c.name == "🔧Salon Staff" && c.type == "category");
                            channel.setParent(category.id);
                            channel.overwritePermissions(message.guild.roles.find(r => r.name === '@everyone'), {
                                SEND_MESSAGES: false, VIEW_CHANNEL: false});
                            channel.overwritePermissions(message.guild.roles.find(r => r.name === 'Administrateur'), {
                                SEND_MESSAGES: true, VIEW_CHANNEL: true});
                            channel.overwritePermissions(message.guild.roles.find(r => r.name === 'Modérateur'), {
                                SEND_MESSAGES: true, VIEW_CHANNEL: true});
                            channel.overwritePermissions(message.guild.roles.find(r => r.name === 'Staff'), {
                                SEND_MESSAGES: true, VIEW_CHANNEL: true});
                            channel.overwritePermissions(message.guild.roles.find(r => r.name === 'Notifications'), {
                                SEND_MESSAGES: false, VIEW_CHANNEL: false});
                            channel.overwritePermissions(message.guild.roles.find(r => r.name === 'Bot'), {
                                SEND_MESSAGES: true, VIEW_CHANNEL: true});
                            })
                        }
                        if (!BotCommandeStaffChannel) {
                        message.guild.createChannel("🤖bot-commande-staff","text").then(channel => {
                            let category = message.guild.channels.find(c => c.name == "🔧Salon Staff" && c.type == "category");
                            channel.setParent(category.id);
                            channel.overwritePermissions(message.guild.roles.find(r => r.name === '@everyone'), {
                                SEND_MESSAGES: false, VIEW_CHANNEL: false});
                            channel.overwritePermissions(message.guild.roles.find(r => r.name === 'Administrateur'), {
                                SEND_MESSAGES: true, VIEW_CHANNEL: true});
                            channel.overwritePermissions(message.guild.roles.find(r => r.name === 'Modérateur'), {
                                SEND_MESSAGES: true, VIEW_CHANNEL: true});
                            channel.overwritePermissions(message.guild.roles.find(r => r.name === 'Staff'), {
                                SEND_MESSAGES: true, VIEW_CHANNEL: true});
                            channel.overwritePermissions(message.guild.roles.find(r => r.name === 'Notifications'), {
                                SEND_MESSAGES: false, VIEW_CHANNEL: false});
                            channel.overwritePermissions(message.guild.roles.find(r => r.name === 'Bot'), {
                                SEND_MESSAGES: true, VIEW_CHANNEL: true});
                            })
                        }
                        if (!ChatVocalChannel) {
                        message.guild.createChannel("🔊Chat Vocal Staff","voice").then(channel => {
                            let category = message.guild.channels.find(c => c.name == "🔧Salon Staff" && c.type == "category");
                            channel.setParent(category.id);
                            channel.overwritePermissions(message.guild.roles.find(r => r.name === '@everyone'), {
                                CONNECT: false, VIEW_CHANNEL: false});
                            channel.overwritePermissions(message.guild.roles.find(r => r.name === 'Administrateur'), {
                                CONNECT: true, VIEW_CHANNEL: true});
                            channel.overwritePermissions(message.guild.roles.find(r => r.name === 'Modérateur'), {
                                CONNECT: true, VIEW_CHANNEL: true});
                            channel.overwritePermissions(message.guild.roles.find(r => r.name === 'Staff'), {
                                CONNECT: true, VIEW_CHANNEL: true});
                            channel.overwritePermissions(message.guild.roles.find(r => r.name === 'Notifications'), {
                                CONNECT: false, VIEW_CHANNEL: false});
                            channel.overwritePermissions(message.guild.roles.find(r => r.name === 'Bot'), {
                                CONNECT: true, VIEW_CHANNEL: true});
                            })
                        }
                        if (!AFKCategory) {
                        message.guild.createChannel("💤AFK","category").then(channel => {
                            channel.overwritePermissions(message.guild.roles.find(r => r.name === '@everyone'), {
                                SPEAK: false});
                            channel.overwritePermissions(message.guild.roles.find(r => r.name === 'Administrateur'), {
                                SPEAK: false});
                            channel.overwritePermissions(message.guild.roles.find(r => r.name === 'Modérateur'), {
                                SPEAK: false});
                            channel.overwritePermissions(message.guild.roles.find(r => r.name === 'Staff'), {
                                SPEAK: false});
                            channel.overwritePermissions(message.guild.roles.find(r => r.name === 'Notifications'), {
                                SPEAK: false});
                            channel.overwritePermissions(message.guild.roles.find(r => r.name === 'Bot'), {
                                SPEAK: false});
                            })
                        }
                        if (!AFKChannel) {
                        message.guild.createChannel("💤AFK💤","voice").then(channel => {
                            let category = message.guild.channels.find(c => c.name == "💤AFK" && c.type == "category");
                            channel.setParent(category.id);
                            channel.overwritePermissions(message.guild.roles.find(r => r.name === '@everyone'), {
                                SPEAK: false});
                            channel.overwritePermissions(message.guild.roles.find(r => r.name === 'Administrateur'), {
                                SPEAK: false});
                            channel.overwritePermissions(message.guild.roles.find(r => r.name === 'Modérateur'), {
                                SPEAK: false});
                            channel.overwritePermissions(message.guild.roles.find(r => r.name === 'Staff'), {
                                SPEAK: false});
                            channel.overwritePermissions(message.guild.roles.find(r => r.name === 'Notifications'), {
                                SPEAK: false});
                            channel.overwritePermissions(message.guild.roles.find(r => r.name === 'Bot'), {
                                SPEAK: false});
                            })
                        }
                    }, 3000);
                }
                if (message.content === "no" && message.member.hasPermission(["ADMINISTRATOR"])) return message.reply("L'action Setup Server a été annulé !");
            })
}});

/*Embed Creator*/
let embed_color = "";
let embed_title = ""
let embed_title_url = ""
let embed_author = ""
let embed_author_picture = ""
let embed_author_url = ""
let embed_description = ""
let embed_thumbnail = ""
let embed_picture = ""
let embed_time = ""
let embed_footer = ""
let embed_footer_picture = ""
client.on("message", message => {
    if(message.author.bot) return;
    if(message.content.indexOf(guildConf[message.guild.id].prefix) !== 0) return;
    const args = message.content.slice(guildConf[message.guild.id].prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    if(command === "embed-color") {
        if (!message.member.hasPermission('MANAGE_MESSAGES'))
      return message.reply("Désolé, Vous n'avez pas les permissions !");
      embed_color = args.join(` `);
      message.channel.send(`La couleur de l'embed est ${embed_color}`)
    }
    if(command === "embed-title") {
        if (!message.member.hasPermission('MANAGE_MESSAGES'))
      return message.reply("Désolé, Vous n'avez pas les permissions !");
      embed_title = args.join(` `);
      message.channel.send(`Le titre de l'embed est ${embed_title}`)
    }
    if(command === "embed-title-url") {
        if (!message.member.hasPermission('MANAGE_MESSAGES'))
      return message.reply("Désolé, Vous n'avez pas les permissions !");
      embed_title_url = args.join(` `);
      message.channel.send(`L'url de l'embed est ${embed_title_url}`)
    }
    if(command === "embed-author") {
        if (!message.member.hasPermission('MANAGE_MESSAGES'))
      return message.reply("Désolé, Vous n'avez pas les permissions !");
      embed_author = args.slice(2).join(' ');
      embed_author_picture = args[1];
      embed_author_url = args[0];
      message.channel.send(`L'auteur de l'embed est ${embed_author}\nL'image pour l'auteur de l'embed est ${embed_author_picture}\nl'url pour l'auteur de l'embed est ${embed_author_url}`)
    }
    if(command === "embed-description") {
        if (!message.member.hasPermission('MANAGE_MESSAGES'))
      return message.reply("Désolé, Vous n'avez pas les permissions !");
      embed_description = args.join(` `);
      message.channel.send(`La description de l'embed est ${embed_description}`)
    }
    if(command === "embed-thumbnail") {
        if (!message.member.hasPermission('MANAGE_MESSAGES'))
      return message.reply("Désolé, Vous n'avez pas les permissions !");
      embed_thumbnail = args.join(` `);
      message.channel.send(`La vignette de l'embed est ${embed_thumbnail}`)
    }
    if(command === "embed-picture") {
        if (!message.member.hasPermission('MANAGE_MESSAGES'))
      return message.reply("Désolé, Vous n'avez pas les permissions !");
      embed_picture = args.join(` `);
      message.channel.send(`L'image de l'embed est ${embed_picture}`)
    }
    if(command === "embed-time") {
        if (!message.member.hasPermission('MANAGE_MESSAGES'))
      return message.reply("Désolé, Vous n'avez pas les permissions !");
      embed_time = args.join(` `);
      message.channel.send(`Le temps est sur ${embed_time}`)
    }
    if(command === "embed-footer") {
        if (!message.member.hasPermission('MANAGE_MESSAGES'))
      return message.reply("Désolé, Vous n'avez pas les permissions !");
      embed_footer = args.slice(1).join(' ');
      embed_footer_picture = args[0];
      message.channel.send(`Le footer de l'embed est ${embed_footer}\nL'url pour le footer de l'embed est ${embed_footer_picture}`)
    }
    if(command === "embed-test") {
      embed_color = config.colorembed;
      embed_title = "C'est un titre";
      embed_title_url = "https://discord.js.org/";
      embed_author = "C'est l'auteur";
      embed_author_picture = "https://i.imgur.com/imGGvmq.jpg";
      embed_author_url = "https://discord.js.org/";
      embed_description = "C'est un description";
      embed_thumbnail = "https://i.imgur.com/imGGvmq.jpg";
      embed_picture = "https://i.imgur.com/imGGvmq.jpg";
      embed_time = "true";
      embed_footer = "C'est un footer !";
      embed_footer_picture = "https://i.imgur.com/imGGvmq.jpg";
      message.channel.send(`Commande Test !`);
    }
    if(command === "embed-create") {
      if (!message.member.hasPermission('MANAGE_MESSAGES'))
    return message.reply("Désolé, Vous n'avez pas les permissions !");
      if(!embed_color) embed_color = config.colorembed;
      if(!embed_time) embed_time = "false";
      if(!embed_title) embed_title = "";
      if(!embed_title_url) embed_title_url = "";
      if(!embed_author) embed_author = `${message.author.username}`;
      if(!embed_author_picture) embed_author_picture = `${message.author.displayAvatarURL}`;
      if(!embed_author_url) embed_author_url = "";
      if(!embed_description) embed_description = "";
      if(!embed_thumbnail) embed_thumbnail = "";
      if(!embed_picture) embed_picture = "";
      if(!embed_footer_picture) embed_footer_picture = `${client.user.displayAvatarURL}`;
    const embed_create = new Discord.RichEmbed()
            .setColor(`${embed_color}`)
	        .setTitle(`${embed_title}`)
	        .setURL(`${embed_title_url}`)
	        .setAuthor(`${embed_author}`, `${embed_author_picture}`, `${embed_author_url}`)
	        .setDescription(`${embed_description}`)
	        .setThumbnail(`${embed_thumbnail}`)
            .setImage(`${embed_picture}`)
            if(embed_time === "true") embed_create.setTimestamp()
            if(!embed_footer) embed_create.setFooter(`Embed Creator Beta Version`, `${embed_footer_picture}`);
            if(embed_footer) embed_create.setFooter(`${embed_footer} - Embed Creator Beta Version`, `${embed_footer_picture}`);
            else if(embed_footer === "false") embed_create.setFooter(`Embed Creator Beta Version`, `${embed_footer_picture}`);
    message.channel.send(embed_create)
  }
  if (command === "embed-help") {
    const embedpollhelp = new Discord.RichEmbed()
        .setColor(`${config.colorembed}`)
        .setTitle('Aide Embed Creator')
        .addField(`${guildConf[message.guild.id].prefix}embed-color`, `Commande permettant de définir la couleur de l'embed`)
        .addField(`${guildConf[message.guild.id].prefix}embed-title`, `Commande permettant de définir le titre de l'embed`)
        .addField(`${guildConf[message.guild.id].prefix}embed-title-url`, `Commande permettant de définir l'url du titre de l'embed`)
        .addField(`${guildConf[message.guild.id].prefix}embed-author`, `Commande permettant de définir l'auteur de l'embed\nExemple: ${guildConf[message.guild.id].prefix}embed-author <url> <image> <nom>`)
        .addField(`${guildConf[message.guild.id].prefix}embed-description`, `Commande permettant de définir la description de l'embed`)
        .addField(`${guildConf[message.guild.id].prefix}embed-thumbnail`, `Commande permettant de définir la vignette de l'embed`)
        .addField(`${guildConf[message.guild.id].prefix}embed-picture`, `Commande permettant de définir l'image de l'embed`)
        .addField(`${guildConf[message.guild.id].prefix}embed-time`, `Commande permettant d'afficher le temps de l'embed\nExemple: ${guildConf[message.guild.id].prefix}embed-time <true ou false>\ntrue = oui false = non`)
        .addField(`${guildConf[message.guild.id].prefix}embed-footer`, `Commande permettant de définir le footer de l'embed\nExemple: ${guildConf[message.guild.id].prefix}embed-footer <image> <texte>`)
        .addField(`${guildConf[message.guild.id].prefix}embed-create`, `Commande permettant de générer l'embed`)
        .setTimestamp()
        .setFooter('Embed Creator Beta Version');
    message.channel.send(embedpollhelp)
}
});

/*Custom Prefix*/
client.on("message", message => {
    if (message.author.bot) return;
    if (message.content.indexOf(guildConf[message.guild.id].prefix) !== 0) return;
    if (!message.member.hasPermission('CREATE_INSTANT_INVITE'))
	  return message.reply("Désolé, Vous n'avez pas les permissions !");
    const args = message.content.slice(guildConf[message.guild.id].prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    if (command === "new-prefix") {
        let newPrefix = message.content.split(" ").slice(1, 2)[0];
        guildConf[message.guild.id].prefix = newPrefix;
	    if (!guildConf[message.guild.id].prefix) {
		    guildConf[message.guild.id].prefix = guildConf[message.guild.id].prefix;
	    }
        message.reply(`Le prefix est maintenant: ${newPrefix}`)
        fs.writeFile('./config.json', JSON.stringify(guildConf, null, 2), (err) => {
            if (err) console.log(err)
       })
    }
});

/*Economy Bot*/
client.on('message', async message => {
    if (message.author.bot) return;
    if (message.content.indexOf(guildConf[message.guild.id].prefix) !== 0) return;
    if (!message.member.hasPermission('CREATE_INSTANT_INVITE'))
	  return message.reply("Désolé, Vous n'avez pas les permissions !");
    const args = message.content.slice(guildConf[message.guild.id].prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    if (command === "add-money") {
        if (!message.member.hasPermission('ADMINISTRATOR')) {
            return message.reply('You do not have enough permission to use this command.')
        }
    
        if (!args[0]) return message.reply(`S'il vous plaît, veuillez spécifier une valeur.`)
        if (isNaN(args[0])) return message.reply(`Ce n'est pas un nombre valide !`)
    
        let user = message.mentions.users.first() || message.author
        message.channel.send('Ajouté avec succès, ' + args[0] + ' à ' + user)
        db.add(`money_${message.guild.id}_${message.author.id}`, args[0])
    }
    if (command === "remove-money") {
        if (!message.member.hasPermission('ADMINISTRATOR')) {
            return message.reply('You do not have enough permission to use this command.')
        }
    
        if (!args[0]) return message.reply(`S'il vous plaît, veuillez spécifier une valeur.`)
        if (isNaN(args[0])) return message.reply(`Ce n'est pas un nombre valide !`)
    
        let user = message.mentions.users.first() || message.author
        message.channel.send('Supprimés avec succès, ' + args[0] + ' à ' + user)
        db.subtract(`money_${user.id}`, args[0])
    }
    if (command === "daily") {
        let timeout = 86400000
    let amount = 500
    let daily = await db.fetch(`daily_${message.author.id}`);

    if (daily !== null && timeout - (Date.now() - daily) > 0) {
        let time = ms(timeout - (Date.now() - daily));
            return message.reply(`Vous avez déjà récupéré votre récompense hebdomadaire, vous pouvez revenir la récupérer à **${time.hours}:${time.minutes}:${time.seconds}**!`)
        } else {
        let user = message.mentions.users.first() || message.author
        message.channel.send('Récompense Quotidienne Ajoutés avec succès, ' + amount + ' à ' + user)
        db.add(`money_${message.author.id}`, amount)
        db.set(`daily_${message.author.id}`, Date.now())
        }
    }
    if (command === "monthly") {
        let timeout = 2592000000
        let amount = 5000
        let monthly = await db.fetch(`monthly_${message.author.id}`);

        if (monthly !== null && timeout - (Date.now() - monthly) > 0) {
            let time = ms(timeout - (Date.now() - monthly));
            return message.reply(`Vous avez déjà récupéré votre récompense mensuelle, vous pouvez revenir la récupérer dans **${time.days} jours à ${time.hours}:${time.minutes}:${time.seconds}**!`)
        } else {
        let user = message.mentions.users.first() || message.author
        message.channel.send('Récompense Mensuelle Ajoutés avec succès, ' + amount + ' à ' + user)
        db.add(`money_${message.author.id}`, amount)
        db.set(`monthly_${message.author.id}`, Date.now())
        }
    }
    if (command === "weekly") {
        let timeout = 604800000
        let amount = 1000
        let weekly = await db.fetch(`weekly_${message.author.id}`);
    
        if (weekly !== null && timeout - (Date.now() - weekly) > 0) {
            let time = ms(timeout - (Date.now() - weekly));
        return message.reply(`Vous avez déjà récupéré votre récompense hebdomadaire, vous pouvez revenir la récupérer dans **${time.days} jours à ${time.hours}:${time.minutes}:${time.seconds}**!`)
    } else {
        let user = message.mentions.users.first() || message.author
        message.channel.send('Récompense Hebdomadaire Ajoutés avec succès, ' + amount + ' à ' + user)
        db.add(`money_${message.author.id}`, amount)
        db.set(`weekly_${message.author.id}`, Date.now())
        }
    }
    if (command === "money-help") {
        const embedpollhelp = new Discord.RichEmbed()
        .setColor(`${config.colorembed}`)
        .setTitle('Aide Argents')
        .addField(`${guildConf[message.guild.id].prefix}add-money`, `Commande permettant d'ajouté de l'argent sur le solde`)
        .addField(`${guildConf[message.guild.id].prefix}remove-money`, `Commande permettant de supprimé de l'argent sur le solde`)
        .addField(`${guildConf[message.guild.id].prefix}daily`, `Commande permettant de recevoir une récompense quotidienne`)
        .addField(`${guildConf[message.guild.id].prefix}monthly`, `Commande permettant de recevoir une récompense mensuelle`)
        .addField(`${guildConf[message.guild.id].prefix}weekly`, `Commande permettant de recevoir une récompense hebdomadaire`)
        .setTimestamp()
        .setFooter('Embed Solde Release Version');
    message.channel.send(embedpollhelp)
    }
})
