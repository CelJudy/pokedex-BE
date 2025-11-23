const jwt = require('jsonwebtoken');

/**
 * Middleware para verificar el token JWT
 * Lee el token desde el header Authorization: Bearer <token>
 */
const authenticateToken = (req, res, next) => {
  try {
    // Obtener el token del header Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Formato: "Bearer TOKEN"

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token de acceso requerido. Incluye el token en el header Authorization: Bearer <token>',
      });
    }

    // Verificar el token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: 'Token inválido o expirado',
        });
      }

      // Agregar la información del usuario al request
      req.user = user;
      next();
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al verificar el token',
      error: error.message,
    });
  }
};

module.exports = {
  authenticateToken,
};


