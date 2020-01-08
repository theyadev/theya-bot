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
let cooldowng = new Set()
let cooldown = new Set()
let cooldownMappool = new Set()
let cooldownr = new Set()
let cdsecondsr = 5
let cdseconds = 10
let cdsecondsMappool = 60
let request = new Set()

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
    fs.readFile('./maps/mapsOsu.txt', 'utf8', (err, fileOsu) => {
      fs.readFile('./maps/mapsMania.txt', 'utf8', (err, fileMania) => {
        if (err) throw err
        var ArrayOsu = fileOsu.match(/.{1,7}/g)
        var ArrayMania = fileMania.match(/.{1,7}/g)
        console.log(`${ArrayOsu.length} osu! maps in the bot.`)
        console.log(`${ArrayMania.length} osu!mania maps in the bot.`)
      })
    })
    fs.readFile('./users.txt', 'utf8', (err, usersList) => {
      if (err) throw err
      var lignes = usersList.split(/\r\n|\r|\n/)
      console.log(`${lignes.length} users registered.`)
    })
    client.on("PM", async (message) => {
      if (message.user.ircUsername === USERNAME) return
      let messageArray = message.message.split(" ")
      let cmd = messageArray[0]
      let commandfile = client.commands.get(cmd.slice(prefix.length))
      let mode = JSON.parse(fs.readFileSync("./mode.json", "utf8"))
      if (!mode[message.user.ircUsername]) {
        mode[message.user.ircUsername] = {
          mode: "osu"
        }
      }
      let defaultMode = mode[message.user.ircUsername].mode

      let lastMap = JSON.parse(fs.readFileSync("./lastMap.json", "utf8"))
      if (!lastMap[message.user.ircUsername]) {
        lastMap[message.user.ircUsername] = {
          lastMap: " "
        }
      }
      let userLastMap = lastMap[message.user.ircUsername].lastMap
      fs.readFile('./users.txt', 'utf8', (err, usersList) => {
        if (err) throw err
        var lignes = usersList.split(/\r\n|\r|\n/)
        if (lignes.indexOf(message.user.ircUsername) == -1 && message.message.indexOf('!') == 0) {
          message.user.sendMessage('Hey ! I see its the first time you use the bot :o')
          message.user.sendMessage('Go check !help & !info for a good start !')
          fs.appendFile('./users.txt', `${message.user.ircUsername}\n`, (err) => {
            if (err) throw err
            console.log('Joueur Sauvegardé.')
          })
        }
      })
      function mappool(mappoolTxt) {
        setTimeout(function () {
          message.user.sendMessage("Maps NM :")
          requestsMappool(mappoolTxt, 0)
          requestsMappool(mappoolTxt, 1)
          setTimeout(function () {
            requestsMappool(mappoolTxt, 2)
            requestsMappool(mappoolTxt, 3)
          }, 1000)
        }, 6000)
        setTimeout(function () {
          message.user.sendMessage("Maps HD :")
          requestsMappool(mappoolTxt, 4)
          requestsMappool(mappoolTxt, 5)
        }, 12000)
        setTimeout(function () {
          message.user.sendMessage("Maps HR :")
          requestsMappool(mappoolTxt, 6)
          requestsMappool(mappoolTxt, 7)
        }, 18000)
        setTimeout(function () {
          message.user.sendMessage("Maps FM :")
          requestsMappool(mappoolTxt, 8)
          requestsMappool(mappoolTxt, 9)
        }, 24000)
        setTimeout(function () {
          message.user.sendMessage("TieBreaker :")
          requestsMappool(mappoolTxt, 10)
        }, 30000)
      }
      function requestsMappool(mappoolTxt, nombre) {
        rateLimiter += 1
        fs.readFile(`./maps/${mappoolTxt}`, 'utf8', (err, file) => {
          if (err) throw err
          var Array = file.match(/.{1,7}/g)

          osuApi.getBeatmaps({ b: Array[nombre] }).then(beatmaps => {
            var nombre = beatmaps[0].difficulty.rating
            duration = beatmaps[0].length.total

            message.user.sendMessage(`[https://osu.ppy.sh/b/${beatmaps[0].id} ${beatmaps[0].artist} - ${beatmaps[0].title} [${beatmaps[0].version}]] | ${map.rating(beatmaps[0].difficulty.rating)} ★ | ${map.duree(beatmaps[0].length.total)} ♪ | BPM: ${beatmaps[0].bpm} | CS: ${beatmaps[0].difficulty.size} OD: ${beatmaps[0].difficulty.overall} AR: ${beatmaps[0].difficulty.approach} HP: ${beatmaps[0].difficulty.drain}`)
          })
        })
        return
      }
      if (cooldowng.has(message.user.ircUsername)) return
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
      if (cooldownMappool.has(message.user.ircUsername)) {
        cooldowng.add(message.user.ircUsername)
        message.user.sendMessage(`Please wait ${cdsecondsMappool} seconds before making another commands.`)
        return
      }
      if (cooldownr.has(message.user.ircUsername)) {
        cooldowng.add(message.user.ircUsername)
        message.user.sendMessage(`Please wait ${cdsecondsr} seconds before making another commands.`)
        return
      }
      if (commandfile) { 
        rateLimiter++
        commandfile.run(message, cooldown, mode, userLastMap, cooldownr, lastMap, rateLimiter, defaultMode, request)
      }
        switch (message.message) {
        case prefix + "cc":
          return await user.sendMessage(`Cc ${user.ircUsername}`)
        case prefix + "mappoolaeris":
          cooldownMappool.add(message.user.ircUsername)
          setTimeout(function () {
            mappool('mapsAeris.txt')
          }, 3000)
          break
      }
      if (message.user.ircUsername == "DJays" && message.message == prefix + "w") {
        requests("Djays")
        cooldownr.add(message.user.ircUsername)
      }
      setTimeout(() => {
        cooldown.delete(message.user.ircUsername)
        cooldowng.delete(message.user.ircUsername)
      }, cdseconds * 1000)
      setTimeout(() => {
        cooldownMappool.delete(message.user.ircUsername)
        cooldowng.delete(message.user.ircUsername)
      }, cdsecondsMappool * 1000)
      setTimeout(() => {
        cooldownr.delete(message.user.ircUsername)
        cooldowng.delete(message.user.ircUsername)
      }, cdsecondsr * 1000)
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