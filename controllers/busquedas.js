const { response } = require("express");
const { ObjectId } = require('mongoose').Types;

const { Usuario, Categoria, Producto } = require("../models");

const coleccionesPermitidas = [
    'usuarios',
    'categoria',
    'productos',
    'roles'
];

const buscarUsuarios = async( termino = '', res = response ) => {
    //buscar por ID
    const esMongoID = ObjectId.isValid( termino); //TRUE
    if( esMongoID && termino.length == 24) {
        const usuario = await Usuario.findById( termino );
        return res.json({
            results: (usuario) ? [usuario] : []
        });
    } 
    //creamos que sea incensible al termino de mayuscula o minuscula
    const regex = new RegExp( termino, 'i' ); 
    //buscar por nombre o correo y estado activo, con operadores de mongoose
    let buscar = { 
        $or: [{ nombre : regex }, { correo : regex }],
        $and: [{ estado : true }]
    }

    //coleccion de dos promesas
    const [total, usuarios] = await Promise.all([
        Usuario.count( buscar),
        Usuario.find(buscar)
        ]);
        return res.json({
        total,
        results: usuarios
    });
}

const buscarCategorias = async(termino = '', res = response ) => {
    // buscar por ID
    const esMongoID = ObjectId.isValid( termino ) // true

    if( esMongoID ) {
        const categoria =  await Categoria.findById( termino );
        return res.json({
            results: (categoria) ? [ categoria] : []
        });
    }
    const regex = new RegExp( termino, 'i');
    let buscarCategorias = {
        $or: [{ nombre : regex }, { estado: true }]
    }
    //coleccion de dos promesas
    const[totalCat, categorias] = await Promise.all([
        Categoria.count( buscarCategorias),
        Categoria.find(buscarCategorias)
    ]);
    return res.json({
        totalCat,
        categorias
    });

}

const buscarProductos = async(termino = '', res = response ) => {
     // buscar por ID
     const esMongoID = ObjectId.isValid( termino ) // true
     if( esMongoID && termino.length == 24 ) {
         const producto =  await Producto.findById( termino );
         return res.json({
             results: (producto) ? [ producto] : []
         });
     }
     const regex = new RegExp( termino, 'i');
     let buscarp = {
         $or: [{ nombre : regex }, { estado: true }]
     }
     //coleccion de dos promesas
     const[totalCat, productos] = await Promise.all([
         Producto.count( buscarp),
         Producto.find(buscarP)
     ]);
     return res.json({
         totalCat,
         productos
     });
 

}

const busquedas = (req, res = response) => {

    const { colecciones, termino } = req.params;

    if (!coleccionesPermitidas.includes(colecciones)) {
        return res.status(400).json({
            message: `Las colecciones permitidas son ${coleccionesPermitidas}`
        });
    }

    switch (colecciones) {
        case 'usuarios':
            buscarUsuarios( termino, res );
        break;
        case 'categoria':
            buscarCategorias( termino, res );
        break;
        case 'producto':
            buscarProductos( termino, res );
        break;
        case 'roles':

        break;
        default:
            return res.status(500).json({
                msg: 'se olvido hacer esta busqueda'
            })
    }


}

module.exports = busquedas;