module.exports.run = async (message, cooldown) => {
    cooldown.add(message.user.ircUsername)
    setTimeout(function () {
        setTimeout(function () {
            message.user.sendMessage("Commands List :")
        }, 0)
        setTimeout(function () {
            message.user.sendMessage('!recommend (!r) <mania/osu> = request an osu!/osu!mania map.')
        }, 500)
        setTimeout(function () {
            message.user.sendMessage('!bomb <mania/osu> = request 5 maps.')
        }, 1000)
        setTimeout(function () {
            message.user.sendMessage('!maps = show how many maps there are in the bot.')
        }, 1500)
        setTimeout(function () {
            message.user.sendMessage('!request = request a beatmap to add in the bot.')
        }, 2000)
        setTimeout(function () {
            message.user.sendMessage("!mode <mania/osu> = set your default game mode.")
        }, 2500);
        setTimeout(function () {
            message.user.sendMessage("!complain = complain about the last map.")
        }, 3000);
    }, 5000)
}
module.exports.help = {
    name: "help"
}