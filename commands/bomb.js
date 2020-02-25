const fs = require('fs')
const osu = require('node-osu')
const {
    categoryMania,
    categoryOsu
} = require("../category.js")
const {
    apiKey
} = require('../secret.js')
const map = require('../mapsDetails.js')
var osuApi = new osu.Api(apiKey, {
    notFoundAsError: true,
    completeScores: false
})
let already = new Set()
module.exports.run = async (message) => {
    let noDoublon = []
    let mode = JSON.parse(fs.readFileSync("./mode.json", "utf8"))
    if (!mode[message.user.ircUsername]) {
        mode[message.user.ircUsername] = {
            mode: "osu"
        }
    }

    function recommend(messages) {
        let modes = messages.split(' ')
        let defaultMode = mode[message.user.ircUsername].mode
        if (already.has(message.user.ircUsername)) return
        if (modes[1] == "mania" || modes[1] == "osu") {
            setTimeout(function () {
                let maps = JSON.parse(fs.readFileSync(`./maps/maps${modes[1]}.json`, "utf8"))
                var randomMap = maps[Math.round(Math.random() * maps.length)]
                if (randomMap == undefined) randomMap = maps[Math.round(Math.random() * maps.length)]
                while (noDoublon.includes(randomMap.id)) randomMap = maps[Math.round(Math.random() * maps.length)]
                console.log(randomMap.id)
                noDoublon.push(randomMap.id)
                osuApi.getBeatmaps({
                    b: randomMap.id
                }).then(beatmaps => {
                    message.user.sendMessage(`[https://osu.ppy.sh/b/${beatmaps[0].id} ${beatmaps[0].artist} - ${beatmaps[0].title} [${beatmaps[0].version}]] | ${randomMap.genre[0].toUpperCase() + randomMap.genre.slice(1)} | ${map.rating(beatmaps[0].difficulty.rating)} ★ | ${map.duree(beatmaps[0].length.total)} ♪ | BPM: ${beatmaps[0].bpm}`)
                })
            }, 1500);
        } else if (defaultMode == "osu") {
            let maps = JSON.parse(fs.readFileSync(`./maps/mapsOsu.json`, "utf8"))
            let maps1 = []
            let maps2 = []
            let maps3 = []
            if (!modes[1]) {
                var randomMap = maps[Math.floor(Math.random() * maps.length)]
                while (noDoublon.includes(randomMap.id)) randomMap = maps[Math.round(Math.random() * maps.length)]
                console.log(randomMap.id)
                noDoublon.push(randomMap.id)

                osuApi.getBeatmaps({
                    b: randomMap.id
                }).then(beatmaps => {
                    message.user.sendMessage(`[https://osu.ppy.sh/b/${beatmaps[0].id} ${beatmaps[0].artist} - ${beatmaps[0].title} [${beatmaps[0].version}]] | ${randomMap.genre[0].toUpperCase() + randomMap.genre.slice(1)} | ${map.rating(beatmaps[0].difficulty.rating)} ★ | ${map.duree(beatmaps[0].length.total)} ♪ | BPM: ${beatmaps[0].bpm}`)
                })
            }
            if (modes[1]) {
                if (modes[1] == "4" || modes[1] == "5" || modes[1] == "6" || modes[1] == "7" || modes[1] == "8") {
                    let difficulty = modes[1]
                    for (var i = 0, l = maps.length; i < l; i++) {
                        for (var w = 0, x = maps[i].difficulty.length; w < x; w++) {
                            if (Math.floor(maps[i].difficulty[w].rating) == difficulty) {
                                maps1.push(maps[i].difficulty[w])
                            }
                        }
                    }
                } else if (categoryOsu.includes(modes[1].toLowerCase())) {
                    let genre = modes[1].toLowerCase()
                    for (var i = 0, l = maps.length; i < l; i++) {
                        if (maps[i].genre == genre) {
                            maps1.push(maps[i])
                        }
                    }
                } else if (isNaN(modes[1])) {
                    let test = []
                    let mode = modes[1].split(" ")

                    for (var i = 0, l = maps.length; i < l; i++) {
                        if (test.includes(maps[i].artist.toLowerCase()) == true) {

                        } else if (maps[i].artist.toLowerCase() == modes[1].toLowerCase()) {
                            test.push(maps[i])
                        } else {
                            let artistR = maps[i].artist.toLowerCase().replace("(cv:", '').replace(")", '').replace("(", '').replace(".", '')
                            let artistSplit = artistR.split(' ')
                            split(i, artistSplit);
                        }
                    }

                    function split(i, artistSplit) {
                        for (var w = 0, y = artistSplit.length; w < y; w++) {
                            if (artistSplit[w] == 'feat.' || artistSplit[w] == 'feat' || artistSplit[w] == 'x' || artistSplit[w] == '&' || artistSplit[w] == '' || artistSplit[w] == ' ') {} else {
                                if (artistSplit[w] == mode[0].toLowerCase()) {
                                    maps1.push(maps[i])
                                }
                            }
                        }
                    }
                    if (maps1.length == 0) {
                        message.user.sendMessage("theya!bot doesn't have any map from this artist.")
                        return
                    }
                } else if (modes[1] >= 100 && modes[1] <= 300) {
                    let bpm = Math.round(modes[1] / 10) * 10
                    for (var i = 0, l = maps.length; i < l; i++) {
                        if (maps[i].bpm == bpm) {
                            maps1.push(maps[i])
                        }
                    }
                } else {
                    maps1.push(maps)
                }
                setTimeout(() => {
                    if (!modes[2]) {
                        var randomMap = maps1[Math.floor(Math.random() * maps1.length)]
                        while (noDoublon.includes(randomMap.id)) randomMap = maps[Math.round(Math.random() * maps.length)]

                        console.log(randomMap.id)
                        noDoublon.push(randomMap.id)

                        osuApi.getBeatmaps({
                            b: randomMap.id
                        }).then(beatmaps => {
                            message.user.sendMessage(`[https://osu.ppy.sh/b/${beatmaps[0].id} ${beatmaps[0].artist} - ${beatmaps[0].title} [${beatmaps[0].version}]] | ${randomMap.genre[0].toUpperCase() + randomMap.genre.slice(1)} | ${map.rating(beatmaps[0].difficulty.rating)} ★ | ${map.duree(beatmaps[0].length.total)} ♪ | BPM: ${beatmaps[0].bpm}`)
                        })
                    }
                    if (modes[2] && modes[2] != modes[1]) {
                        if (modes[2] == "4" || modes[2] == "5" || modes[2] == "6" || modes[2] == "7" || modes[2] == "8") {
                            let difficulty = modes[2]
                            for (var i = 0, l = maps1.length; i < l; i++) {
                                for (var w = 0, x = maps1[i].difficulty.length; w < x; w++) {
                                    if (Math.floor(maps1[i].difficulty[w].rating) == difficulty) {
                                        maps2.push(maps1[i].difficulty[w])
                                    }
                                }
                            }
                        } else if (categoryOsu.includes(modes[2].toLowerCase())) {
                            let genre = modes[2].toLowerCase()
                            for (var i = 0, l = maps1.length; i < l; i++) {
                                if (maps1[i].genre == genre) {
                                    maps2.push(maps1[i])
                                }
                            }
                        } else if (modes[2] >= 100 && modes[2] <= 300) {
                            let bpm = Math.round(modes[2] / 10) * 10
                            for (var i = 0, l = maps1.length; i < l; i++) {
                                if (maps1[i].bpm == bpm) {
                                    maps2.push(maps1[i])
                                }
                            }
                        } else {
                            maps2.push(maps1)
                        }
                        setTimeout(() => {
                            if (!modes[3]) {
                                if (maps2.length == undefined || maps2.length <= 5) {
                                    message.user.sendMessage('No maps with these criteria')
                                    already.add(message.user.ircUsername)
                                } else {
                                    var randomMap = maps2[Math.floor(Math.random() * maps2.length)]
                                    while (noDoublon.includes(randomMap.id)) randomMap = maps[Math.round(Math.random() * maps.length)]

                                    console.log(randomMap.id)
                                    noDoublon.push(randomMap.id)


                                    osuApi.getBeatmaps({
                                        b: randomMap.id
                                    }).then(beatmaps => {
                                        message.user.sendMessage(`[https://osu.ppy.sh/b/${beatmaps[0].id} ${beatmaps[0].artist} - ${beatmaps[0].title} [${beatmaps[0].version}]] | ${randomMap.genre[0].toUpperCase() + randomMap.genre.slice(1)} | ${map.rating(beatmaps[0].difficulty.rating)} ★ | ${map.duree(beatmaps[0].length.total)} ♪ | BPM: ${beatmaps[0].bpm}`)
                                    })
                                }
                            }
                            if (modes[3] && modes[3] != modes[2] && modes[3] != modes[1]) {
                                if (modes[3] == "4" || modes[3] == "5" || modes[3] == "6" || modes[3] == "7" || modes[3] == "8") {
                                    let difficulty = modes[3]
                                    for (var i = 0, l = maps2.length; i < l; i++) {
                                        for (var w = 0, x = maps2[i].difficulty.length; w < x; w++) {
                                            if (Math.floor(maps2[i].difficulty[w].rating) == difficulty) {
                                                maps3.push(maps2[i].difficulty[w])
                                            }
                                        }
                                    }
                                } else if (categoryOsu.includes(modes[3].toLowerCase())) {
                                    let genre = modes[3].toLowerCase()
                                    for (var i = 0, l = maps2.length; i < l; i++) {
                                        if (maps2[i].genre == genre) {
                                            maps3.push(maps2[i])
                                        }
                                    }
                                } else if (modes[3] >= 100 && modes[3] <= 300) {
                                    let bpm = Math.round(modes[3] / 10) * 10
                                    for (var i = 0, l = maps2.length; i < l; i++) {
                                        if (maps2[i].bpm == bpm) {
                                            maps3.push(maps2[i])
                                        }
                                    }
                                } else {
                                    maps3.push(maps2)
                                }
                                
                                if (maps3.length == undefined || maps3.length <= 5) {
                                    if (already.has(message.user.ircUsername)) return
                                    message.user.sendMessage('No maps with these criteria')
                                    already.add(message.user.ircUsername)
                                } else {
                                    var randomMap = maps3[Math.floor(Math.random() * maps3.length)]
                                    while (noDoublon.includes(randomMap.id)) randomMap = maps[Math.round(Math.random() * maps.length)]

                                    console.log(randomMap.id)
                                    noDoublon.push(randomMap.id)


                                    osuApi.getBeatmaps({
                                        b: randomMap.id
                                    }).then(beatmaps => {
                                        message.user.sendMessage(`[https://osu.ppy.sh/b/${beatmaps[0].id} ${beatmaps[0].artist} - ${beatmaps[0].title} [${beatmaps[0].version}]] | ${randomMap.genre[0].toUpperCase() + randomMap.genre.slice(1)} | ${map.rating(beatmaps[0].difficulty.rating)} ★ | ${map.duree(beatmaps[0].length.total)} ♪ | BPM: ${beatmaps[0].bpm}`)
                                    })
                                }
                            }
                        }, 1500);
                    }
                }, 1500);
            }
        } else if (defaultMode == "mania") {
            let maps = JSON.parse(fs.readFileSync(`./maps/mapsMania.json`, "utf8"))
            let maps1 = []
            let maps2 = []
            let maps3 = []
            if (!modes[1]) {
                var randomMap = maps[Math.floor(Math.random() * maps.length)]
                while (noDoublon.includes(randomMap.id)) randomMap = maps[Math.round(Math.random() * maps.length)]
                console.log(randomMap.id)
                noDoublon.push(randomMap.id)

                osuApi.getBeatmaps({
                    b: randomMap.id
                }).then(beatmaps => {
                    message.user.sendMessage(`[https://osu.ppy.sh/b/${beatmaps[0].id} ${beatmaps[0].artist} - ${beatmaps[0].title} [${beatmaps[0].version}]] | ${randomMap.genre[0].toUpperCase() + randomMap.genre.slice(1)} | ${map.rating(beatmaps[0].difficulty.rating)} ★ | ${map.duree(beatmaps[0].length.total)} ♪ | BPM: ${beatmaps[0].bpm}`)
                })
            }
            if (modes[1]) {
                if (modes[1] == "3" || modes[1] == "4" || modes[1] == "5" || modes[1] == "6") {
                    let difficulty = modes[1]
                    for (var i = 0, l = maps.length; i < l; i++) {
                        for (var w = 0, x = maps[i].difficulty.length; w < x; w++) {
                            if (Math.floor(maps[i].difficulty[w].rating) == difficulty) {
                                maps1.push(maps[i].difficulty[w])
                            }
                        }
                    }
                } else if (categoryOsu.includes(modes[1].toLowerCase())) {
                    let genre = modes[1].toLowerCase()
                    for (var i = 0, l = maps.length; i < l; i++) {
                        if (maps[i].genre == genre) {
                            maps1.push(maps[i])
                        }
                    }
                } else if (isNaN(modes[1])) {
                    let test = []
                    let mode = modes[1].split(" ")

                    for (var i = 0, l = maps.length; i < l; i++) {
                        if (test.includes(maps[i].artist.toLowerCase()) == true) {

                        } else if (maps[i].artist.toLowerCase() == modes[1].toLowerCase()) {
                            test.push(maps[i])
                        } else {
                            let artistR = maps[i].artist.toLowerCase().replace("(cv:", '').replace(")", '').replace("(", '').replace(".", '')
                            let artistSplit = artistR.split(' ')
                            split(i, artistSplit);
                        }
                    }

                    function split(i, artistSplit) {
                        for (var w = 0, y = artistSplit.length; w < y; w++) {
                            if (artistSplit[w] == 'feat.' || artistSplit[w] == 'feat' || artistSplit[w] == 'x' || artistSplit[w] == '&' || artistSplit[w] == '' || artistSplit[w] == ' ') {} else {
                                if (artistSplit[w] == mode[0].toLowerCase()) {
                                    maps1.push(maps[i])
                                }
                            }
                        }
                    }
                    if (maps1.length == 0) {
                        message.user.sendMessage("theya!bot doesn't have any map from this artist.")
                        already.add(message.user.ircUsername)
                    } else if (maps1.length <= 5) {
                        message.user.sendMessage(`theya!bot doesn't has enough maps from this artist, please try "!r ${modes[1]}"`)
                        already.add(message.user.ircUsername)
                        return
                    }
                } else if (modes[1] >= 100 && modes[1] <= 300) {
                    let bpm = Math.round(modes[1] / 10) * 10
                    for (var i = 0, l = maps.length; i < l; i++) {
                        if (maps[i].bpm == bpm) {
                            maps1.push(maps[i])
                        }
                    }
                } else {
                    maps1.push(maps)
                }
                setTimeout(() => {
                    if (!modes[2]) {
                        var randomMap = maps1[Math.floor(Math.random() * maps1.length)]
                        while (noDoublon.includes(randomMap.id)) randomMap = maps[Math.round(Math.random() * maps.length)]

                        console.log(randomMap.id)
                        noDoublon.push(randomMap.id)

                        osuApi.getBeatmaps({
                            b: randomMap.id
                        }).then(beatmaps => {
                            message.user.sendMessage(`[https://osu.ppy.sh/b/${beatmaps[0].id} ${beatmaps[0].artist} - ${beatmaps[0].title} [${beatmaps[0].version}]] | ${randomMap.genre[0].toUpperCase() + randomMap.genre.slice(1)} | ${map.rating(beatmaps[0].difficulty.rating)} ★ | ${map.duree(beatmaps[0].length.total)} ♪ | BPM: ${beatmaps[0].bpm}`)
                        })
                    }
                    if (modes[2] && modes[2] != modes[1]) {
                        if (modes[2] == "3" || modes[2] == "4" || modes[2] == "5" || modes[2] == "6") {
                            let difficulty = modes[2]
                            for (var i = 0, l = maps1.length; i < l; i++) {
                                for (var w = 0, x = maps1[i].difficulty.length; w < x; w++) {
                                    if (Math.floor(maps1[i].difficulty[w].rating) == difficulty) {
                                        maps2.push(maps1[i].difficulty[w])
                                    }
                                }
                            }
                        } else if (categoryOsu.includes(modes[2].toLowerCase())) {
                            let genre = modes[2].toLowerCase()
                            for (var i = 0, l = maps1.length; i < l; i++) {
                                if (maps1[i].genre == genre) {
                                    maps2.push(maps1[i])
                                }
                            }
                        } else if (modes[2] >= 100 && modes[2] <= 300) {
                            let bpm = Math.round(modes[2] / 10) * 10
                            for (var i = 0, l = maps1.length; i < l; i++) {
                                if (maps1[i].bpm == bpm) {
                                    maps2.push(maps1[i])
                                }
                            }
                        } else {
                            maps2.push(maps1)
                        }
                        setTimeout(() => {
                            if (!modes[3]) {
                                if (maps2.length == undefined || maps2.length <= 5) {
                                    message.user.sendMessage('No maps with these criteria')
                                    already.add(message.user.ircUsername)
                                } else {
                                    var randomMap = maps2[Math.floor(Math.random() * maps2.length)]
                                    while (noDoublon.includes(randomMap.id)) randomMap = maps[Math.round(Math.random() * maps.length)]

                                    console.log(randomMap.id)
                                    noDoublon.push(randomMap.id)


                                    osuApi.getBeatmaps({
                                        b: randomMap.id
                                    }).then(beatmaps => {
                                        message.user.sendMessage(`[https://osu.ppy.sh/b/${beatmaps[0].id} ${beatmaps[0].artist} - ${beatmaps[0].title} [${beatmaps[0].version}]] | ${randomMap.genre[0].toUpperCase() + randomMap.genre.slice(1)} | ${map.rating(beatmaps[0].difficulty.rating)} ★ | ${map.duree(beatmaps[0].length.total)} ♪ | BPM: ${beatmaps[0].bpm}`)
                                    })
                                }
                            }
                            if (modes[3] && modes[3] != modes[2] && modes[3] != modes[1]) {
                                if (modes[3] == "3" || modes[3] == "4" || modes[3] == "5" || modes[3] == "6") {
                                    let difficulty = modes[3]
                                    for (var i = 0, l = maps2.length; i < l; i++) {
                                        for (var w = 0, x = maps2[i].difficulty.length; w < x; w++) {
                                            if (Math.floor(maps2[i].difficulty[w].rating) == difficulty) {
                                                maps3.push(maps2[i].difficulty[w])
                                            }
                                        }
                                    }
                                } else if (categoryOsu.includes(modes[3].toLowerCase())) {
                                    let genre = modes[3].toLowerCase()
                                    for (var i = 0, l = maps2.length; i < l; i++) {
                                        if (maps2[i].genre == genre) {
                                            maps3.push(maps2[i])
                                        }
                                    }
                                } else if (modes[3] >= 100 && modes[3] <= 300) {
                                    let bpm = Math.round(modes[3] / 10) * 10
                                    for (var i = 0, l = maps2.length; i < l; i++) {
                                        if (maps2[i].bpm == bpm) {
                                            maps3.push(maps2[i])
                                        }
                                    }
                                } else {
                                    maps3.push(maps2)
                                }
                                if (maps3.length == undefined || maps3.length <= 5) {
                                    if (already.has(message.user.ircUsername)) return
                                    message.user.sendMessage('No maps with these criteria')
                                    already.add(message.user.ircUsername)
                                } else {
                                    var randomMap = maps3[Math.floor(Math.random() * maps3.length)]
                                    while (noDoublon.includes(randomMap.id)) randomMap = maps[Math.round(Math.random() * maps.length)]

                                    console.log(randomMap.id)
                                    noDoublon.push(randomMap.id)


                                    osuApi.getBeatmaps({
                                        b: randomMap.id
                                    }).then(beatmaps => {
                                        message.user.sendMessage(`[https://osu.ppy.sh/b/${beatmaps[0].id} ${beatmaps[0].artist} - ${beatmaps[0].title} [${beatmaps[0].version}]] | ${randomMap.genre[0].toUpperCase() + randomMap.genre.slice(1)} | ${map.rating(beatmaps[0].difficulty.rating)} ★ | ${map.duree(beatmaps[0].length.total)} ♪ | BPM: ${beatmaps[0].bpm}`)
                                    })
                                }
                            }
                        }, 1500);
                    }
                }, 1500);
            }
        }
    }

    setTimeout(function () {
        recommend(message.message)
        setTimeout(function () {
            recommend(message.message)
            setTimeout(function () {
                recommend(message.message)
                setTimeout(function () {
                    recommend(message.message)
                    setTimeout(function () {
                        recommend(message.message)
                        setTimeout(function () {
                            already.delete(message.user.ircUsername)
                            setTimeout(function () {
                                noDoublon = []
                            }, 1500)
                        }, 1500)
                    }, 1500)
                }, 1500)
            }, 1500)
        }, 1500)
    }, 2000)
}


module.exports.help = {
    name: "bomb"
}