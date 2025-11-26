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

La base de datos SQLite se guarda en `./server/data/db.sqlite3` para persistir los datos entre reinicios del contenedor.

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

