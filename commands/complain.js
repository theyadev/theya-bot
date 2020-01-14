const fs = require('fs')

module.exports.run = async (message) => {
    let lastMap = JSON.parse(fs.readFileSync("./lastMap.json", "utf8"))
    let userLastmap = lastMap[message.user.ircUsername].lastmap
    console.log(userLastmap)
    if (!userLastmap == " ") {
        fs.appendFile('./mapsReceived/mapsComplain.txt', JSON.stringify(userLastmap) + "\n", (err) => {
            if (err) throw err
            console.log('Beatmap Sauvegardée.')
            message.user.sendMessage('Your complaint has been taken into account.')
        })
    } else {
        message.user.sendMessage("Sorry you don't have a last map")
    }
}
module.exports.help = {
    name: "complain"
}