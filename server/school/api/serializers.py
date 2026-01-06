from rest_framework import serializers
from django.contrib.auth.models import User
from school.models import Periodo, Grado, Materia, Calificacion, Personal


class PeriodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Periodo
        fields = ['id', 'nombre', 'fecha_inicio', 'fecha_fin']


class GradoSerializer(serializers.ModelSerializer):
    institucion_nombre = serializers.CharField(source='institucion.nombre', read_only=True)
    
    class Meta:
        model = Grado
        fields = ['id', 'nombre', 'descripcion', 'institucion', 'institucion_nombre']


class MateriaSerializer(serializers.ModelSerializer):
    profesor_nombre = serializers.CharField(source='profesor.nombre', read_only=True)
    profesor_apellido = serializers.CharField(source='profesor.apellido', read_only=True)
    grado_nombre = serializers.CharField(source='grado.nombre', read_only=True)
    
    class Meta:
        model = Materia
        fields = ['id', 'nombre', 'descripcion', 'profesor', 'profesor_nombre', 'profesor_apellido', 'grado', 'grado_nombre']



class CalificacionSerializer(serializers.ModelSerializer):
    alumno_nombre = serializers.CharField(source='alumno.nombre', read_only=True)
    alumno_apellido = serializers.CharField(source='alumno.apellido', read_only=True)
    materia_nombre = serializers.CharField(source='materia.nombre', read_only=True)
    periodo_nombre = serializers.CharField(source='periodo.nombre', read_only=True)
    
    class Meta:
        model = Calificacion
        fields = ['id', 'alumno', 'alumno_nombre', 'alumno_apellido', 'materia', 'materia_nombre', 'periodo', 'periodo_nombre', 'calificacion']


class PersonalSerializer(serializers.ModelSerializer):
    institucion_nombre = serializers.CharField(source='institucion.nombre', read_only=True)
    fechaIngreso = serializers.DateField(source='fecha_ingreso', read_only=True)
    
    class Meta:
        model = Personal
        fields = ['id', 'nombre', 'apellido', 'cedula', 'cargo', 'fecha_ingreso', 'fechaIngreso', 'estado', 'email', 'telefono', 'institucion', 'institucion_nombre']


# Serializer para autenticación
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

