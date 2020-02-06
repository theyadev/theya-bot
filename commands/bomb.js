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

module.exports.run = async (message) => {
    let mode = JSON.parse(fs.readFileSync("./mode.json", "utf8"))
    if (!mode[message.user.ircUsername]) {
        mode[message.user.ircUsername] = {
            mode: "osu"
        }
    }
    let defaultMode = mode[message.user.ircUsername].mode

    function recommend(modeSet) {
        if (modeSet == "mania" || modeSet == "osu") {
            let maps = JSON.parse(fs.readFileSync(`./maps/maps${modeSet}.json`, "utf8"))
            var randomMap = maps[Math.round(Math.random() * maps.length)]
            if (randomMap == undefined) randomMap = maps[Math.round(Math.random() * maps.length)]
            console.log(randomMap.id)

            osuApi.getBeatmaps({
                b: `${randomMap.id}`
            }).then(beatmaps => {
                message.user.sendMessage(`[https://osu.ppy.sh/b/${beatmaps[0].id} ${beatmaps[0].artist} - ${beatmaps[0].title} [${beatmaps[0].version}]] | ${randomMap.genre[0].toUpperCase() + randomMap.genre.slice(1)} | ${map.rating(beatmaps[0].difficulty.rating)} ★ | ${map.duree(beatmaps[0].length.total)} ♪ | BPM: ${beatmaps[0].bpm}`)
            })
        } else if (modeSet == "tech" || modeSet == "alternate" || modeSet == "reading" || modeSet == "stream" || modeSet == "classic" || modeSet == "jump" || modeSet == 'ln' || modeSet == 'sv' || modeSet == 'jacks' || modeSet == 'jumpstreams' || modeSet == 'handstreams') {
            let maps = JSON.parse(fs.readFileSync(`./maps/maps${defaultMode}.json`, "utf8"))
            let difficulty = modeSet.toLowerCase()
            let mapsDifficulty = []
            for (var i = 0, l = maps.length; i < l; i++) {
                if (maps[i].genre == difficulty) {
                    mapsDifficulty.push(maps[i])
                }
            }
            var difficultyRandom = mapsDifficulty[Math.round(Math.random() * mapsDifficulty.length)]
            if (difficultyRandom == undefined) var difficultyRandom = mapsDifficulty[Math.round(Math.random() * mapsDifficulty.length)]
            osuApi.getBeatmaps({
                b: `${difficultyRandom.id}`
            }).then(beatmaps => {
                message.user.sendMessage(`[https://osu.ppy.sh/b/${difficultyRandom.id} ${difficultyRandom.artist} - ${difficultyRandom.title} [${beatmaps[0].version}]] | ${difficultyRandom.genre[0].toUpperCase() + difficultyRandom.genre.slice(1)} | ${map.rating(beatmaps[0].difficulty.rating)} ★ | ${map.duree(difficultyRandom.length)} ♪ | BPM: ${difficultyRandom.bpm}`)
            })
        } else if (modeSet == "3" || modeSet == "4" || modeSet == "5" || modeSet == "6" || modeSet == "7" || modeSet == "8") {
            let maps = JSON.parse(fs.readFileSync(`./maps/maps${defaultMode}.json`, "utf8"))
            let difficulty = modeSet
            let mapsDifficulty = []
            for (var i = 0, l = maps.length; i < l; i++) {
                for (var w = 0, x = maps[i].difficulty.length; w < x; w++) {
                    if (Math.round(maps[i].difficulty[w].rating) == difficulty) {
                        mapsDifficulty.push(maps[i].difficulty[w])
                    }
                }
            }
            var difficultyRandom = mapsDifficulty[Math.round(Math.random() * mapsDifficulty.length)]
            if (difficultyRandom == undefined) var difficultyRandom = mapsDifficulty[Math.round(Math.random() * mapsDifficulty.length)]
            console.log(difficultyRandom.id)
            message.user.sendMessage(`[https://osu.ppy.sh/b/${difficultyRandom.id} ${difficultyRandom.artist} - ${difficultyRandom.title} [${difficultyRandom.version}]] | ${difficultyRandom.genre[0].toUpperCase() + difficultyRandom.genre.slice(1)} | ${map.rating(difficultyRandom.rating)} ★ | ${map.duree(difficultyRandom.length)} ♪ | BPM: ${difficultyRandom.bpm}`)
        } else if (modeSet) {
            let maps = JSON.parse(fs.readFileSync(`./maps/maps${defaultMode}.json`, "utf8"))
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
            } else if (test.length <= 5) {
                message.user.sendMessage(`theya!bot doesn't has enough maps from this artist, please try "!r ${modeSet}"`)
            } else {
                var difficultyRandom = test[Math.round(Math.random() * test.length)]
                while (difficultyRandom == undefined) var difficultyRandom = test[Math.round(Math.random() * test.length)]
                osuApi.getBeatmaps({
                    b: difficultyRandom.id
                }).then(beatmaps => {
                    message.user.sendMessage(`[https://osu.ppy.sh/b/${beatmaps[0].id} ${beatmaps[0].artist} - ${beatmaps[0].title} [${beatmaps[0].version}]] | ${difficultyRandom.genre[0].toUpperCase() + difficultyRandom.genre.slice(1)} | ${map.rating(beatmaps[0].difficulty.rating)} ★ | ${map.duree(beatmaps[0].length.total)} ♪ | BPM: ${beatmaps[0].bpm}`)
                })
            }
        }
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
    } else if (defaultMode == "osu") {
        if (mode.toLowerCase() == "tech" || mode.toLowerCase() == "alternate" || mode.toLowerCase() == "reading" || mode.toLowerCase() == "stream" || mode.toLowerCase() == "classic" || mode.toLowerCase() == "jump") {
            setTimeout(function () {
                recommend(mode.toLowerCase())
                setTimeout(function () {
                    recommend(mode.toLowerCase())
                    setTimeout(function () {
                        recommend(mode.toLowerCase())
                        setTimeout(function () {
                            recommend(mode.toLowerCase())
                            setTimeout(function () {
                                recommend(mode.toLowerCase())
                            }, 1500)
                        }, 1500)
                    }, 1500)
                }, 1500)
            }, 5000)
        } else if (mode == "4" || mode == "5" || mode == "6" || mode == "7" || mode == "8") {
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
        } else {
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
    } else if (defaultMode == "mania") {
        if (mode.toLowerCase() == 'ln' || mode.toLowerCase() == 'sv' || mode.toLowerCase() == 'tech' || mode.toLowerCase() == 'classic' || mode.toLowerCase() == 'jacks' || mode.toLowerCase() == 'jumpstreams' || mode.toLowerCase() == 'handstreams') {
            setTimeout(function () {
                recommend(mode.toLowerCase())
                setTimeout(function () {
                    recommend(mode.toLowerCase())
                    setTimeout(function () {
                        recommend(mode.toLowerCase())
                        setTimeout(function () {
                            recommend(mode.toLowerCase())
                            setTimeout(function () {
                                recommend(mode.toLowerCase())
                            }, 1500)
                        }, 1500)
                    }, 1500)
                }, 1500)
            }, 5000)
        } else if (mode == "3" || mode == "4" || mode == "5" || mode == "6") {
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
        } else {
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
}


module.exports.help = {
    name: "bomb"
}