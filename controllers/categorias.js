const { response } = require('express');
//Modelo
const { Categoria } = require('../models');

// obtenerCategorias - paginado - total - populete
const categoriasGet = async (req, res = response ) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };
    
    //coleccion de promesas
    const [ total, categorias ] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .skip(Number( desde))
            .limit(Number( limite))
            .populate("usuario", "nombre")
            .exec()
    ]);

    res.json({
        total,
        categorias
    });
}

//obtenerCategoria - populete{}
const categoriaGet = async( req, res = response) => {
    const { id } = req.params;
    const categoria = await Categoria.findById( id ).populate("usuario", "nombre");

    res.json( categoria );
}

const crearCategoria = async( req, res = response) => {

    const nombre = req.body.nombre.toUpperCase(); //almacenar el nombre en mayuscula

    const categoriaDB = await Categoria.findOne({ nombre }) //buscamos si existe una categoria almacenada

    if( categoriaDB ) {
        return res.status(400).json({
            msg: `La categoria ${ categoriaDB.nombre}, ya existe`
        });
    }
    //Generar la data guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }
    //creamos la data
    const categoria = new Categoria( data );
    // guardar DB
    await categoria.save();
    //enviamos codigo 201, de craeado
    res.status(201).json(categoria);
}

//actualizarCategoria 
const categoriasPut = async(req, res = response) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate( id, data, { new: true } );

    res.json(categoria);
}

//borrarCategoria - estado: false
const categoriaDelete = async(req, res = response) => {

    const { id } = req.params;

    const categoria = await Categoria.findByIdAndUpdate( id, { estado: false }, {new: true});

    res.json(categoria);
}



module.exports = {
    crearCategoria,
    categoriasGet,
    categoriaGet,
    categoriasPut,
    categoriaDelete
}