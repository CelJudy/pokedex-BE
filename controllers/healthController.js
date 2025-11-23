/**
 * GET /health
 * Endpoint de salud del servidor
 */
const healthCheck = (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
};

module.exports = {
  healthCheck,
};


