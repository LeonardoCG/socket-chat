const { Router } = require('express');
const { check } = require('express-validator');
//controllers
const { productCreate, 
        productsGet, 
        productGet, 
        productUpdate, 
        productDelete }= require('../controllers/productos');
//helpers
const {existeCategoriaPorId,existeProductoPorId } = require('../helpers/db-validators');
//Middlewares
const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');
//Router
const router = Router();


//obtener todos los productos - publico
router.get('/', productsGet);

//obtener todos los productos por id - publico
router.get('/:id',[
    check('id', 'No es un ID mongo válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos,
], productGet);

// crear un producto - cualquier persona con token valido
router.post('/',[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un ID mongo válido').isMongoId(),
    check('categoria').custom( existeCategoriaPorId),
    validarCampos
],productCreate);

//actualizar product
router.put('/:id',[
    validarJWT,
    check('id').custom( existeProductoPorId),
    validarCampos
], productUpdate);

//borrar producto - esado: false
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID Mongo válido').isMongoId(),
    check('id').custom( existeProductoPorId),
    validarCampos
],productDelete);


module.exports = router;