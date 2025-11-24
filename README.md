# Backend API - Pokedex

Backend completo desarrollado con Node.js y Express que incluye autenticación JWT, conexión a PostgreSQL con Prisma, y envío de correos SMTP.

## 🚀 Características

- ✅ Express.js como framework
- ✅ PostgreSQL
- ✅ Autenticación JWT (login, registro, renovación de token)
- ✅ Envío de correos SMTP con Nodemailer
- ✅ Middleware de autenticación
- ✅ Manejo centralizado de errores
- ✅ CORS configurado
- ✅ Validación de datos con express-validator
- ✅ Validación de número de peticion con express-rate-limit
- ✅ Variables de entorno con dotenv

## 📋 Requisitos Previos

- Node.js (v16 o superior)
- PostgreSQL (v15 o superior)
- npm o yarn

## 🔧 Instalación

1. **Clonar el repositorio** (si aplica) o navegar al directorio del proyecto

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   ```bash
   cp .env.example .env
   ```
   
   Editar el archivo `.env`

4. **Configurar la base de datos con el archivo bd.sql**

## 🏃 Ejecución

### Modo desarrollo (con nodemon):
```bash
npm run dev
```

### Modo producción:
```bash
npm start
```

El servidor estará disponible en `http://localhost:3000` (o el puerto configurado en `.env`)

## 🔐 Seguridad

- Las contraseñas se encriptan con bcryptjs
- Los tokens JWT tienen expiración configurable
- Validación de datos en todos los endpoints
- CORS configurado
- Variables sensibles en archivo `.env`


