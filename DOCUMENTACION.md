# Documentación Técnica - CodeLatin-7

## 📁 Estructura del Proyecto

```
server/
├── core/ # ⚙️ Configuración del proyecto Django
│ ├── settings.py # Configuración global (BD, apps, middleware, CORS)
│ ├── urls.py # Rutas principales del proyecto
│ ├── views.py # Vista de bienvenida (api_root)
│ ├── wsgi.py # Configuración WSGI para producción
│ └── asgi.py # Configuración ASGI para async/WebSockets
│
├── school/ # 📚 Aplicación principal
│ ├── models/ # Modelos de base de datos (organizados por entidad)
│ ├── admin/ # Configuración del panel de administración
│ ├── api/ # 🌐 API REST (organizada por módulos)
│ ├── migrations/ # Migraciones de base de datos
│ ├── tests/ # Pruebas unitarias
│ └── apps.py # Configuración de la aplicación
│
├── scripts/ # 🔧 Scripts de utilidad
│ └── entrypoint.sh # Script de inicio para Docker
│
├── manage.py # Script de gestión de Django
├── requirements.txt # Dependencias Python
├── Dockerfile # Configuración Docker
└── db.sqlite3 # Base de datos SQLite
```

## 🔗 Endpoints de la API

**Base URL:** `http://localhost:8000/api/`

### Recursos Disponibles

- **Estudiantes**: `/api/estudiantes/` o `/api/alumnos/`
- **Grados**: `/api/grados/`
- **Instituciones**: `/api/instituciones/`
- **Materias**: `/api/materias/`
- **Personal**: `/api/personal/`
- **Periodos**: `/api/periodos/`
- **Calificaciones**: `/api/calificaciones/`

### Operaciones CRUD

Todos los endpoints soportan:
- `GET /api/{recurso}/` - Listar (paginado)
- `GET /api/{recurso}/{id}/` - Obtener por ID
- `POST /api/{recurso}/` - Crear
- `PUT /api/{recurso}/{id}/` - Actualizar
- `DELETE /api/{recurso}/{id}/` - Eliminar

## 📊 Modelos Principales

- **Estudiante**: nombre, apellido, matricula, correo, grado
- **Grado**: nombre, descripcion, institucion
- **Institucion**: nombre, direccion, telefono
- **Personal**: nombre, apellido, cedula, cargo, institucion
- **Materia**: nombre, descripcion, grado
- **Periodo**: nombre, fecha_inicio, fecha_fin
- **Calificacion**: estudiante, materia, periodo, nota

## ⚙️ Configuración

- **Backend**: Django 5.2+ con Django REST Framework
- **Base de Datos**: SQLite (por defecto)
- **CORS**: Habilitado para desarrollo
- **Paginación**: 20 elementos por página
#----------------------------------------
#
# Dockerización del Backend
#
#----------------------------------------

Este documento explica cómo usar Docker para ejecutar el backend Django.

## Requisitos

- Docker instalado
- Docker Compose instalado (opcional pero recomendado)

## Opción 1: Usar Docker Compose (Recomendado)

### Construir y ejecutar

```bash
# Desde la raíz del proyecto
docker-compose up --build
```

### Ejecutar en segundo plano

```bash
docker-compose up -d
```

### Ver logs

```bash
docker-compose logs -f backend
```

### Detener

```bash
docker-compose down
```

### Detener y eliminar volúmenes

```bash
docker-compose down -v
```

## Opción 2: Usar Docker directamente

### Construir la imagen

```bash
cd server
docker build -t codelatin-backend .
```

### Ejecutar el contenedor

```bash
docker run -d \
  --name codelatin-backend \
  -p 8000:8000 \
  codelatin-backend
```

### Ver logs

```bash
docker logs -f codelatin-backend
```

### Detener y eliminar

```bash
docker stop codelatin-backend
docker rm codelatin-backend
```

## Ejecutar comandos Django

### ⚠️ Importante: Usuario Admin

**Si la base de datos ya existe** (archivo `server/db.sqlite3` presente):
- ✅ **NO necesitas crear un nuevo superusuario**
- ✅ Usa las credenciales existentes para acceder al admin
- ✅ La base de datos persiste entre reinicios gracias a los volúmenes montados

**Solo si es la primera vez o la base de datos no existe**, crea un superusuario:

### Con Docker Compose

```bash
# Crear superusuario (solo si es necesario)
docker-compose exec backend python manage.py createsuperuser

# Ejecutar migraciones manualmente
docker-compose exec backend python manage.py migrate

# Acceder a la shell de Django
docker-compose exec backend python manage.py shell
```

### Con Docker directo

```bash
# Crear superusuario
docker exec -it codelatin-backend python manage.py createsuperuser

# Ejecutar migraciones
docker exec -it codelatin-backend python manage.py migrate

# Acceder a la shell
docker exec -it codelatin-backend python manage.py shell
```

## Variables de Entorno

Puedes crear un archivo `.env` en la carpeta `server` para configurar variables de entorno:

```env
DEBUG=True
SECRET_KEY=tu-secret-key-aqui
ALLOWED_HOSTS=localhost,127.0.0.1
```

Y actualizar el `docker-compose.yml` para cargarlo:

```yaml
environment:
  - DEBUG=${DEBUG}
  - SECRET_KEY=${SECRET_KEY}
env_file:
  - ./server/.env
```

## Persistencia de Datos

La base de datos SQLite se guarda en `./server/db.sqlite3` para persistir los datos entre reinicios del contenedor.

**Nota importante:** Si el archivo `server/db.sqlite3` ya existe con datos y usuarios, estos se mantendrán cuando otra persona ejecute el servidor con Docker. No es necesario crear nuevos usuarios a menos que se elimine la base de datos.

## Solución de Problemas

### El contenedor no inicia

```bash
# Ver logs
docker-compose logs backend

# Verificar que el puerto 8000 no esté en uso
netstat -an | grep 8000
```

### Error de permisos

```bash
# En Linux/Mac, ajustar permisos
chmod +x server/entrypoint.sh
```

### Reconstruir desde cero

```bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```

## Producción

Para producción, considera:

1. Usar una base de datos externa (PostgreSQL, MySQL, etc.)
2. Configurar variables de entorno seguras
3. Deshabilitar DEBUG
4. Usar un servidor WSGI como Gunicorn
5. Configurar un proxy reverso (Nginx)
6. Usar volúmenes nombrados para datos persistentes

#---------------------------------------------------------------
#
## 🔄 Migraciones de Base de Datos
#
#----------------------------------------------------------------


### Migraciones de Esquema

Las migraciones se ejecutan automáticamente al iniciar con Docker (`docker-compose up`). Manualmente:

**Con Docker:**
```bash
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py makemigrations
docker-compose exec backend python manage.py showmigrations
```

**Sin Docker:**
```bash
cd server
python manage.py migrate
python manage.py makemigrations
python manage.py showmigrations
```

**Migraciones existentes:**
- `0001_initial.py`: Crea Institucion, Grado, Periodo, Alumno, Profesor, Materia, Calificacion
- `0002_personal.py`: Crea tabla Personal

### Migraciones de Datos (Fixtures)

**Con Docker - Exportar datos:**
```bash
docker-compose exec backend python manage.py dumpdata school > fixtures/school_data.json
docker-compose exec backend python manage.py dumpdata school.Institucion > fixtures/instituciones.json
docker-compose exec backend python manage.py dumpdata auth.User > fixtures/usuarios.json
```

**Con Docker - Importar datos:**
```bash
docker-compose exec backend python manage.py loaddata fixtures/school_data.json
docker-compose exec backend python manage.py loaddata fixtures/usuarios.json fixtures/instituciones.json
```

**Sin Docker:**
```bash
cd server
python manage.py dumpdata school > fixtures/school_data.json
python manage.py loaddata fixtures/school_data.json
```
