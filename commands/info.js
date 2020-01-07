module.exports.run = async (message, cooldown) => {
    cooldown.add(message.user.ircUsername)
    setTimeout(function () {
        setTimeout(function () {
            message.user.sendMessage("The goal of this bot is to send good unranked maps, if farming is borring for you, this bot is made for you !")
        }, 0)
        /*setTimeout(function () {
          message.user.sendMessage("This bot is created by Theya, a guy who never touch javascript before, so be gentle if there are bugs. The bot is still in developement phase !")
        }, 500)*/
        setTimeout(function () {
            message.user.sendMessage('You can join the Discord: https://discord.gg/bUsRruH for requesting features, maps, or just chat.')
        }, 500)
        setTimeout(function () {
            message.user.sendMessage("Also, don't be afraid of downloading a 7* map, a lot of map have a full mapset.")
        }, 1000)
        setTimeout(function () {
            message.user.sendMessage("Do !help for commands list.")
        }, 1500)
    }, 5000)
}
module.exports.help = {
    name: "info"
}