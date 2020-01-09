const fs = require('fs')
const osu = require('node-osu')
const apiKey = require('C:/Users/Theya/Desktop/theya-bot/secret.js')
const map = require('C:/Users/Theya/Desktop/theya-bot/mapsDetails.js')
var osuApi = new osu.Api(apiKey, {
  notFoundAsError: true,
  completeScores: false
})

module.exports.run = async (message, /*lastMap*/) => {
  fs.readFile(`./maps/mapsGnf.txt`, 'utf8', (err, file) => {
    if (err) throw err
    var Array = file.match(/.{1,7}/g)
    var randomItem = Array[Math.round(Math.random() * Array.length)]
    var maps = randomItem - 1
    console.log(randomItem)

    osuApi.getBeatmaps({ b: `${randomItem}` }).then(beatmaps => {
      message.user.sendMessage(`[https://osu.ppy.sh/b/${randomItem} ${beatmaps[0].artist} - ${beatmaps[0].title} [${beatmaps[0].version}]] | ${map.genre(maps)} | ${map.rating(beatmaps[0].difficulty.rating)} ★ | ${map.duree(beatmaps[0].length.total)} ♪ | BPM: ${beatmaps[0].bpm}`)
    })
  })

}
module.exports.help = {
  name: "oktier"
}