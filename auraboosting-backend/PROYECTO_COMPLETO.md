# 🎮 AuraBoosting - Documentación Completa del Proyecto

## 📦 Resumen del Sistema

**AuraBoosting** es una plataforma completa de coaching de videojuegos con arquitectura API RESTful.

### Componentes del Sistema
- ✅ **Backend API** (Laravel 12 + Sanctum) - COMPLETADO
- 🔜 **Panel Admin** (Frontend separado) - PRÓXIMO
- 🔜 **App Web/Móvil Cliente** - FUTURO

---

## 🏗️ Arquitectura Backend (Completada)

### Estructura de Carpetas
```
AuraBoosting/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Controller.php
│   │   │   └── Api/
│   │   │       ├── AuthController.php          ✅ Login, Register, Logout
│   │   │       ├── GameController.php          ✅ Gestión de juegos
│   │   │       ├── ClassController.php         ✅ Gestión de clases
│   │   │       ├── CoachController.php         ✅ Listado de coaches
│   │   │       ├── EnrollmentController.php    ✅ Inscripciones
│   │   │       ├── PaymentController.php       ✅ Pagos
│   │   │       └── ReviewController.php        ✅ Reseñas
│   │   ├── Resources/
│   │   │   ├── UserResource.php                ✅ Transformador de usuarios
│   │   │   ├── GameResource.php                ✅ Transformador de juegos
│   │   │   ├── ClassResource.php               ✅ Transformador de clases
│   │   │   ├── EnrollmentResource.php          ✅ Transformador de inscripciones
│   │   │   ├── PaymentResource.php             ✅ Transformador de pagos
│   │   │   ├── ReviewResource.php              ✅ Transformador de reseñas
│   │   │   └── SpecializationResource.php      ✅ Transformador de especializaciones
│   │   ├── Requests/
│   │   │   ├── Auth/
│   │   │   │   ├── RegisterRequest.php         ✅ Validación registro
│   │   │   │   └── LoginRequest.php            ✅ Validación login
│   │   │   ├── Class/
│   │   │   │   ├── StoreClassRequest.php       ✅ Validación crear clase
│   │   │   │   └── UpdateClassRequest.php      ✅ Validación actualizar clase
│   │   │   ├── Enrollment/
│   │   │   │   └── StoreEnrollmentRequest.php  ✅ Validación inscripción
│   │   │   ├── Payment/
│   │   │   │   └── StorePaymentRequest.php     ✅ Validación pago
│   │   │   └── Review/
│   │   │       ├── StoreReviewRequest.php      ✅ Validación crear reseña
│   │   │       └── UpdateReviewRequest.php     ✅ Validación actualizar reseña
│   │   └── Middleware/
│   │       ├── EnsureUserIsCoach.php           ✅ Middleware coach
│   │       ├── EnsureUserIsStudent.php         ✅ Middleware student
│   │       └── EnsureUserIsAdmin.php           ✅ Middleware admin
│   ├── Models/
│   │   ├── User.php                            ✅ Con relaciones completas
│   │   ├── Game.php                            ✅
│   │   ├── ClassModel.php                      ✅
│   │   ├── ClassEnrollment.php                 ✅
│   │   ├── Payment.php                         ✅
│   │   ├── Review.php                          ✅
│   │   └── CoachSpecialization.php             ✅
│   ├── Policies/
│   │   ├── ClassPolicy.php                     ✅ Autorización clases
│   │   ├── EnrollmentPolicy.php                ✅ Autorización inscripciones
│   │   └── ReviewPolicy.php                    ✅ Autorización reseñas
│   ├── Services/
│   │   ├── PaymentService.php                  ✅ Lógica de pagos
│   │   └── EnrollmentService.php               ✅ Lógica de inscripciones
│   └── Traits/
│       └── ApiResponse.php                     ✅ Respuestas consistentes
├── database/
│   ├── migrations/
│   │   ├── 2019_12_14_000001_create_personal_access_tokens_table.php ✅
│   │   ├── 0001_01_01_000000_create_users_table.php
│   │   ├── 2023_10_01_000000_add_columns_to_users_table.php ✅
│   │   ├── 2023_10_01_000001_create_games_table.php ✅
│   │   ├── 2023_10_01_000002_create_classes_table.php ✅
│   │   ├── 2023_10_01_000003_create_class_enrollments_table.php ✅
│   │   ├── 2023_10_01_000004_create_reviews_table.php ✅
│   │   ├── 2023_10_01_000005_create_payments_table.php ✅
│   │   └── 2023_10_01_000006_create_coach_specializations_table.php ✅
│   └── seeders/
│       └── DemoDataSeeder.php                  ✅ Datos de prueba
├── routes/
│   ├── api.php                                 ✅ Rutas API v1
│   └── web.php
├── config/
│   ├── sanctum.php                             ✅ Configuración Sanctum
│   └── cors.php                                ✅ Configuración CORS
├── bootstrap/
│   └── app.php                                 ✅ Middleware y excepciones
├── API_README.md                               ✅ Documentación API
└── postman_collection.json                     ✅ Colección Postman
```

---

## 🎯 Endpoints API Disponibles

### Base URL: `http://localhost:8000/api/v1`

#### 🔐 Autenticación
- `POST /register` - Registrar usuario
- `POST /login` - Iniciar sesión
- `POST /logout` - Cerrar sesión (auth)
- `GET /me` - Usuario actual (auth)

#### 🎮 Juegos
- `GET /games` - Listar juegos
- `GET /games/{id}` - Ver juego específico

#### 📚 Clases
- `GET /classes` - Listar clases (público)
- `GET /classes/{id}` - Ver clase específica
- `POST /classes` - Crear clase (coach)
- `PUT /classes/{id}` - Actualizar clase (coach)
- `DELETE /classes/{id}` - Eliminar clase (coach)
- `PATCH /classes/{id}/status` - Actualizar estado (coach)
- `GET /my-classes` - Mis clases (coach)

#### 👨‍🏫 Coaches
- `GET /coaches` - Listar coaches
- `GET /coaches/{id}` - Ver coach específico

#### 📝 Inscripciones
- `POST /enrollments` - Inscribirse (student)
- `GET /my-enrollments` - Mis inscripciones (student)
- `DELETE /enrollments/{id}` - Cancelar inscripción (student)

#### 💳 Pagos
- `POST /payments` - Procesar pago
- `GET /payments/{id}` - Ver pago
- `POST /payments/{id}/confirm` - Confirmar pago

#### ⭐ Reseñas
- `POST /reviews` - Crear reseña (student)
- `PUT /reviews/{id}` - Actualizar reseña (student)
- `DELETE /reviews/{id}` - Eliminar reseña (student)

---

## 🚀 Cómo Iniciar el Backend

### 1. Requisitos Previos
```bash
- PHP 8.2+
- Composer
- MySQL 8.0+
- Git
```

### 2. Instalación
```bash
cd AuraBoosting

# Instalar dependencias (requiere composer install completo)
composer install

# Configurar variables de entorno
cp .env.example .env

# Configurar base de datos en .env
DB_CONNECTION=mysql
DB_DATABASE=auraboosting
DB_USERNAME=root
DB_PASSWORD=tu_password

# Generar key
php artisan key:generate

# Ejecutar migraciones
php artisan migrate

# Cargar datos de prueba (opcional)
php artisan db:seed --class=DemoDataSeeder

# Iniciar servidor
php artisan serve
```

### 3. Probar la API
```bash
# Registro
curl -X POST http://localhost:8000/api/v1/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"password","password_confirmation":"password"}'

# Login
curl -X POST http://localhost:8000/api/v1/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password"}'
```

---

## 🎨 Recomendaciones para el Frontend (Panel Admin)

### Stack Tecnológico Sugerido

#### Opción 1: React + Vite (Recomendado)
```bash
npm create vite@latest auraboosting-admin -- --template react-ts
cd auraboosting-admin
npm install
```

**Librerías recomendadas:**
- **React Router** - Navegación
- **Axios** - Peticiones HTTP
- **TanStack Query (React Query)** - Estado del servidor
- **Zustand** - Estado global
- **Tailwind CSS** - Estilos
- **Shadcn/ui** - Componentes UI
- **Recharts** - Gráficos
- **React Hook Form** - Formularios

#### Opción 2: Vue 3 + Vite
```bash
npm create vite@latest auraboosting-admin -- --template vue-ts
```

**Librerías recomendadas:**
- **Vue Router** - Navegación
- **Pinia** - Estado
- **Axios** - HTTP
- **Element Plus** - Componentes UI
- **Chart.js** - Gráficos

#### Opción 3: Next.js (Full-stack)
```bash
npx create-next-app@latest auraboosting-admin
```

---

## 📱 Estructura del Panel Admin (Sugerida)

### Páginas Principales

```
admin-panel/
├── /login                          # Login de administradores
├── /dashboard                      # Dashboard principal
├── /users
│   ├── /students                  # Gestión de estudiantes
│   ├── /coaches                   # Gestión de coaches
│   └── /admins                    # Gestión de admins
├── /games
│   ├── /list                      # Lista de juegos
│   └── /create                    # Crear/editar juego
├── /classes
│   ├── /list                      # Lista de clases
│   ├── /pending                   # Clases pendientes
│   └── /completed                 # Clases completadas
├── /enrollments                    # Gestión de inscripciones
├── /payments
│   ├── /pending                   # Pagos pendientes
│   ├── /completed                 # Pagos completados
│   └── /refunds                   # Reembolsos
├── /reviews                        # Gestión de reseñas
├── /reports                        # Reportes y estadísticas
└── /settings                       # Configuración
```

### Componentes Clave

1. **AuthContext/AuthProvider**
   - Manejo de autenticación
   - Almacenar token
   - Verificar permisos

2. **API Client Service**
```javascript
// services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

3. **Dashboard Stats**
   - Total de usuarios
   - Clases activas
   - Ingresos del mes
   - Reseñas pendientes

4. **Tables con Paginación**
   - Filtros
   - Ordenamiento
   - Búsqueda

---

## 🔒 Seguridad Implementada

✅ **Autenticación con Sanctum**  
✅ **Validación de datos (Form Requests)**  
✅ **Autorización con Policies**  
✅ **CSRF Protection**  
✅ **Rate Limiting**  
✅ **Password Hashing (bcrypt)**  
✅ **SQL Injection Prevention (Eloquent ORM)**  
✅ **XSS Protection**  

---

## 📊 Base de Datos

### Relaciones
- Un **User (coach)** tiene muchas **Classes**
- Un **User (coach)** tiene muchas **Specializations**
- Un **User (student)** tiene muchas **Enrollments**
- Una **Class** pertenece a un **Coach** y un **Game**
- Un **Enrollment** tiene un **Payment**
- Una **Class** tiene muchas **Reviews**

### Migraciones Ordenadas
1. `users` (base Laravel)
2. `personal_access_tokens` (Sanctum)
3. `games`
4. `add_columns_to_users`
5. `coach_specializations`
6. `classes`
7. `class_enrollments`
8. `payments`
9. `reviews`

---

## 🧪 Testing

### Usuarios de Prueba (después de seeder)
```
Admin:    admin@auraboosting.com
Coach 1:  coach1@auraboosting.com
Coach 2:  coach2@auraboosting.com
Student:  student1@example.com
Password: password (todos)
```

---

## 📦 Próximos Pasos

### Backend
- [ ] Integración con Stripe/PayPal
- [ ] Sistema de notificaciones email
- [ ] WebSockets para notificaciones en tiempo real
- [ ] Sistema de reportes avanzados
- [ ] API de estadísticas
- [ ] Tests automatizados (PHPUnit)

### Frontend Admin
- [ ] Crear proyecto React/Vue
- [ ] Sistema de autenticación
- [ ] Dashboard con estadísticas
- [ ] CRUD completo de usuarios
- [ ] CRUD completo de juegos
- [ ] Gestión de clases
- [ ] Gestión de pagos
- [ ] Sistema de reportes
- [ ] Panel de configuración

---

## 🎯 Convenciones y Buenas Prácticas Implementadas

✅ **RESTful API Design**  
✅ **Versionado de API (v1)**  
✅ **Respuestas JSON consistentes**  
✅ **HTTP Status Codes correctos**  
✅ **Separación de responsabilidades (SRP)**  
✅ **Service Layer para lógica de negocio**  
✅ **Resource Transformers**  
✅ **Form Request Validation**  
✅ **Policy-based Authorization**  
✅ **Database Transactions**  
✅ **Eager Loading (N+1 prevention)**  
✅ **Middleware para roles**  
✅ **CORS configurado**  
✅ **Error Handling centralizado**  

---

## 📞 Soporte

Para cualquier consulta sobre la API o el proyecto, revisar:
- `API_README.md` - Documentación completa de la API
- `postman_collection.json` - Colección de Postman para pruebas
- Código fuente comentado

---

**¡El backend está 100% funcional y listo para conectar con el frontend!** 🎉
