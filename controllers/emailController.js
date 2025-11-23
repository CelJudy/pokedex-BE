const { validationResult } = require('express-validator');
const { sendEmail, sendTestEmail } = require('../services/emailService');

/**
 * POST /email/send
 * Envía un correo electrónico
 */
const sendEmailHandler = async (req, res, next) => {
  try {
    // Validar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Errores de validación',
        errors: errors.array(),
      });
    }

    const { to, subject, html } = req.body;

    // Enviar correo
    const result = await sendEmail(to, subject, html);

    res.json({
      success: true,
      message: 'Correo enviado exitosamente',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /email/send-test
 * Envía un correo de prueba
 */
const sendTestEmailHandler = async (req, res, next) => {
  try {
    // Validar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Errores de validación',
        errors: errors.array(),
      });
    }

    const { to } = req.body;

    // Enviar correo de prueba
    const result = await sendTestEmail(to);

    res.json({
      success: true,
      message: 'Correo de prueba enviado exitosamente',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendEmailHandler,
  sendTestEmailHandler,
};


