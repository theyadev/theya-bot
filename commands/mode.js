const fs = require('fs')

module.exports.run = async (message, mode) => {
    const CTV = message.message.slice(6)
    if (CTV == "osu" || CTV == "mania") {
        mode[message.user.ircUsername] = {
            mode: message.message.slice(6)
        }
        fs.writeFile("./mode.json", JSON.stringify(mode), (err) => {
            if (err) throw err
        })
        let defaultMode = mode[message.user.ircUsername].mode
        message.user.sendMessage(`Your default game mode is now set to : ${defaultMode}`)
    } else {
        message.user.sendMessage('Correct usage : !mode <mania/osu>')
    }
}
module.exports.help = {
    name: "mode"
}