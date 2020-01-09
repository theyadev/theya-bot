const fs = require('fs')
const osu = require('node-osu')
const { apiKey } = require('C:/Users/Theya/Desktop/theya-bot/secret.js')
const map = require('C:/Users/Theya/Desktop/theya-bot/mapsDetails.js')
var osuApi = new osu.Api(apiKey, {
    notFoundAsError: true,
    completeScores: false
})

module.exports.run = async (message, cooldown,) => {
    let mode = JSON.parse(fs.readFileSync("./mode.json", "utf8"))
    if (!mode[message.user.ircUsername]) {
        mode[message.user.ircUsername] = {
            mode: "osu"
        }
    }
    let defaultMode = mode[message.user.ircUsername].mode
    mode = message.message.slice(6)

    if (mode == "mania" || mode == "osu") {
        cooldown.add(message.user.ircUsername)
        setTimeout(function () {
            let bomb = 0
            do {
                bomb += 1
                fs.readFile(`./maps/maps${mode}.txt`, 'utf8', (err, file) => {
                    if (err) throw err
                    var Array = file.match(/.{1,7}/g)
                    var randomItem = Array[Math.round(Math.random() * Array.length)]
                    var maps = randomItem - 1
                    console.log(randomItem)

                    osuApi.getBeatmaps({ b: `${randomItem}` }).then(beatmaps => {
                        message.user.sendMessage(`[https://osu.ppy.sh/b/${randomItem} ${beatmaps[0].artist} - ${beatmaps[0].title} [${beatmaps[0].version}]] | ${map.genre(maps)} | ${map.rating(beatmaps[0].difficulty.rating)} ★ | ${map.duree(beatmaps[0].length.total)} ♪ | BPM: ${beatmaps[0].bpm}`)
                    })
                })
            } while (bomb < 5)
        }, 5000)
    }
    else {
        cooldown.add(message.user.ircUsername)
        setTimeout(function () {
            let bomb = 0
            do {
                bomb += 1
                fs.readFile(`./maps/maps${defaultMode}.txt`, 'utf8', (err, file) => {
                    if (err) throw err
                    var Array = file.match(/.{1,7}/g)
                    var randomItem = Array[Math.round(Math.random() * Array.length)]
                    var maps = randomItem - 1
                    console.log(randomItem)

                    osuApi.getBeatmaps({ b: `${randomItem}` }).then(beatmaps => {
                        message.user.sendMessage(`[https://osu.ppy.sh/b/${randomItem} ${beatmaps[0].artist} - ${beatmaps[0].title} [${beatmaps[0].version}]] | ${map.genre(maps)} | ${map.rating(beatmaps[0].difficulty.rating)} ★ | ${map.duree(beatmaps[0].length.total)} ♪ | BPM: ${beatmaps[0].bpm}`)
                    })
                })
            } while (bomb < 5)
        }, 5000)
    }
}


module.exports.help = {
    name: "bomb"
}