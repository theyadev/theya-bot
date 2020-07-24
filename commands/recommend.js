const mapRating = require('../functions/details.js').mapRating
const mapLength = require('../functions/details.js').mapLength
const randomMap = require('../functions/get.js').randomMap
const getDefaultMode = require('../functions/get.js').defaultMode

module.exports.run = async (message, args) => {
    getDefaultMode(message.user.ircUsername, function(mode) {  
    randomMap(args, mode, function (err, map) {
        if (map == null || map.length == 0) {
            message.user.sendMessage('Sorry, no match was found with these criterias.')
            return
        }
        message.user.sendMessage(`[https://osu.ppy.sh/b/${map.id} ${map.artist} - ${map.title} [${map.version}]] | ${map.genre[0].toUpperCase() + map.genre.slice(1)} | ${mapRating(map.rating)} ★ | ${mapLength(map.length)} ♪ | BPM: ${map.bpm}`)
    })
})
}
module.exports.help = {
    name: "r",
    alias: 'recommend'
}