# CodeLatin-7 - Plataforma Educativa

Sistema de gestión educativa desarrollado con Django REST Framework (Backend) y Angular (Frontend).

## 🚀 Inicio Rápido

### Requisitos

- Docker Desktop (Windows/Mac) o Docker Engine (Linux)
- Docker Compose (incluido con Docker Desktop)

### Ejecutar el Proyecto

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd CodeLatin-7
   ```

2. **Iniciar con Docker Compose**
   ```bash
   docker-compose up --build
   ```

3. **Verificar que funciona**
   - Backend API: http://localhost:8000/api/
   - Admin Django: http://localhost:8000/admin/

¡Listo! El backend está corriendo. 🎉

## 🛠️ Comandos Útiles

```bash
# Iniciar el servidor
docker-compose up

# Iniciar en segundo plano
docker-compose up -d

# Ver logs
docker-compose logs -f backend

# Detener el servidor
docker-compose down

# Crear superusuario (admin)
docker-compose exec backend python manage.py createsuperuser

# Ejecutar migraciones manualmente
docker-compose exec backend python manage.py migrate
```

## 📁 Estructura del Proyecto

```
CodeLatin-7/
├── server/          # Backend Django REST Framework
├── client/          # Frontend Angular
└── docker-compose.yml
```

## 🔗 Endpoints de la API

- **API Root**: http://localhost:8000/api/
- **Estudiantes**: http://localhost:8000/api/estudiantes/
- **Grados**: http://localhost:8000/api/grados/
- **Instituciones**: http://localhost:8000/api/instituciones/
- **Materias**: http://localhost:8000/api/materias/
- **Personal**: http://localhost:8000/api/personal/
- **Periodos**: http://localhost:8000/api/periodos/
- **Calificaciones**: http://localhost:8000/api/calificaciones/
- **Admin Django**: http://localhost:8000/admin/

## 📝 Notas

- Las migraciones se ejecutan automáticamente al iniciar el contenedor
- La base de datos PostgreSQL (Neon) se configura mediante variables de entorno en `server/.env`
- El código está montado como volumen para desarrollo (cambios se reflejan automáticamente)
