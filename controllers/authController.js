const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const db = require('../config/database');
const { sendEmail } = require('../services/emailService');

/**
 * Genera un token JWT
 */
const generateToken = (userId, email) => {
  return jwt.sign(
    { userId, email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

/**
 * POST /api/auth/login
 * Inicia sesión con email y password
 */
const login = async (req, res, next) => {
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

    const { email, password } = req.body;

    // Buscar usuario por email

    const user = await db.query(`SELECT * FROM users WHERE mail = $1 and active is true`, [email.toLowerCase()]);

    if (user.rowCount === 0) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas',
      });
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.rows[0].pass);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas',
      });
    }

    const response = await db.query(`select ARRAY_AGG(pokemon) as pokemon from favorite where user_id=$1`, 
        [user.rows[0].id]);

    // Generar token JWT
    const token = generateToken(user.rows[0].id, user.email);

    // Respuesta exitosa
    res.json({
      success: true,
      message: 'Login exitoso',
      data: {
        token,
        pokemon:response.rows[0].pokemon,
        user: {
          id: user.rows[0].id,
          email: user.rows[0].mail,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/register
 * Registra un nuevo usuario
 */
const register = async (req, res, next) => {
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
    const { email, password } = req.body;

    // Verificar si el usuario ya existe
    const result = await db.query(`SELECT * FROM users WHERE mail = $1`, [email.toLowerCase()]);

    if (result.rowCount>0) {
      return res.status(409).json({
        success: false,
        message: 'El correo electrónico ya está registrado',
      });
    }

    // Encriptar contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crear usuario
    const userResult = await db.query(`INSERT INTO users (mail, pass) VALUES ($1, $2) RETURNING *`, 
        [email.toLowerCase(), hashedPassword]);

    const user = userResult.rows[0];

    // Generar token JWT
    const token = generateToken(user.id, user.mail);

    // Generar link de confirmación
    const confirmationLink = `${process.env.CONFIRMATION_LINK}/${token}`;

    // Crear HTML del correo de confirmación
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { padding: 30px; background-color: #f9f9f9; border-radius: 0 0 5px 5px; }
            .button { display: inline-block; padding: 12px 30px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .button:hover { background-color: #45a049; }
            .footer { text-align: center; padding: 10px; color: #666; font-size: 12px; margin-top: 20px; }
            .link { word-break: break-all; color: #4CAF50; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Confirmación de Registro</h1>
            </div>
            <div class="content">
              <p>Hola,</p>
              <p>Gracias por registrarte en nuestra plataforma. Para completar tu registro, por favor confirma tu correo electrónico haciendo clic en el siguiente botón:</p>
              <div style="text-align: center;">
                <a href="${confirmationLink}" class="button">Confirmar Correo Electrónico</a>
              </div>
              <p>O copia y pega el siguiente enlace en tu navegador:</p>
              <p class="link">${confirmationLink}</p>
              <p>Este enlace expirará en 24 horas.</p>
              <p>Si no creaste esta cuenta, puedes ignorar este correo.</p>
            </div>
            <div class="footer">
              <p>Este es un correo automático, por favor no responder.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Enviar correo de confirmación (no bloquea el registro si falla)
    try {
      await sendEmail(
        email.toLowerCase(),
        'Confirma tu correo electrónico - Registro',
        emailHtml
      );
      console.log(`✅ Correo de confirmación enviado a: ${email.toLowerCase()}`);
    } catch (emailError) {
      // Log del error pero no fallar el registro
      console.error('⚠️ Error al enviar correo de confirmación:', emailError.message);
    }

    // Respuesta exitosa
    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente. Se ha enviado un correo de confirmación.',
      data: {
        token,
        user: {
          id: user.id,
          email: user.mail,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/confirm
 * Confirma el correo electrónico del usuario usando el token
 */
const confirmEmail = async (req, res, next) => {
  try {
    const { token } = req.body;

    // Validar que el token esté presente
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token de confirmación requerido',
      });
    }

    // Verificar y decodificar el token JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'El token de confirmación ha expirado',
        });
      }
      return res.status(401).json({
        success: false,
        message: 'Token de confirmación inválido',
      });
    }

    const { userId } = decoded;

    // Verificar que el usuario existe
    const userResult = await db.query(`SELECT * FROM users WHERE id = $1`, [userId]);

    if (userResult.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      });
    }

    const user = userResult.rows[0];

    // Verificar si ya está activo
    if (user.active === true) {
      return res.status(200).json({
        success: true,
        message: 'El correo electrónico ya estaba confirmado',
        data: {
          email: user.mail,
        },
      });
    }

    // Actualizar el campo active a true
    const updateResult = await db.query(
      `UPDATE users SET active = true WHERE id = $1 RETURNING *`,
      [userId]
    );

    res.json({
      success: true,
      message: 'Correo electrónico confirmado exitosamente',
      data: {
        email: updateResult.rows[0].mail,
        active: updateResult.rows[0].active,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/renew
 * Renueva el token JWT
 */
const renewToken = async (req, res, next) => {
  try {
    // El middleware authenticateToken ya verificó el token y agregó req.user
    const { userId, email } = req.user;

    // Generar nuevo token
    const newToken = generateToken(userId, email);

    res.json({
      success: true,
      message: 'Token renovado exitosamente',
      data: {
        token: newToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  register,
  confirmEmail,
  renewToken,
};

