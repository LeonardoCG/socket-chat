const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
//Modelo
const { Usuario } = require('../models');


const usuariosGet = async(req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    //usuario activdo
    const query = { estado: true };

    //coleccion de dos promesas
    const [ total, usuarios ] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number( desde ))
            .limit(Number( limite ))
    ]);

    return res.json({
        total,
        usuarios
    });
}

const usuariosPost = async(req, res = response) => {
    
    const { nombre, correo, password, role } = req.body;
    const usuario = new Usuario({ nombre, correo, password, role });

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt );

    // Guardar en BD
    await usuario.save();

    return res.json({
        usuario
    });
}

const usuariosPut = async(req, res = response) => {

    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;

    if ( password ) {
        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto );

    return res.json(usuario);
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - usuariosPatch'
    });
}

const usuariosDelete = async(req, res = response) => {

    const { id } = req.params;

    // const uid = req.uid;
    // Fisicamente lo borramos
    // const usuario = await Usuario.findByIdAndDelete( id );
    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false } );
    const usuarioAutenticado = req.usuario;

    return res.json({usuario, usuarioAutenticado});
}




module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete,
}