from rest_framework import viewsets, status
from rest_framework.response import Response
from school.api.alumnos.serializers import AlumnoSerializer
from school.exceptions.domain_exceptions import (
    AlumnoNotFoundError,
    MatriculaDuplicadaError,
    GradoNotFoundError
)


class AlumnoViewSet(viewsets.ViewSet):
    """ViewSet delgado que delega a servicios"""
    permission_classes = []
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        from school.services.alumno_service import AlumnoService
        self.alumno_service = AlumnoService()
    
    def list(self, request):
        """Lista alumnos con filtros"""
        filtros = {
            'grado_id': request.query_params.get('grado'),
            'institucion_id': request.query_params.get('institucion'),
            'search': request.query_params.get('search')
        }
        # Limpiar None values
        filtros = {k: v for k, v in filtros.items() if v is not None}
        
        try:
            alumnos = self.alumno_service.listar_alumnos(filtros)
            serializer = AlumnoSerializer(alumnos, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def retrieve(self, request, pk=None):
        """Obtiene un alumno por ID"""
        try:
            alumno = self.alumno_service.obtener_alumno(int(pk))
            serializer = AlumnoSerializer(alumno)
            return Response(serializer.data)
        except AlumnoNotFoundError as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_404_NOT_FOUND
            )
        except ValueError:
            return Response(
                {'error': ERROR_INVALID_ID},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    def create(self, request):
        """Crea un nuevo alumno"""
        serializer = AlumnoSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            datos_validados = serializer.validated_data
            # Mapear campos del serializer a campos del servicio
            datos_servicio = {
                'nombre': datos_validados.get('nombre'),
                'apellido': datos_validados.get('apellido'),
                'matricula': datos_validados.get('matricula'),
                'fecha_nacimiento': datos_validados.get('fecha_nacimiento') or datos_validados.get('fechaNacimiento'),
                'correo': datos_validados.get('correo') or datos_validados.get('email'),
                'grado_id': datos_validados.get('grado') or datos_validados.get('gradoEstudioId')
            }
            
            alumno = self.alumno_service.crear_alumno(datos_servicio)
            return Response(
                AlumnoSerializer(alumno).data,
                status=status.HTTP_201_CREATED
            )
        except (MatriculaDuplicadaError, GradoNotFoundError) as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {'error': f'Error al crear alumno: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def update(self, request, pk=None):
        """Actualiza un alumno"""
        serializer = AlumnoSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            datos_validados = serializer.validated_data
            datos_servicio = {
                'nombre': datos_validados.get('nombre'),
                'apellido': datos_validados.get('apellido'),
                'matricula': datos_validados.get('matricula'),
                'fecha_nacimiento': datos_validados.get('fecha_nacimiento') or datos_validados.get('fechaNacimiento'),
                'correo': datos_validados.get('correo') or datos_validados.get('email'),
                'grado_id': datos_validados.get('grado') or datos_validados.get('gradoEstudioId')
            }
            
            alumno = self.alumno_service.actualizar_alumno(int(pk), datos_servicio)
            return Response(AlumnoSerializer(alumno).data)
        except AlumnoNotFoundError as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_404_NOT_FOUND
            )
        except (MatriculaDuplicadaError, GradoNotFoundError) as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        except ValueError:
            return Response(
                {'error': ERROR_INVALID_ID},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {'error': f'Error al actualizar alumno: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def destroy(self, request, pk=None):
        """Elimina un alumno"""
        try:
            self.alumno_service.eliminar_alumno(int(pk))
            return Response(status=status.HTTP_204_NO_CONTENT)
        except AlumnoNotFoundError as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_404_NOT_FOUND
            )
        except ValueError:
            return Response(
                {'error': ERROR_INVALID_ID},
                status=status.HTTP_400_BAD_REQUEST
            )

