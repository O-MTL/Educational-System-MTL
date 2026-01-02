"""
Excepciones de dominio para la aplicación escolar
"""


class DomainException(Exception):
    """Excepción base para errores de dominio"""
    pass


class AlumnoNotFoundError(DomainException):
    """Alumno no encontrado"""
    pass


class MatriculaDuplicadaError(DomainException):
    """Matrícula duplicada"""
    pass


class GradoNotFoundError(DomainException):
    """Grado no encontrado"""
    pass


class InstitucionNotFoundError(DomainException):
    """Institución no encontrada"""
    pass


class MateriaNotFoundError(DomainException):
    """Materia no encontrada"""
    pass


class PeriodoNotFoundError(DomainException):
    """Periodo no encontrado"""
    pass

