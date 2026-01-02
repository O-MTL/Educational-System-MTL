"""
Repository para operaciones de acceso a datos de Grado
"""
from typing import Optional
from school.models import Grado


class GradoRepository:
    """Repositorio para operaciones de acceso a datos de Grado"""
    
    @staticmethod
    def get_by_id(grado_id: int) -> Optional[Grado]:
        """Obtiene un grado por ID"""
        try:
            return Grado.objects.get(id=grado_id)
        except Grado.DoesNotExist:
            return None
    
    @staticmethod
    def exists(grado_id: int) -> bool:
        """Verifica si un grado existe"""
        return Grado.objects.filter(id=grado_id).exists()

