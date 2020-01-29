const fs = require('fs')
const osu = require('node-osu')
const { apiKey } = require('../secret.js')
const map = require('../mapsDetails.js')
var osuApi = new osu.Api(apiKey, {
    notFoundAsError: true,
    completeScores: false
})

module.exports.run = async (message) => {
    let mode = JSON.parse(fs.readFileSync("./mode.json", "utf8"))
    if (!mode[message.user.ircUsername]) {
        mode[message.user.ircUsername] = {
            mode: "osu"
        }
    }
    let defaultMode = mode[message.user.ircUsername].mode
    function recommend(modeSet) {
        let maps = JSON.parse(fs.readFileSync(`./maps/maps${modeSet}.json`, "utf8"))
        var randomMap = maps[Math.round(Math.random() * maps.length)]
        if (randomMap == undefined) randomMap = maps[Math.round(Math.random() * maps.length)]
        console.log(randomMap)

        osuApi.getBeatmaps({ b: `${randomMap.id}` }).then(beatmaps => {
            message.user.sendMessage(`[https://osu.ppy.sh/b/${beatmaps[0].id} ${beatmaps[0].artist} - ${beatmaps[0].title} [${beatmaps[0].version}]] | ${randomMap.genre[0].toUpperCase() + randomMap.genre.slice(1)} | ${map.rating(beatmaps[0].difficulty.rating)} ★ | ${map.duree(beatmaps[0].length.total)} ♪ | BPM: ${beatmaps[0].bpm}`)
        })
        return
    }
    mode = message.message.slice(6)

    if (mode == "mania" || mode == "osu") {
        setTimeout(function () {
            recommend(mode)
            setTimeout(function () {
                recommend(mode)
                setTimeout(function () {
                    recommend(mode)
                    setTimeout(function () {
                        recommend(mode)
                        setTimeout(function () {
                            recommend(mode)
                        }, 1500)
                    }, 1500)
                }, 1500)
            }, 1500)
        }, 5000)
    }
    else {
        setTimeout(function () {
            recommend(defaultMode)
            setTimeout(function () {
                recommend(defaultMode)
                setTimeout(function () {
                    recommend(defaultMode)
                    setTimeout(function () {
                        recommend(defaultMode)
                        setTimeout(function () {
                            recommend(defaultMode)
                        }, 1500)
                    }, 1500)
                }, 1500)
            }, 1500)
        }, 5000)
    }
}


module.exports.help = {
    name: "bomb"
}