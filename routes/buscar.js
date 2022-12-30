const { Router } = require('express');
const buscar = require('../controllers/buscars');

const router = Router();


router.get('/:coleccion/:termino', buscar )




module.exports = router;