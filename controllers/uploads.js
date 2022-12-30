const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;

//configurar y autentificar con cloudinary
cloudinary.config( process.env.CLOUDINARY_URL);

const { response } = require("express");
const { subirArchivo } = require("../helpers/subir-Archivo");
const { Usuario, Producto} = require("../models");


const cargarArchivo = async(req, res = response) => {
    
    try {
        //imagenes nombre o subir otras extensiones
        //const imagen = await subirArchivo(req.files, ['txt', 'md'], 'textos');
        const imagen = await subirArchivo(req.files, undefined, 'imgs');
        res.json({ imagen });    
    } catch ( msg ) {
        res.status(400).json({ msg });    
    }
    
}

const actualizarImagen = async(req, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch ( coleccion ) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                });
            }
            break;
        
        case 'productos':
            modelo = await Producto.findById(id);
            if( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                });
            }
            break;
    
        default:
            return res.status(500).json({ msg: 'Se me olvido'});
    }
    //limpiar imagenes previas
    if( modelo.img ) {
        // validamos si existe la img
        const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img );
        // 
        if( fs.existsSync( pathImagen ) ) {
            fs.unlinkSync( pathImagen ); //borrar imagen
        }
    }

    const nombre = await subirArchivo( req.files, undefined, coleccion );
    modelo.img = await nombre;

    await modelo.save();

    res.json( modelo );
}

const mostrarImagen = async(req, res = response ) => {

    const { id, coleccion } = req.params;
    
    let modelo;

    switch ( coleccion ) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                });
            }
            break;
        
        case 'productos':
            modelo = await Producto.findById(id);
            if( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                });
            }
            break;
    
        default:
            return res.status(500).json({ msg: 'Se me olvido'});
    } 
     //limpiar imagenes previas
    if( modelo.img ) {
        // validamos si existe la img
        const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img );
        

        if( fs.existsSync( pathImagen ) ) {
            return res.sendFile( pathImagen);
        } 
    }
    //place holder
    const pathPlaceHolder = path.join( __dirname, '../assets/no-image.jpg');

    return res.sendFile( pathPlaceHolder);
}

const actualizarImagenCloudinary = async(req, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch ( coleccion ) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                });
            }
            break;
        
        case 'productos':
            modelo = await Producto.findById(id);
            if( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                });
            }
            break;
    
        default:
            return res.status(500).json({ msg: 'Se me olvido'});
    }
    //limpiar imagenes previas en cloudinary
    if( modelo.img ) {
        //separamos por un slash
        const nombreArr = modelo.img.split('/');
        //tomamos el ultimo texto o posicion 
        const nombre = nombreArr[ nombreArr.length - 1 ];
        //cortamos donde encontramos el punto y guardamos en public_id
        const [ public_id ] = nombre.split('.');
        //borrar de cloudinary en un proceso aparte
        cloudinary.uploader.destroy( public_id );
    }

    //subir img a cloudinary
    //desestructurar y extraer el path temporal
    const { tempFilePath } = req.files.archivo;
    //desestructurar y extraer la url segura
    const { secure_url } = await cloudinary.uploader.upload( tempFilePath );   
    modelo.img = await secure_url; 
    //guardamos la url
    await modelo.save();

    res.json( modelo );
}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
} 