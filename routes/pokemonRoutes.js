const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { saveFavorite, deleteFavorite } = require('../controllers/pokemonController');
const { authenticateToken } = require('../middleware/authMiddleware');


// Rutas (protegidas con autenticación)
router.post('/saveFavorite', authenticateToken, saveFavorite);
router.post('/deleteFavorite', authenticateToken, deleteFavorite);

module.exports = router;


