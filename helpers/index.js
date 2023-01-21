

const dbValidators = require('./db-validators');
const generarJWT   = require('./generarjwt');
const googleVerify = require('./google-verify');
const subirArchivo = require('./subirArchivo');


module.exports = {
    dbValidators,
    generarJWT,
    googleVerify,
    subirArchivo
}