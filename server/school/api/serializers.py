from rest_framework import serializers
from django.contrib.auth.models import User
from school.models import Periodo, Grado, Materia, Alumno, Calificacion, Personal


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


class AlumnoSerializer(serializers.ModelSerializer):
    grado_nombre = serializers.CharField(source='grado.nombre', read_only=True)
    gradoEstudioId = serializers.IntegerField(source='grado.id', read_only=True)
    cedula = serializers.SerializerMethodField()
    fechaNacimiento = serializers.DateField(source='fecha_nacimiento', required=False, allow_null=True)
    email = serializers.EmailField(source='correo', required=False, allow_null=True)
    matricula = serializers.CharField(required=False)
    
    def get_cedula(self, obj):
        return obj.matricula
    
    def to_internal_value(self, data):
        """Mapear campos del frontend a campos del modelo antes de la validación"""
        try:
            if hasattr(data, 'items'):
                data = dict(data.items())
            elif isinstance(data, dict):
                data = dict(data)
            else:
                data = dict(data)
            
            print(f"Datos recibidos en to_internal_value: {data}")
            
            if 'cedula' in data and 'matricula' not in data:
                data['matricula'] = str(data['cedula'])
            
            if 'fechaNacimiento' in data and 'fecha_nacimiento' not in data:
                data['fecha_nacimiento'] = data.get('fechaNacimiento')
            
            if 'email' in data and 'correo' not in data:
                data['correo'] = data.get('email')
            
            if 'gradoEstudioId' in data and 'grado' not in data:
                grado_id = data.get('gradoEstudioId')
                if grado_id:
                    try:
                        grado_id_int = int(grado_id)
                        from school.models import Grado
                        if Grado.objects.filter(id=grado_id_int).exists():
                            data['grado'] = grado_id_int
                        else:
                            print(f"Advertencia: El grado con ID {grado_id_int} no existe. Se creará el estudiante sin grado.")
                    except (ValueError, TypeError):
                        pass
            
            print(f"Datos mapeados antes de validación: {data}")
            result = super().to_internal_value(data)
            print(f"Resultado de to_internal_value: {result}")
            return result
        except Exception as e:
            print(f"Error en to_internal_value: {e}")
            import traceback
            print(traceback.format_exc())
            raise
    
    def create(self, validated_data):
        try:
            if 'matricula' not in validated_data or not validated_data.get('matricula'):
                nombre = validated_data.get('nombre', '')[:3].upper() if validated_data.get('nombre') else 'EST'
                apellido = validated_data.get('apellido', '')[:3].upper() if validated_data.get('apellido') else '000'
                validated_data['matricula'] = f"EST-{nombre}-{apellido}"
            
            return super().create(validated_data)
        except Exception as e:
            import traceback
            print(f"Error en AlumnoSerializer.create: {e}")
            print(traceback.format_exc())
            raise
    
    direccion = serializers.SerializerMethodField()
    telefono = serializers.SerializerMethodField()
    nombreRepresentante = serializers.SerializerMethodField()
    telefonoRepresentante = serializers.SerializerMethodField()
    año = serializers.SerializerMethodField()
    periodo = serializers.SerializerMethodField()
    estado = serializers.SerializerMethodField()
    fechaIngreso = serializers.SerializerMethodField()
    
    def get_direccion(self, obj):
        return ""
    
    def get_telefono(self, obj):
        return ""
    
    def get_nombreRepresentante(self, obj):
        return ""
    
    def get_telefonoRepresentante(self, obj):
        return ""
    
    def get_año(self, obj):
        return None
    
    def get_periodo(self, obj):
        return ""
    
    def get_estado(self, obj):
        return True
    
    def get_fechaIngreso(self, obj):
        return None
    
    class Meta:
        model = Alumno
        fields = ['id', 'nombre', 'apellido', 'matricula', 'cedula', 'fecha_nacimiento', 'fechaNacimiento', 
                 'correo', 'email', 'grado', 'grado_nombre', 'gradoEstudioId', 
                 'direccion', 'telefono', 'nombreRepresentante', 'telefonoRepresentante', 'año', 'periodo', 
                 'estado', 'fechaIngreso']
        read_only_fields = ['id', 'cedula', 'grado_nombre', 'gradoEstudioId', 
                           'direccion', 'telefono', 'nombreRepresentante', 'telefonoRepresentante', 
                           'año', 'periodo', 'estado', 'fechaIngreso']


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

