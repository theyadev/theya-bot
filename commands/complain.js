const fs = require('fs')

module.exports.run = async (message,/*userLastMap*/) => {
    message.user.sendMessage('Sorry, complain command has some issue, please try again later')
   /* lastMap = JSON.parse(fs.readFileSync("./lastMap.json", "utf8"))
    if (!lastMap[message.user.ircUsername]) {
        lastMap[message.user.ircUsername] = {
            lastMap: " "
        }
    }
    userLastMap = lastMap[message.user.ircUsername].lastMap
    fs.appendFile('./mapsReceived/mapsComplain.txt', JSON.stringify(userLastMap) + "\n", (err) => {
        if (err) throw err
        console.log('Beatmap Sauvegardée.')
        message.user.sendMessage('Your complaint has been taken into account.')
    })*/
}
module.exports.help = {
    name: "complain"
}