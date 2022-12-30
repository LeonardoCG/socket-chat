const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const { Usuario } = require('../models');

const validarJWT = async( req = request, res= response, next ) =>{

    const token = req.header('x-token');

    if( !token ) {
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        })
    }

    try {
        // validamos el token
        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );
        
        //leer el usuario que corresponde al uid
        const usuario = await Usuario.findById( uid );
        //si el usuario no existe en DB
        if( !usuario ) {
            return res.status(401).json({
                msg: 'Usuario no existe en DB'
            });
        }
        //verificar si el uid tiene estado en true
        if( !usuario.estado ) {
            return res.status(401).json({
                msg: 'Token no valido - usuario con estado: false'
            });
        }
        
        req.usuario = usuario;
        
        next();
        
    } catch (error) {
        console.log(error);
        response.status(401).json({
            msg: 'Token no valido'
        });
    }

}

module.exports = {
    validarJWT
}