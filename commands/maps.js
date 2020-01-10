const fs = require('fs')

module.exports.run = async (message) => {
    let mapsOsu = JSON.parse(fs.readFileSync(`./maps/mapsOsu.json`, "utf8"))        
    let mapsMania = JSON.parse(fs.readFileSync(`./maps/mapsMania.json`, "utf8"))                  
            message.user.sendMessage(`There are ${mapsOsu.length} osu! beatmaps & ${mapsMania.length} osu!mania beatmaps in the bot`)   
}
module.exports.help = {
    name: "maps"
}