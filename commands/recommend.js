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
const {
    tester
} = require('../category.js')
var osuApi = new osu.Api(apiKey, {
    notFoundAsError: true,
    completeScores: false
})

var GoogleSpreadsheet = require('google-spreadsheet');
var async = require('async');
var doc = new GoogleSpreadsheet('1yfta-E52NcQRPdnqBQKbo5m-pVe0Jn6xJ-pzQygGxhs');
var sheet;

let lastMapTest = []
let mapsTest = []
let currentBeatmapIndex = 0;
setInterval(function () {
    mapsTest = []
    currentBeatmapIndex = 0;
    async.series([
        function setAuth(step) {
            var creds = require('../client_secret.json');

            doc.useServiceAccountAuth(creds, step);
        },
        function getInfoAndWorksheets(step) {
            doc.getInfo(function (err, info) {
                console.log('Loaded doc: ' + info.title + ' by ' + info.author.email);
                sheet = info.worksheets[0];
                console.log('sheet 1: ' + sheet.title + ' ' + sheet.rowCount + 'x' + sheet.colCount);
                step();
            });
        },
        function workingWithRows(step) {
            // google provides some query options
            sheet.getRows({
                offset: 1,
                orderby: 'id'
            }, function (err, rows) {
                console.log('Read ' + rows.length + ' rows');
                for (var i = 0, l = rows.length; i < l; i++) {
                    if (rows[i].mode == "Standard") {
                        if (rows[i].approved.toLowerCase() == "ok" || rows[i].approved.toLowerCase() == "oui" || rows[i].approved.toLowerCase() == "no" || rows[i].approved.toLowerCase() == "non") {

                        } else {
                            mapsTest.push(rows[i].id)
                        }
                    }

                }
                step();
            });
        },
    ], function (err) {
        if (err) {
            console.log('Error: ' + err);
        }
    });

    function shuffle(arra1) {
        var ctr = arra1.length,
            temp, index;

        // While there are elements in the array
        while (ctr > 0) {
            // Pick a random index
            index = Math.floor(Math.random() * ctr);
            // Decrease ctr by 1
            ctr--;
            // And swap the last element with it
            temp = arra1[ctr];
            arra1[ctr] = arra1[index];
            arra1[index] = temp;
        }
        return arra1;
    }
    mapsTest = shuffle(mapsTest)
}, 1800000);

module.exports.run = async (message, lastMap, mode) => {
    let modes = message.message.split(" ")
    let defaultMode = mode[message.user.ircUsername].mode
    if (modes[1] == "mania" || modes[1] == "osu") {
        setTimeout(function () {
            let maps = JSON.parse(fs.readFileSync(`./maps/maps${modes[1]}.json`, "utf8"))
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
        }, 1500);
    } else if (modes[1] == "test") {
        if (tester.includes(message.user.ircUsername)) {
            lastMapTest[message.user.ircUsername] = mapsTest[currentBeatmapIndex]
            osuApi.getBeatmaps({
                b: mapsTest[currentBeatmapIndex]
            }).then(beatmaps => {
                message.user.sendMessage(`[https://osu.ppy.sh/b/${beatmaps[0].id} ${beatmaps[0].artist} - ${beatmaps[0].title} [${beatmaps[0].version}]] | ${map.rating(beatmaps[0].difficulty.rating)} ★ | ${map.duree(beatmaps[0].length.total)} ♪ | BPM: ${beatmaps[0].bpm}`)
            })
            currentBeatmapIndex++
        }
    } else if (modes[1] == "yes" || modes[1] == "y") {
        if (tester.includes(message.user.ircUsername)) {
            if (lastMapTest[message.user.ircUsername] == undefined) {
                message.user.sendMessage("You don't have a last map.")
            } else {
                async.series([
                    function setAuth(step) {
                        var creds = require('../client_secret.json');

                        doc.useServiceAccountAuth(creds, step);
                    },
                    function getInfoAndWorksheets(step) {
                        doc.getInfo(function (err, info) {
                            sheet = info.worksheets[0];
                            step();
                        });
                    },
                    function workingWithRows(step) {
                        // google provides some query options
                        sheet.getRows({
                            offset: 1,
                        }, function (err, rows) {
                            console.log('Read ' + rows.length + ' rows');
                            for (var i = 0, l = rows.length; i < l; i++) {
                                if (rows[i].id == lastMapTest[message.user.ircUsername]) {
                                    rows[i].approved = 'ok'; // update a value
                                    rows[i].save();
                                }
                            }
                            step();
                        });
                    },
                ], function (err) {
                    if (err) {
                        console.log('Error: ' + err);
                    }
                });
                message.user.sendMessage("The map has been approved.")
            }
        }
    } else if (modes[1] == "no" || modes[1] == "n") {
        if (tester.includes(message.user.ircUsername)) {
            if (lastMapTest[message.user.ircUsername] == undefined) {
                message.user.sendMessage("You don't have a last map.")
            } else {
                async.series([
                    function setAuth(step) {
                        var creds = require('../client_secret.json');

                        doc.useServiceAccountAuth(creds, step);
                    },
                    function getInfoAndWorksheets(step) {
                        doc.getInfo(function (err, info) {
                            sheet = info.worksheets[0];
                            step();
                        });
                    },
                    function workingWithRows(step) {
                        // google provides some query options
                        sheet.getRows({
                            offset: 1,
                        }, function (err, rows) {
                            console.log('Read ' + rows.length + ' rows');
                            for (var i = 0, l = rows.length; i < l; i++) {
                                if (rows[i].id == lastMapTest[message.user.ircUsername]) {
                                    rows[i].approved = 'no'; // update a value
                                    rows[i].save();
                                }
                            }
                            step();
                        });
                    },
                ], function (err) {
                    if (err) {
                        console.log('Error: ' + err);
                    }
                });
                message.user.sendMessage("The map has not been approved.")
            }
        }
    } else if (modes[1] == "genre" || modes[1] == "g") {
        if (tester.includes(message.user.ircUsername)) {
            if (categoryOsu.includes(modes[2].toLowerCase())) {
                if (lastMapTest[message.user.ircUsername] == undefined) {
                    message.user.sendMessage("You don't have a last map.")
                } else {
                    async.series([
                        function setAuth(step) {
                            var creds = require('../client_secret.json');

                            doc.useServiceAccountAuth(creds, step);
                        },
                        function getInfoAndWorksheets(step) {
                            doc.getInfo(function (err, info) {
                                sheet = info.worksheets[0];
                                step();
                            });
                        },
                        function workingWithRows(step) {
                            // google provides some query options
                            sheet.getRows({
                                offset: 1,
                            }, function (err, rows) {
                                console.log('Read ' + rows.length + ' rows');
                                for (var i = 0, l = rows.length; i < l; i++) {
                                    if (rows[i].id == lastMapTest[message.user.ircUsername]) {
                                        rows[i].genre = modes[2].toLowerCase(); // update a value
                                        rows[i].save();
                                    }
                                }
                                step();
                            });
                        },
                    ], function (err) {
                        if (err) {
                            console.log('Error: ' + err);
                        }
                    });
                    message.user.sendMessage("The genre has been set to : " + modes[2].toLowerCase() + ".")
                }
            } else {
                message.user.sendMessage('This is not a genre.')
            }
        }
    } else if (defaultMode == "osu") {
        let maps = JSON.parse(fs.readFileSync(`./maps/mapsOsu.json`, "utf8"))
        let maps1 = []
        let maps2 = []
        let maps3 = []
        if (!modes[1]) {
            var randomMap = maps[Math.floor(Math.random() * maps.length)]
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
                        if (artistSplit[w] == 'feat.' || artistSplit[w] == 'feat' || artistSplit[w] == 'x' || artistSplit[w] == '&' || artistSplit[w] == '' || artistSplit[w] == ' ') {
                        } else {
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
                            var randomMap = maps2[Math.floor(Math.random() * maps2.length)]
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
                            var randomMap = maps3[Math.floor(Math.random() * maps3.length)]
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
                        if (artistSplit[w] == 'feat.' || artistSplit[w] == 'feat' || artistSplit[w] == 'x' || artistSplit[w] == '&' || artistSplit[w] == '' || artistSplit[w] == ' ') {
                        } else {
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
                            var randomMap = maps2[Math.floor(Math.random() * maps2.length)]
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
                            var randomMap = maps3[Math.floor(Math.random() * maps3.length)]
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

                        }
                    }, 1500);
                }
            }, 1500);
        }
    }
}
module.exports.help = {
    name: "recommend"
}