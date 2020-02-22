const langue = require("./config.js").langue;

/* Pour ajouter une langue il faut procéder de cette façon
if(langue === `votre langue`)
{
module.exports = {
    ...
};
}
*/

/* Pour ajouter un text traduit if faut procéder de cette façon
*/

if(langue === `english`)
{
module.exports = {
    presence: `My prefix is`,
    commandescharger: `Loaded Commands`,
    cooldowntext: `You must wait a while before you can use the bot commands again.`,
    descriptiontestcommande: `This command allows you to test the bot.`,
    processversionwarning: `You must have at least version 8 of node.js to be able to use the bot.`,
    descriptionhelp1: `Use`,
    descriptionhelp2: `command name\` for help using a command.`,
    helpauthorcommands: `Commands`,
    descriptionhelpcommande: `This command allows you to have the complete list of bot commands.`,
    errornote: `is not a valid type!`,
    errorcommand: `is not a valid command!`,
    testtext: `The bot is working properly!`,
    verifylevels1: `None`,
    verifylevels2: `Low`,
    verifylevels3: `Way`,
    region1: `Brazil`,
    region2: `South Africa`,
    region3: `Central Europe`,
    region4: `Russia`,
    region5: `Singapore`,
    region6: `United States Central`,
    region7: `Japan`,
    region8: `Eastern United States`,
    region9: `Southern United States`,
    region10: `Western United States`,
    region11: `Western Europe`,
    region12: `London`,
    region13: `India`,
    nonetext: "None",
    yestext: "Yes",
    notext: "No",
    serveurinfotitle: "Server info",
    descriptionserverinfocommande: `This command allows you to display information about the server.`,
};
}
if(langue === `french`)
{
module.exports = {
    presence: `Mon prefix est`,
    commandescharger: `Commandes Chargés`,
    cooldowntext: `Vous devez attendre un certain temps avant de pouvoir utiliser à nouveau les commandes du bot.`,
    descriptiontestcommande: `Cette commande vous permet tester le bot.`,
    processversionwarning: `Vous devez avoir au moins la version 8 de node.js pour pouvoir utiliser le bot.`,
    descriptionhelp1: `Utilise`,
    descriptionhelp2: `nom de la commande\` pour obtenir de l'aide sur l'utilisation d'une commande.`,
    helpauthorcommands: `Commandes`,
    descriptionhelpcommande: `Cette commande vous permet d'avoir la liste complète des commandes du bot.`,
    errornote: `n'est pas un type valide !`,
    errorcommand: `n'est pas une commande valide !`,
    testtext: `Le bot fonctionne correctement !`,
    verifylevels1: `Aucun`,
    verifylevels2: `Faible`,
    verifylevels3: `Moyen`,
    nonetext: "Aucun",
    yestext: "Oui",
    notext: "Non",
    serveurinfotitle: "Serveur info",
    descriptionserverinfocommande: `Cette commande vous permet d'afficher des informations concernant le serveur.`,
};
}