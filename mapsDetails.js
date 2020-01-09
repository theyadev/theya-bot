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