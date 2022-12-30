

const dbValidators = require('./db-validators');
const generaJWT    = require('./generarjwt');
const googleVerify = require('./google-verify');
const subirArchivo = require('./subirArchivo');


module.exports = {
    ...dbValidators,
    ...generaJWT,
    ...googleVerify,
    ...subirArchivo
}