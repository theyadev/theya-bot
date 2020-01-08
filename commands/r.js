const fs = require('fs')
const osu = require('node-osu')
const { apiKey } = require('C:/Users/Theya/Desktop/theya-bot/secret.js')
const map = require('C:/Users/Theya/Desktop/theya-bot/mapsDetails.js')
var osuApi = new osu.Api(apiKey, {
    notFoundAsError: true,
    completeScores: false
})

module.exports.run = async (message, cooldownr, lastMap, rateLimiter) => {
    let mode = JSON.parse(fs.readFileSync("./mode.json", "utf8"))
    if (!mode[message.user.ircUsername]) {
        mode[message.user.ircUsername] = {
            mode: "osu"
        }
    }
    let defaultMode = mode[message.user.ircUsername].mode
    mode = message.message.slice(3)
    if (mode == "mania" || mode == "osu") {
        cooldownr.add(message.user.ircUsername)
        setTimeout(function () {
        }, 1000);
    }
    else {
        cooldownr.add(message.user.ircUsername)
        setTimeout(function () {
            fs.readFile(`./maps/maps${defaultMode}.txt`, 'utf8', (err, file) => {
                if (err) throw err
                var Array = file.match(/.{1,7}/g)
                var randomItem = Array[Math.round(Math.random() * Array.length)]
                var maps = randomItem - 1
                console.log(randomItem)

                lastMap[message.user.ircUsername] = {
                    lastMap: randomItem
                }
                fs.writeFile("./lastMap.json", JSON.stringify(lastMap), (err) => {
                    if (err) throw err
                })
                let userLastMap = lastMap[message.user.ircUsername].lastMap

                osuApi.getBeatmaps({ b: `${randomItem}` }).then(beatmaps => {
                    rateLimiter++
                    message.user.sendMessage(`[https://osu.ppy.sh/b/${randomItem} ${beatmaps[0].artist} - ${beatmaps[0].title} [${beatmaps[0].version}]] | ${map.genre(maps)} | ${map.rating(beatmaps[0].difficulty.rating)} ★ | ${map.duree(beatmaps[0].length.total)} ♪ | BPM: ${beatmaps[0].bpm}`)
                })
            })
        }, 1000);
    }

}
module.exports.help = {
    name: "r"
}