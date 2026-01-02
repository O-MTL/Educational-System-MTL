"""
Servicio con lógica de negocio para Alumnos
"""
from typing import Optional, List, Dict
from school.repositories.alumno_repository import AlumnoRepository
from school.repositories.grado_repository import GradoRepository
from school.exceptions.domain_exceptions import (
    AlumnoNotFoundError,
    MatriculaDuplicadaError,
    GradoNotFoundError
)
from school.models import Alumno


class AlumnoService:
    """Servicio con lógica de negocio para Alumnos"""
    
    def __init__(self):
        self.alumno_repo = AlumnoRepository()
        self.grado_repo = GradoRepository()
    
    def crear_alumno(self, datos: Dict) -> Dict:
        """Crea un nuevo alumno con validaciones de negocio"""
        # Validar que el grado existe si se proporciona
        grado_id = datos.get('grado_id') or datos.get('grado')
        if grado_id:
            if not self.grado_repo.exists(grado_id):
                raise GradoNotFoundError(f"Grado con ID {grado_id} no existe")
        
        # Generar matrícula si no existe
        matricula = datos.get('matricula')
        if not matricula:
            matricula = self._generar_matricula(
                datos.get('nombre', ''),
                datos.get('apellido', '')
            )
        
        # Validar que la matrícula no esté duplicada
        if self.alumno_repo.get_by_matricula(matricula):
            raise MatriculaDuplicadaError(
                f"Ya existe un alumno con matrícula {matricula}"
            )
        
        # Preparar datos para crear
        alumno_data = {
            'nombre': datos.get('nombre'),
            'apellido': datos.get('apellido'),
            'matricula': matricula,
            'fecha_nacimiento': datos.get('fecha_nacimiento'),
            'correo': datos.get('correo') or datos.get('email'),
            'grado_id': grado_id
        }
        
        alumno = self.alumno_repo.create(**alumno_data)
        return self._to_dict(alumno)
    
    def obtener_alumno(self, alumno_id: int) -> Dict:
        """Obtiene un alumno por ID"""
        alumno = self.alumno_repo.get_by_id(alumno_id)
        if not alumno:
            raise AlumnoNotFoundError(f"Alumno con ID {alumno_id} no existe")
        return self._to_dict(alumno)
    
    def listar_alumnos(self, filtros: Dict = None) -> List[Dict]:
        """Lista alumnos con filtros opcionales"""
        filtros = filtros or {}
        
        if filtros.get('grado_id') or filtros.get('grado'):
            grado_id = filtros.get('grado_id') or filtros.get('grado')
            alumnos = self.alumno_repo.filter_by_grado(grado_id)
        elif filtros.get('institucion_id') or filtros.get('institucion'):
            institucion_id = filtros.get('institucion_id') or filtros.get('institucion')
            alumnos = self.alumno_repo.filter_by_institucion(institucion_id)
        elif filtros.get('search'):
            alumnos = self.alumno_repo.search(filtros['search'])
        else:
            alumnos = self.alumno_repo.get_all()
        
        return [self._to_dict(alumno) for alumno in alumnos]
    
    def actualizar_alumno(self, alumno_id: int, datos: Dict) -> Dict:
        """Actualiza un alumno con validaciones"""
        alumno = self.alumno_repo.get_by_id(alumno_id)
        if not alumno:
            raise AlumnoNotFoundError(f"Alumno con ID {alumno_id} no existe")
        
        # Validar matrícula si se está cambiando
        nueva_matricula = datos.get('matricula')
        if nueva_matricula and nueva_matricula != alumno.matricula:
            if self.alumno_repo.get_by_matricula(nueva_matricula):
                raise MatriculaDuplicadaError(
                    f"Matrícula {nueva_matricula} ya existe"
                )
        
        # Validar grado si se está cambiando
        grado_id = datos.get('grado_id') or datos.get('grado')
        if grado_id:
            if not self.grado_repo.exists(grado_id):
                raise GradoNotFoundError(f"Grado con ID {grado_id} no existe")
        
        # Preparar datos de actualización
        update_data = {}
        if 'nombre' in datos:
            update_data['nombre'] = datos['nombre']
        if 'apellido' in datos:
            update_data['apellido'] = datos['apellido']
        if nueva_matricula:
            update_data['matricula'] = nueva_matricula
        if 'fecha_nacimiento' in datos:
            update_data['fecha_nacimiento'] = datos['fecha_nacimiento']
        if 'correo' in datos or 'email' in datos:
            update_data['correo'] = datos.get('correo') or datos.get('email')
        if grado_id:
            update_data['grado_id'] = grado_id
        
        alumno_actualizado = self.alumno_repo.update(alumno, **update_data)
        return self._to_dict(alumno_actualizado)
    
    def eliminar_alumno(self, alumno_id: int) -> None:
        """Elimina un alumno"""
        alumno = self.alumno_repo.get_by_id(alumno_id)
        if not alumno:
            raise AlumnoNotFoundError(f"Alumno con ID {alumno_id} no existe")
        self.alumno_repo.delete(alumno)
    
    def _generar_matricula(self, nombre: str, apellido: str) -> str:
        """Genera una matrícula única basada en nombre y apellido"""
        prefijo_nombre = (nombre or 'EST')[:3].upper()
        prefijo_apellido = (apellido or '000')[:3].upper()
        base_matricula = f"EST-{prefijo_nombre}-{prefijo_apellido}"
        
        # Si ya existe, agregar número incremental
        contador = 1
        matricula = base_matricula
        while self.alumno_repo.get_by_matricula(matricula):
            matricula = f"{base_matricula}-{contador}"
            contador += 1
        
        return matricula
    
    def _to_dict(self, alumno: Alumno) -> Dict:
        """Convierte un modelo Alumno a diccionario"""
        return {
            'id': alumno.id,
            'nombre': alumno.nombre,
            'apellido': alumno.apellido,
            'matricula': alumno.matricula,
            'fecha_nacimiento': alumno.fecha_nacimiento,
            'correo': alumno.correo,
            'grado_id': alumno.grado_id if alumno.grado else None,
            'grado_nombre': alumno.grado.nombre if alumno.grado else None,
            # Campos adicionales para compatibilidad con frontend
            'cedula': alumno.matricula,
            'email': alumno.correo,
            'fechaNacimiento': alumno.fecha_nacimiento,
            'gradoEstudioId': alumno.grado_id if alumno.grado else None,
            'direccion': '',
            'telefono': '',
            'nombreRepresentante': '',
            'telefonoRepresentante': '',
            'año': None,
            'periodo': '',
            'estado': True,
            'fechaIngreso': None,
        }

