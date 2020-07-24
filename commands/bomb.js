const mapRating = require('../functions/details.js').mapRating
const mapLength = require('../functions/details.js').mapLength
const bombRandomMap = require('../functions/get.js').bombRandomMap
const getDefaultMode = require('../functions/get.js').defaultMode

module.exports.run = async (message, args) => {
    getDefaultMode(message.user.ircUsername, function (mode) {
        bombRandomMap(args, mode, function (err, maps) {
            if (maps == null || maps.length == 0) {
                message.user.sendMessage('Sorry, no match was found with these criterias.')
                return
            }
            if (maps[0] == undefined || maps.length < 3) {
                message.user.sendMessage('Sorry, no enough match was found with these criterias. Please try with !r.')
                return
            }
            maps.forEach(map => {
              message.user.sendMessage(`[https://osu.ppy.sh/b/${map.id} ${map.artist} - ${map.title} [${map.version}]] | ${map.genre[0].toUpperCase() + map.genre.slice(1)} | ${mapRating(map.rating)} ★ | ${mapLength(map.length)} ♪ | BPM: ${map.bpm}`)
            });
        })
    })
}
module.exports.help = {
    name: "bomb"
}