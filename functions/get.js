var mysql = require("mysql");
const db_config = require('../config.json')
var connection;
const genres = require("../genres.json");

module.exports.randomMap = async function randomMap(args, mode, callback) {
  connection = await mysql.createConnection(db_config);
  connection.query(`SELECT * FROM maps WHERE mode = "${mode}"`, function (
    error,
    res,
    fields
  ) {
    if (!args || args.length == 0) {
      let random = res[Math.floor(Math.random() * res.length)].main_diff;
      connection.query(
        "SELECT * FROM difficulties WHERE id = " + random,
        function (err, diff, fields) {
          if (err) callback(err, null);
          else callback(null, diff[0]);
        }
      );
      connection.end();
    } else {
      connection.query(
        `SELECT * FROM difficulties WHERE mode = "${mode}"`,
        function (err, diffs, fields) {
          let maps = diffs;
          args.forEach((criteria) => {
            if (isNaN(criteria)) {
              if (
                genres.osu.includes(criteria) ||
                genres.mania.includes(criteria)
              ) {
                if (mode == "osu") {
                  if (genres.osu.includes(criteria)) {
                    maps = maps.filter((map) => map.genre == criteria);
                  }
                }
                if (mode == "mania") {
                  if (genres.mania.includes(criteria)) {
                    maps = maps.filter((map) => map.genre == criteria);
                  }
                }
              } else {
                let allM = res;
                allM = allM.filter(
                  (map) =>
                    map.artist.toLowerCase().includes(criteria.toLowerCase()) ||
                    map.title.toLowerCase().includes(criteria.toLowerCase())
                );
                let newMaps = [];
                diffs = [];
                allM.forEach((e) => {
                  diffs.push(e.main_diff);
                });
                maps.forEach((m) => {
                  if (diffs.includes(m.id)) {
                    newMaps.push(m);
                  }
                });
                maps = newMaps;
              }
            } else {
              if (criteria < 10 && criteria > 0) {
                maps = maps.filter((map) => Math.floor(map.rating) == criteria);
              } else {
                maps = maps.filter(
                  (map) => Math.ceil(map.bpm / 10) * 10 == criteria
                );
              }
            }
          });
          let randomDiff = null;
          if (maps.length != 0) {
            randomDiff = maps[Math.floor(Math.random() * maps.length)];
          }
          if (err) callback(err, null);
          else callback(null, randomDiff);
        }
      );
      connection.end();
    }
  });
};

module.exports.bombRandomMap = async function bombRandomMap(
  args,
  mode,
  callback
) {
  connection = await mysql.createConnection(db_config);
  connection.query(`SELECT * FROM maps WHERE mode = "${mode}"`, function (
    error,
    res,
    fields
  ) {
    if (!args || args.length == 0) {
      connection.query("SELECT * FROM difficulties", function (
        err,
        diffs,
        fields
      ) {
        let maps = diffs;

        let randoms = [];
        let timeout = 0;
        do {
          timeout++;
          if (timeout > 19) {
            break;
          }
          let random = res[Math.floor(Math.random() * res.length)];
          let map = maps.filter((map) => map.id == random.main_diff);
          randoms.push(map[0]);
        } while (randoms.length < 3);

        if (err) callback(err, null);
        else callback(null, randoms);
      });
      connection.end();
    } else {
      connection.query(
        `SELECT * FROM difficulties WHERE mode = "${mode}"`,
        function (err, diffs, fields) {
          let maps = diffs;
          args.forEach((criteria) => {
            if (isNaN(criteria)) {
              if (
                genres.osu.includes(criteria) ||
                genres.mania.includes(criteria)
              ) {
                if (mode == "osu") {
                  if (genres.osu.includes(criteria)) {
                    maps = maps.filter((map) => map.genre == criteria);
                  }
                }
                if (mode == "mania") {
                  if (genres.mania.includes(criteria)) {
                    maps = maps.filter((map) => map.genre == criteria);
                  }
                }
              } else {
                let allM = res;
                allM = allM.filter(
                  (map) =>
                    (map.artist
                      .toLowerCase()
                      .includes(criteria.toLowerCase()) &&
                      map.mode == mode) ||
                    map.title.toLowerCase().includes(criteria.toLowerCase())
                );
                let newMaps = [];
                diffs = [];
                allM.forEach((e) => {
                  diffs.push(e.main_diff);
                });
                maps.forEach((m) => {
                  if (diffs.includes(m.id)) {
                    newMaps.push(m);
                  }
                });
                maps = newMaps;
              }
            } else {
              if (criteria < 10 && criteria > 0) {
                maps = maps.filter((map) => Math.floor(map.rating) == criteria);
              } else {
                maps = maps.filter(
                  (map) => Math.ceil(map.bpm / 10) * 10 == criteria
                );
              }
            }
          });
          let randomDiff = null;
          let randoms = [];
          if (maps.length != 0) {
            let timeout = 0;
            do {
              timeout++;
              if (timeout > 19) {
                break;
              }
              let random = maps[Math.floor(Math.random() * maps.length)];
              if (!randoms.includes(random)) {
                randoms.push(random);
              }
            } while (randoms.length < 3);
          }
          if (err) callback(err, null);
          else callback(null, randoms);
        }
      );
      connection.end();
    }
  });
};

module.exports.defaultMode = async function getDefaultMode(username, callback) {
  connection = await mysql.createConnection(db_config);
  await connection.query(
    `SELECT * FROM modes WHERE username = "${username}"`,
    function (error, res, fields) {
      if (res.length != 0) callback(res[0].mode);
      else callback("osu");
    }
  );
  connection.end();
};
