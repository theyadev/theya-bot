const Banchojs = require("bancho.js")
const osu = require('node-osu')
const fs = require('fs')
const { USERNAME, PASSWORD, apiKey } = require('./secret')
const map = require('./mapsDetails.js')
const client = new Banchojs.BanchoClient({ username: USERNAME, password: PASSWORD })
const prefix = "!"

client.commands = new Map()

var osuApi = new osu.Api(apiKey, {
  notFoundAsError: true,
  completeScores: false
})

var rateLimiter = 0

let mode = 0
let cooldowng = new Set()
let cooldown = new Set()
let cdseconds = 13

let request = new Set()
setInterval(function(){ 
  fs.writeFile("./lastMap.json", '{}', (err) => {
    if (err) throw err
})
 }, 1800000);
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
const startOsuBot = async () => {
  try {
    await client.connect()
    console.log("Theya!Bot is Online...")
    let mapsOsu = JSON.parse(fs.readFileSync(`./maps/mapsOsu.json`, "utf8"))
    let mapsMania = JSON.parse(fs.readFileSync(`./maps/mapsMania.json`, "utf8"))

    console.log(`${mapsOsu.length} osu! maps in the bot.`)
    console.log(`${mapsMania.length} osu!mania maps in the bot.`)


    fs.readFile('./users.txt', 'utf8', (err, usersList) => {
      if (err) throw err
      var lignes = usersList.split(/\r\n|\r|\n/)
      console.log(`${lignes.length} users registered.`)
    })
    client.on("PM", async (message) => {
      if (message.user.ircUsername === USERNAME) return
      let messageArray = message.message.split(" ")
      let cmd = messageArray[0].toLowerCase()
      let commandfile = client.commands.get(cmd.slice(prefix.length))

      mode = JSON.parse(fs.readFileSync("./mode.json", "utf8"))
      if (!mode[message.user.ircUsername]) {
        mode[message.user.ircUsername] = {
          mode: "osu"
        }
      }
      let defaultMode = mode[message.user.ircUsername].mode

      let lastMap = JSON.parse(fs.readFileSync("./lastMap.json", "utf8"))
      if (!lastMap[message.user.ircUsername]) {
        lastMap[message.user.ircUsername] = {
          lastmap: " "
        }
      }
      let userLastmap = lastMap[message.user.ircUsername].lastmap

      fs.readFile('./users.txt', 'utf8', (err, usersList) => {
        if (err) throw err
        var lignes = usersList.split(/\r\n|\r|\n/)
        if (lignes.indexOf(message.user.ircUsername) == -1 && message.message.indexOf('!') == 0) {
          fs.appendFile('./users.txt', `${message.user.ircUsername}\n`, (err) => {
            if (err) throw err
            console.log('Joueur Sauvegardé.')
          })
        }
      })
      if (cooldowng.has(message.user.ircUsername)) return
      if (message.message[0] == prefix) {
      if (rateLimiter >= 60) {
        cooldowng.add(message.user.ircUsername)
        message.user.sendMessage('The bot has too many request, please retry in a few seconds.')
        return
      }
      if (cooldown.has(message.user.ircUsername)) {
        cooldowng.add(message.user.ircUsername)
        message.user.sendMessage(`Please wait ${cdseconds} seconds before making another commands.`)
        return
      }
      if (commandfile) {
        cooldown.add(message.user.ircUsername)
        rateLimiter++
        commandfile.run(message, cooldown, mode, lastMap, mode)
      }
    }
      setTimeout(() => {
        cooldown.delete(message.user.ircUsername)
        cooldowng.delete(message.user.ircUsername)
      }, cdseconds * 1000)
      if (rateLimiter == 1) {
        setTimeout(() => {
          rateLimiter = 0
        }, 60000)
      }
      if (message.message.indexOf("!request") == 0) {
        message.user.sendMessage('Please /np the map. (You have 30 seconds)')
        request.add(message.user.ircUsername)
      }
      if (!request.has(message.user.ircUsername)) return
      if (request.has(message.user.ircUsername) && message.message.includes('osu.ppy.sh') == true) {
        fs.appendFile('./mapsReceived/requestedMaps.txt', `${message.message}\n`, (err) => {
          if (err) throw err
          console.log('Beatmap Sauvegardée.')
          message.user.sendMessage('The beatmap has been saved, you may find it in the bot soon!')
        })
      }
      setTimeout(function () {
        request.delete(message.user.ircUsername)
        return
      }, 30000)
    })
  }
  catch (err) {
    console.error(err)
  }
}
startOsuBot()