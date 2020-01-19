const fs = require('fs')
const osu = require('node-osu')
const { apiKey } = require('../secret.js')
const map = require('../mapsDetails.js')
var osuApi = new osu.Api(apiKey, {
    notFoundAsError: true,
    completeScores: false
})

module.exports.run = async (message, lastMap, mode) => {
    let modes = message.message.slice(11)
    let defaultMode = mode[message.user.ircUsername].mode
    if (modes == "mania" || modes == "osu") {
        setTimeout(function () {
            let maps = JSON.parse(fs.readFileSync(`./maps/maps${modes}.json`, "utf8"))
            var randomMap = maps[Math.round(Math.random() * maps.length)]
            if (randomMap == undefined) randomMap = maps[Math.round(Math.random() * maps.length)]
            lastMap[message.user.ircUsername] = {
                lastmap: randomMap.ID
            }
            fs.writeFile("./lastMap.json", JSON.stringify(lastMap), (err) => {
                if (err) throw err
            })
            console.log(randomMap)

            osuApi.getBeatmaps({ b: `${randomMap.ID}` }).then(beatmaps => {
                message.user.sendMessage(`[https://osu.ppy.sh/b/${beatmaps[0].id} ${beatmaps[0].artist} - ${beatmaps[0].title} [${beatmaps[0].version}]] | ${randomMap.Genre[0].toUpperCase() + randomMap.Genre.slice(1)} | ${map.rating(beatmaps[0].difficulty.rating)} ★ | ${map.duree(beatmaps[0].length.total)} ♪ | BPM: ${beatmaps[0].bpm}`)
            })
        }, 1000);
    } else if (defaultMode == "osu") {
        if (modes.toLowerCase() == "tech" || modes.toLowerCase() == "alternate" || modes.toLowerCase() == "reading" || modes.toLowerCase() == "stream" || modes.toLowerCase() == "classic" || modes.toLowerCase() == "jump") {
            setTimeout(function () {
                let maps = JSON.parse(fs.readFileSync(`./maps/mapsOsu.json`, "utf8"))
                var randomMap = maps[Math.round(Math.random() * maps.length)]
                if (randomMap == undefined) randomMap = maps[Math.round(Math.random() * maps.length)]
                while (randomMap.Genre !== modes.toLowerCase()) randomMap = maps[Math.round(Math.random() * maps.length)]

                lastMap[message.user.ircUsername] = {
                    lastmap: randomMap.ID
                }
                fs.writeFile("./lastMap.json", JSON.stringify(lastMap), (err) => {
                    if (err) throw err
                })
                console.log(randomMap)

                osuApi.getBeatmaps({ b: `${randomMap.ID}` }).then(beatmaps => {
                    message.user.sendMessage(`[https://osu.ppy.sh/b/${beatmaps[0].id} ${beatmaps[0].artist} - ${beatmaps[0].title} [${beatmaps[0].version}]] | ${randomMap.Genre[0].toUpperCase() + randomMap.Genre.slice(1)} | ${map.rating(beatmaps[0].difficulty.rating)} ★ | ${map.duree(beatmaps[0].length.total)} ♪ | BPM: ${beatmaps[0].bpm}`)
                })
            }, 1000);
        } else {
            setTimeout(function () {
                let maps = JSON.parse(fs.readFileSync(`./maps/maps${defaultMode}.json`, "utf8"))
                var randomMap = maps[Math.round(Math.random() * maps.length)]
                if (randomMap == undefined) randomMap = maps[Math.round(Math.random() * maps.length)]
                lastMap[message.user.ircUsername] = {
                    lastmap: randomMap.ID
                }
                fs.writeFile("./lastMap.json", JSON.stringify(lastMap), (err) => {
                    if (err) throw err
                })
                console.log(randomMap)

                osuApi.getBeatmaps({ b: `${randomMap.ID}` }).then(beatmaps => {
                    message.user.sendMessage(`[https://osu.ppy.sh/b/${beatmaps[0].id} ${beatmaps[0].artist} - ${beatmaps[0].title} [${beatmaps[0].version}]] | ${randomMap.Genre[0].toUpperCase() + randomMap.Genre.slice(1)} | ${map.rating(beatmaps[0].difficulty.rating)} ★ | ${map.duree(beatmaps[0].length.total)} ♪ | BPM: ${beatmaps[0].bpm}`)
                })
            }, 1000);
        }
    } else if (defaultMode == "mania") {
        if (modes.toLowerCase() == 'ln' || modes.toLowerCase() == 'sv' || modes.toLowerCase() == 'tech' || modes.toLowerCase() == 'classic' || modes.toLowerCase() == 'jacks' || modes.toLowerCase() == 'jumpstreams') {
            setTimeout(function () {
                let maps = JSON.parse(fs.readFileSync(`./maps/mapsMania.json`, "utf8"))
                var randomMap = maps[Math.round(Math.random() * maps.length)]
                if (randomMap == undefined) randomMap = maps[Math.round(Math.random() * maps.length)]
                while (randomMap.Genre !== modes.toLowerCase()) randomMap = maps[Math.round(Math.random() * maps.length)]

                lastMap[message.user.ircUsername] = {
                    lastmap: randomMap.ID
                }
                fs.writeFile("./lastMap.json", JSON.stringify(lastMap), (err) => {
                    if (err) throw err
                })
                console.log(randomMap)

                osuApi.getBeatmaps({ b: `${randomMap.ID}` }).then(beatmaps => {
                    message.user.sendMessage(`[https://osu.ppy.sh/b/${beatmaps[0].id} ${beatmaps[0].artist} - ${beatmaps[0].title} [${beatmaps[0].version}]] | ${randomMap.Genre[0].toUpperCase() + randomMap.Genre.slice(1)} | ${map.rating(beatmaps[0].difficulty.rating)} ★ | ${map.duree(beatmaps[0].length.total)} ♪ | BPM: ${beatmaps[0].bpm}`)
                })
            }, 1000);
        } else {
            setTimeout(function () {
                let maps = JSON.parse(fs.readFileSync(`./maps/maps${defaultMode}.json`, "utf8"))
                var randomMap = maps[Math.round(Math.random() * maps.length)]
                if (randomMap == undefined) randomMap = maps[Math.round(Math.random() * maps.length)]
                lastMap[message.user.ircUsername] = {
                    lastmap: randomMap.ID
                }
                fs.writeFile("./lastMap.json", JSON.stringify(lastMap), (err) => {
                    if (err) throw err
                })
                console.log(randomMap)

                osuApi.getBeatmaps({ b: `${randomMap.ID}` }).then(beatmaps => {
                    message.user.sendMessage(`[https://osu.ppy.sh/b/${beatmaps[0].id} ${beatmaps[0].artist} - ${beatmaps[0].title} [${beatmaps[0].version}]] | ${randomMap.Genre[0].toUpperCase() + randomMap.Genre.slice(1)} | ${map.rating(beatmaps[0].difficulty.rating)} ★ | ${map.duree(beatmaps[0].length.total)} ♪ | BPM: ${beatmaps[0].bpm}`)
                })
            }, 1000);
        }
    }
}
module.exports.help = {
    name: "recommend"
}