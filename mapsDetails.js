module.exports.duree = function mapLength(nombre) {
    var heures = Math.floor(nombre / 60 / 60)
    var minutes = Math.floor(nombre / 60) - (heures * 60)
    var secondes = nombre % 60
    var duree = minutes.toString().padStart(2, '0') + ':' + secondes.toString().padStart(2, '0')
    return duree
}
module.exports.rating = function mapRating(nombre) {
    starRating = nombre * 100
    starRating = Math.round(starRating)
    starRating = starRating / 100
    return starRating
}
module.exports.genre = function mapGenre(nombre) {
    var genre = {
        //Tech
        2208884: "Tech",
        2012779: "Tech",
        2247022: "Tech",
        1945145: "Tech",
        1929267: "Tech",
        2259809: "Tech",
        2247016: "Tech",
        2183655: "Tech",
        2077010: "Tech",
        2159524: "Tech",
        1849133: "Tech",
        1966085: "Tech",
        1896803: "Tech",
        2242453: "Tech",
        1858393: "Tech",
        1570797: "Tech",
        2141853: "Tech",
        2236733: "Tech",
        2268175: "Tech",
        2264344: "Tech",
        2132292: "Tech",
        2155904: "Tech",
        1479006: "Tech",
        2133937: "Tech",
        2169383: "Tech",
        1502447: "Tech",
        1269405: "Tech",
        1135842: "Tech",
        1487796: "Tech",
        1401833: "Tech",
        2206580: "Tech",
        //Alternate
        2035760: "Alternate",
        2219808: "Alternate",
        2015296: "Alternate",
        2034429: "Alternate",
        1731977: "Alternate",
        1992818: "Alternate",
        1538158: "Alternate",
        1992817: "Alternate",
        //Jump
        2260873: "Jump",
        1041370: "Jump",
        1552653: "Jump",
        1523740: "Jump",
        1613550: "Jump",
        2266645: "Jump",
        //Stream
        1911573: "Stream",
        2255704: "Stream",
        750243: "Stream",
        2232193: "Stream",
        2221798: "Stream",
        2198088: "Stream",
        2204116: "Stream",
        2190485: "Stream",
        2026594: "Stream",
        //Special
        1051428: "Special",
        2271671: "Special",
        //Mania Maps:
        1187559: "LN & SV",
        1739738: "LN",
        1546411: "LN",
        2068795: "LN",
        1432753: "LN",
        2078266: "LN",
        1361218: "SV",
    }
    return genre[nombre] || 'Classic'
}