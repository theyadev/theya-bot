module.exports.run = async (message, args) => {
        setTimeout(function () {
            message.user.sendMessage("Full Commands List : https://theyabot.ddns.net/")
        }, 0);   
        setTimeout(function () {
            message.user.sendMessage("!mode <mania/osu> = set your default game mode.")
        }, 500);  
        setTimeout(function () {
            message.user.sendMessage('!recommend (!r) = recommend an osu!/osu!mania map.')
        }, 1000)
        setTimeout(function () {
            message.user.sendMessage('!bomb = recommend 5 maps.')
        }, 1500)          
}
module.exports.help = {
    name: "help"
}