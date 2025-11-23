# Backend API - Pokedex

Backend completo desarrollado con Node.js y Express que incluye autenticación JWT, conexión a PostgreSQL con Prisma, y envío de correos SMTP.

## 🚀 Características

- ✅ Express.js como framework
- ✅ PostgreSQL con Prisma ORM
- ✅ Autenticación JWT (login, registro, renovación de token)
- ✅ Envío de correos SMTP con Nodemailer
- ✅ Middleware de autenticación
- ✅ Manejo centralizado de errores
- ✅ Logs con Morgan
- ✅ CORS configurado
- ✅ Validación de datos con express-validator
- ✅ Variables de entorno con dotenv

## 📋 Requisitos Previos

- Node.js (v16 o superior)
- PostgreSQL (v12 o superior)
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
   
   Editar el archivo `.env` y configurar:
   - `DATABASE_URL`: URL de conexión a PostgreSQL
   - `JWT_SECRET`: Secreto para firmar tokens JWT
   - `SMTP_*`: Configuración del servidor SMTP

4. **Configurar la base de datos:**
   ```bash
   # Generar el cliente de Prisma
   npm run prisma:generate
   
   # Ejecutar migraciones
   npm run prisma:migrate
   ```

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

## 📚 Endpoints

### Health Check
- **GET** `/api/health`
  - Retorna el estado del servidor
  - Respuesta: `{ status: "ok", timestamp: "...", uptime: ... }`

### Autenticación

#### Login
- **POST** `/api/auth/login`
  - Body:
    ```json
    {
      "email": "usuario@ejemplo.com",
      "password": "contraseña123"
    }
    ```
  - Respuesta exitosa:
    ```json
    {
      "success": true,
      "message": "Login exitoso",
      "data": {
        "token": "jwt_token_aqui",
        "user": {
          "id": 1,
          "email": "usuario@ejemplo.com",
          "name": "Nombre Usuario"
        }
      }
    }
    ```

#### Registro
- **POST** `/api/auth/register`
  - Body:
    ```json
    {
      "email": "nuevo@ejemplo.com",
      "password": "contraseña123",
      "name": "Nombre Opcional"
    }
    ```
  - Respuesta exitosa: Similar a login

#### Renovar Token
- **GET** `/api/auth/renew`
  - Headers: `Authorization: Bearer <token>`
  - Respuesta exitosa:
    ```json
    {
      "success": true,
      "message": "Token renovado exitosamente",
      "data": {
        "token": "nuevo_jwt_token"
      }
    }
    ```

### Email

#### Enviar Correo
- **POST** `/api/email/send`
  - Headers: `Authorization: Bearer <token>`
  - Body:
    ```json
    {
      "to": "destinatario@ejemplo.com",
      "subject": "Asunto del correo",
      "html": "<h1>Contenido HTML</h1>"
    }
    ```

#### Enviar Correo de Prueba
- **POST** `/api/email/send-test`
  - Headers: `Authorization: Bearer <token>`
  - Body:
    ```json
    {
      "to": "destinatario@ejemplo.com"
    }
    ```

## 🔐 Seguridad

- Las contraseñas se encriptan con bcryptjs
- Los tokens JWT tienen expiración configurable
- Validación de datos en todos los endpoints
- CORS configurado
- Variables sensibles en archivo `.env`

## 📝 Ejemplos de Uso

### Ejemplo 1: Login y obtener token

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@ejemplo.com",
    "password": "contraseña123"
  }'
```

### Ejemplo 2: Registrar nuevo usuario

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nuevo@ejemplo.com",
    "password": "contraseña123",
    "name": "Juan Pérez"
  }'
```

### Ejemplo 3: Renovar token

```bash
curl -X GET http://localhost:3000/api/auth/renew \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

### Ejemplo 4: Enviar correo de prueba

```bash
curl -X POST http://localhost:3000/api/email/send-test \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{
    "to": "destinatario@ejemplo.com"
  }'
```

### Ejemplo 5: Enviar correo personalizado

```bash
curl -X POST http://localhost:3000/api/email/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{
    "to": "destinatario@ejemplo.com",
    "subject": "Mi Asunto",
    "html": "<h1>Hola</h1><p>Este es un correo de prueba</p>"
  }'
```

## 🗂️ Estructura del Proyecto

```
BE/
├── config/
│   ├── database.js      # Configuración de Prisma
│   └── cors.js          # Configuración de CORS
├── controllers/
│   ├── authController.js    # Lógica de autenticación
│   ├── emailController.js   # Lógica de envío de correos
│   └── healthController.js  # Health check
├── middleware/
│   ├── authMiddleware.js    # Middleware de autenticación JWT
│   └── errorHandler.js     # Manejo centralizado de errores
├── routes/
│   ├── authRoutes.js        # Rutas de autenticación
│   ├── emailRoutes.js       # Rutas de email
│   └── index.js             # Router principal
├── services/
│   └── emailService.js      # Servicio de Nodemailer
├── prisma/
│   └── schema.prisma        # Esquema de base de datos
├── .env.example             # Ejemplo de variables de entorno
├── app.js                   # Configuración de Express
├── server.js                # Punto de entrada del servidor
├── package.json
└── README.md
```

## 🛠️ Scripts Disponibles

- `npm run dev` - Inicia el servidor en modo desarrollo con nodemon
- `npm start` - Inicia el servidor en modo producción
- `npm run prisma:generate` - Genera el cliente de Prisma
- `npm run prisma:migrate` - Ejecuta las migraciones de la base de datos
- `npm run prisma:studio` - Abre Prisma Studio (interfaz visual de la BD)

## 📧 Configuración SMTP

Para usar Gmail como servidor SMTP:

1. Habilitar "Contraseñas de aplicaciones" en tu cuenta de Google
2. Generar una contraseña de aplicación
3. Usar esa contraseña en `SMTP_PASSWORD`

Ejemplo de configuración en `.env`:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tu_correo@gmail.com
SMTP_PASSWORD=tu_contraseña_de_aplicacion
```

## 🐛 Solución de Problemas

### Error de conexión a PostgreSQL
- Verifica que PostgreSQL esté corriendo
- Verifica la URL en `DATABASE_URL`
- Asegúrate de que la base de datos existe

### Error al enviar correos
- Verifica las credenciales SMTP
- Para Gmail, usa contraseñas de aplicación, no tu contraseña normal
- Verifica que el puerto y host sean correctos

### Error de token JWT
- Verifica que `JWT_SECRET` esté configurado
- Asegúrate de incluir el header `Authorization: Bearer <token>`

## 📄 Licencia

ISC


