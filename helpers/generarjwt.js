const jwt = require('jsonwebtoken');

const generarJWT = ( uid = '' ) => {

    return new Promise( (resolve, reject) => {

        //payload
        const payload = { uid }
        //grabar firma .sign
        jwt.sign( payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '4h'
        }, ( err, token) => {

            if( err ) {
                console.log(err);
                reject('No se pudo generar el token');
            } else {
                resolve( token );
            }
        });
    });
}

module.exports = {
    generarJWT
}