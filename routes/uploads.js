const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarArchivo } = require('../middlewares');
const { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenCloudinary } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers/db-validators');

const router = Router();
// subir img
router.post('/',validarArchivo, cargarArchivo);
//actualizar img con cloudinary & local
router.put('/:coleccion/:id', [
    validarArchivo,
    check('id', 'El id debe ser de mongoDB').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas( c, ['usuarios', 'productos'])),
    validarCampos,   
], actualizarImagenCloudinary);
//], actualizarImagen);

//obtener img
router.get('/:coleccion/:id', [
    check('id', 'El id debe ser de mongoDB').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios', 'productos'])),
    validarCampos
], mostrarImagen);

module.exports = router;


