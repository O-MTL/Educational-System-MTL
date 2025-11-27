"""
Models package for school app
"""
from .institucion import Institucion
from .periodo import Periodo
from .grado import Grado
from .profesor import Profesor
from .materia import Materia
from .alumno import Alumno
from .calificacion import Calificacion
from .personal import Personal

__all__ = [
    'Institucion',
    'Periodo',
    'Grado',
    'Profesor',
    'Materia',
    'Alumno',
    'Calificacion',
    'Personal',
]

