from rest_framework import serializers
from school.models import Profesor


class ProfesorSerializer(serializers.ModelSerializer):
    institucion_nombre = serializers.CharField(source='institucion.nombre', read_only=True)
    
    class Meta:
        model = Profesor
        fields = ['id', 'nombre', 'apellido', 'correo', 'telefono', 'institucion', 'institucion_nombre']

