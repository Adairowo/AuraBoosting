# 🎮 AuraBoosting - Plataforma de Coaching de Videojuegos

[![Laravel](https://img.shields.io/badge/Laravel-12-red.svg)](https://laravel.com)
[![PHP](https://img.shields.io/badge/PHP-8.2+-blue.svg)](https://php.net)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

Plataforma completa para conectar coaches profesionales de videojuegos con estudiantes, incluyendo sistema de clases, pagos y reseñas.

## ✨ Características

- 🔐 **Autenticación segura** con Laravel Sanctum
- 👥 **Sistema de roles** (Admin, Coach, Student)
- 🎮 **Gestión de juegos** y especializaciones
- 📚 **Clases programables** con cupos limitados
- 💳 **Sistema de pagos** integrado
- ⭐ **Sistema de reseñas** y calificaciones
- 📊 **API RESTful** completa y documentada
- 🔒 **Seguridad** con políticas y validaciones

## 🚀 Inicio Rápido

### Requisitos
- PHP 8.2+
- Composer
- MySQL 8.0+
- Node.js 18+ (opcional, para frontend)

### Instalación

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/auraboosting.git
cd auraboosting/AuraBoosting

# Instalar dependencias
composer install

# Configurar entorno
cp .env.example .env
php artisan key:generate

# Configurar base de datos en .env
DB_DATABASE=auraboosting
DB_USERNAME=root
DB_PASSWORD=tu_password

# Ejecutar migraciones
php artisan migrate

# (Opcional) Cargar datos de prueba
php artisan db:seed --class=DemoDataSeeder

# Iniciar servidor
php artisan serve
```

La API estará disponible en `http://localhost:8000/api/v1`

## 📚 Documentación

- **[API_README.md](API_README.md)** - Documentación completa de la API
- **[PROYECTO_COMPLETO.md](PROYECTO_COMPLETO.md)** - Guía completa del proyecto
- **[postman_collection.json](postman_collection.json)** - Colección de Postman

## 🎯 Endpoints Principales

### Autenticación
```bash
POST /api/v1/register   # Registrar usuario
POST /api/v1/login      # Iniciar sesión
GET  /api/v1/me         # Usuario actual
```

### Clases
```bash
GET  /api/v1/classes         # Listar clases
POST /api/v1/classes         # Crear clase (coach)
GET  /api/v1/my-classes      # Mis clases (coach)
```

### Inscripciones
```bash
POST /api/v1/enrollments     # Inscribirse a clase
GET  /api/v1/my-enrollments  # Mis inscripciones
```

Ver documentación completa en [API_README.md](API_README.md)

## 🏗️ Arquitectura

```
app/
├── Http/
│   ├── Controllers/Api/    # Controladores API
│   ├── Resources/          # Transformadores
│   ├── Requests/           # Validaciones
│   └── Middleware/         # Middleware personalizados
├── Models/                 # Modelos Eloquent
├── Policies/              # Políticas de autorización
├── Services/              # Lógica de negocio
└── Traits/                # Traits reutilizables
```

## 👥 Roles del Sistema

### Student (Estudiante)
- Inscribirse en clases
- Realizar pagos
- Dejar reseñas
- Ver historial

### Coach (Entrenador)
- Crear y gestionar clases
- Ver estudiantes inscritos
- Actualizar estado de clases
- Recibir reseñas

### Admin (Administrador)
- Acceso completo al sistema
- Gestión de usuarios
- Gestión de juegos
- Panel de administración

## 🔒 Seguridad

- ✅ Autenticación con Sanctum (tokens Bearer)
- ✅ Validación de datos (Form Requests)
- ✅ Autorización con Policies
- ✅ CSRF Protection
- ✅ Rate Limiting
- ✅ Password Hashing (bcrypt)
- ✅ SQL Injection Prevention

## 🧪 Testing

### Usuarios de Prueba
```
Admin:    admin@auraboosting.com
Coach:    coach1@auraboosting.com
Student:  student1@example.com
Password: password (todos)
```

### Ejecutar Tests
```bash
php artisan test
```

## 📦 Stack Tecnológico

**Backend:**
- Laravel 12
- Laravel Sanctum (Autenticación)
- MySQL
- PHP 8.2+

**Próximo Frontend:**
- React/Vue 3
- Tailwind CSS
- Axios
- React Query

## 🛣️ Roadmap

### Fase 1 - Backend ✅ COMPLETADO
- [x] API RESTful completa
- [x] Sistema de autenticación
- [x] Gestión de clases
- [x] Sistema de pagos
- [x] Sistema de reseñas

### Fase 2 - Panel Admin 🔜
- [ ] Dashboard con estadísticas
- [ ] CRUD de usuarios
- [ ] CRUD de juegos
- [ ] Gestión de pagos
- [ ] Sistema de reportes

### Fase 3 - Cliente Web/Móvil
- [ ] Aplicación web para estudiantes
- [ ] Búsqueda de clases
- [ ] Sistema de notificaciones
- [ ] Chat en tiempo real
- [ ] App móvil (opcional)

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo `LICENSE` para más detalles.

## 📧 Contacto

Equipo AuraBoosting - [@auraboosting](https://twitter.com/auraboosting)

Link del proyecto: [https://github.com/tu-usuario/auraboosting](https://github.com/tu-usuario/auraboosting)

---

Hecho con ❤️ por el equipo de AuraBoosting
