# AuraBoosting API - Backend

API RESTful para la plataforma de coaching de videojuegos AuraBoosting.

## 🚀 Tecnologías

- **Laravel 12** - Framework PHP
- **Laravel Sanctum** - Autenticación API
- **MySQL** - Base de datos
- **RESTful API** - Arquitectura

## 📁 Estructura del Proyecto

```
app/
├── Http/
│   ├── Controllers/Api/     # Controladores API
│   ├── Resources/           # Transformadores de datos
│   ├── Requests/            # Validación de requests
│   └── Middleware/          # Middleware personalizados
├── Models/                  # Modelos Eloquent
├── Policies/               # Políticas de autorización
├── Services/               # Lógica de negocio
└── Traits/                 # Traits reutilizables
```

## 🔧 Instalación

```bash
# Instalar dependencias
composer install

# Copiar archivo de configuración
cp .env.example .env

# Generar key de aplicación
php artisan key:generate

# Configurar base de datos en .env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=auraboosting
DB_USERNAME=root
DB_PASSWORD=

# Ejecutar migraciones
php artisan migrate

# Iniciar servidor
php artisan serve
```

## 📚 Endpoints de la API

### Base URL: `http://localhost:8000/api/v1`

### 🔐 Autenticación

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/register` | Registrar usuario | No |
| POST | `/login` | Iniciar sesión | No |
| POST | `/logout` | Cerrar sesión | Sí |
| GET | `/me` | Usuario actual | Sí |

### 🎮 Juegos

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/games` | Listar juegos | No |
| GET | `/games/{id}` | Ver juego | No |

### 📚 Clases

| Método | Endpoint | Descripción | Auth | Rol |
|--------|----------|-------------|------|-----|
| GET | `/classes` | Listar clases | No | - |
| GET | `/classes/{id}` | Ver clase | No | - |
| POST | `/classes` | Crear clase | Sí | Coach |
| PUT | `/classes/{id}` | Actualizar clase | Sí | Coach |
| DELETE | `/classes/{id}` | Eliminar clase | Sí | Coach |
| GET | `/my-classes` | Mis clases (coach) | Sí | Coach |
| PATCH | `/classes/{id}/status` | Actualizar estado | Sí | Coach |

### 👨‍🏫 Coaches

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/coaches` | Listar coaches | No |
| GET | `/coaches/{id}` | Ver coach | No |

### 📝 Inscripciones

| Método | Endpoint | Descripción | Auth | Rol |
|--------|----------|-------------|------|-----|
| POST | `/enrollments` | Inscribirse a clase | Sí | Student |
| GET | `/my-enrollments` | Mis inscripciones | Sí | Student |
| DELETE | `/enrollments/{id}` | Cancelar inscripción | Sí | Student |

### 💳 Pagos

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/payments` | Procesar pago | Sí |
| GET | `/payments/{id}` | Ver pago | Sí |
| POST | `/payments/{id}/confirm` | Confirmar pago | Sí |

### ⭐ Reseñas

| Método | Endpoint | Descripción | Auth | Rol |
|--------|----------|-------------|------|-----|
| POST | `/reviews` | Crear reseña | Sí | Student |
| PUT | `/reviews/{id}` | Actualizar reseña | Sí | Student |
| DELETE | `/reviews/{id}` | Eliminar reseña | Sí | Student |

## 🔑 Autenticación

La API usa **Laravel Sanctum** con tokens Bearer.

### Registro
```bash
POST /api/v1/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "role": "student"
}
```

### Login
```bash
POST /api/v1/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "user": {...},
    "access_token": "1|xxxxxxxxxxxxx",
    "token_type": "Bearer"
  }
}
```

### Usar el Token
```bash
GET /api/v1/me
Authorization: Bearer 1|xxxxxxxxxxxxx
```

## 📊 Estructura de Respuestas

### Éxito
```json
{
  "success": true,
  "message": "Operación exitosa",
  "data": {...}
}
```

### Error
```json
{
  "success": false,
  "message": "Mensaje de error",
  "errors": {...}
}
```

### Paginación
```json
{
  "success": true,
  "data": [...],
  "meta": {
    "current_page": 1,
    "last_page": 5,
    "per_page": 15,
    "total": 75
  },
  "links": {
    "first": "...",
    "last": "...",
    "prev": null,
    "next": "..."
  }
}
```

## 🎯 Filtros y Parámetros

### Listar Clases
```
GET /api/v1/classes?game_id=1&status=scheduled&upcoming=1&order=asc
```

### Listar Coaches
```
GET /api/v1/coaches?game_id=1&is_verified=1&min_rating=4
```

## 🛡️ Roles y Permisos

- **Student**: Puede inscribirse, pagar y dejar reseñas
- **Coach**: Puede crear y gestionar clases
- **Admin**: Acceso completo (para panel admin)

## 🧪 Testing

```bash
php artisan test
```

## 📝 Buenas Prácticas Implementadas

✅ **Separación de responsabilidades** (Controllers, Services, Policies)  
✅ **Validación de requests** con Form Requests  
✅ **Autorización** con Policies  
✅ **Transformación de datos** con API Resources  
✅ **Respuestas consistentes** con Trait ApiResponse  
✅ **Manejo de errores** centralizado  
✅ **Middleware** para roles  
✅ **Versionado de API** (v1)  
✅ **CORS** configurado  
✅ **Rate Limiting**  
✅ **Transacciones de base de datos**  

## 🔄 Próximos Pasos

- [ ] Integración con pasarela de pagos real (Stripe/PayPal)
- [ ] Notificaciones por email
- [ ] Sistema de notificaciones en tiempo real
- [ ] Panel de administración
- [ ] Documentación con Swagger/OpenAPI
- [ ] Tests automatizados completos

## 📫 Contacto

Para más información sobre el proyecto, contactar al equipo de desarrollo.
