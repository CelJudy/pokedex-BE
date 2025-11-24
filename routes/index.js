const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const pokemonRoutes = require('./pokemonRoutes');
const { healthCheck } = require('../controllers/healthController');

// Ruta de salud
router.get('/health', healthCheck);

// Rutas de autenticación
router.use('/auth', authRoutes);


router.use('/pokemon', pokemonRoutes);

module.exports = router;


