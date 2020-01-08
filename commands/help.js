module.exports.run = async (message, cooldown) => {
    cooldown.add(message.user.ircUsername)
    setTimeout(function () {
        setTimeout(function () {
            message.user.sendMessage("Full Commands List : https://github.com/theyadev/theya-bot")
        }, 0);   
        setTimeout(function () {
            message.user.sendMessage("!mode <mania/osu> = set your default game mode.")
        }, 500);  
        setTimeout(function () {
            message.user.sendMessage('!recommend (!r) <mania/osu> = recommend an osu!/osu!mania map.')
        }, 1000)
        setTimeout(function () {
            message.user.sendMessage('!bomb <mania/osu> = recommend 5 maps.')
        }, 1500)          
    }, 5000)
}
module.exports.help = {
    name: "help"
}