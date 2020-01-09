module.exports.run = async (message) => {
    setTimeout(function () {
        setTimeout(function () {
            message.user.sendMessage("The goal of this bot is to send good unranked maps, if farming is borring for you, this bot is made for you !")
        }, 0)
        setTimeout(function () {
            message.user.sendMessage('You can join the Discord: https://discord.gg/bUsRruH for requesting features, maps, or just chat.')
        }, 500)
        setTimeout(function () {
            message.user.sendMessage("Commands list : https://github.com/theyadev/theya-bot/")
        }, 1000)
    }, 5000)
}
module.exports.help = {
    name: "info"
}