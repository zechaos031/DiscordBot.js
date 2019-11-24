/*Ne touchez c'est valeurs que si vous êtes sur de ce que vous faites !*/
const { Client, RichEmbed, Emoji, MessageReaction } = require('discord.js');
const CONFIG = require('./config');
const Discord = require('discord.js');
const client = new Client({ disableEveryone: true });
const dl = require('discord-leveling');
var Long = require("long");
var dernierAppel = new Array();
client.music = require("./music");
client.music.start(client, {
	youtubeKey: CONFIG.youtubeapikey,
	botPrefix: CONFIG.prefix + CONFIG.prefixMusic,
  
	play: {
	  usage: "{{CONFIG.prefix + CONFIG.prefixMusic}}play some tunes",
	  exclude: false  
	},
  
	anyoneCanSkip: true,
  
	ownerOverMember: true,
	ownerID: CONFIG.ownerID,
  
	cooldown: {
	  enabled: false
	}
  });
client.login(CONFIG.botToken);
client.on('ready', () => {
		client.user.setActivity(`Mon prefix est ${CONFIG.prefix}`, {type: "WATCHING"});
		client.user.setStatus("online");
    console.log("Connecté en tant que " + client.user.tag)
    console.log("Serveurs:")
    client.guilds.forEach((guild) => {
        console.log(" - " + guild.name)
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

if (CONFIG.botToken === '')
    throw new Error("La propriété 'botToken' n'est pas définie dans le fichier config.js. Fais-le s'il te plaît !");

client.on('error', console.error);

/*Welcome Messages*/
client.on("guildMemberAdd", member =>{
	let embed = new Discord.RichEmbed()
  	  .setColor(`${CONFIG.colorembed}`)
	  .setThumbnail('' + member.user.displayAvatarURL + '')
	  .addField('Bienvenue **' + member.user.username + '**', 'Dans ' + member.guild.name + '')
	  .addField('On est maintenant ' + member.guild.memberCount + ' membres !', 'Amusez vous bien :wink:', true)
	  const channel = getDefaultChannel(member.guild);
	  channel.send(embed);
	  console.log(`${member.user.username}`, "est arrivés dans " + `${member.guild.name}`)
});

/*Leave Messages*/
client.on("guildMemberRemove", member =>{
  let embed = new Discord.RichEmbed()
	  .setColor(`${CONFIG.colorembed}`)
  	  .setThumbnail('' + member.user.displayAvatarURL + '')
	  .addField(':cry: **' + member.user.username + '** a quitté ' + member.guild.name + '', 'On est maintenant ' + member.guild.memberCount + ' membres !')
	  const channel = getDefaultChannel(member.guild);
	  channel.send(embed);
	  console.log(`${member.user.username}` + " a quitté " + `${member.guild.name}`)
	  dl.Delete(member.user.id)
});

/*Server Info*/
client.on("message", message => {
    if (message.author.bot) return;
    if (message.content.indexOf(CONFIG.prefix) !== 0) return;
    const args = message.content.slice(CONFIG.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    if (command === "server-info") {
        let online = message.guild.members.filter(member => member.user.presence.status !== 'offline');
        const embed = new Discord.RichEmbed()
            .setColor(`${CONFIG.colorembed}`)
            .setThumbnail('' + message.guild.iconURL + '')
            .setTitle('Serveur Info')
            .addField("Nom du serveur", `${message.guild.name}`, true)
            .addField("ID du serveur", `${message.guild.id}`, true)
            .addField("Propriétaire", `${message.guild.owner}`, true)
            .addField("Région", `${message.guild.region}`, true)
            .addField("Salons", `${message.guild.channels.size}`, true)
            .addField("Rôles", `${message.guild.roles.size}`, true)
            .addField("Total de membres", `${message.guild.memberCount - message.guild.members.filter(m => m.user.bot).size}`, true)
            .addField("Bots", `${message.guild.members.filter(m => m.user.bot).size}`, true)
            .addField("En ligne", `${online.size}`, true)
            .addField(`Crée le`, `${message.guild.createdAt.toDateString()}`, true)
            .addField(`Vous avez rejoind le`, `${message.member.joinedAt.toDateString()}`, true)
            .setTimestamp()
            .setFooter('Server info Release Version');
        message.channel.send(embed);
    }
});

/*User Info*/
client.on("message", message => {
    if (message.author.bot) return;
    if (message.content.indexOf(CONFIG.prefix) !== 0) return;
    const args = message.content.slice(CONFIG.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    let user = message.author;
    const member = message.mentions.members.first() || message.guild.members.get(args[0]) || message.member;
    if (command === "user-info") {
        const embed = new Discord.RichEmbed()
            .setColor(`${CONFIG.colorembed}`)
            .setThumbnail('' + member.user.displayAvatarURL + '')
            .setTitle('Utlisateur Info')
            .addField("Pseudo", `${member}`, true)
            .addField("ID", `${member.id}`, true)
            .addField("Crée le", `${member.user.createdAt.toDateString()}`, true)
            .addField("Rejoind le", `${member.joinedAt.toDateString()}`, true)
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
    if (message.content.indexOf(CONFIG.prefix) !== 0) return;
    const args = message.content.slice(CONFIG.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    if (command === "bot-info") {
        const embed = new Discord.RichEmbed()
            .setColor(`${CONFIG.colorembed}`)
            .setThumbnail('' + client.user.displayAvatarURL + '')
            .setTitle('Bot Info', true)
            .addField("Nom du bot", `${client.user}`, true)
            .addField("ID du bot", `${client.user.id}`, true)
            .addField("Crée le", `${client.user.createdAt.toDateString()}`, true)
            .addField("Sur", `${client.guilds.size} Serveurs`, true)
            .addField("Developpeur", `Alex Animate Mp4#2361`, true)
            .addField("Site web", `https://discordbotjs.github.io/DiscordBot.js-Website.io/`, true)
            .addField("Serveur Support", `https://discordapp.com/invite/UqUsr5x`, true)
            .addField("Dépôts Github", `https://github.com/DiscordBotJs/DiscordBot.Js`, true)
            .addField(`Vidéo Présentation`, `https://youtu.be/cIFhTOgT4Oc`, true)
            .setTimestamp()
            .setFooter('Bot info Release Version');
        message.channel.send(embed);
    }
});

/*Channel Info*/
client.on("message", message => {
    if (message.author.bot) return;
    if (message.content.indexOf(CONFIG.prefix) !== 0) return;
    const args = message.content.slice(CONFIG.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const channel = message.mentions.channels.first() || message.channel;
    const channelTypes = {
        dm: 'Message privés',
        group: 'Groupe privés',
        text: 'Salon textuel',
        voice: 'Salon vocal',
        category: 'Catégorie',
        unknown: 'Inconnue',
    };
    if (command === "channel-info") {
        const embed = new Discord.RichEmbed()
            .setColor(`${CONFIG.colorembed}`)
            .setTitle('Channel Info', true)
            .addField("Nom du salon", channel.type === 'dm' ? `<@${channel.recipient.username}>` : channel.name, true)
            .addField("Id", channel.id, true)
            .addField("Crée le", channel.createdAt.toDateString(), true)
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
    if (message.content.indexOf(CONFIG.prefix) !== 0) return;
    const args = message.content.slice(CONFIG.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const role = message.mentions.roles.first() || message.guild.roles.get(args[0]);
    if (command === "role-info") {
        if (!role) {
            return message.reply('Veuillez rentrez un role !');
        }
        const embed = new Discord.RichEmbed()
            .setColor(`${CONFIG.colorembed}`)
            .setTitle('Channel Info', true)
            .addField("Nom du rôle", role.name, true)
            .addField("Id", role.id, true)
            .addField("Crée le", role.createdAt.toDateString(), true)
            .addField("Epinglés", role.hoist ? 'Oui' : 'Non', true)
            .addField("Mentionable", role.mentionable ? 'Oui' : 'Non', true)
            .addField("Couleur", role.color, true)
            .setTimestamp()
            .setFooter('Role info Release Version');
        message.channel.send(embed);
    }
});

/*Server List*/
client.on("message", message => {
    if (message.author.bot) return;
    if (message.content.indexOf(CONFIG.prefix) !== 0) return;
    const args = message.content.slice(CONFIG.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    if (command === "server-list") {
        message.channel.send(client.guilds.map(r => r.name + ` | **${r.memberCount}** membres`));
    }
});

/*Kick*/
client.on("message", async message => {
	if(message.author.bot) return;
	if(message.content.indexOf(CONFIG.prefix) !== 0) return;
	const args = message.content.slice(CONFIG.prefix.length).trim().split(/ +/g);
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
		  .setColor(`${CONFIG.colorembed}`)
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
	if(message.content.indexOf(CONFIG.prefix) !== 0) return;
	const args = message.content.slice(CONFIG.prefix.length).trim().split(/ +/g);
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
		  .setColor(`${CONFIG.colorembed}`)
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
	if(message.content.indexOf(CONFIG.prefix) !== 0) return;
	const args = message.content.slice(CONFIG.prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();
	if(command === "report") {
	if (!message.member.hasPermission('KICK_MEMBERS'))
	return message.reply("Désolé, Vous n'avez pas les permissions !");

	let target = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]))
	let reason = args.slice(1).join(' ');

	if(!target) return message.reply("S'il vous plait mentionné un membre valide !");
	if(!reason) reason = "Aucune Raison";

	const embed_report = new Discord.RichEmbed()
		  .setColor(`${CONFIG.colorembed}`)
		  .setTitle('Logs Report')
		  .addField("Membre", `${target.user}`)
		  .addField("Membre ID", `${target.user.id}`)
		  .addField("Auteur", `${message.author}`)
		  .addField("Auteur ID", `${message.author.id}`)
		  .addField("Raison", `${reason}`)
		.setTimestamp()
		.setFooter('Report Release Version');

	const embed_report_message = new Discord.RichEmbed()
		  .setColor(`${CONFIG.colorembed}`)
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
            const LogsChannelID = message.guild.channels.get(CONFIG.logs)
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
	if(message.content.indexOf(CONFIG.prefix) !== 0) return;
	const args = message.content.slice(CONFIG.prefix.length).trim().split(/ +/g);
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
		  .setColor(`${CONFIG.colorembed}`)
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
		  .setColor(`${CONFIG.colorembed}`)
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
            			const LogsChannelID = message.guild.channels.get(CONFIG.logs)
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
	if(message.content.indexOf(CONFIG.prefix) !== 0) return;
	const args = message.content.slice(CONFIG.prefix.length).trim().split(/ +/g);
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
		  .setColor(`${CONFIG.colorembed}`)
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
		  .setColor(`${CONFIG.colorembed}`)
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
            			const LogsChannelID = message.guild.channels.get(CONFIG.logs)
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

/*Clear*/
client.on("message", async message => {
	if(message.author.bot) return;
	if(message.content.indexOf(CONFIG.prefix) !== 0) return;
	const args = message.content.slice(CONFIG.prefix.length).trim().split(/ +/g);
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

/*Discord Invite*/
client.on("message", message => {
	  if(message.author.bot) return;
	  if(message.content.indexOf(CONFIG.prefix) !== 0) return;
	  const args = message.content.slice(CONFIG.prefix.length).trim().split(/ +/g);
      const command = args.shift().toLowerCase();
	  if(command === "discord-invite") {
		if (!message.member.hasPermission('CREATE_INSTANT_INVITE'))
    return message.reply("Désolé, Vous n'avez pas les permissions !");
    if(message.guild.id === "611526755374727178")
            message.channel.send(`Lien d'invitation du serveur: https://discord.gg/xuVc8qD`);
    else if(message.guild.id === "606383442124603393")
            message.channel.send(`Lien d'invitation du serveur: https://discord.gg/nS4F33`);
    else
            message.reply(`Le serveur n'est pas définie dans la base de donnée !`)
	}
});

/*Ping*/
client.on("message", message => {
	if(message.author.bot) return;
	if(message.content.indexOf(CONFIG.prefix) !== 0) return;
	const args = message.content.slice(CONFIG.prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();
	if(command === "ping") {
	  const embed = new Discord.RichEmbed()
	  .setColor(`${CONFIG.colorembed}`)
	  .setTitle(`Ping Info`)
	  .setDescription(`Temp de latence avec le serveur ${message.createdTimestamp - Date.now()} ms\nTemp de latence avec l'API de Discord ${Math.round(client.ping)} ms`)
	  message.channel.send(embed);
  }
});

/*Say*/
client.on("message", message => {
	if(message.author.bot) return;
	if(message.content.indexOf(CONFIG.prefix) !== 0) return;
	const args = message.content.slice(CONFIG.prefix.length).trim().split(/ +/g);
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
  if(message.content.indexOf(CONFIG.prefix) !== 0) return;
  const args = message.content.slice(CONFIG.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if(command === "say-markdown") {
	  if (!message.member.hasPermission('MANAGE_MESSAGES'))
	  return message.reply("Désolé, Vous n'avez pas les permissions !");
	  const embed = new Discord.RichEmbed()
		.setColor(`${CONFIG.colorembed}`)
		.setTitle(`Markdown Help`)
		.addField(`${CONFIG.prefix}say-italic`, `*Italic*`)
		.addField(`${CONFIG.prefix}say-bold`, `**Gras**`)
		.addField(`${CONFIG.prefix}say-underline`, `__Souligné__`)
		.addField(`${CONFIG.prefix}say-strikethrough`, `~~Barré~~`)
		.addField(`${CONFIG.prefix}say-quotes`, `>>> Citations`)
		.addField(`${CONFIG.prefix}say-spoiler`, `||Spoiler||`)
		.addField(`${CONFIG.prefix}say-code`, `Visualisation Impossible`)
		.addField(`${CONFIG.prefix}say-code-block`, `Visualisation Impossible`)
		.addField(`${CONFIG.prefix}say-code-color`, `Pour effectuer cette commande, vous devez sauter une ligne après la langue définie !\nExemple: ${CONFIG.prefix}say-code-color Js ou autre langage\nVotre code en Js ou autre langage`)
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
    if (message.content.indexOf(CONFIG.prefix) !== 0) return;
    const args = message.content.slice(CONFIG.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    if (command === "logs-channel") {
        if (!message.member.hasPermission('VIEW_AUDIT_LOG')) return message.reply("Désolé, Vous n'avez pas les permissions !");
        const LogsChannelID = args.join(` `);
        CONFIG.logs = LogsChannelID;
        if (!CONFIG.logs) return message.reply("Impossible de trouver le canal Logs !");
        message.channel.send(`Les logs sont maintenant activés !`);
    }
});

/*Help*/
client.on("message", message => {
	if(message.author.bot) return;
	if(message.content.indexOf(CONFIG.prefix) !== 0) return;
	const args = message.content.slice(CONFIG.prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();
	if(command === "help") {
	  const embed = new Discord.RichEmbed()
	        .setColor(`${CONFIG.colorembed}`)
	        .setTitle(`Aide Commande`)
            .addField(`${CONFIG.prefix}server-info`, `Affiche les informations du serveur`)
            .addField(`${CONFIG.prefix}user-info`, `Afiiche vos informations non personnel`)
            .addField(`${CONFIG.prefix}bot-info`, `Affiche les informations du bot`)
            .addField(`${CONFIG.prefix}channel-info`, `Affiche les informations d'un salon`)
            .addField(`${CONFIG.prefix}role-info`, `Affiche les informations d'un rôle`)
	    .addField(`${CONFIG.prefix}server-list`, `Affiche les serveurs où le bot est connecté`)
            .addField(`${CONFIG.prefix}kick`, `Commande permettant de kicker un membre`)
            .addField(`${CONFIG.prefix}ban`, `Commande permettant de bannir un memre`)
            .addField(`${CONFIG.prefix}report`, `Commande permettant de reporter un membre`)
            .addField(`${CONFIG.prefix}mute`, `Commande permettant de mettre en soudrine un membre`)
            .addField(`${CONFIG.prefix}unmute`, `Commande permettant d'enlever sourdine d'un membre`)
            .addField(`${CONFIG.prefix}clear`, `Commande permettant de supprimer des messsages`)
            .addField(`${CONFIG.prefix}discord-invite`, `Commande permettant de générer un lien d'invitation du serveur`)
            .addField(`${CONFIG.prefix}ping`, `Commande permettant d'afficher le ping`)
            .addField(`${CONFIG.prefix}say`, `Commande permettant de faire parler le bot`)
            .addField(`${CONFIG.prefix}say-markdown`, `Commande permettant de faire parler le bot avec les markdown de discord`)
	    .addField(`${CONFIG.prefix}logs-channel`, `Commande permettant de configurer le salon Logs\n(Veuillez renseignez l'ID du channel !)`)
	    .addField(`${CONFIG.prefix}setup-server`, `Commande permettant de configurer un serveur`)
	    .addField(`${CONFIG.prefix}embed-help`, `Aide pour crée un embed`)
            .addField(`${CONFIG.prefix}poll-help`, `Aide pour crée un sondage`)
	    .addField(`${CONFIG.prefix}xp-help`, `Aide pour le système d'xp`)
            .addField(`${CONFIG.prefix}help-reaction-role`, `Aide pour la configuration de Reaction Role`)
            .addField(`${CONFIG.prefix + CONFIG.prefixMusic}help`, `Affiche les commandes de musique`)
	  message.channel.send(embed);
	  }
});

/*Reaction Role*/
if (CONFIG.roles.length !== CONFIG.reactions.length)
    throw "La liste des rôles et la liste des réactions ne sont pas éxacte ! Veuillez vérifier ceci dans le fichier config.js";
        function generateMessages() {
            return CONFIG.roles.map((r, e) => {
                return {
                    role: r,
                    message: `Réagissez ci-dessous pour obtenir le rôle **"${r}"** !`,
                    emoji: CONFIG.reactions[e]
                };
            });
}

function generateEmbedFields() {
    return CONFIG.roles.map((r, e) => {
        return {
            emoji: CONFIG.reactions[e],
            role: r
        };
    });
}

client.on("message", message => {
    if (message.content === `${CONFIG.prefix}reaction-role-create`) {
        if (!message.member.hasPermission('MANAGE_ROLES'))
	return message.reply("Désolé, Vous n'avez pas les permissions !");

    if (message.author.bot) return;

    if (!message.guild) return;

    if (message.guild && !message.channel.permissionsFor(message.guild.me).missing('SEND_MESSAGES')) return;

    if ((message.author.id !== CONFIG.ownerID) && (message.content.toLowerCase() !== `${CONFIG.prefix}reaction-role-create`)) return;

    if (CONFIG.deleteSetupCMD) {
        const missing = message.channel.permissionsFor(message.guild.me).missing('MANAGE_MESSAGES');

        if (missing.includes('MANAGE_MESSAGES'))
            throw new Error("J'ai besoin de la permission pour supprimer votre commande ! Attribuez-moi l'autorisation 'Gérer les messages' sur ce salon !");
        message.delete().catch(O_o=>{});
    }

    const missing = message.channel.permissionsFor(message.guild.me).missing('MANAGE_MESSAGES');

    if (missing.includes('ADD_REACTIONS'))
        throw new Error("J'ai besoin de la permission pour ajouter des réactions aux messages ! Veuillez attribuer l'autorisation 'Ajouter des réactions' à ce salon !");

    if (!CONFIG.embed) {
        if (!CONFIG.initialMessage || (CONFIG.initialMessage === '')) 
            throw "La propriété 'initialMessage' n'est pas définie dans le fichier config.js. Fais-le s'il te plaît !";

        message.channel.send(CONFIG.initialMessage);

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
        if (!CONFIG.embedMessage || (CONFIG.embedMessage === ''))
            throw "La propriété 'embedMessage' n'est pas définie dans le fichier config.js. Fais-le s'il te plaît !";
        if (!CONFIG.embedFooter || (CONFIG.embedMessage === ''))
            throw "La propriété 'embedFooter' n'est pas définie dans le fichier config.js. Fais-le s'il te plaît !";

        const roleEmbed = new RichEmbed()
            .setDescription(CONFIG.embedMessage)
            .setFooter(CONFIG.embedFooter);

        if (CONFIG.embedColor) roleEmbed.setColor(CONFIG.embedColor);

        if (CONFIG.embedThumbnail && (CONFIG.embedThumbnailLink !== '')) 
            roleEmbed.setThumbnail(CONFIG.embedThumbnailLink);
        else if (CONFIG.embedThumbnail && message.guild.icon)
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
            for (const r of CONFIG.reactions) {
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
        (message.author.id === client.user.id) && (message.content !== CONFIG.initialMessage || 
        (message.embeds[0] && (embedFooterText !== CONFIG.embedFooter)))
    ) {

        if (!CONFIG.embed && (message.embeds.length < 1)) {
            const re = `\\*\\*"(.+)?(?="\\*\\*)`;
            const role = message.content.match(re)[1];

            if (member.id !== client.user.id) {
                const guildRole = message.guild.roles.find(r => r.name === role);
                if (event.t === "MESSAGE_REACTION_ADD") member.addRole(guildRole.id);
                else if (event.t === "MESSAGE_REACTION_REMOVE") member.removeRole(guildRole.id);
            }
        } else if (CONFIG.embed && (message.embeds.length >= 1)) {
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
		  .setColor(`${CONFIG.colorembed}`)
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
        	  const LogsChannelID = message.guild.channels.get(CONFIG.logs)
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
		  .setColor(`${CONFIG.colorembed}`)
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
        	  const LogsChannelID = newMessage.guild.channels.get(CONFIG.logs)
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
	const embed = new Discord.RichEmbed()
		  .setColor(`${CONFIG.colorembed}`)
		  .setTitle('Logs Salon Ajoutés')
		  .addField("Nom du salon", channel.type === 'dm' ? `<@${channel.recipient.username}>` : channel.name)
          .addField("ID", channel.id)
          .addField("Crée le", channel.createdAt.toString())
          .addField("NSFW", channel.nsfw ? 'Oui' : 'Non')
          .addField("Catégories", channel.parent ? channel.parent.name : 'Aucun')
          .addField("Type", channelTypes[channel.type])
		  .setTimestamp()
		  .setFooter('Logs Beta Version');
		  const LogsChannel = channel.guild.channels.find(channel => channel.name === "📄logs");
        	  const LogsChannelID = channel.guild.channels.get(CONFIG.logs)
        		if (LogsChannel) {
        			LogsChannel.send(embed)
        		}
        		else if(!LogsChannel) {
        			if (!LogsChannelID) return message.reply("Impossible de trouver le salon Logs !");
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
	const embed = new Discord.RichEmbed()
		  .setColor(`${CONFIG.colorembed}`)
		  .setTitle('Logs Salon Supprimés')
		  .addField("Nom du salon", channel.type === 'dm' ? `<@${channel.recipient.username}>` : channel.name)
          .addField("ID", channel.id)
          .addField("Crée le", channel.createdAt.toString())
          .addField("NSFW", channel.nsfw ? 'Oui' : 'Non')
          .addField("Catégories", channel.parent ? channel.parent.name : 'Aucun')
          .addField("Type", channelTypes[channel.type])
		  .setTimestamp()
		  .setFooter('Logs Beta Version');
		  const LogsChannel = channel.guild.channels.find(channel => channel.name === "📄logs");
        	  const LogsChannelID = channel.guild.channels.get(CONFIG.logs)
        		if (LogsChannel) {
        			LogsChannel.send(embed)
        		}
        		else if(!LogsChannel) {
        			if (!LogsChannelID) return message.reply("Impossible de trouver le salon Logs !");
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
    if (message.content.indexOf(CONFIG.prefix) !== 0) return;
    const args = message.content.slice(CONFIG.prefix.length).trim().split(/ +/g);
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
                    .setColor(`${CONFIG.colorembed}`)
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
                    .setColor(`${CONFIG.colorembed}`)
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
                                        .setColor(`${CONFIG.colorembed}`)
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
            .setColor(`${CONFIG.colorembed}`)
            .setTitle('Aide Sondage')
            .addField(`${CONFIG.prefix}poll-info`, `Commande permettant de spécifier les options du sondage\nExemple: **${CONFIG.prefix}poll-info <votre 1er custom émoji ou émoji> <l'ID du 1er l'émoji> <votre 2nd custom émoji ou émoji> <l'ID du 2nd l'émoji> <Le temps en minutes> <La question>**\nRésultat: **${CONFIG.prefix}poll-info :Onze: 612854454101999647 :Mike: 612854453237841920 20 Onze ou Mike ?**`)
            .addField(`${CONFIG.prefix}poll-create`, `Commande permettant de crée un sondage`)
            .addField(`${CONFIG.prefix}poll-reset`, `Commande permettant de réinitialiser les info du sondage`)
            .setTimestamp()
            .setFooter('Sondage Beta Version');
        message.channel.send(embedpollhelp)
    }
});

/*Système d'xp*/
client.on('message', async message => {
    if (message.author.bot) return;
    const args = message.content.slice(CONFIG.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    var profile = await dl.Fetch(message.author.id)
    var user = message.mentions.users.first() || message.author
    var output1 = await dl.Fetch(user.id)
    dl.AddXp(message.author.id, 10)
    if (profile.xp + 10 > 100) {
      await dl.AddLevel(message.author.id, 1)
      await dl.SetXp(message.author.id, 0)
      const embednewlvl = new Discord.RichEmbed()
            .setColor(`${CONFIG.colorembed}`)
            .setTitle('Xp Nouveau Niveaux !')
	        .setDescription(`${message.author}`)
            .addField(`Niveaux`, `${profile.level + 1}`)
            .setTimestamp()
            .setFooter('Xp Release Version');
        message.channel.send(embednewlvl)
    }

    if (command === 'xp-info') {
      const embedxpinfo = new Discord.RichEmbed()
            .setColor(`${CONFIG.colorembed}`)
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
            .setColor(`${CONFIG.colorembed}`)
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
            .setColor(`${CONFIG.colorembed}`)
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
            .setColor(`${CONFIG.colorembed}`)
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
            .setColor(`${CONFIG.colorembed}`)
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
            .setColor(`${CONFIG.colorembed}`)
            .setTitle('Aide Xp')
            .addField(`${CONFIG.prefix}xp-info`, `Commande permettant d'afficher le nombre d'xp et de niveau que vous avez`)
            .addField(`${CONFIG.prefix}xp-setxp`, `Commande permettant de définir le nombre d'xp d'un membre`)
            .addField(`${CONFIG.prefix}xp-setlevel`, `Commande permettant de définir le nombre de niveaux d'un membre`)
            .addField(`${CONFIG.prefix}xp-leaderboard`, `Commande permettant d'afficher le classement d'un/des membre(s)\nDeux façons de l'utiliser: ${CONFIG.prefix}xp-leaderboard ou\n${CONFIG.prefix}xp-leaderboard <nom de la personne>`)
            .addField(`${CONFIG.prefix}xp-delete`, `Commande permettant de supprimer un membre de la base de donnée`)
            .setTimestamp()
            .setFooter('Xp Release Version');
        message.channel.send(xphelp)
    }
})

/*Setup Serveur*/
client.on("message", async message => {
    if (message.author.bot) return;
    if (message.content.indexOf(CONFIG.prefix) !== 0) return;
    const args = message.content.slice(CONFIG.prefix.length).trim().split(/ +/g);
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
                        .setColor(`${CONFIG.colorembed}`)
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
                        CONFIG.roles = ["Notifications"],
                        CONFIG.reactions = ["🔔"]
                        const roleEmbed = new RichEmbed()
                        .setDescription(CONFIG.embedMessage)
                        .setFooter(CONFIG.embedFooter);
                        if (CONFIG.embedColor) roleEmbed.setColor(CONFIG.embedColor);

                        if (CONFIG.embedThumbnail && (CONFIG.embedThumbnailLink !== ''))
                            roleEmbed.setThumbnail(CONFIG.embedThumbnailLink);
                        else if (CONFIG.embedThumbnail && message.guild.icon)
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
                                for (const r of CONFIG.reactions) {
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
    if(message.content.indexOf(CONFIG.prefix) !== 0) return;
    const args = message.content.slice(CONFIG.prefix.length).trim().split(/ +/g);
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
      embed_color = CONFIG.colorembed;
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
      if(!embed_color) embed_color = CONFIG.colorembed;
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
        .setColor(`${CONFIG.colorembed}`)
        .setTitle('Aide Embed Creator')
        .addField(`${CONFIG.prefix}embed-color`, `Commande permettant de définir la couleur de l'embed`)
        .addField(`${CONFIG.prefix}embed-title`, `Commande permettant de définir le titre de l'embed`)
        .addField(`${CONFIG.prefix}embed-title-url`, `Commande permettant de définir l'url du titre de l'embed`)
        .addField(`${CONFIG.prefix}embed-author`, `Commande permettant de définir l'auteur de l'embed\nExemple: ${CONFIG.prefix}embed-author <url> <image> <nom>`)
        .addField(`${CONFIG.prefix}embed-description`, `Commande permettant de définir la description de l'embed`)
        .addField(`${CONFIG.prefix}embed-thumbnail`, `Commande permettant de définir la vignette de l'embed`)
        .addField(`${CONFIG.prefix}embed-picture`, `Commande permettant de définir l'image de l'embed`)
        .addField(`${CONFIG.prefix}embed-time`, `Commande permettant d'afficher le temps de l'embed\nExemple: ${CONFIG.prefix}embed-time <true ou false>\ntrue = oui false = non`)
        .addField(`${CONFIG.prefix}embed-footer`, `Commande permettant de définir le footer de l'embed\nExemple: ${CONFIG.prefix}embed-footer <image> <texte>`)
        .addField(`${CONFIG.prefix}embed-create`, `Commande permettant de générer l'embed`)
        .setTimestamp()
        .setFooter('Embed Creator Beta Version');
    message.channel.send(embedpollhelp)
}
});

