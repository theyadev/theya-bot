const Banchojs = require("bancho.js");
const fs = require('fs')
const { USERNAME, PASSWORD, prefix } = require('./config.json')

const client = new Banchojs.BanchoClient({ username: USERNAME, password: PASSWORD });
client.commands = new Map()

let cooldowng = new Set()
let cooldown = new Set()
let cdseconds = 10

fs.readdir("./commands/", (err, files) => {
    if (err) console.log(err)

    let jsfile = files.filter(f => f.split(".").pop() === "js")
    if (jsfile.length <= 0) {
        console.log("No commands find")
        return
    }
    jsfile.forEach((f, i) => {
        let props = require(`./commands/${f}`)
        console.log(`${f} Loaded.`)
        client.commands.set(props.help.name, props)
        client.commands.set(props.help.alias, props)
    })
})

const getDefaultMode = require('./functions/get.js').defaultMode

client.connect().then(() => {
    console.log("We're online! Now listening for incoming messages.");
    client.on("PM", (message) => {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getFullYear();
        var hours = today.getHours()
        var mins = today.getMinutes().toString().padStart(2, '0')

        var todays = mm + '/' + dd + '/' + yyyy + ' ' + hours + ":" + mins;
        console.log(`${todays} | ${message.user.ircUsername}: ${message.message}`)
        if (message.user.ircUsername == USERNAME) return
        if (message.message[0] != prefix) return


        if (cooldowng.has(message.user.ircUsername)) return
        if (cooldown.has(message.user.ircUsername)) {
            cooldowng.add(message.user.ircUsername)
            message.user.sendMessage(`Please wait ${cdseconds} seconds before sending another command.`)
            return
        }

        let args = message.message.slice(prefix.length).split(/ +/);
        args.shift()
        let command = message.message.split(" ")
        let cmd = command[0].toLowerCase()
        let commandfile = client.commands.get(cmd.slice(prefix.length))
        if (commandfile) {
            cooldown.add(message.user.ircUsername)
            commandfile.run(message, args)
        }
        setTimeout(() => {
            cooldown.delete(message.user.ircUsername)
            cooldowng.delete(message.user.ircUsername)
        }, cdseconds * 1000)
    });
}).catch(console.error);