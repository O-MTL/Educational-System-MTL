from rest_framework import serializers
from school.models import Institucion


class InstitucionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Institucion
        fields = ['id', 'nombre', 'direccion', 'telefono', 'correo']

