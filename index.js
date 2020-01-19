const { Client } = require('discord.js');
const Discord = require('discord.js');
const client = new Client({ disableEveryone: true });
const config = require("./config.js");
const langu = require("./language.js");
const CONFIG = require('./config');
const fs = require("fs");
const wait = require('util').promisify(setTimeout);
require('events').EventEmitter.defaultMaxListeners = 0;
const Long = require("long");
client.commands = require("./commands.js");
client.commands.start(client, {
	botPrefix: config.prefix,
  ownerID: config.ownerID,
  /*
  <command>: {
    enabled: false,                    // True/False statement.
    alt: ["name1","name2","name3"],    // Array of alt names (aliases).
    help: "Help text.",                // String of help text.
    name: "play"                       // Name of the command.
    usage: "{{prefix}}play bad memes", // Usage text. {{prefix}} will insert the bots prefix.
    exclude: false                     // Excludes the command from the help command.
  }
  */
  test: {
	  exclude: true
  },
  help: {
    alt: ["aide"],
    exclude: true
  },
  serverinfo: {
    alt: ["serveur-info"]
  },
  userinfo: {
    alt: ["utilisateur-info"]
  },
  channelinfo: {
    alt: ["salon-info"]
  },
  roleinfo: {
    alt: ["rôle-info"]
  },
  serverlist: {
    alt: ["serveur-list"]
  },
  serverinvite: {
    alt: ["serveur-invite"]
  },
	cooldown: {
	  enabled: true
	}
});
client.login(config.botToken);