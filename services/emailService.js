const nodemailer = require('nodemailer');

// Configurar el transporter de Nodemailer
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true para 465, false para otros puertos
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

/**
 * Envía un correo electrónico
 * @param {string} to - Dirección de correo del destinatario
 * @param {string} subject - Asunto del correo
 * @param {string} html - Contenido HTML del correo
 * @returns {Promise<Object>} - Resultado del envío
 */
const sendEmail = async (to, subject, html) => {
  try {
    // Validar que existan las variables de entorno necesarias
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      throw new Error('Configuración SMTP incompleta. Verifica las variables de entorno.');
    }

    const transporter = createTransporter();

    // Verificar la conexión SMTP
    await transporter.verify();

    // Enviar el correo
    const info = await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME || 'Backend API'}" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    return {
      success: true,
      messageId: info.messageId,
      response: info.response,
    };
  } catch (error) {
    console.error('Error al enviar correo:', error);
    throw new Error(`Error al enviar correo: ${error.message}`);
  }
};

/**
 * Envía un correo de prueba
 * @param {string} to - Dirección de correo del destinatario
 * @returns {Promise<Object>} - Resultado del envío
 */
const sendTestEmail = async (to) => {
  const subject = 'Correo de prueba - Backend API';
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .footer { text-align: center; padding: 10px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Correo de Prueba</h1>
          </div>
          <div class="content">
            <p>Hola,</p>
            <p>Este es un correo de prueba enviado desde el backend API.</p>
            <p>Si recibes este mensaje, significa que la configuración SMTP está funcionando correctamente.</p>
            <p>Fecha y hora: ${new Date().toLocaleString('es-ES')}</p>
          </div>
          <div class="footer">
            <p>Este es un correo automático, por favor no responder.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return await sendEmail(to, subject, html);
};

module.exports = {
  sendEmail,
  sendTestEmail,
};


