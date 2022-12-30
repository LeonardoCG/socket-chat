const Categoria = require('../models/categoria');
const Producto = require('../models/producto');
const Role = require('../models/role');
const Usuario = require('../models/usuario');

const esRoleValido = async(role = '') => {
    //VERIFICAR SI EXISTE EL ROLE
    const existeRol = await Role.findOne({ role });
    if ( !existeRol ) {
        throw new Error(`El rol ${ role } no está registrado en la BD`);
    }
}

//validador de correo
const emailExiste = async( correo = '' ) => {
    // Verificar si el correo existe
    const existeEmail = await Usuario.findOne({ correo });
    if ( existeEmail ) {
        throw new Error(`El correo: ${ correo }, ya está registrado`);
    }
}

//validador de usuario por id
const existeUsuarioPorId = async( id ) => {
    // Verificar si el correo existe
    const existeUsuario = await Usuario.findById(id);
    if ( !existeUsuario ) {
        throw new Error(`El id no existe ${ id }`);
    }
}

//validador de categorias por id
const existeCategoriaPorId = async( id ) => {
    // Verificar si la categoria existe
    const existeCategoria = await Categoria.findById(id);
    if( !existeCategoria ) {
        throw new Error(`El id no existe ${ id }`);
    }
}

const existeProductoPorId = async( id ) => {
    //verificar si existe el producto
    const existeProducto = await Producto.findById(id);
    if(!existeProducto) {
        throw new Error(`El id no existe ${ id }`);
    }
}

//validar colecciones permitidas
const coleccionesPermitidas = ( coleccion = '', colecciones = []) => {
    //verdicar si la coleccion existe
    const incluida = colecciones.includes( coleccion);
    if( !incluida ) {
        throw new Error(`La coleccion ${ coleccion } no es permitida, ${ colecciones }`);
    }

    return true;
} 


module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId,
    coleccionesPermitidas
}

