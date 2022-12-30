const { Router } = require('express');
const { check } = require('express-validator');

const { crearCategoria, 
        categoriasGet,
        categoriaGet,
        categoriasPut,
        categoriaDelete } = require('../controllers/categorias');

//helpers
const {existeCategoriaPorId } = require('../helpers/db-validators');
//middlewars
const { validarJWT, 
        validarCampos, 
        esAdminRole } = require('../middlewares');
//routes
const router = Router();

//obtener todas las categorias - publico
router.get('/', categoriasGet);

//obtener una categoria por ID - publico
router.get('/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
],categoriaGet);

//crear una categoria  - cualquier persona con token valido
router.post('/', [ 
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    validarCampos
],crearCategoria);

//actualizar - privado - con token valido
router.put('/:id',[ 
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom( existeCategoriaPorId),
    validarCampos
], categoriasPut);


//borrar una categoria por ID - ADMIN_ROLE - ESTADO-FALSE
router.delete('/:id',[ 
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
],categoriaDelete );

module.exports = router;