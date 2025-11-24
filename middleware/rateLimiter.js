const rateLimit = require('express-rate-limit');

const windowMinutes = Number(process.env.RATE_LIMIT_WINDOW_MINUTES);
const maxRequests = Number(process.env.RATE_LIMIT_MAX_REQUESTS);

const rateLimiter = rateLimit({
  windowMs: windowMinutes * 60 * 1000,
  max: maxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json({
      success: false,
      message: 'Demasiadas solicitudes. Intenta nuevamente mas tarde.',
    });
  },
});

module.exports = rateLimiter;

