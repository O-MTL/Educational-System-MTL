"""
Repository para operaciones de acceso a datos de Alumno
"""
from typing import Optional, List
from django.db.models import Q
from school.models import Alumno


class AlumnoRepository:
    """Repositorio para operaciones de acceso a datos de Alumno"""
    
    @staticmethod
    def get_by_id(alumno_id: int) -> Optional[Alumno]:
        """Obtiene un alumno por ID"""
        try:
            return Alumno.objects.get(id=alumno_id)
        except Alumno.DoesNotExist:
            return None
    
    @staticmethod
    def get_by_matricula(matricula: str) -> Optional[Alumno]:
        """Obtiene un alumno por matrícula"""
        try:
            return Alumno.objects.get(matricula=matricula)
        except Alumno.DoesNotExist:
            return None
    
    @staticmethod
    def get_all() -> List[Alumno]:
        """Obtiene todos los alumnos"""
        return list(Alumno.objects.all())
    
    @staticmethod
    def filter_by_grado(grado_id: int) -> List[Alumno]:
        """Filtra alumnos por grado"""
        return list(Alumno.objects.filter(grado_id=grado_id))
    
    @staticmethod
    def filter_by_institucion(institucion_id: int) -> List[Alumno]:
        """Filtra alumnos por institución"""
        return list(Alumno.objects.filter(grado__institucion_id=institucion_id))
    
    @staticmethod
    def search(search_term: str) -> List[Alumno]:
        """Busca alumnos por nombre, apellido o matrícula"""
        return list(Alumno.objects.filter(
            Q(nombre__icontains=search_term) |
            Q(apellido__icontains=search_term) |
            Q(matricula__icontains=search_term)
        ))
    
    @staticmethod
    def create(**kwargs) -> Alumno:
        """Crea un nuevo alumno"""
        return Alumno.objects.create(**kwargs)
    
    @staticmethod
    def update(alumno: Alumno, **kwargs) -> Alumno:
        """Actualiza un alumno existente"""
        for key, value in kwargs.items():
            setattr(alumno, key, value)
        alumno.save()
        return alumno
    
    @staticmethod
    def delete(alumno: Alumno) -> None:
        """Elimina un alumno"""
        alumno.delete()

