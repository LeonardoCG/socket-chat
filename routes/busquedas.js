const { Router } = require('express');
const busquedas = require('../controllers/busquedas');


const router = Router();

router.get('/:colecciones/:termino', busquedas);



module.exports = router;