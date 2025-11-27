from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db.models import Q
from school.models import Periodo, Grado, Materia, Alumno, Calificacion, Personal
from school.api.serializers import (
    PeriodoSerializer, GradoSerializer,
    MateriaSerializer, AlumnoSerializer,
    CalificacionSerializer, PersonalSerializer, UserSerializer
)


class PeriodoViewSet(viewsets.ModelViewSet):
    queryset = Periodo.objects.all()
    serializer_class = PeriodoSerializer


class GradoViewSet(viewsets.ModelViewSet):
    queryset = Grado.objects.all()
    serializer_class = GradoSerializer
    
    def get_queryset(self):
        queryset = Grado.objects.all()
        institucion_id = self.request.query_params.get('institucion', None)
        if institucion_id:
            queryset = queryset.filter(institucion_id=institucion_id)
        return queryset


class MateriaViewSet(viewsets.ModelViewSet):
    queryset = Materia.objects.all()
    serializer_class = MateriaSerializer
    
    def get_queryset(self):
        queryset = Materia.objects.all()
        grado_id = self.request.query_params.get('grado', None)
        profesor_id = self.request.query_params.get('profesor', None)
        
        if grado_id:
            queryset = queryset.filter(grado_id=grado_id)
        if profesor_id:
            queryset = queryset.filter(profesor_id=profesor_id)
        return queryset


class AlumnoViewSet(viewsets.ModelViewSet):
    queryset = Alumno.objects.all()
    serializer_class = AlumnoSerializer
    permission_classes = []
    
    def get_serializer_context(self):
        """Pasar el request al serializer para que pueda acceder a los datos originales"""
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    def get_queryset(self):
        queryset = Alumno.objects.all()
        grado_id = self.request.query_params.get('grado', None)
        institucion_id = self.request.query_params.get('institucion', None)
        search = self.request.query_params.get('search', None)
        
        if grado_id:
            queryset = queryset.filter(grado_id=grado_id)
        elif institucion_id:
            queryset = queryset.filter(grado__institucion_id=institucion_id)
        if search:
            queryset = queryset.filter(
                Q(nombre__icontains=search) | 
                Q(apellido__icontains=search) | 
                Q(matricula__icontains=search)
            )
        return queryset


class CalificacionViewSet(viewsets.ModelViewSet):
    queryset = Calificacion.objects.all()
    serializer_class = CalificacionSerializer
    
    def get_queryset(self):
        queryset = Calificacion.objects.all()
        alumno_id = self.request.query_params.get('alumno', None)
        materia_id = self.request.query_params.get('materia', None)
        periodo_id = self.request.query_params.get('periodo', None)
        
        if alumno_id:
            queryset = queryset.filter(alumno_id=alumno_id)
        if materia_id:
            queryset = queryset.filter(materia_id=materia_id)
        if periodo_id:
            queryset = queryset.filter(periodo_id=periodo_id)
        return queryset


class PersonalViewSet(viewsets.ModelViewSet):
    queryset = Personal.objects.all()
    serializer_class = PersonalSerializer
    
    def get_queryset(self):
        queryset = Personal.objects.all()
        cargo = self.request.query_params.get('cargo', None)
        institucion_id = self.request.query_params.get('institucion', None)
        estado = self.request.query_params.get('estado', None)
        search = self.request.query_params.get('search', None)
        
        if cargo:
            queryset = queryset.filter(cargo=cargo)
        if institucion_id:
            queryset = queryset.filter(institucion_id=institucion_id)
        if estado is not None:
            queryset = queryset.filter(estado=estado.lower() == 'true')
        if search:
            queryset = queryset.filter(
                Q(nombre__icontains=search) | 
                Q(apellido__icontains=search) | 
                Q(cedula__icontains=search)
            )
        return queryset


# Vista para autenticación
class AuthViewSet(viewsets.ViewSet):
    permission_classes = []
    
    @action(detail=False, methods=['post'])
    def login(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response(
                {'error': 'Username y password son requeridos'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = authenticate(username=username, password=password)
        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user': UserSerializer(user).data
            })
        else:
            return Response(
                {'error': 'Credenciales inválidas'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
    
    @action(detail=False, methods=['post'])
    def logout(self, request):
        if request.user.is_authenticated:
            try:
                request.user.auth_token.delete()
                return Response({'message': 'Logout exitoso'})
            except:
                return Response(
                    {'error': 'Error al hacer logout'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
        return Response(
            {'error': 'No autenticado'}, 
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        if request.user.is_authenticated:
            return Response(UserSerializer(request.user).data)
        else:
            return Response(
                {'error': 'No autenticado'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )

