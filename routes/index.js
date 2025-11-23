const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const emailRoutes = require('./emailRoutes');
const { healthCheck } = require('../controllers/healthController');

// Ruta de salud
router.get('/health', healthCheck);

// Rutas de autenticación
router.use('/auth', authRoutes);

// Rutas de email
router.use('/email', emailRoutes);

module.exports = router;


