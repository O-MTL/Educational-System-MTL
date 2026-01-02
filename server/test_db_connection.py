"""
Script para probar la conexión a PostgreSQL (Neon)
"""
import os
import sys
import django

# Configurar encoding para Windows
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.db import connection
from django.conf import settings

def test_connection():
    """Prueba la conexión a la base de datos"""
    print("🔍 Verificando configuración de base de datos...")
    print(f"   DB_NAME: {settings.DATABASES['default']['NAME']}")
    print(f"   DB_USER: {settings.DATABASES['default']['USER']}")
    print(f"   DB_HOST: {settings.DATABASES['default']['HOST']}")
    print(f"   DB_PORT: {settings.DATABASES['default']['PORT']}")
    print(f"   DB_PASSWORD: {'*' * len(settings.DATABASES['default']['PASSWORD']) if settings.DATABASES['default']['PASSWORD'] else '(vacío)'}")
    print()
    
    try:
        print("🔌 Intentando conectar a PostgreSQL...")
        with connection.cursor() as cursor:
            # Probar conexión básica
            cursor.execute("SELECT version();")
            version = cursor.fetchone()
            print(f"✅ Conexión exitosa a PostgreSQL!")
            print(f"   Versión: {version[0]}")
            print()
            
            # Probar que podemos listar las bases de datos
            cursor.execute("SELECT current_database();")
            current_db = cursor.fetchone()
            print(f"✅ Base de datos actual: {current_db[0]}")
            print()
            
            # Verificar que podemos hacer queries
            cursor.execute("SELECT 1 as test;")
            test = cursor.fetchone()
            print(f"✅ Query de prueba exitosa: {test[0]}")
            print()
            
            print("🎉 ¡Todo funciona correctamente!")
            return True
            
    except Exception as e:
        print(f"❌ Error de conexión: {e}")
        print()
        print("💡 Posibles soluciones:")
        print("   1. Verifica que el archivo .env existe en server/")
        print("   2. Verifica que las credenciales en .env son correctas")
        print("   3. Verifica que DB_HOST solo contiene el hostname (sin postgresql://)")
        print("   4. Verifica que puedes acceder a Neon desde tu red")
        return False

if __name__ == '__main__':
    success = test_connection()
    sys.exit(0 if success else 1)

