# 🔷 Arquitectura Hexagonal vs Nuestra Implementación

## ¿Qué es la Arquitectura Hexagonal?

La **Arquitectura Hexagonal** (también llamada **Ports & Adapters**) fue creada por Alistair Cockburn. Se llama "hexagonal" porque visualmente se representa como un hexágono, pero el número de lados no importa - lo importante es que el **núcleo está aislado** y se conecta al exterior a través de **puertos y adaptadores**.

### Conceptos Clave

```
┌─────────────────────────────────────────┐
│                                         │
│         ADAPTADORES PRIMARIOS           │
│    (Lo que INICIA la comunicación)     │
│  - HTTP/REST API                        │
│  - CLI                                  │
│  - WebSockets                           │
│  - GraphQL                              │
├─────────────────────────────────────────┤
│                                         │
│              PUERTOS                    │
│    (Interfaces/Contratos)               │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│         NÚCLEO DE APLICACIÓN            │
│    (Lógica de Negocio Pura)            │
│  - Entities (objetos de dominio)       │
│  - Use Cases / Services                 │
│  - Domain Events                        │
│  - Value Objects                        │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│              PUERTOS                    │
│    (Interfaces/Contratos)               │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│        ADAPTADORES SECUNDARIOS          │
│  (Lo que la aplicación USA)            │
│  - Base de Datos                        │
│  - APIs Externas                        │
│  - Sistema de Archivos                  │
│  - Cola de Mensajes                     │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🎯 Nuestra Implementación (Hexagonal Simplificada)

### Mapeo de Conceptos

| Concepto Hexagonal | Nuestra Implementación | Archivo Ejemplo |
|-------------------|------------------------|-----------------|
| **Adaptador Primario** | ViewSets | `api/views.py` |
| **Puerto Primario** | (Implícito - duck typing) | - |
| **Use Case / Service** | Services | `services/alumno_service.py` |
| **Entity** | Modelos Django | `models/alumno.py` |
| **Puerto Secundario** | (Implícito - duck typing) | - |
| **Adaptador Secundario** | Repositories | `repositories/alumno_repository.py` |
| **Infraestructura** | Django ORM | `models/` |

### Diagrama de Nuestra Arquitectura

```
┌─────────────────────────────────────────┐
│                                         │
│         ADAPTADOR PRIMARIO              │
│         (ViewSets - API REST)           │
│                                         │
│  class AlumnoViewSet:                   │
│    - list()                             │
│    - create()                           │
│    - update()                           │
│    - delete()                           │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│         SERIALIZERS (DTOs)              │
│    (Validación de entrada/salida)      │
│                                         │
│  class AlumnoSerializer:               │
│    - validate_nombre()                  │
│    - validate_apellido()                │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│         NÚCLEO (SERVICES)               │
│      (Lógica de Negocio)                │
│                                         │
│  class AlumnoService:                   │
│    - crear_alumno()                     │
│    - obtener_alumno()                   │
│    - actualizar_alumno()                │
│    - _generar_matricula()               │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│      ADAPTADOR SECUNDARIO               │
│        (Repositories)                   │
│                                         │
│  class AlumnoRepository:                │
│    - get_by_id()                        │
│    - get_by_matricula()                 │
│    - filter_by_grado()                  │
│    - create()                           │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│      INFRAESTRUCTURA                    │
│        (Django ORM)                      │
│                                         │
│  class Alumno(models.Model):           │
│    - nombre                             │
│    - apellido                           │
│    - matricula                          │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🔄 Flujo de Datos Comparado

### Arquitectura Hexagonal "Pura"

```
HTTP Request
    ↓
[Adaptador Primario: Controller]
    ↓
[Puerto: IAlumnoUseCase (interface)]
    ↓
[Use Case: CrearAlumnoUseCase]
    ↓
[Entity: Alumno (sin dependencias)]
    ↓
[Puerto: IAlumnoRepository (interface)]
    ↓
[Adaptador Secundario: AlumnoRepository]
    ↓
[Infraestructura: Base de Datos]
```

### Nuestra Arquitectura (Simplificada)

```
HTTP Request
    ↓
[ViewSet: AlumnoViewSet.create()]
    ↓
[Serializer: AlumnoSerializer (validación)]
    ↓
[Service: AlumnoService.crear_alumno()]
    ↓
[Repository: AlumnoRepository.create()]
    ↓
[Model: Alumno (Django ORM)]
    ↓
[Base de Datos: SQLite/PostgreSQL]
```

**Diferencia clave**: No tenemos interfaces explícitas, pero mantenemos la misma separación de responsabilidades.

---

## 📊 Comparación Detallada

### 1. Interfaces/Puertos

#### Hexagonal Pura
```python
from abc import ABC, abstractmethod

class IAlumnoRepository(ABC):
    @abstractmethod
    def get_by_id(self, id: int) -> Alumno:
        pass
    
    @abstractmethod
    def create(self, data: dict) -> Alumno:
        pass

class AlumnoRepository(IAlumnoRepository):
    def get_by_id(self, id: int) -> Alumno:
        return Alumno.objects.get(id=id)
    
    def create(self, data: dict) -> Alumno:
        return Alumno.objects.create(**data)
```

#### Nuestra (Simplificada)
```python
# No necesitamos interfaces explícitas
# Python usa duck typing

class AlumnoRepository:
    @staticmethod
    def get_by_id(id: int) -> Alumno:
        return Alumno.objects.get(id=id)
    
    @staticmethod
    def create(**kwargs) -> Alumno:
        return Alumno.objects.create(**kwargs)
```

**Ventaja**: Menos código, misma funcionalidad.

---

### 2. Entities

#### Hexagonal Pura
```python
# Entity separada del ORM
class Alumno:
    def __init__(self, id, nombre, apellido, matricula):
        self.id = id
        self.nombre = nombre
        self.apellido = apellido
        self.matricula = matricula
    
    def es_matricula_valida(self) -> bool:
        return len(self.matricula) >= 5

# Mapper para convertir entre Entity y Model
class AlumnoMapper:
    @staticmethod
    def to_entity(model: AlumnoModel) -> Alumno:
        return Alumno(
            id=model.id,
            nombre=model.nombre,
            apellido=model.apellido,
            matricula=model.matricula
        )
```

#### Nuestra (Simplificada)
```python
# Reutilizamos el modelo Django como Entity
class Alumno(models.Model):
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    matricula = models.CharField(max_length=20)
    
    def es_matricula_valida(self) -> bool:
        return len(self.matricula) >= 5
```

**Ventaja**: No necesitas mappers, Django ya lo hace.

---

### 3. Use Cases vs Services

#### Hexagonal Pura
```python
# Use Case muy granular
class CrearAlumnoUseCase:
    def __init__(self, repo: IAlumnoRepository):
        self.repo = repo
    
    def execute(self, data: dict) -> Alumno:
        # Validar
        # Crear
        # Retornar
        pass

class ObtenerAlumnoUseCase:
    def __init__(self, repo: IAlumnoRepository):
        self.repo = repo
    
    def execute(self, id: int) -> Alumno:
        return self.repo.get_by_id(id)
```

#### Nuestra (Simplificada)
```python
# Service más amplio (agrupa varios use cases)
class AlumnoService:
    def __init__(self):
        self.repo = AlumnoRepository()
    
    def crear_alumno(self, data: dict) -> dict:
        # Validar
        # Crear
        # Retornar
        pass
    
    def obtener_alumno(self, id: int) -> dict:
        return self.repo.get_by_id(id)
```

**Ventaja**: Menos clases, más fácil de mantener.

---

## ✅ ¿Cuándo usar cada una?

### Usa Hexagonal Pura si:
- ✅ Proyecto muy grande (100+ desarrolladores)
- ✅ Múltiples equipos trabajando en paralelo
- ✅ Necesitas cambiar de framework frecuentemente
- ✅ Tienes múltiples adaptadores primarios (web, móvil, CLI, etc.)
- ✅ El equipo tiene experiencia en arquitectura avanzada
- ✅ Presupuesto para más tiempo de desarrollo

### Usa Nuestra (Simplificada) si:
- ✅ Proyecto pequeño/mediano (como el tuyo)
- ✅ Un solo adaptador primario (REST API)
- ✅ Quieres mantener Django
- ✅ Equipo pequeño/mediano
- ✅ Necesitas resultados rápidos
- ✅ Quieres los beneficios de hexagonal sin la complejidad

---

## 🚀 Migración Futura

Si tu proyecto crece, puedes evolucionar fácilmente:

### Paso 1: Agregar Interfaces (si lo necesitas)
```python
from typing import Protocol

class AlumnoRepositoryProtocol(Protocol):
    def get_by_id(self, id: int) -> Alumno: ...
    def create(self, **kwargs) -> Alumno: ...

class AlumnoRepository:
    def get_by_id(self, id: int) -> Alumno:
        # implementación
        pass
```

### Paso 2: Separar Entities (si lo necesitas)
```python
# Crear entities puras
class AlumnoEntity:
    # Sin dependencias de Django
    pass

# Mapper
class AlumnoMapper:
    @staticmethod
    def to_entity(model: Alumno) -> AlumnoEntity:
        pass
```

### Paso 3: Granularizar Services
```python
# Dividir en use cases más pequeños
class CrearAlumnoUseCase:
    pass

class ObtenerAlumnoUseCase:
    pass
```

---

## 📚 Resumen

**Nuestra arquitectura ES arquitectura hexagonal**, pero:

1. ✅ **Simplificada**: Sin interfaces explícitas (usa duck typing)
2. ✅ **Pragmática**: Reutiliza Django models como entities
3. ✅ **Práctica**: Services más amplios en lugar de use cases granulares
4. ✅ **Mantiene principios**: Separación, testabilidad, desacoplamiento

**Es como la diferencia entre:**
- **Hexagonal Pura**: Teoría perfecta, más código
- **Nuestra**: Práctica perfecta, menos código, mismos beneficios

---

## 🎓 Conclusión

Si conoces la arquitectura hexagonal, **ya entiendes nuestra arquitectura**. Solo que la hemos adaptado para ser más práctica con Django y Python.

**Los principios son los mismos:**
- ✅ Núcleo independiente del framework
- ✅ Adaptadores para entrada/salida
- ✅ Separación de responsabilidades
- ✅ Testeable sin dependencias externas

**La diferencia es la implementación:**
- Menos código boilerplate
- Más pragmática
- Igual de efectiva para proyectos medianos

