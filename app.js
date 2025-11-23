require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('./config/cors');
const routes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// Crear aplicación Express
const app = express();

// Middleware
app.use(cors);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logs con Morgan
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Rutas
app.use('/api', routes);

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Backend API - Pokedex',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/health',
      auth: {
        login: 'POST /api/auth/login',
        register: 'POST /api/auth/register',
        renew: 'GET /api/auth/renew',
      },
      email: {
        send: 'POST /api/email/send',
        sendTest: 'POST /api/email/send-test',
      },
    },
  });
});

// Manejo de errores (debe ir al final)
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;


