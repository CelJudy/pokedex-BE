const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { login, register, confirmEmail, renewToken } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Validaciones para login
const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Debe ser un correo electrónico válido')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
];

// Validaciones para registro
const registerValidation = [
  body('email')
    .isEmail()
    .withMessage('Debe ser un correo electrónico válido')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
];

// Rutas
router.post('/login', loginValidation, login);
router.post('/register', registerValidation, register);
router.post('/confirm', confirmEmail);
router.get('/renew', authenticateToken, renewToken);

module.exports = router;

