const { Client, RichEmbed, Emoji, MessageReaction } = require('discord.js');
const Discord = require('discord.js');
const client = new Client({ disableEveryone: true });
const dl = require('discord-leveling');
const Canvas = require('canvas');
const snekfetch = require('snekfetch');
const db = require('quick.db');
const ms = require('parse-ms');
const config = require("./config.js");
const guildConf = require('./config.json');
const language = require("./language.js");
const PACKAGE = require('./package.json');
const fs = require("fs");
const wait = require('util').promisify(setTimeout);
require('events').EventEmitter.defaultMaxListeners = 0;
const Long = require("long");

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

let emoji1id = ""
let emoji2id = ""
let emoji1text = ""
let emoji2text = ""
let time = ""
let question = ""
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
function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}

const lastChar = (str) => str.split('').reverse().join(',').replace(',', '')[str.length === str.length + 1 ? 1 : 0];
const emojiList = ['✅','❎'];
const emojiLetterList = ['🇦','🇧','🇨','🇩','🇪','🇫','🇬','🇭','🇮','🇯','🇰','🇱','🇲','🇳','🇴','🇵','🇶','🇷','🇸','🇹','🇺','🇻','🇼','🇽','🇾','🇿'];

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

exports.start = (client, options) => {
    try {
        if (process.version.slice(1).split('.')[0] < 8) console.error(new Error(`${language.processversionwarning}`));
        function moduleAvailable(name) {
          try {
            require.resolve(name);
            return true;
          } catch(e){}
          return false;
        };
        //if (moduleAvailable("modulename")) console.error(new Error(""));
        //if (!moduleAvailable("ytdl-core") || !moduleAvailable("ytpl") || !moduleAvailable("ytsearcher")) console.error(new Error(""));
    
        class abcd {
          constructor(client, options) {
            // Data Objects
            this.commands = new Map();
            this.commandsArray = [];
            this.aliases = new Map();
            this.queues = new Map();
            this.client = client;

            // Help Command options
            this.help = {
              enabled: (options.help == undefined ? true : (options.help && typeof options.help.enabled !== 'undefined' ? options.help && options.help.enabled : true)),
              run: "helpFunction",
              alt: (options && options.help && options.help.alt) || [],
              help: (options && options.help && options.help.help) || `${language.descriptionhelpcommande}`,
              name: (options && options.help && options.help.name) || "help",
              usage: (options && options.help && options.help.usage) || null,
              exclude: Boolean((options && options.help && options.help.exclude)),
              masked: "help"
            };
    
            // test Command options
            this.test = {
              enabled: (options.test == undefined ? true : (options.test && typeof options.test.enabled !== 'undefined' ? options.test && options.test.enabled : true)),
              run: "testFunction",
              alt: (options && options.test && options.test.alt) || [],
              help: (options && options.test && options.test.help) || `${language.descriptiontestcommande}`,
              name: (options && options.test && options.test.name) || "test",
              usage: (options && options.test && options.test.usage) || null,
              exclude: Boolean((options && options.test && options.test.exclude)),
              masked: "test"
            };

            // news Command options
            this.news = {
              enabled: (options.news == undefined ? true : (options.news && typeof options.news.enabled !== 'undefined' ? options.news && options.news.enabled : true)),
              run: "newsFunction",
              alt: (options && options.news && options.news.alt) || [],
              help: (options && options.news && options.news.help) || `${language.descriptionnewscommande}`,
              name: (options && options.news && options.news.name) || "news",
              usage: (options && options.news && options.news.usage) || null,
              exclude: Boolean((options && options.news && options.news.exclude)),
              masked: "news"
            };

            // serverinfo Command options
            this.serverinfo = {
              enabled: (options.serverinfo == undefined ? true : (options.serverinfo && typeof options.serverinfo.enabled !== 'undefined' ? options.serverinfo && options.serverinfo.enabled : true)),
              run: "serverinfoFunction",
              alt: (options && options.serverinfo && options.serverinfo.alt) || [],
              help: (options && options.serverinfo && options.serverinfo.help) || `${language.descriptiontestcommande}`,
              name: (options && options.serverinfo && options.serverinfo.name) || "server-info",
              usage: (options && options.serverinfo && options.serverinfo.usage) || null,
              exclude: Boolean((options && options.serverinfo && options.serverinfo.exclude)),
              masked: "serverinfo"
            };

            // userinfo Command options
            this.userinfo = {
              enabled: (options.userinfo == undefined ? true : (options.userinfo && typeof options.userinfo.enabled !== 'undefined' ? options.userinfo && options.userinfo.enabled : true)),
              run: "userinfoFunction",
              alt: (options && options.userinfo && options.userinfo.alt) || [],
              help: (options && options.userinfo && options.userinfo.help) || `${language.descriptionuserinfocommande}`,
              name: (options && options.userinfo && options.userinfo.name) || "user-info",
              usage: (options && options.userinfo && options.userinfo.usage) || null,
              exclude: Boolean((options && options.userinfo && options.userinfo.exclude)),
              masked: "userinfo"
            };

            // botinfo Command options
            this.botinfo = {
              enabled: (options.botinfo == undefined ? true : (options.botinfo && typeof options.botinfo.enabled !== 'undefined' ? options.botinfo && options.botinfo.enabled : true)),
              run: "botinfoFunction",
              alt: (options && options.botinfo && options.botinfo.alt) || [],
              help: (options && options.botinfo && options.botinfo.help) || `${language.descriptionbotinfocommande}`,
              name: (options && options.botinfo && options.botinfo.name) || "bot-info",
              usage: (options && options.botinfo && options.botinfo.usage) || null,
              exclude: Boolean((options && options.botinfo && options.botinfo.exclude)),
              masked: "botinfo"
            };

            // channelinfo Command options
            this.channelinfo = {
              enabled: (options.channelinfo == undefined ? true : (options.channelinfo && typeof options.channelinfo.enabled !== 'undefined' ? options.channelinfo && options.channelinfo.enabled : true)),
              run: "channelinfoFunction",
              alt: (options && options.channelinfo && options.channelinfo.alt) || [],
              help: (options && options.channelinfo && options.channelinfo.help) || `${language.descriptionchannelinfocommande}`,
              name: (options && options.channelinfo && options.channelinfo.name) || "channel-info",
              usage: (options && options.channelinfo && options.channelinfo.usage) || null,
              exclude: Boolean((options && options.channelinfo && options.channelinfo.exclude)),
              masked: "channelinfo"
            };

            // roleinfo Command options
            this.roleinfo = {
              enabled: (options.roleinfo == undefined ? true : (options.roleinfo && typeof options.roleinfo.enabled !== 'undefined' ? options.roleinfo && options.roleinfo.enabled : true)),
              run: "roleinfoFunction",
              alt: (options && options.roleinfo && options.roleinfo.alt) || [],
              help: (options && options.roleinfo && options.roleinfo.help) || `${language.descriptionroleinfocommande}`,
              name: (options && options.roleinfo && options.roleinfo.name) || "role-info",
              usage: (options && options.roleinfo && options.roleinfo.usage) || null,
              exclude: Boolean((options && options.roleinfo && options.roleinfo.exclude)),
              masked: "roleinfo"
            };

            // serverlist Command options
            this.serverlist = {
              enabled: (options.serverlist == undefined ? true : (options.serverlist && typeof options.serverlist.enabled !== 'undefined' ? options.serverlist && options.serverlist.enabled : true)),
              run: "serverlistFunction",
              alt: (options && options.serverlist && options.serverlist.alt) || [],
              help: (options && options.serverlist && options.serverlist.help) || `${language.descriptionserverlistcommande}`,
              name: (options && options.serverlist && options.serverlist.name) || "server-list",
              usage: (options && options.serverlist && options.serverlist.usage) || null,
              exclude: Boolean((options && options.serverlist && options.serverlist.exclude)),
              masked: "serverlist"
            };

            // serverinvite Command options
            this.serverinvite = {
              enabled: (options.serverinvite == undefined ? true : (options.serverinvite && typeof options.serverinvite.enabled !== 'undefined' ? options.serverinvite && options.serverinvite.enabled : true)),
              run: "serverinviteFunction",
              alt: (options && options.serverinvite && options.serverinvite.alt) || [],
              help: (options && options.serverinvite && options.serverinvite.help) || `${language.descriptionserverinvitecommande}`,
              name: (options && options.serverinvite && options.serverinvite.name) || "server-invite",
              usage: (options && options.serverinvite && options.serverinvite.usage) || null,
              exclude: Boolean((options && options.serverinvite && options.serverinvite.exclude)),
              masked: "serverinvite"
            };

            // webhookcreate Command options
            this.webhookcreate = {
              enabled: (options.webhookcreate == undefined ? true : (options.webhookcreate && typeof options.webhookcreate.enabled !== 'undefined' ? options.webhookcreate && options.webhookcreate.enabled : true)),
              run: "webhookcreateFunction",
              alt: (options && options.webhookcreate && options.webhookcreate.alt) || [],
              help: (options && options.webhookcreate && options.webhookcreate.help) || `${language.descriptionwebhookcreatecommande}`,
              name: (options && options.webhookcreate && options.webhookcreate.name) || "webhook-create",
              usage: (options && options.webhookcreate && options.webhookcreate.usage) || null,
              exclude: Boolean((options && options.webhookcreate && options.webhookcreate.exclude)),
              masked: "webhookcreate"
            };

            // webhookconfigsend Command options
            this.webhookconfigsend = {
              enabled: (options.webhookconfigsend == undefined ? true : (options.webhookconfigsend && typeof options.webhookconfigsend.enabled !== 'undefined' ? options.webhookconfigsend && options.webhookconfigsend.enabled : true)),
              run: "webhookconfigsendFunction",
              alt: (options && options.webhookconfigsend && options.webhookconfigsend.alt) || [],
              help: (options && options.webhookconfigsend && options.webhookconfigsend.help) || `${language.descriptionwebhookconfigsendcommande}`,
              name: (options && options.webhookconfigsend && options.webhookconfigsend.name) || "webhook-config-send",
              usage: (options && options.webhookconfigsend && options.webhookconfigsend.usage) || null,
              exclude: Boolean((options && options.webhookconfigsend && options.webhookconfigsend.exclude)),
              masked: "webhookconfigsend"
            };

            // webhooksend Command options
            this.webhooksend = {
              enabled: (options.webhooksend == undefined ? true : (options.webhooksend && typeof options.webhooksend.enabled !== 'undefined' ? options.webhooksend && options.webhooksend.enabled : true)),
              run: "webhooksendFunction",
              alt: (options && options.webhooksend && options.webhooksend.alt) || [],
              help: (options && options.webhooksend && options.webhooksend.help) || `${language.descriptionwebhooksendcommande}`,
              name: (options && options.webhooksend && options.webhooksend.name) || "webhook-send",
              usage: (options && options.webhooksend && options.webhooksend.usage) || null,
              exclude: Boolean((options && options.webhooksend && options.webhooksend.exclude)),
              masked: "webhooksend"
            };

            // webhookhelp Command options
            this.webhookhelp = {
              enabled: (options.webhookhelp == undefined ? true : (options.webhookhelp && typeof options.webhookhelp.enabled !== 'undefined' ? options.webhookhelp && options.webhookhelp.enabled : true)),
              run: "webhookhelpFunction",
              alt: (options && options.webhookhelp && options.webhookhelp.alt) || [],
              help: (options && options.webhookhelp && options.webhookhelp.help) || `${language.descriptionwebhookhelpcommande}`,
              name: (options && options.webhookhelp && options.webhookhelp.name) || "webhook-help",
              usage: (options && options.webhookhelp && options.webhookhelp.usage) || null,
              exclude: Boolean((options && options.webhookhelp && options.webhookhelp.exclude)),
              masked: "webhookhelp"
            };

            // addrole Command options
            this.addrole = {
              enabled: (options.addrole == undefined ? true : (options.addrole && typeof options.addrole.enabled !== 'undefined' ? options.addrole && options.addrole.enabled : true)),
              run: "addroleFunction",
              alt: (options && options.addrole && options.addrole.alt) || [],
              help: (options && options.addrole && options.addrole.help) || `${language.descriptionaddrolecommande}`,
              name: (options && options.addrole && options.addrole.name) || "add-role",
              usage: (options && options.addrole && options.addrole.usage) || null,
              exclude: Boolean((options && options.addrole && options.addrole.exclude)),
              masked: "addrole"
            };

            // removerole Command options
            this.removerole = {
              enabled: (options.removerole == undefined ? true : (options.removerole && typeof options.removerole.enabled !== 'undefined' ? options.removerole && options.removerole.enabled : true)),
              run: "removeroleFunction",
              alt: (options && options.removerole && options.removerole.alt) || [],
              help: (options && options.removerole && options.removerole.help) || `${language.descriptionremoverolecommande}`,
              name: (options && options.removerole && options.removerole.name) || "remove-role",
              usage: (options && options.removerole && options.removerole.usage) || null,
              exclude: Boolean((options && options.removerole && options.removerole.exclude)),
              masked: "removerole"
            };

            // kick Command options
            this.kick = {
              enabled: (options.kick == undefined ? true : (options.kick && typeof options.kick.enabled !== 'undefined' ? options.kick && options.kick.enabled : true)),
              run: "kickFunction",
              alt: (options && options.kick && options.kick.alt) || [],
              help: (options && options.kick && options.kick.help) || `${language.descriptionkickcommande}`,
              name: (options && options.kick && options.kick.name) || "kick",
              usage: (options && options.kick && options.kick.usage) || null,
              exclude: Boolean((options && options.kick && options.kick.exclude)),
              masked: "kick"
            };

            // ban Command options
            this.ban = {
              enabled: (options.ban == undefined ? true : (options.ban && typeof options.ban.enabled !== 'undefined' ? options.ban && options.ban.enabled : true)),
              run: "banFunction",
              alt: (options && options.ban && options.ban.alt) || [],
              help: (options && options.ban && options.ban.help) || `${language.descriptionbancommande}`,
              name: (options && options.ban && options.ban.name) || "ban",
              usage: (options && options.ban && options.ban.usage) || null,
              exclude: Boolean((options && options.ban && options.ban.exclude)),
              masked: "ban"
            };

            // unban Command options
            this.unban = {
              enabled: (options.unban == undefined ? true : (options.unban && typeof options.unban.enabled !== 'undefined' ? options.unban && options.unban.enabled : true)),
              run: "unbanFunction",
              alt: (options && options.unban && options.unban.alt) || [],
              help: (options && options.unban && options.unban.help) || `${language.descriptionunbancommande}`,
              name: (options && options.unban && options.unban.name) || "unban",
              usage: (options && options.unban && options.unban.usage) || null,
              exclude: Boolean((options && options.unban && options.unban.exclude)),
              masked: "unban"
            };

            // report Command options
            this.report = {
              enabled: (options.report == undefined ? true : (options.report && typeof options.report.enabled !== 'undefined' ? options.report && options.report.enabled : true)),
              run: "reportFunction",
              alt: (options && options.report && options.report.alt) || [],
              help: (options && options.report && options.report.help) || `${language.descriptionreportcommande}`,
              name: (options && options.report && options.report.name) || "report",
              usage: (options && options.report && options.report.usage) || null,
              exclude: Boolean((options && options.report && options.report.exclude)),
              masked: "report"
            };

            // mute Command options
            this.mute = {
              enabled: (options.mute == undefined ? true : (options.mute && typeof options.mute.enabled !== 'undefined' ? options.mute && options.mute.enabled : true)),
              run: "muteFunction",
              alt: (options && options.mute && options.mute.alt) || [],
              help: (options && options.mute && options.mute.help) || `${language.descriptionmutecommande}`,
              name: (options && options.mute && options.mute.name) || "mute",
              usage: (options && options.mute && options.mute.usage) || null,
              exclude: Boolean((options && options.mute && options.mute.exclude)),
              masked: "mute"
            };

            // unmute Command options
            this.unmute = {
              enabled: (options.unmute == undefined ? true : (options.unmute && typeof options.unmute.enabled !== 'undefined' ? options.unmute && options.unmute.enabled : true)),
              run: "unmuteFunction",
              alt: (options && options.unmute && options.unmute.alt) || [],
              help: (options && options.unmute && options.unmute.help) || `${language.descriptionunmutecommande}`,
              name: (options && options.unmute && options.unmute.name) || "unmute",
              usage: (options && options.unmute && options.unmute.usage) || null,
              exclude: Boolean((options && options.unmute && options.unmute.exclude)),
              masked: "unmute"
            };

            // botvote Command options
            this.botvote = {
              enabled: (options.botvote == undefined ? true : (options.botvote && typeof options.botvote.enabled !== 'undefined' ? options.botvote && options.botvote.enabled : true)),
              run: "botvoteFunction",
              alt: (options && options.botvote && options.botvote.alt) || [],
              help: (options && options.botvote && options.botvote.help) || `${language.descriptionbotvotecommande}`,
              name: (options && options.botvote && options.botvote.name) || "bot-vote",
              usage: (options && options.botvote && options.botvote.usage) || null,
              exclude: Boolean((options && options.botvote && options.botvote.exclude)),
              masked: "botvote"
            };

            // rps Command options
            this.rps = {
              enabled: (options.rps == undefined ? true : (options.rps && typeof options.rps.enabled !== 'undefined' ? options.rps && options.rps.enabled : true)),
              run: "rpsFunction",
              alt: (options && options.rps && options.rps.alt) || [],
              help: (options && options.rps && options.rps.help) || `${language.descriptionrpscommande}`,
              name: (options && options.rps && options.rps.name) || "rps",
              usage: (options && options.rps && options.rps.usage) || null,
              exclude: Boolean((options && options.rps && options.rps.exclude)),
              masked: "rps"
            };

            // clear Command options
            this.clear = {
              enabled: (options.clear == undefined ? true : (options.clear && typeof options.clear.enabled !== 'undefined' ? options.clear && options.clear.enabled : true)),
              run: "clearFunction",
              alt: (options && options.clear && options.clear.alt) || [],
              help: (options && options.clear && options.clear.help) || `${language.descriptionclearcommande}`,
              name: (options && options.clear && options.clear.name) || "clear",
              usage: (options && options.clear && options.clear.usage) || null,
              exclude: Boolean((options && options.clear && options.clear.exclude)),
              masked: "clear"
            };

            // ping Command options
            this.ping = {
              enabled: (options.ping == undefined ? true : (options.ping && typeof options.ping.enabled !== 'undefined' ? options.ping && options.ping.enabled : true)),
              run: "pingFunction",
              alt: (options && options.ping && options.ping.alt) || [],
              help: (options && options.ping && options.ping.help) || `${language.descriptionpingcommande}`,
              name: (options && options.ping && options.ping.name) || "ping",
              usage: (options && options.ping && options.ping.usage) || null,
              exclude: Boolean((options && options.ping && options.ping.exclude)),
              masked: "ping"
            };

            // say Command options
            this.say = {
              enabled: (options.say == undefined ? true : (options.say && typeof options.say.enabled !== 'undefined' ? options.say && options.say.enabled : true)),
              run: "sayFunction",
              alt: (options && options.say && options.say.alt) || [],
              help: (options && options.say && options.say.help) || `${language.descriptionsaycommande}`,
              name: (options && options.say && options.say.name) || "say",
              usage: (options && options.say && options.say.usage) || null,
              exclude: Boolean((options && options.say && options.say.exclude)),
              masked: "say"
            };

            // saymarkdown Command options
            this.saymarkdown = {
              enabled: (options.saymarkdown == undefined ? true : (options.saymarkdown && typeof options.saymarkdown.enabled !== 'undefined' ? options.saymarkdown && options.saymarkdown.enabled : true)),
              run: "saymarkdownFunction",
              alt: (options && options.saymarkdown && options.saymarkdown.alt) || [],
              help: (options && options.saymarkdown && options.saymarkdown.help) || `${language.descriptionsaymarkdowncommande}`,
              name: (options && options.saymarkdown && options.saymarkdown.name) || "say-markdown",
              usage: (options && options.saymarkdown && options.saymarkdown.usage) || null,
              exclude: Boolean((options && options.saymarkdown && options.saymarkdown.exclude)),
              masked: "saymarkdown"
            };

            // sayitalic Command options
            this.sayitalic = {
              enabled: (options.sayitalic == undefined ? true : (options.sayitalic && typeof options.sayitalic.enabled !== 'undefined' ? options.sayitalic && options.sayitalic.enabled : true)),
              run: "sayitalicFunction",
              alt: (options && options.sayitalic && options.sayitalic.alt) || [],
              help: (options && options.sayitalic && options.sayitalic.help) || `${language.descriptionsayitaliccommande}`,
              name: (options && options.sayitalic && options.sayitalic.name) || "say-italic",
              usage: (options && options.sayitalic && options.sayitalic.usage) || null,
              exclude: Boolean((options && options.sayitalic && options.sayitalic.exclude)),
              masked: "sayitalic"
            };

            // saybold Command options
            this.saybold = {
              enabled: (options.saybold == undefined ? true : (options.saybold && typeof options.saybold.enabled !== 'undefined' ? options.saybold && options.saybold.enabled : true)),
              run: "sayboldFunction",
              alt: (options && options.saybold && options.saybold.alt) || [],
              help: (options && options.saybold && options.saybold.help) || `${language.descriptionsayboldcommande}`,
              name: (options && options.saybold && options.saybold.name) || "say-bold",
              usage: (options && options.saybold && options.saybold.usage) || null,
              exclude: Boolean((options && options.saybold && options.saybold.exclude)),
              masked: "saybold"
            };

            // sayunderline Command options
            this.sayunderline = {
              enabled: (options.sayunderline == undefined ? true : (options.sayunderline && typeof options.sayunderline.enabled !== 'undefined' ? options.sayunderline && options.sayunderline.enabled : true)),
              run: "sayunderlineFunction",
              alt: (options && options.sayunderline && options.sayunderline.alt) || [],
              help: (options && options.sayunderline && options.sayunderline.help) || `${language.descriptionsayunderlinecommande}`,
              name: (options && options.sayunderline && options.sayunderline.name) || "say-underline",
              usage: (options && options.sayunderline && options.sayunderline.usage) || null,
              exclude: Boolean((options && options.sayunderline && options.sayunderline.exclude)),
              masked: "sayunderline"
            };

            // saystrikethrough Command options
            this.saystrikethrough = {
              enabled: (options.saystrikethrough == undefined ? true : (options.saystrikethrough && typeof options.saystrikethrough.enabled !== 'undefined' ? options.saystrikethrough && options.saystrikethrough.enabled : true)),
              run: "saystrikethroughFunction",
              alt: (options && options.saystrikethrough && options.saystrikethrough.alt) || [],
              help: (options && options.saystrikethrough && options.saystrikethrough.help) || `${language.descriptionsaystrikethroughcommande}`,
              name: (options && options.saystrikethrough && options.saystrikethrough.name) || "say-strikethrough",
              usage: (options && options.saystrikethrough && options.saystrikethrough.usage) || null,
              exclude: Boolean((options && options.saystrikethrough && options.saystrikethrough.exclude)),
              masked: "saystrikethrough"
            };

            // sayquotes Command options
            this.sayquotes = {
              enabled: (options.sayquotes == undefined ? true : (options.sayquotes && typeof options.sayquotes.enabled !== 'undefined' ? options.sayquotes && options.sayquotes.enabled : true)),
              run: "sayquotesFunction",
              alt: (options && options.sayquotes && options.sayquotes.alt) || [],
              help: (options && options.sayquotes && options.sayquotes.help) || `${language.descriptionsayquotescommande}`,
              name: (options && options.sayquotes && options.sayquotes.name) || "say-quotes",
              usage: (options && options.sayquotes && options.sayquotes.usage) || null,
              exclude: Boolean((options && options.sayquotes && options.sayquotes.exclude)),
              masked: "sayquotes"
            };

            // sayspoiler Command options
            this.sayspoiler = {
              enabled: (options.sayspoiler == undefined ? true : (options.sayspoiler && typeof options.sayspoiler.enabled !== 'undefined' ? options.sayspoiler && options.sayspoiler.enabled : true)),
              run: "sayspoilerFunction",
              alt: (options && options.sayspoiler && options.sayspoiler.alt) || [],
              help: (options && options.sayspoiler && options.sayspoiler.help) || `${language.descriptionsayspoilercommande}`,
              name: (options && options.sayspoiler && options.sayspoiler.name) || "say-spoiler",
              usage: (options && options.sayspoiler && options.sayspoiler.usage) || null,
              exclude: Boolean((options && options.sayspoiler && options.sayspoiler.exclude)),
              masked: "sayspoiler"
            };

            // saycode Command options
            this.saycode = {
              enabled: (options.saycode == undefined ? true : (options.saycode && typeof options.saycode.enabled !== 'undefined' ? options.saycode && options.saycode.enabled : true)),
              run: "saycodeFunction",
              alt: (options && options.saycode && options.saycode.alt) || [],
              help: (options && options.saycode && options.saycode.help) || `${language.descriptionsaycodecommande}`,
              name: (options && options.saycode && options.saycode.name) || "say-code",
              usage: (options && options.saycode && options.saycode.usage) || null,
              exclude: Boolean((options && options.saycode && options.saycode.exclude)),
              masked: "saycode"
            };

            // saycodeblock Command options
            this.saycodeblock = {
              enabled: (options.saycodeblock == undefined ? true : (options.saycodeblock && typeof options.saycodeblock.enabled !== 'undefined' ? options.saycodeblock && options.saycodeblock.enabled : true)),
              run: "saycodeblockFunction",
              alt: (options && options.saycodeblock && options.saycodeblock.alt) || [],
              help: (options && options.saycodeblock && options.saycodeblock.help) || `${language.descriptionsaycodeblockcommande}`,
              name: (options && options.saycodeblock && options.saycodeblock.name) || "say-code-block",
              usage: (options && options.saycodeblock && options.saycodeblock.usage) || null,
              exclude: Boolean((options && options.saycodeblock && options.saycodeblock.exclude)),
              masked: "saycodeblock"
            };

            // saycodecolor Command options
            this.saycodecolor = {
              enabled: (options.saycodecolor == undefined ? true : (options.saycodecolor && typeof options.saycodecolor.enabled !== 'undefined' ? options.saycodecolor && options.saycodecolor.enabled : true)),
              run: "saycodecolorFunction",
              alt: (options && options.saycodecolor && options.saycodecolor.alt) || [],
              help: (options && options.saycodecolor && options.saycodecolor.help) || `${language.descriptionsaycodecolorcommande}`,
              name: (options && options.saycodecolor && options.saycodecolor.name) || "say-code-color",
              usage: (options && options.saycodecolor && options.saycodecolor.usage) || null,
              exclude: Boolean((options && options.saycodecolor && options.saycodecolor.exclude)),
              masked: "saycodecolor"
            };

            // logschannel Command options
            this.logschannel = {
              enabled: (options.logschannel == undefined ? true : (options.logschannel && typeof options.logschannel.enabled !== 'undefined' ? options.logschannel && options.logschannel.enabled : true)),
              run: "logschannelFunction",
              alt: (options && options.logschannel && options.logschannel.alt) || [],
              help: (options && options.logschannel && options.logschannel.help) || `${language.descriptionlogschannelcommande}`,
              name: (options && options.logschannel && options.logschannel.name) || "logs-channel",
              usage: (options && options.logschannel && options.logschannel.usage) || null,
              exclude: Boolean((options && options.logschannel && options.logschannel.exclude)),
              masked: "logschannel"
            };

            // pollsimple Command options
            this.pollsimple = {
              enabled: (options.pollsimple == undefined ? true : (options.pollsimple && typeof options.pollsimple.enabled !== 'undefined' ? options.pollsimple && options.pollsimple.enabled : true)),
              run: "pollsimpleFunction",
              alt: (options && options.pollsimple && options.pollsimple.alt) || [],
              help: (options && options.pollsimple && options.pollsimple.help) || `${language.descriptionpollsimplecommande}`,
              name: (options && options.pollsimple && options.pollsimple.name) || "poll-simple",
              usage: (options && options.pollsimple && options.pollsimple.usage) || null,
              exclude: Boolean((options && options.pollsimple && options.pollsimple.exclude)),
              masked: "pollsimple"
            };

            // polladvanced Command options
            this.polladvanced = {
              enabled: (options.polladvanced == undefined ? true : (options.polladvanced && typeof options.polladvanced.enabled !== 'undefined' ? options.polladvanced && options.polladvanced.enabled : true)),
              run: "polladvancedFunction",
              alt: (options && options.polladvanced && options.polladvanced.alt) || [],
              help: (options && options.polladvanced && options.polladvanced.help) || `${language.descriptionpolladvancedcommande}`,
              name: (options && options.polladvanced && options.polladvanced.name) || "poll-advanced",
              usage: (options && options.polladvanced && options.polladvanced.usage) || null,
              exclude: Boolean((options && options.polladvanced && options.polladvanced.exclude)),
              masked: "polladvanced"
            };

            // pollhelp Command options
            this.pollhelp = {
              enabled: (options.pollhelp == undefined ? true : (options.pollhelp && typeof options.pollhelp.enabled !== 'undefined' ? options.pollhelp && options.pollhelp.enabled : true)),
              run: "pollhelpFunction",
              alt: (options && options.pollhelp && options.pollhelp.alt) || [],
              help: (options && options.pollhelp && options.pollhelp.help) || `${language.descriptionpollhelpcommande}`,
              name: (options && options.pollhelp && options.pollhelp.name) || "poll-help",
              usage: (options && options.pollhelp && options.pollhelp.usage) || null,
              exclude: Boolean((options && options.pollhelp && options.pollhelp.exclude)),
              masked: "pollhelp"
            };

            // leaderboard Command options
            this.leaderboard = {
              enabled: (options.leaderboard == undefined ? true : (options.leaderboard && typeof options.leaderboard.enabled !== 'undefined' ? options.leaderboard && options.leaderboard.enabled : true)),
              run: "leaderboardFunction",
              alt: (options && options.leaderboard && options.leaderboard.alt) || [],
              help: (options && options.leaderboard && options.leaderboard.help) || `${language.descriptionleaderboardcommande}`,
              name: (options && options.leaderboard && options.leaderboard.name) || "xp-leaderboard",
              usage: (options && options.leaderboard && options.leaderboard.usage) || null,
              exclude: Boolean((options && options.leaderboard && options.leaderboard.exclude)),
              masked: "leaderboard"
            };

            // xpsetxp Command options
            this.xpsetxp = {
              enabled: (options.xpsetxp == undefined ? true : (options.xpsetxp && typeof options.xpsetxp.enabled !== 'undefined' ? options.xpsetxp && options.xpsetxp.enabled : true)),
              run: "xpsetxpFunction",
              alt: (options && options.xpsetxp && options.xpsetxp.alt) || [],
              help: (options && options.xpsetxp && options.xpsetxp.help) || `${language.descriptionxpsetxpcommande}`,
              name: (options && options.xpsetxp && options.xpsetxp.name) || "xp-setxp",
              usage: (options && options.xpsetxp && options.xpsetxp.usage) || null,
              exclude: Boolean((options && options.xpsetxp && options.xpsetxp.exclude)),
              masked: "xpsetxp"
            };

            // xpsetlevel Command options
            this.xpsetlevel = {
              enabled: (options.xpsetlevel == undefined ? true : (options.xpsetlevel && typeof options.xpsetlevel.enabled !== 'undefined' ? options.xpsetlevel && options.xpsetlevel.enabled : true)),
              run: "xpsetlevelFunction",
              alt: (options && options.xpsetlevel && options.xpsetlevel.alt) || [],
              help: (options && options.xpsetlevel && options.xpsetlevel.help) || `${language.descriptionxpsetlevelcommande}`,
              name: (options && options.xpsetlevel && options.xpsetlevel.name) || "xp-setlevel",
              usage: (options && options.xpsetlevel && options.xpsetlevel.usage) || null,
              exclude: Boolean((options && options.xpsetlevel && options.xpsetlevel.exclude)),
              masked: "xpsetlevel"
            };

            // xpdelete Command options
            this.xpdelete = {
              enabled: (options.xpdelete == undefined ? true : (options.xpdelete && typeof options.xpdelete.enabled !== 'undefined' ? options.xpdelete && options.xpdelete.enabled : true)),
              run: "xpdeleteFunction",
              alt: (options && options.xpdelete && options.xpdelete.alt) || [],
              help: (options && options.xpdelete && options.xpdelete.help) || `${language.descriptionxpdeletecommande}`,
              name: (options && options.xpdelete && options.xpdelete.name) || "xp-delete",
              usage: (options && options.xpdelete && options.xpdelete.usage) || null,
              exclude: Boolean((options && options.xpdelete && options.xpdelete.exclude)),
              masked: "xpdelete"
            };

            // xphelp Command options
            this.xphelp = {
              enabled: (options.xphelp == undefined ? true : (options.xphelp && typeof options.xphelp.enabled !== 'undefined' ? options.xphelp && options.xphelp.enabled : true)),
              run: "xphelpFunction",
              alt: (options && options.xphelp && options.xphelp.alt) || [],
              help: (options && options.xphelp && options.xphelp.help) || `${language.descriptionxphelpcommande}`,
              name: (options && options.xphelp && options.xphelp.name) || "xp-help",
              usage: (options && options.xphelp && options.xphelp.usage) || null,
              exclude: Boolean((options && options.xphelp && options.xphelp.exclude)),
              masked: "xphelp"
            };

            // setupserver Command options
            this.setupserver = {
              enabled: (options.setupserver == undefined ? true : (options.setupserver && typeof options.setupserver.enabled !== 'undefined' ? options.setupserver && options.setupserver.enabled : true)),
              run: "setupserverFunction",
              alt: (options && options.setupserver && options.setupserver.alt) || [],
              help: (options && options.setupserver && options.setupserver.help) || `${language.descriptionsetupservercommande}`,
              name: (options && options.setupserver && options.setupserver.name) || "setupserver",
              usage: (options && options.setupserver && options.setupserver.usage) || null,
              exclude: Boolean((options && options.setupserver && options.setupserver.exclude)),
              masked: "setupserver"
            };

            // embedcreator Command options
            this.embedcreator = {
              enabled: (options.embedcreator == undefined ? true : (options.embedcreator && typeof options.embedcreator.enabled !== 'undefined' ? options.embedcreator && options.embedcreator.enabled : true)),
              run: "embedcreatorFunction",
              alt: (options && options.embedcreator && options.embedcreator.alt) || [],
              help: (options && options.embedcreator && options.embedcreator.help) || `${language.descriptionembedcreatorcommande}`,
              name: (options && options.embedcreator && options.embedcreator.name) || "embed-creator",
              usage: (options && options.embedcreator && options.embedcreator.usage) || null,
              exclude: Boolean((options && options.embedcreator && options.embedcreator.exclude)),
              masked: "embedcreator"
            };

            // embedhelp Command options
            this.embedhelp = {
              enabled: (options.embedhelp == undefined ? true : (options.embedhelp && typeof options.embedhelp.enabled !== 'undefined' ? options.embedhelp && options.embedhelp.enabled : true)),
              run: "embedhelpFunction",
              alt: (options && options.embedhelp && options.embedhelp.alt) || [],
              help: (options && options.embedhelp && options.embedhelp.help) || `${language.descriptionembedhelpcommande}`,
              name: (options && options.embedhelp && options.embedhelp.name) || "embed-help",
              usage: (options && options.embedhelp && options.embedhelp.usage) || null,
              exclude: Boolean((options && options.embedhelp && options.embedhelp.exclude)),
              masked: "embedhelp"
            };

            // addmoney Command options
            this.addmoney = {
              enabled: (options.addmoney == undefined ? true : (options.addmoney && typeof options.addmoney.enabled !== 'undefined' ? options.addmoney && options.addmoney.enabled : true)),
              run: "addmoneyFunction",
              alt: (options && options.addmoney && options.addmoney.alt) || [],
              help: (options && options.addmoney && options.addmoney.help) || `${language.descriptionaddmoneycommande}`,
              name: (options && options.addmoney && options.addmoney.name) || "add-money",
              usage: (options && options.addmoney && options.addmoney.usage) || null,
              exclude: Boolean((options && options.addmoney && options.addmoney.exclude)),
              masked: "addmoney"
            };

            // removemoney Command options
            this.removemoney = {
              enabled: (options.removemoney == undefined ? true : (options.removemoney && typeof options.removemoney.enabled !== 'undefined' ? options.removemoney && options.removemoney.enabled : true)),
              run: "removemoneyFunction",
              alt: (options && options.removemoney && options.removemoney.alt) || [],
              help: (options && options.removemoney && options.removemoney.help) || `${language.descriptionremovemoneycommande}`,
              name: (options && options.removemoney && options.removemoney.name) || "remove-money",
              usage: (options && options.removemoney && options.removemoney.usage) || null,
              exclude: Boolean((options && options.removemoney && options.removemoney.exclude)),
              masked: "removemoney"
            };

            // daily Command options
            this.daily = {
              enabled: (options.daily == undefined ? true : (options.daily && typeof options.daily.enabled !== 'undefined' ? options.daily && options.daily.enabled : true)),
              run: "dailyFunction",
              alt: (options && options.daily && options.daily.alt) || [],
              help: (options && options.daily && options.daily.help) || `${language.descriptiondailycommande}`,
              name: (options && options.daily && options.daily.name) || "daily",
              usage: (options && options.daily && options.daily.usage) || null,
              exclude: Boolean((options && options.daily && options.daily.exclude)),
              masked: "daily"
            };

            // monthly Command options
            this.monthly = {
              enabled: (options.monthly == undefined ? true : (options.monthly && typeof options.monthly.enabled !== 'undefined' ? options.monthly && options.monthly.enabled : true)),
              run: "monthlyFunction",
              alt: (options && options.monthly && options.monthly.alt) || [],
              help: (options && options.monthly && options.monthly.help) || `${language.descriptionmonthlycommande}`,
              name: (options && options.monthly && options.monthly.name) || "monthly",
              usage: (options && options.monthly && options.monthly.usage) || null,
              exclude: Boolean((options && options.monthly && options.monthly.exclude)),
              masked: "monthly"
            };

            // weekly Command options
            this.weekly = {
              enabled: (options.weekly == undefined ? true : (options.weekly && typeof options.weekly.enabled !== 'undefined' ? options.weekly && options.weekly.enabled : true)),
              run: "weeklyFunction",
              alt: (options && options.weekly && options.weekly.alt) || [],
              help: (options && options.weekly && options.weekly.help) || `${language.descriptionweeklycommande}`,
              name: (options && options.weekly && options.weekly.name) || "weekly",
              usage: (options && options.weekly && options.weekly.usage) || null,
              exclude: Boolean((options && options.weekly && options.weekly.exclude)),
              masked: "weekly"
            };

            // moneyhelp Command options
            this.moneyhelp = {
              enabled: (options.moneyhelp == undefined ? true : (options.moneyhelp && typeof options.moneyhelp.enabled !== 'undefined' ? options.moneyhelp && options.moneyhelp.enabled : true)),
              run: "moneyhelpFunction",
              alt: (options && options.moneyhelp && options.moneyhelp.alt) || [],
              help: (options && options.moneyhelp && options.moneyhelp.help) || `${language.descriptionmoneyhelpcommande}`,
              name: (options && options.moneyhelp && options.moneyhelp.name) || "money-help",
              usage: (options && options.moneyhelp && options.moneyhelp.usage) || null,
              exclude: Boolean((options && options.moneyhelp && options.moneyhelp.exclude)),
              masked: "moneyhelp"
            };

          this.botPrefix = (options && options.botPrefix) || "!";
          this.logging = (options && typeof options.logging !== 'undefined' ? options && options.logging : true);
          this.defaultPrefix = (options && options.defaultPrefix) || "!";
          this.channelWhitelist = (options && options.channelWhitelist) || [];
          this.channelBlacklist = (options && options.channelBlacklist) || [];
          this.commandson = (options && typeof options.commandson !== 'undefined' ? options && options.commandson : false);
  
          // Cooldown Settings
          this.cooldown = {
            enabled: (options && options.cooldown ? options && options.cooldown.enabled : true),
            timer: parseInt((options && options.cooldown && options.cooldown.timer) || 10000),
            exclude: (options && options.cooldown && options.cooldown.exclude) || ["volume","queue","pause","resume","np"]
          };
  
          this.recentTalk = new Set();
        };
        };

        var discordbotjs = new abcd(client, options);
        if (discordbotjs.commandson == true) client.commands = discordbotjs;
        else exports.bot = discordbotjs;
    
        client.on("ready", () => {
          client.user.setActivity(`${language.presence} ${config.prefix}`, {type: "WATCHING"});
		      client.user.setStatus("online");
          console.log(`------- DiscordBot.js -------\n> Version: ${PACKAGE.version}\n> Extra Logging: ${discordbotjs.logging}.\n> Node.js Version: ${process.version}\n------- DiscordBot.js -------`);
        });
    
        client.on("message", (msg) => {
          if (msg.author.bot || discordbotjs.channelBlacklist.includes(msg.channel.id)) return;
          if (discordbotjs.channelWhitelist.length > 0 && !discordbotjs.channelWhitelist.includes(msg.channel.id)) return;
          const message = msg.content.trim();
          const prefix = typeof discordbotjs.botPrefix == "object" ? (discordbotjs.botPrefix.has(msg.guild.id) ? discordbotjs.botPrefix.get(msg.guild.id).prefix : discordbotjs.defaultPrefix) : discordbotjs.botPrefix;
          const command = message.substring(prefix.length).split(/[ \n]/)[0].trim();
          const suffix = message.substring(prefix.length + command.length).trim();
          const args = message.slice(prefix.length + command.length).trim().split(/ +/g);
    
          if (message.startsWith(prefix) && msg.channel.type == "text") {
            if (discordbotjs.commands.has(command)) {
              let tCmd = discordbotjs.commands.get(command);
              if (tCmd.enabled) {
                if (!discordbotjs.cooldown.enabled == true && !discordbotjs.cooldown.exclude.includes(tCmd.masked)) {
                  if (discordbotjs.recentTalk.has(msg.author.id)) {
                    if (discordbotjs.cooldown.enabled == true && !discordbotjs.cooldown.exclude.includes(tCmd.masked)) return msg.channel.send(discordbotjs.note("fail", `${cooldowntext}`));
                  }
                  discordbotjs.recentTalk.add(msg.author.id);
                  setTimeout(() => { discordbotjs.recentTalk.delete(msg.author.id) }, discordbotjs.cooldown.timer);
                }
                return discordbotjs[tCmd.run](msg, suffix, args);
              }
            } else if (discordbotjs.aliases.has(command)) {
              let aCmd = discordbotjs.aliases.get(command);
              if (aCmd.enabled) {
                if (!discordbotjs.cooldown.enabled == true && !discordbotjs.cooldown.exclude.includes(aCmd.masked)) {
                  if (discordbotjs.recentTalk.has(msg.author.id)) {
                    if (discordbotjs.cooldown.enabled == true && !discordbotjs.cooldown.exclude.includes(aCmd.masked)) return msg.channel.send(discordbotjs.note("fail", `${cooldowntext}`));
                  }
                  discordbotjs.recentTalk.add(msg.author.id);
                  setTimeout(() => { discordbotjs.recentTalk.delete(msg.author.id) }, discordbotjs.cooldown.timer);
                }
                return discordbotjs[aCmd.run](msg, suffix, args);
              }
            };
          };
        });

        discordbotjs.helpFunction = (msg, suffix, args) => {
          const prefix = typeof discordbotjs.botPrefix == "object" ? (discordbotjs.botPrefix.has(msg.guild.id) ? discordbotjs.botPrefix.get(msg.guild.id).prefix : discordbotjs.defaultPrefix) : discordbotjs.botPrefix;
          let command = suffix.trim();
          if (!suffix) {
            if (msg.channel.permissionsFor(msg.guild.me)
              .has('EMBED_LINKS')) {
                const embed1 = new Discord.RichEmbed()
                .setColor(`${config.colorembed}`)
                .setTitle(`Aide Commande n°1`)
                  .addField(`${guildConf[msg.guild.id].prefix}server-info`, `Affiche les informations du serveur`)
                  .addField(`${guildConf[msg.guild.id].prefix}user-info`, `Afiiche vos informations non personnel`)
                  .addField(`${guildConf[msg.guild.id].prefix}bot-info`, `Affiche les informations du bot`)
                  .addField(`${guildConf[msg.guild.id].prefix}channel-info`, `Affiche les informations d'un salon`)
                  .addField(`${guildConf[msg.guild.id].prefix}role-info`, `Affiche les informations d'un rôle`)
            .addField(`${guildConf[msg.guild.id].prefix}server-list`, `Affiche les serveurs où le bot est connecté`)
            .addField(`${guildConf[msg.guild.id].prefix}server-invite`, `Commande permettant de générer un lien d'invitation du serveur`)
                  .addField(`${guildConf[msg.guild.id].prefix}kick`, `Commande permettant de kicker un membre`)
                  .addField(`${guildConf[msg.guild.id].prefix}ban`, `Commande permettant de bannir un membre`)
                  .addField(`${guildConf[msg.guild.id].prefix}report`, `Commande permettant de reporter un membre`)
                  .addField(`${guildConf[msg.guild.id].prefix}mute`, `Commande permettant de mettre en soudrine un membre`)
                  .addField(`${guildConf[msg.guild.id].prefix}unmute`, `Commande permettant d'enlever sourdine d'un membre`)
            .addField(`${guildConf[msg.guild.id].prefix}bot-vote`, `Commande permettant de voter pour DiscordBot.Js`)
              .addField(`${guildConf[msg.guild.id].prefix}chifoumi`, `Commande permettant de jouer aux chifoumi`)
                  .addField(`${guildConf[msg.guild.id].prefix}clear`, `Commande permettant de supprimer des messsages`)
                  .addField(`${guildConf[msg.guild.id].prefix}ping`, `Commande permettant d'afficher le ping`)
                  .addField(`${guildConf[msg.guild.id].prefix}say`, `Commande permettant de faire parler le bot`)
                  .addField(`${guildConf[msg.guild.id].prefix}say-markdown`, `Commande permettant de faire parler le bot avec les markdown de discord`)
            .addField(`${guildConf[msg.guild.id].prefix}logs-channel`, `Commande permettant de configurer le salon Logs\n(Veuillez renseignez l'ID du channel !)`)
            .addField(`${guildConf[msg.guild.id].prefix}setup-server`, `Commande permettant de configurer un serveur`)
            .addField(`${guildConf[msg.guild.id].prefix}embed-help`, `Aide pour crée un embed`)
                  .addField(`${guildConf[msg.guild.id].prefix}poll-help`, `Aide pour crée un sondage`)
            .addField(`${guildConf[msg.guild.id].prefix}xp-help`, `Aide pour le système d'xp`)
                  .addField(`${guildConf[msg.guild.id].prefix + config.prefixMusic}help`, `Affiche les commandes de musique`)
            msg.channel.send(embed1);
            const embed2 = new Discord.RichEmbed()
                .setColor(`${config.colorembed}`)
                .setTitle(`Aide Commande n°2`)
                  .addField(`${guildConf[msg.guild.id].prefix}new-prefix`, `Commande permettant de changer le prefix du bot`)
                  .addField(`${guildConf[msg.guild.id].prefix}money-help`, `Aide pour le système d'argent`)
                  .addField(`${guildConf[msg.guild.id].prefix}webhook-help`, `Aide pour configurer un webhook`)
                  .addField(`${guildConf[msg.guild.id].prefix}invite-list`, `Cette commande a été remplacé par ${guildConf[msg.guild.id].prefix}server-invite`)
                  .addField(`${guildConf[msg.guild.id].prefix}add-role`, `Commande permettant d'ajouter un rôle à un membre`)
                  .addField(`${guildConf[msg.guild.id].prefix}remove-role`, `Commande permettant d'enlever un rôle à un membre`)
                  .addField(`${guildConf[msg.guild.id].prefix}unban`, `Commande permettant de débannir un membre`)
                  .addField(`${guildConf[msg.guild.id].prefix}news`, `Commande permettant de recevoir des actualités de DiscordBot.Js`)
          msg.channel.send(embed2);
            } else {
              var cmdmsg = `${language.helpauthorcommands}\n${language.descriptionhelp1} ${prefix}${discordbotjs.help.name} ${language.descriptionhelp2}`;
              let index = 0;
              let max = discordbotjs.commandsArray.length;
              for (var i = 0; i < discordbotjs.commandsArray.length; i++) {
                if (!discordbotjs.commandsArray[i].disabled || !discordbotjs.commandsArray[i].exclude) {
                  cmdmsg = cmdmsg + `\n• ${discordbotjs.commandsArray[i].name}: ${discordbotjs.commandsArray[i].help}`;
                  index++;
                  if (index == discordbotjs.commandsArray.length) {
                    if (discordbotjs.messageHelp) {
                      let sent = false;
                      msg.author.send(cmdmsg, {
                          code: 'asciidoc'
                        })
                        .then(() => {
                          sent = true;
                        });
                      setTimeout(() => {
                        if (!sent) return msg.channel.send(cmdmsg, {
                          code: 'asciidoc'
                        });
                      }, 500);
                    } else {
                      return msg.channel.send(cmdmsg, {
                        code: 'asciidoc'
                      });
                    };
                  }
                };
              };
            };
          } else if (discordbotjs.commands.has(command) || discordbotjs.aliases.has(command)) {
            if (msg.channel.permissionsFor(msg.guild.me)
              .has('EMBED_LINKS')) {
              const embed = new Discord.RichEmbed();
              command = discordbotjs.commands.get(command) || discordbotjs.aliases.get(command);
              if (command.exclude) return msg.channel.send(discordbotjs.note('fail', `${suffix} ${language.errorcommand}`));
              embed.setAuthor(command.name, msg.client.user.avatarURL);
              embed.setDescription(command.help);
              if (command.alt.length > 0) embed.addField(`Aliases`, command.alt.join(", "), discordbotjs.inlineEmbeds);
              if (command.usage && typeof command.usage == "string") embed.addField(`Usage`, command.usage.replace(/{{prefix}})/g, prefix), discordbotjs.inlineEmbeds);
              embed.setColor(config.colorembed);
              msg.channel.send({
                embed
              });
            } else {
              command = discordbotjs.commands.get(command) || discordbotjs.aliases.get(command);
              if (command.exclude) return msg.channel.send(discordbotjs.note('fail', `${suffix} ${language.errorcommand}`));
              var cmdhelp = `= ${command.name} =\n`;
              cmdhelp = cmdhelp + `\n${command.help}`;
              if (command.usage !== null) cmdhelp = cmdhelp + `\nUsage: ${command.usage.replace(/{{prefix}})/g, prefix)}`;
              if (command.alt.length > 0) cmdhelp = cmdhelp + `\nAliases: ${command.alt.join(", ")}`;
              msg.channel.send(cmdhelp, {
                code: 'asciidoc'
              });
            };
          } else {
            msg.channel.send(discordbotjs.note('fail', `${suffix} ${language.errorcommand}`));
          };
        };
    
        discordbotjs.testFunction = (msg, suffix, args, ignore) => {
          // Ajouter des permissons !
          msg.reply(`${language.testtext}`);
        };

        discordbotjs.newsFunction = (msg, suffix, args, ignore) => {
        const channelexist = msg.guild.channels.find(x => x.name === "actualités-discordbotjs")
        const everyoneRole = client.guilds.get(msg.guild.id).roles.find('name', '@everyone');
        const news_name = "actualités-discordbotjs";
        if(channelexist) {
            return msg.reply(`Le salon existe dejà !`)
        }
        msg.guild.createChannel(news_name, 'text')
        .then(r => {
        r.overwritePermissions(msg.author.id, { SEND_MESSAGES: true });
        r.overwritePermissions(client.user.id, { SEND_MESSAGES: true });
        r.overwritePermissions(everyoneRole, { SEND_MESSAGES: false });
        r.send(`>>> **IMPORTANT** ne jamais supprimer ou renommer ce salon !\nSi vous renommez le nom ou supprimer le salon, Vous n'aurez pas accés aux actualités de DiscordBot.Js`)
        })
        database.findOne({
          serverID: msg.guild.id,
      }, (err, news) => {
          if (err) console.error(err);
              const newsdb = new database({
                  serverID: msg.guild.id,
                  news: "Activés",
              })});

              newsdb.save()
                  .then(result => console.log(result))
                  .catch(err => console.error(err));
        };

        discordbotjs.serverinfoFunction = (msg, suffix, args, ignore) => {
          let verifLevels = [`${language.verifylevels1}`, `${language.verifylevels2}`, `${language.verifylevels3}`, "(╯°□°）╯︵  ┻━┻", "┻━┻ミヽ(ಠ益ಠ)ノ彡┻━┻"];
        let region = {
            "brazil": `:flag_br: ${language.region1}`,
            "southafrica": `:flag_za: ${language.region2}`,
            "eu-central": `:flag_eu: ${language.region3}`,
            "europe": `:flag_eu: Europe`,
            "russia": `:flag_ru: ${language.region4}`,
            "singapore": `:flag_sg: ${language.region5}`,
            "us-central": `:flag_us: ${language.region6}`,
            "sydney": `:flag_au: Sydney`,
            "japan": `:flag_jp: ${language.region7}`,
            "us-east": `:flag_us: ${language.region8}`,
            "us-south": `:flag_us: ${language.region9}`,
            "us-west": `:flag_us: ${language.region10}`,
            "eu-west": `:flag_eu: ${language.region11}`,
            "vip-us-east": `:flag_us: VIP U.S. East ?`,
            "london": `:flag_gb: ${language.region12}`,
            "india": `:flag_in: ${language.region13}`,
            "amsterdam": `:flag_nl: Amsterdam`,
            "hongkong": `:flag_hk: Hong Kong`
        };
        var emojis;
        if (msg.guild.emojis.size === 0) {
            emojis = `${language.nonetext}`;
        } else {
            emojis = msg.guild.emojis.size;
        }
        let online = msg.guild.members.filter(member => member.user.presence.status !== 'offline');
        var verified;
        if(msg.guild.verified === false) {
            verified = `${language.nonetext}`;
        } else {
            verified = `${language.yestext}`;
        }
        var afk_channel;
        if(msg.guild.afkChannel) {
            afk_channel = msg.guild.afkChannel;
        } else {
            afk_channel = `${language.nonetext}`;
        }
        var afk_channelid;
        if(msg.guild.afkChannelID) {
            afk_channelid = msg.guild.afkChannelID;
        } else {
            afk_channelid = `${language.nonetext}`;
        }
        var avaible;
        if(msg.guild.available) {
            avaible = `${language.yestext}`;
        } else {
            avaible = `${language.nonetext}`;
        }
        const embed = new Discord.RichEmbed()
            .setColor(`${config.colorembed}`)
            .setThumbnail('' + msg.guild.iconURL + '')
            .setTitle(`${language.serveurinfotitle}`)
            .addField("Nom du serveur", `${msg.guild.name}`, true)
            .addField("ID du serveur", `${msg.guild.id}`, true)
            .addField("Propriétaire", `${msg.guild.owner}`, true)
            .addField("Région", region[msg.guild.region], true)
            .addField("Salons", `${msg.guild.channels.size}`, true)
            .addField("Emojis", `${emojis}`, true)
            .addField("Rôles", `${msg.guild.roles.size}`, true)
            .addField(`Salon AFK`, `${afk_channel}`, true)
            .addField(`ID du Salon AFK`, `${afk_channelid}`, true)
            .addField("Délai avant AFK", msg.guild.afkTimeout / 60 + ' minutes', true)
            .addField("Niveaux de vérification", verifLevels[msg.guild.verificationLevel], true)
            .addField(`Verifié`, `${verified}`, true)
            /*if(guildConf[msg.guild.id].serverinvite) {
                embed.addField(`Server invite`, `${guildConf[msg.guild.id].serverinvite}`, true)
            } else {
                embed.addField(`Server invite`, `Aucun`, true)
            }
            */
            embed.addField("Total de membres", `${msg.guild.memberCount - msg.guild.members.filter(m => m.user.bot).size}`, true)
            embed.addField("Bots", `${msg.guild.members.filter(m => m.user.bot).size}`, true)
            embed.addField("En ligne", `${online.size}`, true)
            embed.addField(`Crée le`, `${timeConverter(msg.guild.createdAt)}`, true)
            embed.addField(`Vous avez rejoind le`, `${timeConverter(msg.member.joinedAt)}`, true)
            embed.setTimestamp()
            embed.setFooter('Server info Release Version');
        msg.channel.send(embed);
        };

        discordbotjs.userinfoFunction = (msg, suffix, args, ignore) => {
        var botuser;
        if(msg.member.user.bot) {
            botuser = "Oui";
        } else {
            botuser = "Non";
        }
        const embed = new Discord.RichEmbed()
            .setColor(`${config.colorembed}`)
            .setThumbnail('' + msg.member.user.displayAvatarURL + '')
            .setTitle('Utlisateur Info')
            .addField("Pseudo", `${msg.member}`, true)
            .addField("ID", `${msg.member.id}`, true)
            .addField("Bot", `${botuser}`, true)
            .addField("Crée le", `${timeConverter(msg.member.user.createdAt)}`, true)
            .addField("Rejoind le", `${timeConverter(msg.member.joinedAt)}`, true)
            .addField("Dernier message", `${msg.member.user.lastMessage}`, true)
            .addField("Dernier message ID", `${msg.member.user.lastMessageID}`, true)
            .addField("Status", `${msg.member.user.presence.status}`, true)
            .addField("Status de jeux", `${msg.member.presence.game ? msg.member.presence.game.name : 'Aucun'}`, true)
            .addField("Rôles", `${msg.member.roles.map(roles => `${roles.name}`).join(', ')}`, true)
            .setTimestamp()
            .setFooter('User info Release Version');
        msg.channel.send(embed);
        };

        discordbotjs.botinfoFunction = (msg, suffix, args, ignore) => {
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
        msg.channel.send(embed);
        };

        discordbotjs.channelinfoFunction = (msg, suffix, args, ignore) => {
          const channel = msg.mentions.channels.first() || msg.channel;
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
        msg.channel.send(embed);
        };

        discordbotjs.roleinfoFunction = (msg, suffix, args, ignore) => {
          const role = msg.mentions.roles.first() || msg.guild.roles.get(args[0]);
        if (!role) {
            return msg.reply('Veuillez rentrez un role !');
        }
        const embed = new Discord.RichEmbed()
            .setColor(`${config.colorembed}`)
            .setTitle('Rôle Info', true)
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
        msg.channel.send(embed);
        };
        
        discordbotjs.serverlistFunction = (msg, suffix, args, ignore) => {
          let region = {
            "brazil": `:flag_br: ${language.region1}`,
            "southafrica": `:flag_za: ${language.region2}`,
            "eu-central": `:flag_eu: ${language.region3}`,
            "europe": `:flag_eu: Europe`,
            "russia": `:flag_ru: ${language.region4}`,
            "singapore": `:flag_sg: ${language.region5}`,
            "us-central": `:flag_us: ${language.region6}`,
            "sydney": `:flag_au: Sydney`,
            "japan": `:flag_jp: ${language.region7}`,
            "us-east": `:flag_us: ${language.region8}`,
            "us-south": `:flag_us: ${language.region9}`,
            "us-west": `:flag_us: ${language.region10}`,
            "eu-west": `:flag_eu: ${language.region11}`,
            "vip-us-east": `:flag_us: VIP U.S. East ?`,
            "london": `:flag_gb: ${language.region12}`,
            "india": `:flag_in: ${language.region13}`,
            "amsterdam": `:flag_nl: Amsterdam`,
            "hongkong": `:flag_hk: Hong Kong`
        };
        msg.channel.send(client.guilds.map(r => r.name + ` | **${r.memberCount}** membres | Propriétaire **${r.owner ? r.owner.displayName : 'Aucun'}** | Région **${region[r.region]}** | Invitation **${language.nonetext}** | Actualités DiscordBot.Js: **${language.nonetext}**`))
        };
        
        discordbotjs.serverinviteFunction = async (msg, suffix, args, ignore) => {
          if (!msg.member.hasPermission('CREATE_INSTANT_INVITE')) return msg.reply("Désolé, Vous n'avez pas les permissions !");
        const invite = await msg.channel.createInvite({
            maxAge: 0,
            maxUses: 0
        })
        msg.channel.send(`Lien d'invitation: https://${language.nonetext}`);
        console.log(`${msg.guild.name} (${msg.guild.id}) a crée une invitation ${invite}`)
        };
        
        discordbotjs.webhookcreateFunction = (msg, suffix, args, ignore) => {
          if (!msg.member.hasPermission('MANAGE_WEBHOOKS')) return msg.reply("Désolé, Vous n'avez pas les permissions !");
        webhookurl = args[0];
        webhookusername = args.slice(1).join(' ');
        if(!webhookurl) return msg.reply(`Vous devez spécifier l'url de l'avatar du webhook !`)
        if(!webhookusername) return msg.reply(`Vous devez spécifier le nom du webhook !`)
        msg.channel.createWebhook(webhookusername, webhookurl)
        .then(webhook => webhook.edit(webhookusername, webhookurl)
        .then(wb => msg.author.send(`Vous avez crée un webhook !\nLe lien permet d'avoir différentes informations sur le webhook comme l'ID et le TOKEN\nLien du webhook: https://discordapp.com/api/webhooks/${wb.id}/${wb.token}\n**ATTENTION** vous ne devez jamais divulgez le TOKEN et l'ID du Webhook à d'autre personne !`)).catch(console.error))
        };
        
        discordbotjs.webhookconfigsendFunction = (msg, suffix, args, ignore) => {
        if (!msg.member.hasPermission('MANAGE_WEBHOOKS')) return msg.reply("Désolé, Vous n'avez pas les permissions !");
        webhookid = args[0];
        webhooktoken = args[1];
        if(!webhookid) return msg.reply(`Vous devez spécifier l'ID du webhook !`)
        if(!webhooktoken) return msg.reply(`Vous devez spécifier le TOKEN de webhook !`)
        msg.reply(`Le TOKEN et l'ID sont maintenant enregistré dans la base de donnée`)
        };
        
        discordbotjs.webhooksendFunction = (msg, suffix, args, ignore) => {
          if (!msg.member.hasPermission('MANAGE_WEBHOOKS')) return msg.reply("Désolé, Vous n'avez pas les permissions !");
        //if(!guildConf[message.guild.id].webhookid & guildConf[message.guild.id].webhooktoken) return message.reply(`Vous devez configurez le webhook !\nFaites la commande ${discordbotjs.botPrefix}webhook-config-send`)
        webhooksendtext = args.slice(0).join(' ');
        if(!webhooksendtext) return msg.reply(`Vous devez spécifier un texte !`)
        //Hook.login(guildConf[message.guild.id].webhookid, guildConf[message.guild.id].webhooktoken)
        Hook.setPayload({
            "content": webhooksendtext
        })
        Hook.fire()
            .then(response_object => {
        })
            .catch(error => {
            throw error;
        })
        };
        
        discordbotjs.webhookhelpFunction = (msg, suffix, args, ignore) => {
          const embed = new Discord.RichEmbed()
		      .setColor(`${config.colorembed}`)
          .setTitle('Aide Webhook')
          .setDescription(`**ATTENTION** vous ne devez jamais divulgez le TOKEN et l'ID du Webhook à d'autre personne !`)
          .addField(`${discordbotjs.botPrefix}webhook-create`, `Commande permettant de crée un webhook\nExemple: ${discordbotjs.botPrefix}webhook-create https://i.imgur.com/kYMFIh8.png DiscordBot.Js`)
          .addField(`${discordbotjs.botPrefix}webhook-config-send`, `Commande permettant de configurer le webhook\nExemple: ${discordbotjs.botPrefix}webhook-config-send ID TOKEN`)
          .addField(`${discordbotjs.botPrefix}webhook-send`, `Commande permettant d'envoyer un message avec le webhook`)
		      .setTimestamp()
          .setFooter('Webhook Beta Version');
          msg.channel.send(embed)
        };
        
        discordbotjs.addroleFunction = (msg, suffix, args, ignore) => {
          if (!msg.member.hasPermission('MANAGE_ROLES_OR_PERMISSIONS')) return msg.reply("Désolé, Vous n'avez pas les permissions !");
          const member = msg.mentions.members.first() || msg.guild.members.get(args[0]) || msg.member;
          let role = msg.mentions.roles.first() || msg.guild.roles.get(args[0]);
          if (!role) return msg.reply(`Le rôle ${name} n'existe pas sur le serveur`);
          let botRolePosition = msg.guild.member(client.user).highestRole.position;
          let rolePosition = role.position;
          let userRolePossition = msg.member.highestRole.position;
          if (userRolePossition <= rolePosition) return msg.channel.send("Échec de l'ajout du rôle à l'utilisateur car votre rôle est inférieur au rôle spécifié.")
          if (botRolePosition <= rolePosition) return msg.channel.send("Échec de l'ajout du rôle à l'utilisateur car mon rôle est inférieur au rôle spécifié.");
          member.addRole(role);
          if(member.id === msg.author.id) {msg.channel.send(`**${msg.author}**, Vous vous êtes mis le rôle **${role}**.`);} else {
          msg.channel.send(`**${msg.author}**, Vous avez ajoutés le rôle **${role}** à **${member}**.`);}
        };
        
        discordbotjs.removeroleFunction = (msg, suffix, args, ignore) => {
        if (!msg.member.hasPermission('MANAGE_ROLES_OR_PERMISSIONS')) return msg.reply("Désolé, Vous n'avez pas les permissions !");
        const member = msg.mentions.members.first() || msg.guild.members.get(args[0]) || msg.member;
        let role = msg.mentions.roles.first() || msg.guild.roles.get(args[0]);
        let botRolePosition = msg.guild.member(client.user).highestRole.position;
        let rolePosition = role.position;
        if (botRolePosition <= rolePosition) return msg.channel.send("Échec de l'enlevement du rôle à l'utilisateur car mon rôle est inférieur au rôle spécifié.");
        member.removeRole(role);
        if(member.id === msg.author.id) {msg.channel.send(`**${msg.author}**, Vous vous êtes enlever le rôle **${role}**.`);} else {
        msg.channel.send(`**${msg.author}**, Vous avez enlever le rôle **${role}** à **${member}**.`);}
        };
        
        discordbotjs.kickFunction = (msg, suffix, args, ignore) => {
          if (!msg.member.hasPermission('KICK_MEMBERS'))
	  return msg.reply("Désolé, Vous n'avez pas les permissions !");

	  let target = msg.guild.member(msg.mentions.users.first() || msg.guild.members.get(args[0]))
	  let reason = args.slice(1).join(' ');

	  if(!target) return msg.reply("S'il vous plait mentionné un membre valide !");

	  if(!target.kickable) return msg.reply("Je ne peut pas kicker ce membre !\nai-je les permissions pour kicker des membres ?");

	  if(!reason) reason = "Aucune Raison";

	  const embed_kick_msg = new Discord.RichEmbed()
		  .setColor(`${config.colorembed}`)
		  .setTitle('Vous avez était kicker !')
		  .addField("Auteur", `${msg.author}`)
		  .addField("Auteur ID", `${msg.author.id}`)
		  .addField("Serveur", `${msg.guild.name}`)
		  .addField("Serveur ID", `${msg.guild.id}`)
		  .addField("Salon", `${msg.channel.name}`)
		  .addField("Salon ID", `${msg.channel.id}`)
		  .addField("Raison", `${reason}`)
		  .setTimestamp()
		  .setFooter('Kick Release Version');

	  target.send(embed_kick_msg);
	  console.log(`${msg.author.tag}` + " a kicker " + `${target.user.username}` + " car: " + `${reason}`)
	  setTimeout(function(){ 
		target.kick(reason)
	}, 1000);
        };
        
        discordbotjs.banFunction = (msg, suffix, args, ignore) => {
          if (!msg.member.hasPermission('BAN_MEMBERS'))
	  return msg.reply("Désolé, Vous n'avez pas les permissions !");

	  let target = msg.guild.member(msg.mentions.users.first() || msg.guild.members.get(args[0]))
	  let reason = args.slice(1).join(' ');

	  if(!target) return msg.reply("S'il vous plait mentionné un membre valide !");

	  if(!target.bannable) return msg.reply("Je ne peut pas bannir ce membre !\nai-je les permissions pour bannir des membres ?");

	  if(!reason) reason = "Aucune Raison";

	  const embed_ban_msg = new Discord.RichEmbed()
		  .setColor(`${config.colorembed}`)
		  .setTitle('Vous avez était bannie !')
		  .addField("Auteur", `${msg.author}`)
		  .addField("Auteur ID", `${msg.author.id}`)
		  .addField("Serveur", `${msg.guild.name}`)
		  .addField("Serveur ID", `${msg.guild.id}`)
		  .addField("Salon", `${msg.channel.name}`)
		  .addField("Salon ID", `${msg.channel.id}`)
		  .addField("Raison", `${reason}`)
		  .setTimestamp()
		  .setFooter('Ban Release Version');

	  target.send(embed_ban_msg);
	  console.log(`${msg.author.tag}` + " a bannie " + `${target.user.username}` + " car: " + `${reason}`)
	  setTimeout(function(){ 
		target.ban(reason)
	}, 1000);
        };
        
        discordbotjs.unbanFunction = (msg, suffix, args, ignore) => {
          if (!msg.member.hasPermission('BAN_MEMBERS'))
	  return msg.reply("Désolé, Vous n'avez pas les permissions !");

	  let target = args[0];
      
      if (!target) return msg.reply("Vous devez spécifier l'ID de l'utilisateur !")

        msg.guild.unban(target).catch(e =>{
            if(e){
              return msg.channel.send(`${client.users.get(`${args[0]}`).username} n'est pas bannie`);
            } else {
                return msg.channel.send(`${client.users.get(`${args[0]}`).username} n'est pas sur le serveur`);
            }
        })
        console.log(`${msg.author.tag} a débannie ${target}`)
        };
        
        discordbotjs.reportFunction = async (msg, suffix, args, ignore) => {
    let target = msg.guild.member(msg.mentions.users.first() || msg.guild.members.get(args[0]))
    let reportRole = msg.guild.roles.find(x => x.name === "Reported");
    let reason = args.slice(1).join(' ');
    
    if(!reportRole) {
        try{
            reportRole = await msg.guild.createRole({
                name: "Reported",
                color: "#514f48",
                permissions: []
            })
            msg.guild.channels.forEach(async (channel, id) => {
                await channel.overwritePermissions(reportRole, {
                })
            })
        } catch(e) {
            console.log(e.stack);
        }
    }

	if(!target) return msg.reply("S'il vous plait mentionné un membre valide !");
	if(!reason) reason = "Aucune Raison";

	const embed_report = new Discord.RichEmbed()
		  .setColor(`${config.colorembed}`)
		  .setTitle('Logs Report')
		  .addField("Membre", `${target.user}`)
		  .addField("Membre ID", `${target.user.id}`)
		  .addField("Auteur", `${msg.author}`)
		  .addField("Auteur ID", `${msg.author.id}`)
		  .addField("Raison", `${reason}`)
		.setTimestamp()
		.setFooter('Report Release Version');

	const embed_report_msg = new Discord.RichEmbed()
		  .setColor(`${config.colorembed}`)
		  .setTitle('Vous avez était reporté !')
		  .addField("Auteur", `${msg.author}`)
		  .addField("Auteur ID", `${msg.author.id}`)
		  .addField("Serveur", `${msg.guild.name}`)
		  .addField("Serveur ID", `${msg.guild.id}`)
		  .addField("Salon", `${msg.channel.name}`)
		  .addField("Salon ID", `${msg.channel.id}`)
		  .addField("Raison", `${reason}`)
		  .setTimestamp()
		  .setFooter('Report Release Version');

			target.addRole(reportRole)
	const LogsChannel = msg.guild.channels.find(channel => channel.name === "📄logs");
            const LogsChannelID = msg.guild.channels.get(config.logs_channel)
            if (LogsChannel) {
            LogsChannel.send(embed_report)
            }
            else if(!LogsChannel) {
            if (!LogsChannelID) return msg.reply("Impossible de trouver le salon Logs !");
            LogsChannelID.send(embed_report)
            }
	msg.channel.send(`Signalement effectué ${msg.author} !`);
	target.send(embed_report_msg);
    console.log(`${msg.author.username}` + " a reporté " + `${target.user.username}` + " car: " + `${reason}`)
        };
        
        discordbotjs.muteFunction = async (msg, suffix, args, ignore) => {
          if (!msg.member.hasPermission(["MANAGE_ROLES", "MUTE_MEMBERS", "MANAGE_CHANNELS"]))
	  return msg.reply("Désolé, Vous n'avez pas les permissions !");

	  let target = msg.guild.member(msg.mentions.users.first() || msg.guild.members.get(args[0]))
	  let muteRole = msg.guild.roles.find(x => x.name === "Muted");
	  let reason = args.slice(1).join(' ');

		  if(!muteRole) {
			try{
				muteRole = await msg.guild.createRole({
					name: "Muted",
					color: "#514f48",
					permissions: []
				})
				msg.guild.channels.forEach(async (channel, id) => {
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

	  if(!target) return msg.reply("S'il vous plait mentionné un membre valide !");

	  if(!reason) reason = "Aucune Raison";

	  const embed1 = new Discord.RichEmbed()
		  .setColor(`${config.colorembed}`)
		  .setTitle('Vous êtes mute !')
		  .addField("Auteur", `${msg.author}`)
		  .addField("Auteur ID", `${msg.author.id}`)
		  .addField("Serveur", `${msg.guild.name}`)
		  .addField("Serveur ID", `${msg.guild.id}`)
		  .addField("Salon", `${msg.channel.name}`)
		  .addField("Salon ID", `${msg.channel.id}`)
		  .addField("Raison", `${reason}`)
		  .setTimestamp()
		  .setFooter('Mute Release Version');

		  const embed3 = new Discord.RichEmbed()
		  .setColor(`${config.colorembed}`)
		  .setTitle('Logs Mute')
		  .addField("Auteur", `${msg.author}`)
		  .addField("Auteur ID", `${msg.author.id}`)
		  .addField("Salon", `${msg.channel.name}`)
		  .addField("Salon ID", `${msg.channel.id}`)
		  .addField("Raison", `${reason}`)
		  .setTimestamp()
		  .setFooter('Mute Release Version');

		  if (!target.roles.has(muteRole.id)) {
			target.addRole(muteRole)
				target.send(embed1);
				const LogsChannel = msg.guild.channels.find(channel => channel.name === "📄logs");
            			const LogsChannelID = msg.guild.channels.get(config.logs_channel)
            				if (LogsChannel) {
                				LogsChannel.send(embed3)
            				}
            				else if(!LogsChannel) {
            					if (!LogsChannelID) return msg.reply("Impossible de trouver le salon Logs !");
                					LogsChannelID.send(embed3)
            				}
				console.log(`${msg.author.username}` + " a mute " + `${target.user.username}` + " car: " + `${reason}`)
			} else {
				msg.channel.send(target + ` est déjà mute !`);
			  }
        };
        
        discordbotjs.unmuteFunction = async (msg, suffix, args, ignore) => {
          if (!msg.member.hasPermission(["MANAGE_ROLES", "MUTE_MEMBERS", "MANAGE_CHANNELS"]))
	  return msg.reply("Désolé, Vous n'avez pas les permissions !");

	  let target = msg.guild.member(msg.mentions.users.first() || msg.guild.members.get(args[0]))
	  let muteRole = msg.guild.roles.find(x => x.name === "Muted");
	  let reason = args.slice(1).join(' ');

	  if(!target) return msg.reply("S'il vous plait mentionné un membre valide !");

	  if(!reason) reason = "Aucune Raison";

		  const embed2 = new Discord.RichEmbed()
		  .setColor(`${config.colorembed}`)
		  .setTitle(`Vous n'êtes plus mute !`)
		  .addField("Auteur", `${msg.author}`)
		  .addField("Auteur ID", `${msg.author.id}`)
		  .addField("Serveur", `${msg.guild.name}`)
		  .addField("Serveur ID", `${msg.guild.id}`)
		  .addField("Salon", `${msg.channel.name}`)
		  .addField("Salon ID", `${msg.channel.id}`)
		  .addField("Raison", `${reason}`)
		  .setTimestamp()
		  .setFooter('Unmute Release Version');

		  const embed4 = new Discord.RichEmbed()
		  .setColor(`${config.colorembed}`)
		  .setTitle(`Logs Unmute:`)
		  .addField("Auteur", `${msg.author}`)
		  .addField("Auteur ID", `${msg.author.id}`)
		  .addField("Salon", `${msg.channel.name}`)
		  .addField("Salon ID", `${msg.channel.id}`)
		  .addField("Raison", `${reason}`)
		  .setTimestamp()
		  .setFooter('Unmute Release Version');

		  if (target.roles.has(muteRole.id)) {
			target.removeRole(muteRole)
				target.send(embed2);
				const LogsChannel = msg.guild.channels.find(channel => channel.name === "📄logs");
            			const LogsChannelID = msg.guild.channels.get(config.logs_channel)
            				if (LogsChannel) {
                				LogsChannel.send(embed4)
            				}
            				else if(!LogsChannel) {
            					if (!LogsChannelID) return msg.reply("Impossible de trouver le salon Logs !");
                					LogsChannelID.send(embed4)
            				}
				console.log(`${msg.author.username}` + " a unmute " + `${target.user.username}` + " car: " + `${reason}`)
			} else {
				msg.channel.send(target + ` n'as pas était mute !`);
			  }
        };
        
        discordbotjs.botvoteFunction = (msg, suffix, args, ignore) => {
        const embed = new Discord.RichEmbed()
        .setColor(`${config.colorembed}`)
        .setTitle(`Voter pour DiscordBot.Js`)
        .setDescription(`Voter sur top.gg: https://top.gg/bot/629968935709835284/vote`)
        msg.channel.send(embed);
        };
        
        discordbotjs.rpsFunction = (msg, suffix, args, ignore) => {
        let replies = ['💎', '📰', '✂️'];
        let result = Math.floor((Math.random() * replies.length));
        let uReply = "";
        msg.reply(`Réagissez aux émoji :gem: ou :newspaper: ou :scissors: !`)
        msg.react(`💎`)
        msg.react(`📰`)
        msg.react(`✂️`)
        msg.awaitReactions((reaction, user) => user.id === msg.author.id && (reaction.emoji.name === '💎' || reaction.emoji.name === '📰' || reaction.emoji.name === '✂️'),
                            { max: 1, time: 30000 }).then(collected => {
                                    if (collected.first().emoji.name === '💎') {
                                            if (replies[result] === '📰') return msg.channel.send(`J'ai gagnés !`);
                                            else return msg.channel.send('Tu as gagnés !');
                                    }
                                    if (collected.first().emoji.name === '📰') {
                                            if (replies[result] === '✂️') return msg.channel.send(`J'ai gagnés !`);
                                            else return msg.channel.send('Tu as gagnés !');
                                    }
                                    if (collected.first().emoji.name === '✂️') {
                                            if (replies[result] === '💎') return msg.channel.send(`J'ai gagnés !`);
                                            else return msg.channel.send('Tu as gagnés !');
                                    }
                                    }).catch(collected => {
                                        msg.reply('Aucune réaction après 30 secondes, opération annulée');
                            });
        };
        
        discordbotjs.clearFunction = async (msg, suffix, args, ignore) => {
        if (!msg.member.hasPermission('MANAGE_message')) return msg.reply("Désolé, Vous n'avez pas les permissions !");
		    const deleteCount = parseInt(args[0], 10);
		    if(!deleteCount || deleteCount < 2 || deleteCount > 100) return msg.reply("S'il vous plait entrez le nombre de message que vous voulez supprimer entre 2 est 100 !");
		    const fetched = await msg.channel.fetchMessages({limit: deleteCount});
		    msg.channel.bulkDelete(fetched)
		    .catch(error => msg.reply(`Je ne peut pas supprimer des messages car: ${error}`));
        };
        
        discordbotjs.pingFunction = (msg, suffix, args, ignore) => {
          const embed = new Discord.RichEmbed()
	        .setColor(`${config.colorembed}`)
	        .setTitle(`Ping Info`)
	        .setDescription(`Temp de latence avec le serveur ${msg.createdTimestamp - Date.now()} ms\nTemp de latence avec l'API de Discord ${Math.round(client.ping)} ms`)
	        msg.channel.send(embed);
        };
        
        discordbotjs.sayFunction = (msg, suffix, args, ignore) => {
          if (!msg.member.hasPermission('MANAGE_MESSAGES'))
	        return msg.reply("Désolé, Vous n'avez pas les permissions !");
	        const sayMessage = args.join(` `);
	        if(!sayMessage) return msg.reply("Veuillez spécifiez du texte")
	        msg.delete().catch();
	        msg.channel.send(sayMessage + `\nMessage de ${msg.author}`);
          };
          
          discordbotjs.saymarkdownFunction = (msg, suffix, args, ignore) => {
            const embed = new Discord.RichEmbed()
		        .setColor(`${config.colorembed}`)
		        .setTitle(`Markdown Help`)
		        .addField(`${discordbotjs.botPrefix}say-italic`, `*Italic*`)
		        .addField(`${discordbotjs.botPrefix}say-bold`, `**Gras**`)
		        .addField(`${discordbotjs.botPrefix}say-underline`, `__Souligné__`)
		        .addField(`${discordbotjs.botPrefix}say-strikethrough`, `~~Barré~~`)
		        .addField(`${discordbotjs.botPrefix}say-quotes`, `>>> Citations`)
		        .addField(`${discordbotjs.botPrefix}say-spoiler`, `||Spoiler||`)
		        .addField(`${discordbotjs.botPrefix}say-code`, `Visualisation Impossible`)
		        .addField(`${discordbotjs.botPrefix}say-code-block`, `Visualisation Impossible`)
		        .addField(`${discordbotjs.botPrefix}say-code-color`, `Pour effectuer cette commande, vous devez sauter une ligne après la langue définie !\nExemple: ${discordbotjs.botPrefix}say-code-color Js ou autre langage\nVotre code en Js ou autre langage`)
		        .setTimestamp()
		        .setFooter('Markdown Release Version');
		        msg.channel.send(embed);
          };

          discordbotjs.sayitalicFunction = (msg, suffix, args, ignore) => {
            const sayMessage = args.join(` `);
            if(!sayMessage) return msg.reply("Veuillez spécifiez du texte")
            msg.delete().catch();
            msg.channel.send("*" + `${sayMessage}` + "*" + `\nMessage de ${msg.author}`);
          };

          discordbotjs.sayboldFunction = (msg, suffix, args, ignore) => {
            const sayMessage = args.join(` `);
            if(!sayMessage) return msg.reply("Veuillez spécifiez du texte")
            msg.delete().catch();
            msg.channel.send("**" + `${sayMessage}` + "**" + `\nMessage de ${msg.author}`);
          };

          discordbotjs.sayunderlineFunction = (msg, suffix, args, ignore) => {
            const sayMessage = args.join(` `);
            if(!sayMessage) return msg.reply("Veuillez spécifiez du texte")
            msg.delete().catch();
            msg.channel.send("__" + `${sayMessage}` + "__" + `\nMessage de ${msg.author}`);
          };

          discordbotjs.saystrikethroughFunction = (msg, suffix, args, ignore) => {
            const sayMessage = args.join(` `);
            if(!sayMessage) return msg.reply("Veuillez spécifiez du texte")
            msg.delete().catch();
            msg.channel.send("~~" + `${sayMessage}` + "~~" + `\nMessage de ${msg.author}`);
          };

          discordbotjs.sayquotesFunction = (msg, suffix, args, ignore) => {
            if(!sayMessage) return msg.reply("Veuillez spécifiez du texte")
            msg.delete().catch();
            msg.channel.send(">>> " + `${sayMessage}` + `\nMessage de ${msg.author}`);
          };

          discordbotjs.sayspoilerFunction = (msg, suffix, args, ignore) => {
            const sayMessage = args.join(` `);
            if(!sayMessage) return msg.reply("Veuillez spécifiez du texte")
            msg.delete().catch();
            msg.channel.send("||" + `${sayMessage}` + "||" + `\nMessage de ${msg.author}`);
          };

          discordbotjs.saycodeFunction = (msg, suffix, args, ignore) => {
            const sayMessage = args.join(` `);
            if(!sayMessage) return msg.reply("Veuillez spécifiez du texte")
            msg.delete().catch();
            msg.channel.send("`" + `${sayMessage}` + "`" + `\nMessage de ${msg.author}`);
          };

          discordbotjs.saycodeblockFunction = (msg, suffix, args, ignore) => {
            const sayMessage = args.join(` `);
            if(!sayMessage) return msg.reply("Veuillez spécifiez du texte")
            msg.delete().catch();
            msg.channel.send("```\n" + `${sayMessage}` + "\n```" + `\nMessage de ${msg.author}`);
          };

          discordbotjs.saycodecolorFunction = (msg, suffix, args, ignore) => {
            const sayColor = args.slice(0).join(' ');
            const sayMessage = args.slice(1).join(' ');
            if(!sayMessage) return msg.reply("Veuillez spécifiez du texte")
            msg.delete().catch();
            msg.channel.send("```" + `${sayColor}` + "\n" + `${sayMessage}` +"\n```" + `\nMessage de ${msg.author}`);
          };

          discordbotjs.logschannelFunction = (msg, suffix, args, ignore) => {
            const channelmention = msg.mentions.channels.first() || msg.channel;
            if (!msg.member.hasPermission('VIEW_AUDIT_LOG')) return msg.reply("Désolé, Vous n'avez pas les permissions !");
            if (!channelmention) return msg.reply("Vous devez spécifier un salon valide !");
            msg.channel.send(`Les logs sont maintenant activés !\nSalon Logs: ${channelmention}`);
          };

          discordbotjs.pollsimpleFunction = (msg, suffix, args, ignore) => {
            let splitCommand = msg.content.split(" ");
    let time = parseFloat(splitCommand.slice(1).shift());
    let question = splitCommand.slice(2) + '';
    if (lastChar(question) != "?") {
      question += "?"
    }
    if (!(isNaN(time)) && (time <= 720)) {
      if (time >= 1) {
        msg.channel.send('`'+msg.author.username+'`'+' a commencé le sondage `'+question.replace(/,/g, ' ')+'` le sondage prend fin dans '+time+' minutes.')
          .then(async function (msg) {
            let reactionArray = [];
            reactionArray[0] = await msg.react(emojiList[0]);
            reactionArray[1] = await msg.react(emojiList[1]);

            if (time) {
              msg.channel.fetchMessage(msg.id)
                .then(async function (msg) {
                  await sleep(time*60000)
                  var reactionCountsArray = [];                               
                  for (var i = 0; i < reactionArray.length; i++) {
                    reactionCountsArray[i] = msg.reactions.get(emojiList[i]).count-1;
                  }

                  var max = -Infinity, indexMax = [];
                  for(var i = 0; i < reactionCountsArray.length; ++i)
                    if(reactionCountsArray[i] > max) max = reactionCountsArray[i], indexMax = [i];
                    else if(reactionCountsArray[i] === max) indexMax.push(i);

                  var winnersText = "";
                  if (reactionCountsArray[indexMax[0]] == 0) {
                    winnersText = "Aucun vote !"
                  } else {
                    for (var i = 0; i < indexMax.length; i++) {
                      winnersText += emojiList[indexMax[i]] + " : " + reactionCountsArray[indexMax[i]] + " vote(s)\n";
                    }
                  }
                  msg.channel.send("**Résultat pour `"+question.replace(/,/g, ' ')+"`:** " + winnersText);
                });
            }
          })
      } else {
        msg.channel.send(`Impossible de commencer le sondage car le sondage ne peut pas durer moins d'une minute !`);
      }
    } else {
      msg.channel.send(`Impossible de commencer le sondage car le sondage ne peut pas durer plus de 12 heure !`);
    }
          };

          discordbotjs.polladvancedFunction = (msg, suffix, args, ignore) => {
            let splitCommand = msg.content.split(" ");
    let time = parseFloat(splitCommand.slice(1).shift());
    let secondSection = (splitCommand.slice(2) + '').replace(/,/g, ' ');
    let secondSectionSplitted = secondSection.split(';');
    let question = secondSectionSplitted.slice(-1)[0]
    let options = secondSectionSplitted.slice(0, secondSectionSplitted.length-1)
    if (options.length > 20) {
      options = options.slice(0, 20)
    }
    if (lastChar(question) != "?") {
      question += "?"
    }
    if (!(isNaN(time)) && (time <= 720)) {
      if (time >= 1) {
        let optionText = ""
        let count = 0;
        for (var option in options) {
          optionText += "\n"+emojiLetterList[count]+" - "+options[option]
          count += 1
        }
        msg.channel.send('`'+msg.author.username+'`'+' a commencé le sondage `'+question+'` le sondage prend fin dans '+time+' minutes.'+optionText)
          .then(async function (msg) {
            let reactionArray = [];
            let count = 0;
            for (var option in options) {
              reactionArray[count] = await msg.react(emojiLetterList[count]);
              count += 1
            }

            if (time) {
              msg.channel.fetchMessage(msg.id)
                .then(async function (msg) {
                  await sleep(time*60000)
                  var reactionCountsArray = [];                               
                  for (var i = 0; i < reactionArray.length; i++) {
                    reactionCountsArray[i] = msg.reactions.get(emojiLetterList[i]).count-1;
                  }

                  var max = -Infinity, indexMax = [];
                  for(var i = 0; i < reactionCountsArray.length; ++i)
                    if(reactionCountsArray[i] > max) max = reactionCountsArray[i], indexMax = [i];
                    else if(reactionCountsArray[i] === max) indexMax.push(i);

                  var winnersText = "";
                  if (reactionCountsArray[indexMax[0]] == 0) {
                    winnersText = "Aucun Vote !"
                  } else {
                    for (var i = 0; i < indexMax.length; i++) {
                      winnersText += emojiLetterList[indexMax[i]] + ": " + options[indexMax[i]] + " : " + reactionCountsArray[indexMax[i]] + " vote(s)\n";
                    }
                  }
                  msg.channel.send("**Résultat pour `"+question+"`:** \n" + winnersText);
                });
            }
          })
      } else {
        msg.channel.send(`Impossible de commencer le sondage car le sondage ne peut pas durer moins d'une minute !`);
      }
    } else {
      msg.channel.send(`Impossible de commencer le sondage car le sondage ne peut pas durer plus de 12 heure !`);
    }
          };

          discordbotjs.pollhelpFunction = (msg, suffix, args, ignore) => {
            const embedpollhelp = new Discord.RichEmbed()
            .setColor(`${config.colorembed}`)
            .setTitle('Aide Sondage')
            .addField(`${discordbotjs.botPrefix}poll-info`, `Commande permettant de crée un sondage en répondant avec ✅ ou ❎\nExemple: **${discordbotjs.botPrefix}poll-simple <Le temps en minutes> <La question>**`)
            .addField(`${discordbotjs.botPrefix}poll-create`, `Commande permettant de crée un sondage en répondant avec des options (chat, éléphant...)\nExemple: **${discordbotjs.botPrefix}poll-advanced <Le temps en minutes> <Les options en les séparant avec ;>;<La question>**\nRésultat: **${discordbotjs.botPrefix}poll-advanced 5 Javascript:Python;Javascript ou Pyhton ?**`)
            .setTimestamp()
            .setFooter('Sondage Beta Version');
        msg.channel.send(embedpollhelp)
          };

          discordbotjs.leaderboardFunction = async (msg, suffix, args, ignore) => {
            const member = msg.mentions.members.first() || msg.guild.members.get(args[0]);
            const rawLeaderboard = await Levels.fetchLeaderboard(msg.guild.id, 3); 
            if (rawLeaderboard.length < 1) return reply("Aucun membre est défini dans le classement !");
            const leaderboard = Levels.computeLeaderboard(client, rawLeaderboard);
            const lb = leaderboard.map(e => `${e.position}. ${e.username}#${e.discriminator}\nNiveau: ${e.level}\nXP: ${e.xp.toLocaleString()}`);
            if(member) {
            const lvloutput = await Levels.fetch(member.id, msg.guild.id);
            const embedxpstats1 = new Discord.RichEmbed()
            .setColor(`${config.colorembed}`)
            .setTitle('Xp Stats')
            .setDescription(`${member}`)
            .addField(`Niveaux`, `${lvloutput.level}`)
            .addField(`Xp`, `${lvloutput.xp}`)
            .setTimestamp()
            .setFooter('Xp Release Version');
            msg.channel.send(embedxpstats1)
            } else {
            const embedxpstats2 = new Discord.RichEmbed()
            .setColor(`${config.colorembed}`)
            .setTitle('Classement')
            .setDescription(`${lb.join("\n")}`)
            .setTimestamp()
            .setFooter('Xp Release Version');
            msg.channel.send(embedxpstats2)
          }
          };

          discordbotjs.xpsetxpFunction = async (msg, suffix, args, ignore) => {
            if (!msg.member.hasPermission(["ADMINISTRATOR"])) return msg.reply("Désolé, Vous n'avez pas les permissions !");
            let user = msg.mentions.users.first();
            let amount = args[1];
            if(!user) return msg.reply(`Vous devez mentionné un membre !`)
            Levels.setXp(user.id, msg.guild.id, amount);
            const embedsetxp = new Discord.RichEmbed()
            .setColor(`${config.colorembed}`)
            .setTitle('Xp Reçue')
	          .setDescription(`${user}`)
            .addField(`Xp Définie`, `${amount}`)
            .addField(`Auteur`, `${msg.author}`)
            .setTimestamp()
            .setFooter('Xp Release Version');
            msg.channel.send(embedsetxp)
          };

          discordbotjs.xpsetlevelFunction = (msg, suffix, args, ignore) => {
            if (!msg.member.hasPermission(["ADMINISTRATOR"])) return msg.reply("Désolé, Vous n'avez pas les permissions !");
            let user = msg.mentions.users.first();
            let amount = args[1];
            if(!user) return msg.reply(`Vous devez mentionné un membre !`)
            Levels.setLevel(user.id, msg.guild.id, amount);
            const embedsetlevel = new Discord.RichEmbed()
            .setColor(`${config.colorembed}`)
            .setTitle('Niveaux Reçue')
	          .setDescription(`${user}`)
            .addField(`Niveaux Définie`, `${amount}`)
            .addField(`Auteur`, `${msg.author}`)
            .setTimestamp()
            .setFooter('Xp Release Version');
            msg.channel.send(embedsetlevel)
          };

          discordbotjs.xpdeleteFunction = (msg, suffix, args, ignore) => {
            if (!msg.member.hasPermission(["ADMINISTRATOR"])) return msg.reply("Désolé, Vous n'avez pas les permissions !");
            let user = msg.mentions.users.first()
            if (!user) return msg.reply(`S'il vous plait mentionné un membre valide qui se trouve dans la base de donnée !`)
            Levels.deleteUser(user.id, msg.guild.id);
            msg.reply(`Le membre a bien était éffacé de la base de donnée`);
          };

          discordbotjs.xphelpFunction = (msg, suffix, args, ignore) => {
            const xphelp = new Discord.RichEmbed()
            .setColor(`${config.colorembed}`)
            .setTitle('Aide Xp')
            .addField(`${discordbotjs.botPrefix}xp-leaderboard`, `Commande permettant d'afficher le classement d'un/des membre(s)\nDeux façons de l'utiliser: ${discordbotjs.botPrefix}xp-leaderboard ou\n${discordbotjs.botPrefix}xp-leaderboard nom de la personne.`)
            .addField(`${discordbotjs.botPrefix}xp-setxp`, `Commande permettant de définir le nombre d'xp d'un membre`)
            .addField(`${discordbotjs.botPrefix}xp-setlevel`, `Commande permettant de définir le nombre de niveaux d'un membre`)
            .addField(`${discordbotjs.botPrefix}xp-delete`, `Commande permettant de supprimer un membre de la base de donnée`)
            .setTimestamp()
            .setFooter('Xp Release Version');
        msg.channel.send(xphelp)
          };

          discordbotjs.setupserverFunction = (msg, suffix, args, ignore) => {
            if (!msg.member.hasPermission(["ADMINISTRATOR"])) return msg.reply("Désolé, Vous n'avez pas les permissions !");
        msg.reply("êtes vous sur de faire ça ?\nécrivez yes pour effectuez l'action, écrivez no pour annuler");
        const collector = new Discord.MessageCollector(msg.channel, m => m.author.id === msg.author.id, { time: 10000 });
        collector.on('collect', msg => {
        if (msg.content === "yes" && msg.member.hasPermission(["ADMINISTRATOR"])) {
        let AdminRole = msg.guild.roles.find(r => r.name === "Administrateur");
        let ModoRole = msg.guild.roles.find(r => r.name === "Modérateur");
        let StaffRole = msg.guild.roles.find(r => r.name === "Staff");
        let NotifRole = msg.guild.roles.find(r => r.name === "Notifications");
        let BotRole = msg.guild.roles.find(r => r.name === "Bot");
        let GeneraleCategory = msg.guild.channels.find(c => c.name === "👥Général");
        let AccueilChannelr = msg.guild.channels.find(c => c.name === "🎉accueil");
        let AnnoncesChannel = msg.guild.channels.find(c => c.name === "📢annonces");
        let ProjetPubChannel = msg.guild.channels.find(c => c.name === "✅projet-pub");
        let RolesChannel = msg.guild.channels.find(c => c.name === "🔗rôles");
        let ReglesChannel = msg.guild.channels.find(c => c.name === "⛔règles");
        let LogsChannelr = msg.guild.channels.find(c => c.name === "📄logs");
        let BotCommandeChannel = msg.guild.channels.find(c => c.name === "🤖bot-commande");
        let SalonTextuelCategory = msg.guild.channels.find(c => c.name === "💬Salons textuels");
        let ChatTextuelChannel1 = msg.guild.channels.find(c => c.name === "💬chat-textuel-n°1");
        let ChatTextuelChannel2 = msg.guild.channels.find(c => c.name === "💬chat-textuel-n°2");
        let SalonVocauxCategory = msg.guild.channels.find(c => c.name === "🔊Salons vocaux");
        let ChatVocalChannel1 = msg.guild.channels.find(c => c.name === "🔊Chat Vocal #1");
        let ChatVocalChannel2 = msg.guild.channels.find(c => c.name === "🔊Chat Vocal #2");
        let SalonStaffCategory = msg.guild.channels.find(c => c.name === "🔧Salon Staff");
        let ChatTextuelChannel = msg.guild.channels.find(c => c.name === "💬chat-textuel-staff");
        let BotCommandeStaffChannel = msg.guild.channels.find(c => c.name === "🤖bot-commande-staff");
        let ChatVocalChannel = msg.guild.channels.find(c => c.name === "🔊Chat Vocal Staff");
        let AFKCategory = msg.guild.channels.find(c => c.name === "💤AFK");
        let AFKChannel = msg.guild.channels.find(c => c.name === "💤AFK💤");

        if (!AdminRole) {
            try {
                AdminRole = msg.guild.createRole({
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
                    ModoRole = msg.guild.createRole({
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
                        StaffRole = msg.guild.createRole({
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
                            NotifRole = msg.guild.createRole({
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
                                BotRole = msg.guild.createRole({
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
                        else if (config.embedThumbnail && msg.guild.icon)
                            roleEmbed.setThumbnail(msg.guild.iconURL);
                        const fields = generateEmbedFields();
                            if (fields.length > 25) throw "Le nombre maximum de rôles pouvant être définis pour un embed est de 25!";

                        for (const { emoji, role }
                            of fields) {
                            if (!msg.guild.roles.find(r => r.name === role))
                                throw `Le rôle '${role}' n'existe pas !`;
                        const customEmote = client.emojis.find(e => e.name === emoji);

                        if (!customEmote) roleEmbed.addField(emoji, role, true);
                            else roleEmbed.addField(customEmote, role, true);
                        }
                        if (!GeneraleCategory) {
                        msg.guild.createChannel("👥Général","category").then(channel => {
                            channel.setPosition("0")
                            channel.overwritePermissions(msg.guild.roles.find(r => r.name === '@everyone'), {
                                SEND_MESSAGES: false});
                            channel.overwritePermissions(msg.guild.roles.find(r => r.name === 'Administrateur'), {
                                SEND_MESSAGES: true});
                            channel.overwritePermissions(msg.guild.roles.find(r => r.name === 'Modérateur'), {
                                SEND_MESSAGES: true});
                            channel.overwritePermissions(msg.guild.roles.find(r => r.name === 'Staff'), {
                                SEND_MESSAGES: true});
                            channel.overwritePermissions(msg.guild.roles.find(r => r.name === 'Notifications'), {
                                SEND_MESSAGES: false})
                            channel.overwritePermissions(msg.guild.roles.find(r => r.name === 'Bot'), {
                                SEND_MESSAGES: true});
                            })
                        }
                        if (!AccueilChannelr) {
                        msg.guild.createChannel("🎉accueil","text").then(channel => {
                            let category = msg.guild.channels.find(c => c.name == "👥Général" && c.type == "category");
                            channel.setParent(category.id);
                            channel.overwritePermissions(msg.guild.roles.find(r => r.name === '@everyone'), {
                                SEND_MESSAGES: false});
                            channel.overwritePermissions(msg.guild.roles.find(r => r.name === 'Administrateur'), {
                                SEND_MESSAGES: true});
                            channel.overwritePermissions(msg.guild.roles.find(r => r.name === 'Modérateur'), {
                                SEND_MESSAGES: true});
                            channel.overwritePermissions(msg.guild.roles.find(r => r.name === 'Staff'), {
                                SEND_MESSAGES: true});
                            channel.overwritePermissions(msg.guild.roles.find(r => r.name === 'Notifications'), {
                                SEND_MESSAGES: false})
                            channel.overwritePermissions(msg.guild.roles.find(r => r.name === 'Bot'), {
                                SEND_MESSAGES: true});
                            })
                        }
                        if (!AnnoncesChannel) {
                        msg.guild.createChannel("📢annonces","text").then(channel => {
                            let category = msg.guild.channels.find(c => c.name == "👥Général" && c.type == "category");
                            channel.setParent(category.id);
                            channel.overwritePermissions(msg.guild.roles.find(r => r.name === '@everyone'), {
                                SEND_MESSAGES: false});
                            channel.overwritePermissions(msg.guild.roles.find(r => r.name === 'Administrateur'), {
                                SEND_MESSAGES: true});
                            channel.overwritePermissions(msg.guild.roles.find(r => r.name === 'Modérateur'), {
                                SEND_MESSAGES: true});
                            channel.overwritePermissions(msg.guild.roles.find(r => r.name === 'Staff'), {
                                SEND_MESSAGES: true});
                            channel.overwritePermissions(msg.guild.roles.find(r => r.name === 'Notifications'), {
                                SEND_MESSAGES: false})
                            channel.overwritePermissions(msg.guild.roles.find(r => r.name === 'Bot'), {
                                SEND_MESSAGES: true});
                            })
                        }
                        if (!ProjetPubChannel) {
                        msg.guild.createChannel("✅projet-pub","text").then(channel => {
                            let category = msg.guild.channels.find(c => c.name == "👥Général" && c.type == "category");
                            channel.setParent(category.id);
                            })
                        }
                        if (!RolesChannel) {
                        msg.guild.createChannel("🔗rôles","text").then(channel => {
                            let category = msg.guild.channels.find(c => c.name == "👥Général" && c.type == "category");
                            channel.setParent(category.id);
                            channel.send(roleEmbed).then(async m => {
                                for (const r of config.reactions) {
                                    const emoji = r;
                                    const customCheck = client.emojis.find(e => e.name === emoji);
                
                                    if (!customCheck) await m.react(emoji);
                                    else await m.react(customCheck.id);
                                }
                            });
                            channel.overwritePermissions(msg.guild.roles.find(r => r.name === '@everyone'), {
                                SEND_MESSAGES: false});
                            channel.overwritePermissions(msg.guild.roles.find(r => r.name === 'Administrateur'), {
                                SEND_MESSAGES: true});
                            channel.overwritePermissions(msg.guild.roles.find(r => r.name === 'Modérateur'), {
                                SEND_MESSAGES: true});
                            channel.overwritePermissions(msg.guild.roles.find(r => r.name === 'Staff'), {
                                SEND_MESSAGES: true});
                            channel.overwritePermissions(msg.guild.roles.find(r => r.name === 'Notifications'), {
                                SEND_MESSAGES: false})
                            channel.overwritePermissions(msg.guild.roles.find(r => r.name === 'Bot'), {
                                SEND_MESSAGES: true});
                            })
                        }
                        if (!ReglesChannel) {
                        msg.guild.createChannel("⛔règles","text").then(channel => {
                            let category = msg.guild.channels.find(c => c.name == "👥Général" && c.type == "category");
                            channel.setParent(category.id);
                            channel.send(embedregles)
                            .then(async function (msg) {
                                msg.react("✅");
                            })
                            channel.overwritePermissions(msg.guild.roles.find(r => r.name === '@everyone'), {
                                SEND_MESSAGES: false});
                            channel.overwritePermissions(msg.guild.roles.find(r => r.name === 'Administrateur'), {
                                SEND_MESSAGES: true});
                            channel.overwritePermissions(msg.guild.roles.find(r => r.name === 'Modérateur'), {
                                SEND_MESSAGES: true});
                            channel.overwritePermissions(msg.guild.roles.find(r => r.name === 'Staff'), {
                                SEND_MESSAGES: true});
                            channel.overwritePermissions(msg.guild.roles.find(r => r.name === 'Notifications'), {
                                SEND_MESSAGES: false})
                            channel.overwritePermissions(msg.guild.roles.find(r => r.name === 'Bot'), {
                                SEND_MESSAGES: true});
                            })
                        }
                        if (!LogsChannelr) {
                        msg.guild.createChannel("📄logs","text").then(channel => {
                            let category = msg.guild.channels.find(c => c.name == "👥Général" && c.type == "category");
                            channel.setParent(category.id);
                            channel.overwritePermissions(msg.guild.roles.find(r => r.name === '@everyone'), {
                                SEND_MESSAGES: false, VIEW_CHANNEL: false});
                            channel.overwritePermissions(msg.guild.roles.find(r => r.name === 'Administrateur'), {
                                SEND_MESSAGES: true, VIEW_CHANNEL: true});
                            channel.overwritePermissions(msg.guild.roles.find(r => r.name === 'Modérateur'), {
                                SEND_MESSAGES: false, VIEW_CHANNEL: false});
                            channel.overwritePermissions(msg.guild.roles.find(r => r.name === 'Staff'), {
                                SEND_MESSAGES: false, VIEW_CHANNEL: false});
                            channel.overwritePermissions(msg.guild.roles.find(r => r.name === 'Notifications'), {
                                SEND_MESSAGES: false, VIEW_CHANNEL: false});
                            channel.overwritePermissions(msg.guild.roles.find(r => r.name === 'Bot'), {
                                SEND_MESSAGES: true, VIEW_CHANNEL: true});
                            })
                        }
                        if (!BotCommandeChannel) {
                        msg.guild.createChannel("🤖bot-commande","text").then(channel => {
                            let category = msg.guild.channels.find(c => c.name == "👥Général" && c.type == "category");
                            channel.setParent(category.id);
                            })
                        }
                        if (!SalonTextuelCategory) {
                        msg.guild.createChannel("💬Salons textuels","category").then(channel => {
                            })
                        }
                        if (!ChatTextuelChannel1) {
                        msg.guild.createChannel("💬chat-textuel-n°1","text").then(channel => {
                            let category = msg.guild.channels.find(c => c.name == "💬Salons textuels" && c.type == "category");
                            channel.setParent(category.id);
                            })
                        }
                        if (!ChatTextuelChannel2) {
                        msg.guild.createChannel("💬chat-textuel-n°2","text").then(channel => {
                            let category = msg.guild.channels.find(c => c.name == "💬Salons textuels" && c.type == "category");
                            channel.setParent(category.id);
                            })
                        }
                        if (!SalonVocauxCategory) {
                        msg.guild.createChannel("🔊Salons vocaux","category").then(channel => {
                            })
                        }
                        if (!ChatVocalChannel1) {
                        msg.guild.createChannel("🔊Chat Vocal #1","voice").then(channel => {
                            let category = msg.guild.channels.find(c => c.name == "🔊Salons vocaux" && c.type == "category");
                            channel.setParent(category.id);
                            })
                        }
                        if (!ChatVocalChannel2) {
                        msg.guild.createChannel("🔊Chat Vocal #2","voice").then(channel => {
                            let category = msg.guild.channels.find(c => c.name == "🔊Salons vocaux" && c.type == "category");
                            channel.setParent(category.id);
                            })
                        }
                        if (!SalonStaffCategory) {
                        msg.guild.createChannel("🔧Salon Staff","category").then(channel => {
                            channel.overwritePermissions(msg.guild.roles.find(r => r.name === '@everyone'), {
                                CONNECT: false, SEND_MESSAGES: false, VIEW_CHANNEL: false});
                            channel.overwritePermissions(msg.guild.roles.find(r => r.name === 'Administrateur'), {
                                CONNECT: true, SEND_MESSAGES: true, VIEW_CHANNEL: true});
                            channel.overwritePermissions(msg.guild.roles.find(r => r.name === 'Modérateur'), {
                                CONNECT: true, SEND_MESSAGES: true, VIEW_CHANNEL: true});
                            channel.overwritePermissions(msg.guild.roles.find(r => r.name === 'Staff'), {
                                CONNECT: true, SEND_MESSAGES: true, VIEW_CHANNEL: true});
                            channel.overwritePermissions(msg.guild.roles.find(r => r.name === 'Notifications'), {
                                CONNECT: false, SEND_MESSAGES: false, VIEW_CHANNEL: false});
                            channel.overwritePermissions(msg.guild.roles.find(r => r.name === 'Bot'), {
                                CONNECT: true, SEND_MESSAGES: true, VIEW_CHANNEL: true});
                            })
                        }
                        if (!ChatTextuelChannel) {
                        msg.guild.createChannel("💬chat-textuel-staff","text").then(channel => {
                            let category = msg.guild.channels.find(c => c.name == "🔧Salon Staff" && c.type == "category");
                            channel.setParent(category.id);
                            channel.overwritePermissions(msg.guild.roles.find(r => r.name === '@everyone'), {
                                SEND_MESSAGES: false, VIEW_CHANNEL: false});
                            channel.overwritePermissions(msg.guild.roles.find(r => r.name === 'Administrateur'), {
                                SEND_MESSAGES: true, VIEW_CHANNEL: true});
                            channel.overwritePermissions(msg.guild.roles.find(r => r.name === 'Modérateur'), {
                                SEND_MESSAGES: true, VIEW_CHANNEL: true});
                            channel.overwritePermissions(msg.guild.roles.find(r => r.name === 'Staff'), {
                                SEND_MESSAGES: true, VIEW_CHANNEL: true});
                            channel.overwritePermissions(msg.guild.roles.find(r => r.name === 'Notifications'), {
                                SEND_MESSAGES: false, VIEW_CHANNEL: false});
                            channel.overwritePermissions(msg.guild.roles.find(r => r.name === 'Bot'), {
                                SEND_MESSAGES: true, VIEW_CHANNEL: true});
                            })
                        }
                        if (!BotCommandeStaffChannel) {
                        msg.guild.createChannel("🤖bot-commande-staff","text").then(channel => {
                            let category = msg.guild.channels.find(c => c.name == "🔧Salon Staff" && c.type == "category");
                            channel.setParent(category.id);
                            channel.overwritePermissions(msg.guild.roles.find(r => r.name === '@everyone'), {
                                SEND_MESSAGES: false, VIEW_CHANNEL: false});
                            channel.overwritePermissions(msg.guild.roles.find(r => r.name === 'Administrateur'), {
                                SEND_MESSAGES: true, VIEW_CHANNEL: true});
                            channel.overwritePermissions(msg.guild.roles.find(r => r.name === 'Modérateur'), {
                                SEND_MESSAGES: true, VIEW_CHANNEL: true});
                            channel.overwritePermissions(msg.guild.roles.find(r => r.name === 'Staff'), {
                                SEND_MESSAGES: true, VIEW_CHANNEL: true});
                            channel.overwritePermissions(msg.guild.roles.find(r => r.name === 'Notifications'), {
                                SEND_MESSAGES: false, VIEW_CHANNEL: false});
                            channel.overwritePermissions(msg.guild.roles.find(r => r.name === 'Bot'), {
                                SEND_MESSAGES: true, VIEW_CHANNEL: true});
                            })
                        }
                        if (!ChatVocalChannel) {
                        msg.guild.createChannel("🔊Chat Vocal Staff","voice").then(channel => {
                            let category = msg.guild.channels.find(c => c.name == "🔧Salon Staff" && c.type == "category");
                            channel.setParent(category.id);
                            channel.overwritePermissions(msg.guild.roles.find(r => r.name === '@everyone'), {
                                CONNECT: false, VIEW_CHANNEL: false});
                            channel.overwritePermissions(msg.guild.roles.find(r => r.name === 'Administrateur'), {
                                CONNECT: true, VIEW_CHANNEL: true});
                            channel.overwritePermissions(msg.guild.roles.find(r => r.name === 'Modérateur'), {
                                CONNECT: true, VIEW_CHANNEL: true});
                            channel.overwritePermissions(msg.guild.roles.find(r => r.name === 'Staff'), {
                                CONNECT: true, VIEW_CHANNEL: true});
                            channel.overwritePermissions(msg.guild.roles.find(r => r.name === 'Notifications'), {
                                CONNECT: false, VIEW_CHANNEL: false});
                            channel.overwritePermissions(msg.guild.roles.find(r => r.name === 'Bot'), {
                                CONNECT: true, VIEW_CHANNEL: true});
                            })
                        }
                        if (!AFKCategory) {
                        msg.guild.createChannel("💤AFK","category").then(channel => {
                            channel.overwritePermissions(msg.guild.roles.find(r => r.name === '@everyone'), {
                                SPEAK: false});
                            channel.overwritePermissions(msg.guild.roles.find(r => r.name === 'Administrateur'), {
                                SPEAK: false});
                            channel.overwritePermissions(msg.guild.roles.find(r => r.name === 'Modérateur'), {
                                SPEAK: false});
                            channel.overwritePermissions(msg.guild.roles.find(r => r.name === 'Staff'), {
                                SPEAK: false});
                            channel.overwritePermissions(msg.guild.roles.find(r => r.name === 'Notifications'), {
                                SPEAK: false});
                            channel.overwritePermissions(msg.guild.roles.find(r => r.name === 'Bot'), {
                                SPEAK: false});
                            })
                        }
                        if (!AFKChannel) {
                        msg.guild.createChannel("💤AFK💤","voice").then(channel => {
                            let category = msg.guild.channels.find(c => c.name == "💤AFK" && c.type == "category");
                            channel.setParent(category.id);
                            channel.overwritePermissions(msg.guild.roles.find(r => r.name === '@everyone'), {
                                SPEAK: false});
                            channel.overwritePermissions(msg.guild.roles.find(r => r.name === 'Administrateur'), {
                                SPEAK: false});
                            channel.overwritePermissions(msg.guild.roles.find(r => r.name === 'Modérateur'), {
                                SPEAK: false});
                            channel.overwritePermissions(msg.guild.roles.find(r => r.name === 'Staff'), {
                                SPEAK: false});
                            channel.overwritePermissions(msg.guild.roles.find(r => r.name === 'Notifications'), {
                                SPEAK: false});
                            channel.overwritePermissions(msg.guild.roles.find(r => r.name === 'Bot'), {
                                SPEAK: false});
                            })
                        }
                    }, 3000);
                }
                if (msg.content === "no" && msg.member.hasPermission(["ADMINISTRATOR"])) return msg.reply("L'action Setup Server a été annulé !");
              })
          };

          discordbotjs.embedcreatorFunction = (msg, suffix, args, ignore) => {
          let splitCommand = msg.content.split("<");
          let embed_color = (splitCommand.slice(0).shift());
          let embed_time = (splitCommand.slice(1).shift());
          let embed_title = (splitCommand.slice(2).shift());
          let embed_title_url = (splitCommand.slice(3).shift());
          let embed_author = (splitCommand.slice(4).shift());
          let embed_author_picture = (splitCommand.slice(5).shift());
          let embed_author_url = (splitCommand.slice(6).shift());
          let embed_description = (splitCommand.slice(7).shift());
          let embed_thumbnail = (splitCommand.slice(8).shift());
          let embed_picture = (splitCommand.slice(9).shift());
          let embed_footer = (splitCommand.slice(10).shift());
          let embed_footer_picture = (splitCommand.slice(11).shift());
          if(!embed_color) embed_color = config.colorembed;
          if(!embed_time) embed_time = "false";
          if(!embed_title) embed_title = "";
          if(!embed_title_url) embed_title_url = "";
          if(!embed_author) embed_author = `${msg.author.username}`;
          if(!embed_author_picture) embed_author_picture = `${msg.author.displayAvatarURL}`;
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
          msg.channel.send(embed_create)
          };

          discordbotjs.embedhelpFunction = (msg, suffix, args, ignore) => {
            const embedembedhelp = new Discord.RichEmbed()
            .setColor(`${config.colorembed}`)
            .setTitle('Aide Embed Creator')
            .addField(`${discordbotjs.botPrefix}embed-create`, `Commande permettant de générer un embed.\nExemple: ${discordbotjs.botPrefix}embed-create Couleur<Titre<Titre Url<Auteur<Auteur Image<Auteur Url<Description<Vignette<Image<Temps (true ou false)<Footer<Footer Image\nSi vous voulez ne rien spécifer pour une valeur vous devez juste déclarer < sans autre caractère\nExemple: ${discordbotjs.botPrefix}embed-create Couleur<Titre<<Auteur<<<Description<<<Temps (true ou false)<Footer<`)
            .setTimestamp()
            .setFooter('Embed Creator Beta Version');
            msg.channel.send(embedembedhelp)
          };

          discordbotjs.addmoneyFunction = (msg, suffix, args, ignore) => {
          if (!msg.member.hasPermission('ADMINISTRATOR')) return msg.reply(`Désolé, Vous n'avez pas les permissions !`)
          if (!args[0]) return msg.reply(`S'il vous plaît, veuillez spécifier une valeur.`)
          if (isNaN(args[0])) return msg.reply(`Ce n'est pas un nombre valide !`)
          let user = msg.mentions.users.first() || msg.author
          msg.channel.send('Ajouté avec succès, ' + args[0] + ' à ' + user)
          db.add(`money_${msg.guild.id}_${msg.author.id}`, args[0])
          };

          discordbotjs.removemoneyFunction = (msg, suffix, args, ignore) => {
          if (!msg.member.hasPermission('ADMINISTRATOR')) return msg.reply(`Désolé, Vous n'avez pas les permissions !`)
          if (!args[0]) return msg.reply(`S'il vous plaît, veuillez spécifier une valeur.`)
          if (isNaN(args[0])) return msg.reply(`Ce n'est pas un nombre valide !`)
          let user = msg.mentions.users.first() || msg.author
          msg.channel.send('Supprimés avec succès, ' + args[0] + ' à ' + user)
          db.subtract(`money_${user.id}`, args[0])
          };

          discordbotjs.dailyFunction = async (msg, suffix, args, ignore) => {
          let timeout = 86400000
          let amount = 500
          let daily = await db.fetch(`daily_${msg.author.id}`);
          if (daily !== null && timeout - (Date.now() - daily) > 0) {
          let time = ms(timeout - (Date.now() - daily));
            return msg.reply(`Vous avez déjà récupéré votre récompense hebdomadaire, vous pouvez revenir la récupérer dans **${time.hours}:${time.minutes}:${time.seconds}**!`)
          } else {
          let user = msg.mentions.users.first() || msg.author
          msg.channel.send('Récompense Quotidienne Ajoutés avec succès, ' + amount + ' à ' + user)
          db.add(`money_${msg.author.id}`, amount)
          db.set(`daily_${msg.author.id}`, Date.now())
        }
          };

        discordbotjs.monthlyFunction = async (msg, suffix, args, ignore) => {
          let timeout = 2592000000
          let amount = 5000
          let monthly = await db.fetch(`monthly_${msg.author.id}`);
  
          if (monthly !== null && timeout - (Date.now() - monthly) > 0) {
              let time = ms(timeout - (Date.now() - monthly));
              return msg.reply(`Vous avez déjà récupéré votre récompense mensuelle, vous pouvez revenir la récupérer dans **${time.days} jours et ${time.hours}:${time.minutes}:${time.seconds}**!`)
          } else {
          let user = msg.mentions.users.first() || msg.author
          msg.channel.send('Récompense Mensuelle Ajoutés avec succès, ' + amount + ' à ' + user)
          db.add(`money_${msg.author.id}`, amount)
          db.set(`monthly_${msg.author.id}`, Date.now())
          }
        };

        discordbotjs.weeklyFunction = async (msg, suffix, args, ignore) => {
        let timeout = 604800000
        let amount = 1000
        let weekly = await db.fetch(`weekly_${msg.author.id}`);
        if (weekly !== null && timeout - (Date.now() - weekly) > 0) {
            let time = ms(timeout - (Date.now() - weekly));
        return msg.reply(`Vous avez déjà récupéré votre récompense hebdomadaire, vous pouvez revenir la récupérer dans **${time.days} jours et ${time.hours}:${time.minutes}:${time.seconds}**!`)
        } else {
        let user = msg.mentions.users.first() || msg.author
        msg.channel.send('Récompense Hebdomadaire Ajoutés avec succès, ' + amount + ' à ' + user)
        db.add(`money_${msg.author.id}`, amount)
        db.set(`weekly_${msg.author.id}`, Date.now())
        }
        };
        
        discordbotjs.moneyhelpFunction = (msg, suffix, args, ignore) => {
        const embedpollhelp = new Discord.RichEmbed()
        .setColor(`${config.colorembed}`)
        .setTitle('Aide Argents')
        .addField(`${discordbotjs.botPrefix}add-money`, `Commande permettant d'ajouté de l'argent sur le solde`)
        .addField(`${discordbotjs.botPrefix}remove-money`, `Commande permettant de supprimé de l'argent sur le solde`)
        .addField(`${discordbotjs.botPrefix}daily`, `Commande permettant de recevoir une récompense quotidienne`)
        .addField(`${discordbotjs.botPrefix}monthly`, `Commande permettant de recevoir une récompense mensuelle`)
        .addField(`${discordbotjs.botPrefix}weekly`, `Commande permettant de recevoir une récompense hebdomadaire`)
        .setTimestamp()
        .setFooter('Embed Solde Release Version');
        msg.channel.send(embedpollhelp)
	      };

        discordbotjs.loadCommand = (obj) => {
          return new Promise((resolve, reject) => {
            let props = {
              enabled: obj.enabled,
              run: obj.run,
              alt: obj.alt,
              help: obj.help,
              name: obj.name,
              exclude: obj.exclude,
              masked: obj.masked
            };
            if (props.enabled == undefined || null) props.enabled = true;
            if (obj.alt.length > 0) {
              obj.alt.forEach((a) => {
                discordbotjs.aliases.set(a, props);
              })
            };
            discordbotjs.commands.set(obj.name, props);
            discordbotjs.commandsArray.push(props);
            if (discordbotjs.logging) console.log(`${language.commandescharger} ${obj.name}`);
            resolve(discordbotjs.commands.get(obj.name));
          });
        }
    
        discordbotjs.note = (type, text) => {
          if (type === 'wrap') {
            let ntext = text
            .replace(/`/g, '`' + String.fromCharCode(8203))
            .replace(/@/g, '@' + String.fromCharCode(8203))
            .replace(client.token, 'REMOVED');
            return '```\n' + ntext + '\n```';
          } else if (type === 'fail') {
            return ':no_entry_sign: | ' + text.replace(/`/g, '`' + String.fromCharCode(8203));
          } else {
            console.error(new Error(`${type} ${language.errornote}`));
          }
        };

        discordbotjs.loadCommands = async () => {
          try {
            await discordbotjs.loadCommand(discordbotjs.help);
            await discordbotjs.loadCommand(discordbotjs.test);
            await discordbotjs.loadCommand(discordbotjs.news);
            await discordbotjs.loadCommand(discordbotjs.serverinfo);
            await discordbotjs.loadCommand(discordbotjs.userinfo);
            await discordbotjs.loadCommand(discordbotjs.botinfo);
            await discordbotjs.loadCommand(discordbotjs.channelinfo);
            await discordbotjs.loadCommand(discordbotjs.roleinfo);
            await discordbotjs.loadCommand(discordbotjs.serverlist);
            await discordbotjs.loadCommand(discordbotjs.serverinvite);
            await discordbotjs.loadCommand(discordbotjs.webhookcreate);
            await discordbotjs.loadCommand(discordbotjs.webhookconfigsend);
            await discordbotjs.loadCommand(discordbotjs.webhooksend);
            await discordbotjs.loadCommand(discordbotjs.webhookhelp);
            await discordbotjs.loadCommand(discordbotjs.addrole);
            await discordbotjs.loadCommand(discordbotjs.removerole);
            await discordbotjs.loadCommand(discordbotjs.kick);
            await discordbotjs.loadCommand(discordbotjs.ban);
            await discordbotjs.loadCommand(discordbotjs.unban);
            await discordbotjs.loadCommand(discordbotjs.report);
            await discordbotjs.loadCommand(discordbotjs.mute);
            await discordbotjs.loadCommand(discordbotjs.unmute);
            await discordbotjs.loadCommand(discordbotjs.botvote);
            await discordbotjs.loadCommand(discordbotjs.rps);
            await discordbotjs.loadCommand(discordbotjs.clear);
            await discordbotjs.loadCommand(discordbotjs.ping);
            await discordbotjs.loadCommand(discordbotjs.say);
            await discordbotjs.loadCommand(discordbotjs.saymarkdown);
            await discordbotjs.loadCommand(discordbotjs.sayitalic);
            await discordbotjs.loadCommand(discordbotjs.saybold);
            await discordbotjs.loadCommand(discordbotjs.sayunderline);
            await discordbotjs.loadCommand(discordbotjs.saystrikethrough);
            await discordbotjs.loadCommand(discordbotjs.sayquotes);
            await discordbotjs.loadCommand(discordbotjs.sayspoiler);
            await discordbotjs.loadCommand(discordbotjs.saycode);
            await discordbotjs.loadCommand(discordbotjs.saycodeblock);
            await discordbotjs.loadCommand(discordbotjs.saycodecolor);
            await discordbotjs.loadCommand(discordbotjs.logschannel);
            await discordbotjs.loadCommand(discordbotjs.pollsimple);
            await discordbotjs.loadCommand(discordbotjs.polladvanced);
            await discordbotjs.loadCommand(discordbotjs.pollhelp);
            await discordbotjs.loadCommand(discordbotjs.leaderboard);
            await discordbotjs.loadCommand(discordbotjs.xpsetxp);
            await discordbotjs.loadCommand(discordbotjs.xpsetlevel);
            await discordbotjs.loadCommand(discordbotjs.xpdelete);
            await discordbotjs.loadCommand(discordbotjs.xphelp);
            await discordbotjs.loadCommand(discordbotjs.setupserver);
            await discordbotjs.loadCommand(discordbotjs.embedcreator);
            await discordbotjs.loadCommand(discordbotjs.embedhelp);
            await discordbotjs.loadCommand(discordbotjs.addmoney);
            await discordbotjs.loadCommand(discordbotjs.removemoney);
            await discordbotjs.loadCommand(discordbotjs.daily);
            await discordbotjs.loadCommand(discordbotjs.monthly);
            await discordbotjs.loadCommand(discordbotjs.weekly);
            await discordbotjs.loadCommand(discordbotjs.moneyhelp);
          } catch (e) {
            console.error(new Error(e));
          };
        }
        discordbotjs.loadCommands();
    
        Object.defineProperty(Array.prototype, 'musicArraySort', {value: function(n) {
          return Array.from(Array(Math.ceil(this.length/n)), (_,i)=>this.slice(i*n,i*n+n));
        }});
        Object.defineProperty(Array.prototype, 'discordbotjsShuffle', {value: function(){
            let input = this;
            for (let i = input.length - 1; i >= 0; i--) {
                let randomIndex = Math.floor(Math.random() * (i + 1));
                let itemAtIndex = input[randomIndex];
                input[randomIndex] = input[i];
                input[i] = itemAtIndex;
            }
            return input;
        }});
    
      } catch (e) {
        console.error(e);
      };
}
