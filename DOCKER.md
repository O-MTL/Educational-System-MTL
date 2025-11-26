# Documentación Docker - CodeLatin-7 Backend

Esta documentación explica todo lo relacionado con la dockerización del backend Django del proyecto CodeLatin-7.

## 📋 Tabla de Contenidos

1. [Introducción](#introducción)
2. [Estructura de Archivos Docker](#estructura-de-archivos-docker)
3. [Construcción de la Imagen](#construcción-de-la-imagen)
4. [Ejecución del Contenedor](#ejecución-del-contenedor)
5. [Configuración](#configuración)
6. [Comandos Útiles](#comandos-útiles)
7. [Solución de Problemas](#solución-de-problemas)
8. [Producción](#producción)

---

## 🎯 Introducción

El backend Django ha sido dockerizado para facilitar el despliegue y la ejecución en cualquier entorno que soporte Docker. La dockerización incluye:

- **Dockerfile**: Define cómo construir la imagen del servidor
- **docker-compose.yml**: Facilita la gestión del contenedor
- **entrypoint.sh**: Script de inicio que ejecuta migraciones automáticamente
- **.dockerignore**: Optimiza el proceso de construcción

### Requisitos Previos

- Docker Desktop (Windows/Mac) o Docker Engine (Linux)
- Docker Compose (incluido con Docker Desktop)
- Git (para clonar el repositorio)

---

## ⚡ Comandos Rápidos (Referencia)

### Iniciar y Verificar

```bash
# Iniciar el servidor en segundo plano
docker-compose up -d

# Ver contenedores activos
docker ps

# Ver logs (últimas 20 líneas)
docker-compose logs --tail=20 backend

# Ver logs en tiempo real
docker-compose logs -f backend
```

### Detener y Reiniciar

```bash
# Detener el servidor
docker-compose stop

# Reiniciar el servidor
docker-compose restart

# Detener y eliminar
docker-compose down
```

### Comandos Django

```bash
# Crear superusuario (solo si es necesario)
docker-compose exec backend python manage.py createsuperuser

# Ejecutar migraciones
docker-compose exec backend python manage.py migrate

# Acceder a shell de Django
docker-compose exec backend python manage.py shell
```

---

## 📁 Estructura de Archivos Docker

```
CodeLatin-7/
├── server/
│   ├── Dockerfile              # Definición de la imagen Docker
│   ├── .dockerignore           # Archivos excluidos del build
│   ├── entrypoint.sh          # Script de inicio del contenedor
│   ├── requirements.txt       # Dependencias Python
│   └── ...
├── docker-compose.yml          # Configuración de Docker Compose
└── DOCKER.md                   # Esta documentación
```

### Descripción de Archivos

#### `server/Dockerfile`

Define la imagen Docker del backend:

```dockerfile
# Usa Python 3.11 como base
FROM python:3.11-slim

# Establece el directorio de trabajo
WORKDIR /app

# Variables de entorno
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Instala dependencias del sistema (gcc para compilar extensiones)
RUN apt-get update && apt-get install -y gcc && rm -rf /var/lib/apt/lists/*

# Instala dependencias Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia el código de la aplicación
COPY . .

# Crea directorio para datos persistentes
RUN mkdir -p /app/data

# Configura el script de entrada
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# Expone el puerto 8000
EXPOSE 8000

# Usa el script de entrypoint
ENTRYPOINT ["/app/entrypoint.sh"]
```

**Características:**
- Imagen base ligera (`python:3.11-slim`)
- Instalación optimizada de dependencias
- Script de entrada personalizado
- Puerto 8000 expuesto

#### `server/entrypoint.sh`

Script que se ejecuta al iniciar el contenedor:

```bash
#!/bin/bash
set -e

# Espera 2 segundos
sleep 2

# Ejecuta migraciones automáticamente
python manage.py migrate --noinput

# Recopila archivos estáticos (si es necesario)
python manage.py collectstatic --noinput || true

# Inicia el servidor Django
exec python manage.py runserver 0.0.0.0:8000
```

**Funcionalidades:**
- Ejecuta migraciones automáticamente
- Recopila archivos estáticos
- Inicia el servidor Django

#### `server/.dockerignore`

Excluye archivos innecesarios del contexto de construcción:

```
__pycache__/
*.py[cod]
*.log
db.sqlite3
venv/
.env
.git/
```

**Beneficios:**
- Reduce el tamaño del contexto de construcción
- Acelera el proceso de build
- Evita copiar archivos sensibles

#### `docker-compose.yml`

Configuración para Docker Compose:

```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./server
      dockerfile: Dockerfile
    container_name: codelatin-backend
    ports:
      - "8000:8000"
    volumes:
      - ./server:/app              # Monta código para desarrollo
      - ./server/data:/app/data     # Persistencia de datos
      - ./server/db.sqlite3:/app/db.sqlite3
    environment:
      - DJANGO_SETTINGS_MODULE=core.settings
      - PYTHONUNBUFFERED=1
    healthcheck:
      test: ["CMD", "python", "-c", "import urllib.request; urllib.request.urlopen('http://localhost:8000/api/')"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

**Características:**
- Construcción automática de la imagen
- Volúmenes para desarrollo y persistencia
- Healthcheck configurado
- Variables de entorno

---

## 🔨 Construcción de la Imagen

### Método 1: Con Docker Compose (Recomendado)

```bash
# Desde la raíz del proyecto
docker-compose build
```

O construir y ejecutar al mismo tiempo:

```bash
docker-compose up --build
```

### Método 2: Con Docker directamente

```bash
cd server
docker build -t codelatin-backend:latest .
```

**Opciones de construcción:**

```bash
# Construir sin cache (forzar reconstrucción completa)
docker build --no-cache -t codelatin-backend:latest .

# Construir con tag específico
docker build -t codelatin-backend:v1.0.0 .

# Construir para plataforma específica
docker build --platform linux/amd64 -t codelatin-backend:latest .
```

### Verificar la Imagen Construida

```bash
# Listar imágenes
docker images codelatin-backend

# Ver detalles de la imagen
docker inspect codelatin-backend:latest

# Ver historial de construcción
docker history codelatin-backend:latest
```

**Salida esperada:**
```
REPOSITORY          TAG       IMAGE ID       CREATED          SIZE
codelatin-backend   latest    ff941310be15   2 minutes ago    538MB
```

---

## 🚀 Ejecución del Contenedor

### Método 1: Con Docker Compose (Recomendado)

#### Ejecutar en Primer Plano

```bash
docker-compose up
```

#### Ejecutar en Segundo Plano (Detached)

```bash
docker-compose up -d
```

#### Ejecutar y Construir

```bash
docker-compose up --build -d
```

### Método 2: Con Docker directamente

```bash
docker run -d \
  --name codelatin-backend \
  -p 8000:8000 \
  -v $(pwd)/server/data:/app/data \
  -v $(pwd)/server/db.sqlite3:/app/db.sqlite3 \
  codelatin-backend:latest
```

**Explicación de parámetros:**
- `-d`: Ejecuta en segundo plano (detached)
- `--name`: Nombre del contenedor
- `-p 8000:8000`: Mapea puerto host:contenedor
- `-v`: Monta volúmenes para persistencia

### Verificar que Está Corriendo

```bash
# Ver contenedores activos
docker ps

# Ver todos los contenedores (incluyendo detenidos)
docker ps -a

# Ver logs en tiempo real
docker-compose logs -f backend

# Ver últimas 20 líneas de logs
docker-compose logs --tail=20 backend

# Ver logs con Docker directamente
docker logs -f codelatin-backend

# Ver últimas líneas de logs con Docker directamente
docker logs --tail=20 codelatin-backend

# Verificar salud del contenedor
docker-compose ps

# Ver información detallada del contenedor
docker inspect codelatin-backend
```

### Acceder al Servidor

Una vez corriendo, el servidor estará disponible en:

- **API Root**: http://localhost:8000/
- **API Endpoints**: http://localhost:8000/api/
- **Admin Django**: http://localhost:8000/admin/

---

## ⚙️ Configuración

### Variables de Entorno

Puedes configurar variables de entorno de varias formas:

#### 1. En `docker-compose.yml`

```yaml
services:
  backend:
    environment:
      - DEBUG=True
      - SECRET_KEY=tu-clave-secreta
      - ALLOWED_HOSTS=localhost,127.0.0.1
```

#### 2. Con archivo `.env`

Crea `server/.env`:

```env
DEBUG=True
SECRET_KEY=tu-clave-secreta-aqui
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0
```

Y actualiza `docker-compose.yml`:

```yaml
services:
  backend:
    env_file:
      - ./server/.env
```

#### 3. Al ejecutar con Docker

```bash
docker run -d \
  -e DEBUG=True \
  -e SECRET_KEY=tu-clave \
  -p 8000:8000 \
  codelatin-backend:latest
```

### Volúmenes

Los volúmenes configurados en `docker-compose.yml`:

1. **`./server:/app`**: Monta el código para desarrollo (cambios se reflejan)
2. **`./server/data:/app/data`**: Directorio para datos persistentes
3. **`./server/db.sqlite3:/app/db.sqlite3`**: Base de datos SQLite

**Para producción**, comenta el volumen de código:

```yaml
volumes:
  # - ./server:/app  # Comentar en producción
  - ./server/data:/app/data
```

### Puertos

Por defecto, el puerto 8000 está mapeado. Para cambiar el puerto:

```yaml
ports:
  - "8080:8000"  # Puerto host:puerto contenedor
```

O con Docker:

```bash
docker run -d -p 8080:8000 codelatin-backend:latest
```

---

## 🛠️ Comandos Útiles

### Gestión del Contenedor

```bash
# Iniciar contenedor
docker-compose start

# Detener contenedor
docker-compose stop

# Reiniciar contenedor
docker-compose restart

# Detener y eliminar contenedor
docker-compose down

# Detener y eliminar contenedor + volúmenes
docker-compose down -v

# Ver logs en tiempo real
docker-compose logs -f backend

# Ver últimas 20 líneas de logs (útil para verificar inicio)
docker-compose logs --tail=20 backend

# Ver últimas 100 líneas de logs
docker-compose logs --tail=100 backend

# Ver todos los logs desde el inicio
docker-compose logs backend
```

### Ejecutar Comandos Django

**⚠️ Importante sobre el usuario admin:**

Si el archivo `server/db.sqlite3` ya existe con datos y usuarios:
- ✅ **NO necesitas crear un nuevo superusuario**
- ✅ Usa las credenciales existentes para acceder al admin en http://localhost:8000/admin/
- ✅ La base de datos persiste entre reinicios gracias a los volúmenes montados

Solo crea un superusuario si es la primera vez o si la base de datos no existe.

```bash
# Crear superusuario (solo si es necesario)
docker-compose exec backend python manage.py createsuperuser

# Ejecutar migraciones
docker-compose exec backend python manage.py migrate

# Crear migraciones
docker-compose exec backend python manage.py makemigrations

# Acceder a la shell de Django
docker-compose exec backend python manage.py shell

# Verificar configuración
docker-compose exec backend python manage.py check

# Recopilar archivos estáticos
docker-compose exec backend python manage.py collectstatic
```

### Gestión de la Imagen

```bash
# Listar imágenes
docker images

# Eliminar imagen
docker rmi codelatin-backend:latest

# Eliminar imagen forzadamente
docker rmi -f codelatin-backend:latest

# Ver tamaño de imágenes
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"

# Limpiar imágenes no utilizadas
docker image prune
```

### Exportar/Importar Imagen

```bash
# Exportar imagen a archivo tar
docker save codelatin-backend:latest -o codelatin-backend.tar

# Importar imagen desde archivo tar
docker load -i codelatin-backend.tar

# Exportar con compresión
docker save codelatin-backend:latest | gzip > codelatin-backend.tar.gz

# Importar desde archivo comprimido
gunzip -c codelatin-backend.tar.gz | docker load
```

### Inspección y Debugging

```bash
# Ver información del contenedor
docker inspect codelatin-backend

# Ver información resumida del contenedor
docker inspect --format='{{.State.Status}}' codelatin-backend

# Ver procesos dentro del contenedor
docker-compose exec backend ps aux

# Acceder a shell del contenedor
docker-compose exec backend bash
# o
docker exec -it codelatin-backend bash

# Ver uso de recursos en tiempo real
docker stats codelatin-backend

# Ver uso de recursos de todos los contenedores
docker stats

# Ver red del contenedor
docker network inspect code-latin-7_default

# Ver volúmenes montados
docker inspect codelatin-backend | grep -A 10 Mounts

# Ver variables de entorno del contenedor
docker inspect codelatin-backend | grep -A 20 Env
```

---

## 🔧 Solución de Problemas

### El contenedor no inicia

**Síntomas:**
- El contenedor se detiene inmediatamente
- `docker ps` no muestra el contenedor

**Solución:**
```bash
# Ver logs del contenedor
docker-compose logs backend

# Verificar configuración
docker-compose config

# Reconstruir sin cache
docker-compose build --no-cache
docker-compose up
```

### Error: "Port already in use"

**Síntomas:**
```
Error: bind: address already in use
```

**Solución:**
```bash
# Ver qué está usando el puerto 8000
netstat -ano | findstr :8000  # Windows
lsof -i :8000                 # Linux/Mac

# Cambiar el puerto en docker-compose.yml
ports:
  - "8001:8000"  # Usar puerto diferente
```

### Error: "Cannot connect to the Docker daemon"

**Síntomas:**
```
Cannot connect to the Docker daemon
```

**Solución:**
- Verificar que Docker Desktop esté corriendo
- En Linux: `sudo systemctl start docker`
- Verificar permisos: `docker ps` debe funcionar

### Error: "Permission denied" en entrypoint.sh

**Síntomas:**
```
/bin/bash: /app/entrypoint.sh: Permission denied
```

**Solución:**
```bash
# Dar permisos de ejecución
chmod +x server/entrypoint.sh

# Reconstruir la imagen
docker-compose build --no-cache
```

### La base de datos no persiste

**Síntomas:**
- Los datos se pierden al reiniciar el contenedor

**Solución:**
```bash
# Verificar que los volúmenes estén montados
docker inspect codelatin-backend | grep Mounts

# Verificar permisos del directorio
ls -la server/data/

# Asegurar que el volumen esté en docker-compose.yml
volumes:
  - ./server/data:/app/data
```

### Error: "ModuleNotFoundError"

**Síntomas:**
```
ModuleNotFoundError: No module named 'django'
```

**Solución:**
```bash
# Reconstruir la imagen
docker-compose build --no-cache

# Verificar requirements.txt
cat server/requirements.txt

# Reinstalar dependencias dentro del contenedor
docker-compose exec backend pip install -r requirements.txt
```

### El servidor no responde

**Síntomas:**
- El contenedor está corriendo pero no responde en el navegador

**Solución:**
```bash
# Verificar que el contenedor esté corriendo
docker ps

# Ver logs
docker-compose logs backend

# Verificar healthcheck
docker inspect codelatin-backend | grep Health

# Probar conexión desde dentro del contenedor
docker-compose exec backend curl http://localhost:8000/api/
```

### Limpiar Todo y Empezar de Nuevo

```bash
# Detener y eliminar contenedores
docker-compose down -v

# Eliminar imagen
docker rmi codelatin-backend:latest

# Limpiar sistema Docker
docker system prune -a

# Reconstruir desde cero
docker-compose build --no-cache
docker-compose up
```

---

## 🏭 Producción

### Consideraciones para Producción

#### 1. Usar Gunicorn en lugar de runserver

Crea `server/gunicorn_config.py`:

```python
bind = "0.0.0.0:8000"
workers = 4
threads = 2
timeout = 120
```

Actualiza `server/Dockerfile`:

```dockerfile
# Instalar Gunicorn
RUN pip install gunicorn

# Cambiar el comando
CMD ["gunicorn", "core.wsgi:application", "--config", "gunicorn_config.py"]
```

#### 2. Variables de Entorno Seguras

```yaml
environment:
  - DEBUG=False
  - SECRET_KEY=${SECRET_KEY}  # Desde variable de entorno del host
  - ALLOWED_HOSTS=${ALLOWED_HOSTS}
```

#### 3. Base de Datos Externa

Para producción, usa PostgreSQL o MySQL:

```yaml
services:
  backend:
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/dbname
    depends_on:
      - db
  
  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=codelatin
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
```

#### 4. Nginx como Proxy Reverso

```yaml
services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - backend
```

#### 5. Optimización de la Imagen

```dockerfile
# Usar multi-stage build
FROM python:3.11-slim as builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --user -r requirements.txt

FROM python:3.11-slim
WORKDIR /app
COPY --from=builder /root/.local /root/.local
COPY . .
ENV PATH=/root/.local/bin:$PATH
```

### Despliegue

#### Docker Hub

```bash
# Tag de la imagen
docker tag codelatin-backend:latest tu-usuario/codelatin-backend:latest

# Push a Docker Hub
docker push tu-usuario/codelatin-backend:latest
```

#### Docker Compose en Servidor

```bash
# En el servidor
git clone <repo>
cd CodeLatin-7
docker-compose -f docker-compose.prod.yml up -d
```

---

## 📊 Monitoreo y Mantenimiento

### Ver Uso de Recursos

```bash
# Estadísticas en tiempo real
docker stats codelatin-backend

# Uso de disco
docker system df

# Espacio usado por volúmenes
docker volume ls
```

### Backup de Datos

```bash
# Backup de la base de datos SQLite
docker-compose exec backend cp /app/db.sqlite3 /app/data/backup_$(date +%Y%m%d).sqlite3

# O desde el host
cp server/db.sqlite3 server/data/backup_$(date +%Y%m%d).sqlite3
```

### Actualizar la Aplicación

```bash
# 1. Detener el contenedor
docker-compose down

# 2. Actualizar código
git pull

# 3. Reconstruir imagen
docker-compose build --no-cache

# 4. Iniciar
docker-compose up -d

# 5. Ejecutar migraciones (si hay cambios en BD)
docker-compose exec backend python manage.py migrate
```

---

## 📚 Referencias

- [Documentación oficial de Docker](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Django Deployment Checklist](https://docs.djangoproject.com/en/stable/howto/deployment/checklist/)
- [Dockerfile Best Practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)

---

## ✅ Checklist de Dockerización

- [x] Dockerfile creado y optimizado
- [x] .dockerignore configurado
- [x] docker-compose.yml configurado
- [x] entrypoint.sh con migraciones automáticas
- [x] Healthcheck configurado
- [x] Volúmenes para persistencia
- [x] Variables de entorno configuradas
- [x] Documentación completa

---

**Última actualización:** $(date)
**Versión:** 1.0.0

