module.exports.run = async (message) => {
    setTimeout(function () {
        setTimeout(function () {
            message.user.sendMessage("If farming is boring for you, or you just want to chill on good unranked maps, this bot is made for you !")
        }, 0)
        setTimeout(function () {
            message.user.sendMessage('You can join the Discord: https://discord.gg/bUsRruH for requesting features, maps, or just chat.')
        }, 500)
        setTimeout(function () {
            message.user.sendMessage("More info : [https://github.com/theyadev/theya-bot/ Github] [https://osu.ppy.sh/community/forums/topics/1016303 Forum Post] [https://www.reddit.com/r/osugame/comments/elweow/theyabot_a_bot_that_recommend_good_unranked_maps/?utm_source=share&utm_medium=web2x Reddit]")
        }, 1000)
    }, 5000)
}
module.exports.help = {
    name: "info"
}