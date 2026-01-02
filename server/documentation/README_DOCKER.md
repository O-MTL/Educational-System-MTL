# Dockerización del Backend

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
docker build -t educational-system-backend .
```

### Ejecutar el contenedor

```bash
docker run -d \
  --name educational-system-backend \
  -p 8000:8000 \
  educational-system-backend
```

### Ver logs

```bash
docker logs -f educational-system-backend
```

### Detener y eliminar

```bash
docker stop educational-system-backend
docker rm educational-system-backend
```

## Ejecutar comandos Django

### Con Docker Compose

```bash
# Crear superusuario
docker-compose exec backend python manage.py createsuperuser

# Ejecutar migraciones manualmente
docker-compose exec backend python manage.py migrate

# Acceder a la shell de Django
docker-compose exec backend python manage.py shell
```

### Con Docker directo

```bash
# Crear superusuario
docker exec -it educational-system-backend python manage.py createsuperuser

# Ejecutar migraciones
docker exec -it educational-system-backend python manage.py migrate

# Acceder a la shell
docker exec -it educational-system-backend python manage.py shell
```

## Variables de Entorno

Crea un archivo `.env` en la carpeta `server` para configurar las credenciales de PostgreSQL (Neon):

```env
# PostgreSQL (Neon) Configuration
DB_NAME=neondb
DB_USER=neondb_owner
DB_PASSWORD=tu_password_aqui
DB_HOST=ep-lucky-bush-ada2nsx9-pooler.c-2.us-east-1.aws.neon.tech
DB_PORT=5432

# Django Settings (opcional)
DEBUG=True
SECRET_KEY=tu-secret-key-aqui
ALLOWED_HOSTS=localhost,127.0.0.1
```

El `docker-compose.yml` ya está configurado para cargar estas variables automáticamente.

## Persistencia de Datos

La base de datos PostgreSQL (Neon) es un servicio en la nube, por lo que los datos persisten automáticamente. No necesitas configurar volúmenes locales para la base de datos.

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

## Optimización de Hot Reload (Desarrollo)

### Angular (Frontend)

El proyecto está configurado para detectar cambios automáticamente sin necesidad de reiniciar:

**Opciones disponibles:**

```bash
# Modo normal (polling cada 2 segundos)
npm start

# Modo rápido (polling cada 1 segundo) - Recomendado para desarrollo
npm run start:fast
```

**Características:**
- ✅ **Watch mode automático**: Los cambios se detectan y recargan automáticamente
- ✅ **Polling optimizado**: Configurado para Windows (detecta cambios cada 1-2 segundos)
- ✅ **Sin reinicio necesario**: Solo guarda el archivo y espera la recarga automática

**Nota**: Si los cambios no se detectan rápidamente, usa `npm run start:fast` para polling más frecuente.

### Django (Backend)

El servidor Django también tiene auto-reload habilitado:

- ✅ **Auto-reload nativo**: `runserver` detecta cambios en archivos `.py` automáticamente
- ✅ **Volumen montado**: El código está montado en Docker para reflejar cambios inmediatamente
- ✅ **Sin reinicio necesario**: Los cambios en modelos, vistas, serializers se recargan automáticamente

**Importante**: Si cambias `settings.py` o `urls.py`, puede requerir reinicio manual del contenedor.

## Producción

Para producción, considera:

1. ✅ Base de datos externa (PostgreSQL con Neon) - Ya configurado
2. Configurar variables de entorno seguras
3. Deshabilitar DEBUG
4. Usar un servidor WSGI como Gunicorn
5. Configurar un proxy reverso (Nginx)
6. Usar SSL/TLS para conexiones seguras

