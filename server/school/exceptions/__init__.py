"""
Excepciones de dominio para la aplicación
"""
from .domain_exceptions import (
    DomainException,
    AlumnoNotFoundError,
    MatriculaDuplicadaError,
    GradoNotFoundError,
    InstitucionNotFoundError,
    MateriaNotFoundError,
    PeriodoNotFoundError,
)

__all__ = [
    'DomainException',
    'AlumnoNotFoundError',
    'MatriculaDuplicadaError',
    'GradoNotFoundError',
    'InstitucionNotFoundError',
    'MateriaNotFoundError',
    'PeriodoNotFoundError',
]

