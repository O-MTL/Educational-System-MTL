from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db.models import Q
from school.models import Periodo, Grado, Materia, Calificacion, Personal
from school.api.serializers import (
    PeriodoSerializer, GradoSerializer,
    MateriaSerializer,
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


# Authentication ViewSet for user login/logout operations
class AuthViewSet(viewsets.ViewSet):
    """
    ViewSet for handling user authentication.
    
    Endpoints:
        POST /api/auth/login/ - User login
        POST /api/auth/logout/ - User logout
        GET /api/auth/me/ - Get current user info
        
    Educational System Roles:
        - Administrador: is_superuser = True (full system access)
        - Docente: is_staff = True (teacher access to courses/students)
        - Estudiante: regular user (student access to learning materials)
    """
    permission_classes = []
    
    @action(detail=False, methods=['post'])
    def login(self, request):
        """
        Authenticate user and return token with user data.
        
        IMPORTANT FIX: The 'rol' field must be included inside the 'user' object
        to prevent frontend error: "Cannot read properties of undefined (reading 'rol')"
        
        The frontend (auth.ts) expects: response.user.rol
        
        Request Body:
            - username (str): User's username
            - password (str): User's password
            
        Returns:
            200 OK: { token, user: { id, username, email, rol, ... } }
            401 Unauthorized: { error: "Invalid credentials" }
        """
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response(
                {'error': 'Username and password are required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = authenticate(username=username, password=password)
        if user:
            token, _ = Token.objects.get_or_create(user=user)
            
            # Determine user role based on Django permissions:
            # - Administrador: superuser (full access to system management)
            # - Docente: staff member (can manage courses and students)
            # - Estudiante: regular user (can access learning materials)
            if user.is_superuser:
                rol = 'Administrador'
            elif user.is_staff:
                rol = 'Docente'
            else:
                rol = 'Estudiante'
            
            # Include 'rol' in user object for frontend compatibility (auth.ts expects response.user.rol)
            user_data = UserSerializer(user).data
            user_data['rol'] = rol  # Add role to user object
            
            return Response({
                'token': token.key,
                'user': user_data,
                'rol': rol,  # Also at top level for flexibility
                'is_staff': user.is_staff,
                'is_superuser': user.is_superuser,
            })
        else:
            return Response(
                {'error': 'Invalid credentials'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
    
    @action(detail=False, methods=['post'])
    def logout(self, request):
        if request.user.is_authenticated:
            try:
                request.user.auth_token.delete()
                return Response({'message': 'Logout exitoso'})
            except Exception:
                return Response(
                    {'error': 'Error during logout'}, 
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

