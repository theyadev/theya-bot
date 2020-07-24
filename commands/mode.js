const getDefaultMode = require('../functions/get.js').defaultMode

var mysql = require('mysql');
const { db_config } = require('../config.json')
var connection;

function handleDisconnect() {
  connection = mysql.createConnection(db_config); // Recreate the connection, since
  // the old one cannot be reused.

  connection.connect(function (err) {              // The server is either down
    if (err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
  // If you're also serving http, display a 503 error.
  connection.on('error', function (err) {
    console.log('db error', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}

module.exports.run = async (message, args) => {
  if (args[0] == "osu" || args[0] == "mania") {
    handleDisconnect()
    connection.query(`SELECT * FROM modes WHERE username = "${message.user.ircUsername}"`, function (err, res, fields) {
      if (res.length == 0) {
        connection.query(`INSERT INTO modes (username, mode) VALUES ("${message.user.ircUsername}", "${args[0]}")`, function (err, res, fields) {
          message.user.sendMessage('Your default game mode is now set to: ' + args[0])
        })
      } else {
        connection.query(`UPDATE modes SET mode = "${args[0]}" WHERE username = "${message.user.ircUsername}"`, function (err, res, fields) {
          message.user.sendMessage('Your default game mode is now set to: ' + args[0])
          connection.end()
        })
      }
    })
  } else {
    message.user.sendMessage('Please specify a correct mode. (osu, mania)')
  }
}
module.exports.help = {
  name: "mode"
}