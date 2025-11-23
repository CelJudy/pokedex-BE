const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { sendEmailHandler, sendTestEmailHandler } = require('../controllers/emailController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Validaciones para enviar correo
const sendEmailValidation = [
  body('to')
    .isEmail()
    .withMessage('Debe ser un correo electrónico válido')
    .normalizeEmail(),
  body('subject')
    .notEmpty()
    .withMessage('El asunto es requerido')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('El asunto debe tener entre 1 y 200 caracteres'),
  body('html')
    .notEmpty()
    .withMessage('El contenido HTML es requerido')
    .trim(),
];

// Validaciones para correo de prueba
const sendTestEmailValidation = [
  body('to')
    .isEmail()
    .withMessage('Debe ser un correo electrónico válido')
    .normalizeEmail(),
];

// Rutas (protegidas con autenticación)
router.post('/send', authenticateToken, sendEmailValidation, sendEmailHandler);
router.post('/send-test', authenticateToken, sendTestEmailValidation, sendTestEmailHandler);

module.exports = router;


