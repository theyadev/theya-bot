const fs = require('fs')
const osu = require('node-osu')
const {
    apiKey
} = require('../secret.js')
const map = require('../mapsDetails.js')
var osuApi = new osu.Api(apiKey, {
    notFoundAsError: true,
    completeScores: false
})

module.exports.run = async (message, lastMap, mode) => {
    let modes = message.message.slice(3)
    let defaultMode = mode[message.user.ircUsername].mode
    if (modes == "mania" || modes == "osu") {
        setTimeout(function () {
            let maps = JSON.parse(fs.readFileSync(`./maps/maps${modes}.json`, "utf8"))
            var randomMap = maps[Math.round(Math.random() * maps.length)]
            if (randomMap == undefined) randomMap = maps[Math.round(Math.random() * maps.length)]
            lastMap[message.user.ircUsername] = {
                lastmap: randomMap.id
            }
            fs.writeFile("./lastMap.json", JSON.stringify(lastMap), (err) => {
                if (err) throw err
            })
            console.log(randomMap.id)

            osuApi.getBeatmaps({
                b: randomMap.id
            }).then(beatmaps => {
                message.user.sendMessage(`[https://osu.ppy.sh/b/${beatmaps[0].id} ${beatmaps[0].artist} - ${beatmaps[0].title} [${beatmaps[0].version}]] | ${randomMap.genre[0].toUpperCase() + randomMap.genre.slice(1)} | ${map.rating(beatmaps[0].difficulty.rating)} ★ | ${map.duree(beatmaps[0].length.total)} ♪ | BPM: ${beatmaps[0].bpm}`)
            })
        }, 1000);
    } else if (defaultMode == "osu") {
        if (modes == "4" || modes == "5" || modes == "6" || modes == "7" || modes == "8") {
            let maps = JSON.parse(fs.readFileSync(`./maps/mapsOsu.json`, "utf8"))
            let difficulty = modes
            let mapsDifficulty = []
            for (var i = 0, l = maps.length; i < l; i++) {
                for (var w = 0, x = maps[i].difficulty.length; w < x; w++) {
                    if (Math.round(maps[i].difficulty[w].rating) == difficulty) {
                        mapsDifficulty.push(maps[i].difficulty[w])
                    }
                }
            }
            var difficultyRandom = mapsDifficulty[Math.round(Math.random() * mapsDifficulty.length)]
            while (difficultyRandom == undefined) var difficultyRandom = mapsDifficulty[Math.round(Math.random() * mapsDifficulty.length)]
            lastMap[message.user.ircUsername] = {
                lastmap: difficultyRandom.id
            }
            fs.writeFile("./lastMap.json", JSON.stringify(lastMap), (err) => {
                if (err) throw err
            })
            message.user.sendMessage(`[https://osu.ppy.sh/b/${difficultyRandom.id} ${difficultyRandom.artist} - ${difficultyRandom.title} [${difficultyRandom.version}]] | ${difficultyRandom.genre[0].toUpperCase() + difficultyRandom.genre.slice(1)} | ${map.rating(difficultyRandom.rating)} ★ | ${map.duree(difficultyRandom.length)} ♪ | BPM: ${difficultyRandom.bpm}`)
        } else if (modes.toLowerCase() == "tech" || modes.toLowerCase() == "alternate" || modes.toLowerCase() == "reading" || modes.toLowerCase() == "stream" || modes.toLowerCase() == "classic" || modes.toLowerCase() == "jump") {
            let maps = JSON.parse(fs.readFileSync(`./maps/mapsOsu.json`, "utf8"))
            let difficulty = modes.toLowerCase()
            let mapsDifficulty = []
            for (var i = 0, l = maps.length; i < l; i++) {
                if (maps[i].genre == difficulty) {
                    mapsDifficulty.push(maps[i])
                }
            }
            var difficultyRandom = mapsDifficulty[Math.round(Math.random() * mapsDifficulty.length)]
            while (difficultyRandom == undefined) var difficultyRandom = mapsDifficulty[Math.round(Math.random() * mapsDifficulty.length)]
            console.log(difficultyRandom.id)
            lastMap[message.user.ircUsername] = {
                lastmap: difficultyRandom.id
            }
            fs.writeFile("./lastMap.json", JSON.stringify(lastMap), (err) => {
                if (err) throw err
            })
            osuApi.getBeatmaps({
                b: `${difficultyRandom.id}`
            }).then(beatmaps => {
                message.user.sendMessage(`[https://osu.ppy.sh/b/${difficultyRandom.id} ${difficultyRandom.artist} - ${difficultyRandom.title} [${beatmaps[0].version}]] | ${difficultyRandom.genre[0].toUpperCase() + difficultyRandom.genre.slice(1)} | ${map.rating(beatmaps[0].difficulty.rating)} ★ | ${map.duree(difficultyRandom.length)} ♪ | BPM: ${difficultyRandom.bpm}`)
            })
        } else if (modes) {
            let maps = JSON.parse(fs.readFileSync(`./maps/mapsOsu.json`, "utf8"))
            let test = []
            let mode = modes.split(" ")

            for (var i = 0, l = maps.length; i < l; i++) {
                if (test.includes(maps[i].artist.toLowerCase()) == true) {

                } else if (maps[i].artist.toLowerCase() == modes.toLowerCase()) {
                    test.push(maps[i])
                } else {
                    let artistR = maps[i].artist.toLowerCase().replace("(cv:", '').replace(")", '').replace("(", '').replace(".", '')
                    let artistSplit = artistR.split(' ')
                    split(i, artistSplit);
                }
            }

            function split(i, artistSplit) {
                for (var w = 0, y = artistSplit.length; w < y; w++) {
                    if (artistSplit[w] == 'feat.' || artistSplit[w] == 'feat' || artistSplit[w] == 'x' || artistSplit[w] == '&' || artistSplit[w] == '' || artistSplit[w] == ' ') {

                    } else {
                        if (artistSplit[w] == mode[0].toLowerCase()) {
                            test.push(maps[i])
                        }
                    }
                }
            }
            if (test.length == 0) {
                message.user.sendMessage("theya!bot doesn't have any map from this artist.")
            } else {
                var difficultyRandom = test[Math.round(Math.random() * test.length)]
                while (difficultyRandom == undefined) var difficultyRandom = test[Math.round(Math.random() * test.length)]
                osuApi.getBeatmaps({
                    b: difficultyRandom.id
                }).then(beatmaps => {
                    message.user.sendMessage(`[https://osu.ppy.sh/b/${beatmaps[0].id} ${beatmaps[0].artist} - ${beatmaps[0].title} [${beatmaps[0].version}]] | ${difficultyRandom.genre[0].toUpperCase() + difficultyRandom.genre.slice(1)} | ${map.rating(beatmaps[0].difficulty.rating)} ★ | ${map.duree(beatmaps[0].length.total)} ♪ | BPM: ${beatmaps[0].bpm}`)
                })
            }
        } else {
            setTimeout(function () {
                let maps = JSON.parse(fs.readFileSync(`./maps/mapsOsu.json`, "utf8"))
                var randomMap = maps[Math.round(Math.random() * maps.length)]
                console.log(randomMap.id)
                lastMap[message.user.ircUsername] = {
                    lastmap: randomMap.id
                }
                fs.writeFile("./lastMap.json", JSON.stringify(lastMap), (err) => {
                    if (err) throw err
                })

                osuApi.getBeatmaps({
                    b: randomMap.id
                }).then(beatmaps => {
                    message.user.sendMessage(`[https://osu.ppy.sh/b/${beatmaps[0].id} ${beatmaps[0].artist} - ${beatmaps[0].title} [${beatmaps[0].version}]] | ${randomMap.genre[0].toUpperCase() + randomMap.genre.slice(1)} | ${map.rating(beatmaps[0].difficulty.rating)} ★ | ${map.duree(beatmaps[0].length.total)} ♪ | BPM: ${beatmaps[0].bpm}`)
                })
            }, 1000);
        }
    } else if (defaultMode == "mania") {
        if (modes == "3" || modes == "4" || modes == "5" || modes == "6") {
            let maps = JSON.parse(fs.readFileSync(`./maps/mapsMania.json`, "utf8"))
            let difficulty = modes
            let mapsDifficulty = []
            for (var i = 0, l = maps.length; i < l; i++) {
                for (var w = 0, x = maps[i].difficulty.length; w < x; w++) {
                    if (Math.round(maps[i].difficulty[w].rating) == difficulty) {
                        mapsDifficulty.push(maps[i].difficulty[w])
                    }
                }
            }
            var difficultyRandom = mapsDifficulty[Math.round(Math.random() * mapsDifficulty.length)]
            while (difficultyRandom == undefined) var difficultyRandom = mapsDifficulty[Math.round(Math.random() * mapsDifficulty.length)]
            console.log(difficultyRandom.id)
            lastMap[message.user.ircUsername] = {
                lastmap: difficultyRandom.id
            }
            fs.writeFile("./lastMap.json", JSON.stringify(lastMap), (err) => {
                if (err) throw err
            })
            message.user.sendMessage(`[https://osu.ppy.sh/b/${difficultyRandom.id} ${difficultyRandom.artist} - ${difficultyRandom.title} [${difficultyRandom.version}]] | ${difficultyRandom.genre[0].toUpperCase() + difficultyRandom.genre.slice(1)} | ${map.rating(difficultyRandom.rating)} ★ | ${map.duree(difficultyRandom.length)} ♪ | BPM: ${difficultyRandom.bpm}`)
        } else if (modes.toLowerCase() == 'ln' || modes.toLowerCase() == 'sv' || modes.toLowerCase() == 'tech' || modes.toLowerCase() == 'classic' || modes.toLowerCase() == 'jacks' || modes.toLowerCase() == 'jumpstreams' || modes.toLowerCase() == 'handstreams') {
            let maps = JSON.parse(fs.readFileSync(`./maps/mapsMania.json`, "utf8"))
            let difficulty = modes.toLowerCase()
            let mapsDifficulty = []
            for (var i = 0, l = maps.length; i < l; i++) {
                if (maps[i].genre == difficulty) {
                    mapsDifficulty.push(maps[i])
                }
            }
            var difficultyRandom = mapsDifficulty[Math.round(Math.random() * mapsDifficulty.length)]
            while (difficultyRandom == undefined) var difficultyRandom = mapsDifficulty[Math.round(Math.random() * mapsDifficulty.length)]
            console.log(difficultyRandom.id)
            lastMap[message.user.ircUsername] = {
                lastmap: difficultyRandom.id
            }
            fs.writeFile("./lastMap.json", JSON.stringify(lastMap), (err) => {
                if (err) throw err
            })
            osuApi.getBeatmaps({
                b: `${difficultyRandom.id}`
            }).then(beatmaps => {
                message.user.sendMessage(`[https://osu.ppy.sh/b/${difficultyRandom.id} ${difficultyRandom.artist} - ${difficultyRandom.title} [${beatmaps[0].version}]] | ${difficultyRandom.genre[0].toUpperCase() + difficultyRandom.genre.slice(1)} | ${map.rating(beatmaps[0].difficulty.rating)} ★ | ${map.duree(difficultyRandom.length)} ♪ | BPM: ${difficultyRandom.bpm}`)
            })
        } else if (modes) {
            let maps = JSON.parse(fs.readFileSync(`./maps/mapsMania.json`, "utf8"))
            let test = []
            let mode = modes.split(" ")

            for (var i = 0, l = maps.length; i < l; i++) {
                if (test.includes(maps[i].artist.toLowerCase()) == true) {

                } else if (maps[i].artist.toLowerCase() == modes.toLowerCase()) {
                    test.push(maps[i])
                } else {
                    let artistR = maps[i].artist.toLowerCase().replace("(cv:", '').replace(")", '').replace("(", '').replace(".", '')
                    let artistSplit = artistR.split(' ')
                    split(i, artistSplit);
                }
            }

            function split(i, artistSplit) {
                for (var w = 0, y = artistSplit.length; w < y; w++) {
                    if (artistSplit[w] == 'feat.' || artistSplit[w] == 'feat' || artistSplit[w] == 'x' || artistSplit[w] == '&' || artistSplit[w] == '' || artistSplit[w] == ' ') {

                    } else {
                        if (artistSplit[w] == mode[0].toLowerCase()) {
                            test.push(maps[i])
                        }
                    }
                }
            }
            if (test.length == 0) {
                message.user.sendMessage("theya!bot doesn't have any map from this artist.")
            } else {
                var difficultyRandom = test[Math.round(Math.random() * test.length)]
                while (difficultyRandom == undefined) var difficultyRandom = test[Math.round(Math.random() * test.length)]
                osuApi.getBeatmaps({
                    b: difficultyRandom.id
                }).then(beatmaps => {
                    message.user.sendMessage(`[https://osu.ppy.sh/b/${beatmaps[0].id} ${beatmaps[0].artist} - ${beatmaps[0].title} [${beatmaps[0].version}]] | ${difficultyRandom.genre[0].toUpperCase() + difficultyRandom.genre.slice(1)} | ${map.rating(beatmaps[0].difficulty.rating)} ★ | ${map.duree(beatmaps[0].length.total)} ♪ | BPM: ${beatmaps[0].bpm}`)
                })
            }
        } else {
            setTimeout(function () {
                let maps = JSON.parse(fs.readFileSync(`./maps/maps${defaultMode}.json`, "utf8"))
                var randomMap = maps[Math.round(Math.random() * maps.length)]
                if (randomMap == undefined) randomMap = maps[Math.round(Math.random() * maps.length)]
                lastMap[message.user.ircUsername] = {
                    lastmap: randomMap.id
                }
                fs.writeFile("./lastMap.json", JSON.stringify(lastMap), (err) => {
                    if (err) throw err
                })
                console.log(randomMap.id)

                osuApi.getBeatmaps({
                    b: `${randomMap.id}`
                }).then(beatmaps => {
                    message.user.sendMessage(`[https://osu.ppy.sh/b/${beatmaps[0].id} ${beatmaps[0].artist} - ${beatmaps[0].title} [${beatmaps[0].version}]] | ${randomMap.genre[0].toUpperCase() + randomMap.genre.slice(1)} | ${map.rating(beatmaps[0].difficulty.rating)} ★ | ${map.duree(beatmaps[0].length.total)} ♪ | BPM: ${beatmaps[0].bpm}`)
                })
            }, 1000);
        }
    }
}
module.exports.help = {
    name: "r"
}