"""
Admin configuration for school app
"""
from .institucion import InstitucionAdmin
from .periodo import PeriodoAdmin
from .grado import GradoAdmin
from .profesor import ProfesorAdmin
from .materia import MateriaAdmin
from .alumno import AlumnoAdmin
from .calificacion import CalificacionAdmin
from .personal import PersonalAdmin

__all__ = [
    'InstitucionAdmin',
    'PeriodoAdmin',
    'GradoAdmin',
    'ProfesorAdmin',
    'MateriaAdmin',
    'AlumnoAdmin',
    'CalificacionAdmin',
    'PersonalAdmin',
]

