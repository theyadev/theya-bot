const fs = require('fs')

module.exports.run = async (message, cooldown) => {
    cooldown.add(message.user.ircUsername)
    fs.readFile('./maps/mapsOsu.txt', 'utf8', (err, fileOsu) => {
        fs.readFile('./maps/mapsMania.txt', 'utf8', (err, fileMania) => {
            if (err) throw err
            var ArrayOsu = fileOsu.match(/.{1,7}/g)
            var ArrayMania = fileMania.match(/.{1,7}/g)
            message.user.sendMessage(`There are ${ArrayOsu.length} osu! beatmaps & ${ArrayMania.length} osu!mania beatmaps in the bot`)
        })
    })
}
module.exports.help = {
    name: "maps"
}