module.exports = function (bot, options) {
	const { Client } = require('discord.js');
	const Discord = require('discord.js');
	const client = new Client({ disableEveryone: true });
	const config = require("./config.js");
	const guildConf = require('./config.json');
	const logs_name = "📄logs";
	const wait = require('util').promisify(setTimeout);

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

	//MESSAGE DELETE
	bot.on('messageDelete', message => {
		if(guildConf[message.guild.id].logs === "0") {
			console.log("Les logs sont désactivés !")
			return;
		} else if(guildConf[message.guild.id].logs === "1") {
		if(message.author.bot === true) return;
		if(message.content === "") message.content = "Visualisation Impossible"
		const embed = new Discord.RichEmbed()
		  .setColor(`${config.colorembed}`)
		  .setTitle('Logs Message Supprimer')
		  .addField("Message", `${message.content.replace(/`/g,"'")}`)
		  .addField("Message ID", `${message.id}`)
		  .addField("Auteur", `<@${message.member.user.id}>`)
		  .addField("Auteur ID", `${message.member.user.id}`)
		  .addField("Salon", `<#${message.channel.id}>`)
		  .addField("Salon ID", `${message.channel.id}`)
		  .setTimestamp()
		  .setFooter('Logs Beta Version');
		send(bot, message.member.guild, options, embed, "messageDelete")
		}
	});

	//MESSAGE UPDATE
	bot.on('messageUpdate', (oldMessage,newMessage) => {
		if(guildConf[newMessage.guild.id].logs === "0") {
			console.log("Les logs sont désactivés !")
			return;
		} else if(guildConf[newMessage.guild.id].logs === "1") {
		if (oldMessage.author.bot === true) return;
		if (oldMessage.content === newMessage.content) return;
		const embed = new Discord.RichEmbed()
		  .setColor(`${config.colorembed}`)
		  .setTitle('Logs Message Editer')
		  .addField("Nouveau Message", `${newMessage.content.replace(/`/g,"'")}`)
		  .addField("Nouveau Message ID", `${newMessage.id}`)
		  .addField("Ancien Message", `${oldMessage.content.replace(/`/g,"'")}`)
		  .addField("Ancien Message ID", `${oldMessage.id}`)
		  .addField("Auteur", `<@${newMessage.member.user.id}>`)
		  .addField("Auteur ID", `${newMessage.member.user.id}`)
		  .addField("Salon", `<#${newMessage.channel.id}>`)
		  .addField("Salon ID", `${newMessage.channel.id}`)
		  .setTimestamp()
		  .setFooter('Logs Beta Version');
		send(bot, newMessage.member.guild, options, embed, "messageUpdate")
		}
	});

	//CHANNEL CREATE
	bot.on('channelCreate', async channel => {
		if(guildConf[channel.guild.id].logs === "0") {
			console.log("Les logs sont désactivés !")
			return;
		} else if(guildConf[channel.guild.id].logs === "1") {
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
		  .setTimestamp()
		  .setFooter('Logs Beta Version');
		send(bot, channel.guild, options, embed, "channelCreate")
	}
	});

	//CHANNEL DELETE
	bot.on('channelDelete', async channel => {
		if(guildConf[channel.guild.id].logs === "0") {
			console.log("Les logs sont désactivés !")
			return;
		} else if(guildConf[channel.guild.id].logs === "1") {
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
		send(bot, channel.guild, options, embed, "channelDelete")
	}
	});

	//USER BANNED
	bot.on("guildBanAdd", async (banguild, banuser) => {
		if(guildConf[banguild.guild.id].logs === "0") {
			console.log("Les logs sont désactivés !")
			return;
		} else if(guildConf[banguild.guild.id].logs === "1") {
		let logs = await banguild.fetchAuditLogs({type: 22});
		let entry = logs.entries.first();
		const embed = new Discord.RichEmbed()
		  .setColor(`${config.colorembed}`)
          .setTitle('Logs Membre Bannie')
	  	  .addField("Membre", `<@${banuser.id}>`)
          .addField("Membre ID", `${banuser.id}`)
          .addField("Auteur", entry.executor)
          .addField("Auteur ID", entry.executor.id)
          .addField("Raison", entry.reason || "Aucun")
		  .setTimestamp()
		  .setFooter('Logs Beta Version');
		send(bot, banguild, options, embed, "guildBanAdd")
		}
	});

	//USER UNBANNED
	bot.on("guildBanRemove", async (banguild, banuser) => {
		if(guildConf[banguild.guild.id].logs === "0") {
			console.log("Les logs sont désactivés !")
			return;
		} else if(guildConf[banguild.guild.id].logs === "1") {
		let logs = await banguild.fetchAuditLogs({type: 23});
		let entry = logs.entries.first();
		const embed = new Discord.RichEmbed()
		  .setColor(`${config.colorembed}`)
          .setTitle('Logs Membre Débannie')
	  	  .addField("Membre", `<@${banuser.id}>`)
          .addField("Membre ID", `${banuser.id}`)
          .addField("Auteur", entry.executor)
          .addField("Auteur ID", entry.executor.id)
          .addField("Raison", entry.reason || "Aucun")
		  .setTimestamp()
		  .setFooter('Logs Beta Version');
		send(bot, banguild, options, embed, "guildBanRemove")
		}
	});

	//USER NICKNAME UPDATE, USER ROLE UPDATE
	bot.on('guildMemberUpdate', (oldMember, newMember) => {
		if(guildConf[newMember.guild.id].logs === "0") {
			console.log("Les logs sont désactivés !")
			return;
		} else if(guildConf[newMember.guild.id].logs === "1") {
		if (oldMember.nickname != newMember.nickname) {
			const embed1 = new Discord.RichEmbed()
		    .setColor(`${config.colorembed}`)
            .setTitle('Logs Membre Pseudo Mise à jour')
	  	    .addField("Nouveau Pseudo", `<@${newMember.user.id}>`)
            .addField("Ancien Pseudo", `${oldMember.nickname || oldMember.user.tag}`)
            .addField("Pseudo ID", `${newMember.user.id}`)
		    .setTimestamp()
		    .setFooter('Logs Beta Version');
			send(bot, newMember.guild, options, embed1, "guildMemberUpdate")
		}

		// Initialize option if empty
		if (!options) {
			options = {};
		}

		if (options[newMember.guild.id]) {
			options = options[newMember.guild.id];
		}
			let oldMemberRoles = oldMember.roles.keyArray()
			let newMemberRoles = newMember.roles.keyArray()


			// Check inspired by https://medium.com/@alvaro.saburido/set-theory-for-arrays-in-es6-eb2f20a61848
			let oldRoles = oldMemberRoles.filter(x => !newMemberRoles.includes(x));;
			let newRoles = newMemberRoles.filter(x => !oldMemberRoles.includes(x));

			let rolechanged = (newRoles.length || oldRoles.length)

			if (rolechanged) {
				let roleadded = ``
				if (newRoles.length > 0) {
					for (var i = 0; i < newRoles.length; i++) {
						if (i > 0) roleadded += `, `
						roleadded += `<@&${newRoles[i]}>`
					}
				}

				let roleremoved = ``
				if (oldRoles.length > 0) {
					for (var i = 0; i < oldRoles.length; i++) {
						if (i > 0) roleremoved += `, `
						roleremoved += `<@&${oldRoles[i]}>`
					}
				}
				const embed2 = new Discord.RichEmbed()
		  		.setColor(`${config.colorembed}`)
          		.setTitle('Logs Membre Rôles Mise à jour')
	  	  		.addField("Membre", `<@${newMember.user.id}>`)
          		.addField("Membre ID", `${newMember.user.id}`)
          		.addField("Rôle Ajoutés", `${roleadded || "Aucun"}`)
          		.addField("Rôle Enlever", `${roleremoved || "Aucun"}`)
		  		.setTimestamp()
		  		.setFooter('Logs Beta Version');
				send(bot, newMember.guild, options, embed2, "guildMemberUpdate")

			}
		}
	});

	//USER UPDATE AVATAR, USERNAME, DISCRIMINATOR
	/*
	bot.on('userUpdate', (oldUser, newUser) => {
		if(guildConf[oldUser.guild.id].logs === "0") {
			console.log("Les logs sont désactivés !")
			return;
		} else if(guildConf[oldUser.guild.id].logs === "1") {
		// Log quand le user change de username (et possiblement discriminator)
		var usernameChangedMsg = null;
		var discriminatorChangedMsg = null;
		var avatarChangedMsg = null;

		// search the member from all guilds, since the userUpdate event doesn't provide guild information as it is a global event.
		bot.guilds.forEach(function (guild, guildid) {
			guild.members.forEach(function (member, memberid) {
				if (newUser.id == memberid) {
					// var member = bot.guilds.get(guildid).members.get(member.id)

					//USERNAME CHANGED
					if (oldUser.username != newUser.username) {
						usernameChangedMsg = {
							"color": 16244510,
							"title": `Logs Membre Pseudo Mise à jour`,
							"timestamp": new Date(),
							"footer": {
								"text": `Logs Beta Version`
							},
							"fields": [{
									"name": "Ancien Pseudo",
									"value": `${oldUser.nickname || oldUser.user.tag}`,
									"inline": false
								},
								{
									"name": "Nouveau Pseudo",
									"value": `<@${newUser.user.id}>`,
									"inline": false
								},
								{
									"name": "Pseudo ID",
									"value": `${newUser.user.id}`,
									"inline": false
								}
							]
						};
					}

					//DISCRIMINATOR CHANGED
					if (oldUser.discriminator != newUser.discriminator) {
						discriminatorChangedMsg = {
							"color": 16244510,
							"title": `Logs Membre TAG Mise à jour`,
							"timestamp": new Date(),
							"footer": {
								"text": `Logs Beta Version`
							},
							"fields": [{
									"name": "Ancien TAG",
									"value": `${oldUser.discriminator}`,
									"inline": false
								},
								{
									"name": "Nouveau TAG",
									"value": `${newUser.discriminator}`,
									"inline": false
								}
							]
						};
					}

					//AVATAR CHANGED
					if (oldUser.avatar != newUser.avatar) {
						avatarChangedMsg = {
							"color": 16244510,
							"title": `Logs Membre Avatar Mise à jour`,
							"timestamp": new Date(),
							"footer": {
								"text": `Logs Beta Version`
							},
							"thumbnail": {
								"url": oldUser.displayAvatarURL
							},
							"image": {
								"url": newUser.displayAvatarURL
							},
							"fields": [{
								"name": "Ancien Avatar",
								"value": `:arrow_right:`,
								"inline": false
							},
							{
								"name": "Nouveau Avatar",
								"value": `:arrow_down:`,
								"inline": false
							}
						]
						};
					}

					if (usernameChangedMsg) send(bot, guild, options, usernameChangedMsg, "usernameChangedMsg");
					if (discriminatorChangedMsg) send(bot, guild, options, discriminatorChangedMsg, "discriminatorChangedMsg");
					if (avatarChangedMsg) send(bot, guild, options, avatarChangedMsg, "avatarChangedMsg");
				}
			});
		});
	}
	});
	*/

	//CHANNEL JOIN LEAVE SWITCH
	bot.on('voiceStateUpdate', (oldMember, newMember) => {
		if(guildConf[newMember.guild.id].logs === "0") {
			console.log("Les logs sont désactivés !")
			return;
		} else if(guildConf[newMember.guild.id].logs === "1") {
		var oldChannelName
		var newChannelName
		var embed

		//SET CHANNEL NAME STRING
		if (oldMember.voiceChannelID) {
			if (typeof oldMember.voiceChannel.parent !== 'undefined') {
				oldChannelName = `${oldMember.voiceChannel.parent.name}\n\t**${oldMember.voiceChannel.name}**\n*${oldMember.voiceChannelID}*`;
			} else {
				oldChannelName = `-\n\t**${oldMember.voiceChannel.name}**\n*${oldMember.voiceChannelID}*`;
			}
		}
		if (newMember.voiceChannelID) {
			if (typeof newMember.voiceChannel.parent !== 'undefined') {
				newChannelName = `${newMember.voiceChannel.parent.name}\n\t**${newMember.voiceChannel.name}**\n*${newMember.voiceChannelID}*`;
			} else {
				newChannelName = `-\n\t**${newMember.voiceChannel.name}**\n*${newMember.voiceChannelID}*`;
			}
		}

		//JOINED
		if (!oldMember.voiceChannelID && newMember.voiceChannelID) {
			embed = {
				"color": 16244510,
				"title": `Logs Membre à rejoint un salon vocal`,
				"timestamp": new Date(),
				"footer": {
					"text": `Logs Beta Version`
				},
				"fields": [{
					"name": "Membre",
					"value": `${newMember}`,
					"inline": false
				},
				{
					"name": "Membre ID",
					"value": `${newMember.id}`,
					"inline": false
				},
				{
					"name": "Salon vocal",
					"value": `${newChannelName}`,
					"inline": false
				}
			]
			};
		}

		//LEFT
		if (oldMember.voiceChannelID && !newMember.voiceChannelID) {
			embed = {
				"color": 16244510,
				"title": `Logs Membre à quitté un salon vocal`,
				"timestamp": new Date(),
				"footer": {
					"text": `Logs Beta Version`
				},
				"fields": [{
					"name": "Membre",
					"value": `${newMember}`,
					"inline": false
				},
				{
					"name": "Membre ID",
					"value": `${newMember.id}`,
					"inline": false
				},
				{
					"name": "Salon vocal",
					"value": `${oldChannelName}`,
					"inline": false
				}
			]
			};
		}

		//SWITCH
		if (oldMember.voiceChannelID && newMember.voiceChannelID) {
			//False positive check
			if (oldMember.voiceChannelID != newMember.voiceChannelID) {
				embed = {
					"color": 16244510,
				"title": `Logs Membre à changé de salon vocal`,
				"timestamp": new Date(),
				"footer": {
					"text": `Logs Beta Version`
				},
				"fields": [{
					"name": "Membre",
					"value": `${newMember}`,
					"inline": false
				},
				{
					"name": "Membre ID",
					"value": `${newMember.id}`,
					"inline": false
				},
				{
					"name": "Nouveau Salon vocal",
					"value": `${newChannelName}`,
					"inline": false
				},
				{
					"name": "Ancien Salon vocal",
					"value": `${oldChannelName}`,
					"inline": false
				}
			]
				};
			}
		}

		//SEND
		if (embed) {
			send(bot, newMember.guild, options, embed, "voiceStateUpdate")
		}
	}
	});

	//SEND FUNCTION
	function send(bot, guild, options, msg, movement) {
		let embed = ""
		// Initialize option if empty
		if (!options) {
			options = {};
		}

		// Initialize if options are multi-server
		if (options[guild.id]) {
			options = options[guild.id];
		}

		// Add default channel
		if (typeof options.auditlog == 'undefined') options.auditlog = `audit-log`;
		if (typeof options.auditmsg == 'undefined') options.auditmsg = false
		if (typeof options.movement == 'undefined') options.movement = `in-out`;
		if (typeof options.voice == 'undefined') options.voice = false;

		const LogsChannel = guild.channels.find(channel => channel.name === "📄logs");
        const LogsChannelID = guild.channels.get(guildConf[guild.id].logs_channel)

		if (LogsChannel) {
			embed = msg;
			LogsChannel.send(embed)
		} else if(!LogsChannel) {
			if (!LogsChannelID) {
				const everyoneRole = bot.guilds.get(guild.id).roles.find(x => x.name === '@everyone');
				const messageimportant = `>>> **IMPORTANT** ne jamais supprimer ou renommer ce salon !\nSi vous renommez le nom ou supprimer ce salon, Vous n'aurez pas accés aux Logs de DiscordBot.Js (sauf si vous configurer les logs dans un autre salon avec la commande ${guildConf[guild.id].prefix}logs-channel)`
				embed = msg;
				guild.createChannel(logs_name, 'text')
				.then(r => {
				r.overwritePermissions(bot.user.id, { SEND_MESSAGES: true, VIEW_CHANNEL: true });
				r.overwritePermissions(everyoneRole, { SEND_MESSAGES: false, VIEW_CHANNEL: false });
				wait(5000);
				r.send(`${messageimportant}`, embed)
				})
			} else if(LogsChannelID) {
				embed = msg;
				LogsChannelID.send(embed)
			}
		}
	}
};
