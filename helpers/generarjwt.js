const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

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

const comprobarJWT = async( token = '') => {

    try {
        if( token.length < 10 ) {
            return null;
        }

        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY );
        const usuario = await Usuario.findById( uid );

        if( usuario ) {
            return usuario;
        } else {
            return null;
        }
        
    } catch (error) {
        return null;        
    }
}



module.exports = {
    generarJWT,
    comprobarJWT
}