from rest_framework import serializers


class AlumnoSerializer(serializers.Serializer):
    """Serializer simplificado - solo validación de entrada/salida"""
    id = serializers.IntegerField(read_only=True)
    nombre = serializers.CharField(max_length=100, required=True)
    apellido = serializers.CharField(max_length=100, required=True)
    matricula = serializers.CharField(max_length=20, required=False, allow_blank=True, allow_null=True)
    cedula = serializers.CharField(read_only=True)  # Alias de matricula
    fecha_nacimiento = serializers.DateField(required=False, allow_null=True)
    fechaNacimiento = serializers.DateField(required=False, allow_null=True)  # Alias para frontend
    correo = serializers.EmailField(required=False, allow_null=True, allow_blank=True)
    email = serializers.EmailField(required=False, allow_null=True, allow_blank=True)  # Alias para frontend
    grado = serializers.IntegerField(required=False, allow_null=True)
    gradoEstudioId = serializers.IntegerField(required=False, allow_null=True)  # Alias para frontend
    grado_nombre = serializers.CharField(read_only=True)
    # Campos adicionales para compatibilidad con frontend (solo lectura)
    direccion = serializers.CharField(read_only=True, default='')
    telefono = serializers.CharField(read_only=True, default='')
    nombreRepresentante = serializers.CharField(read_only=True, default='')
    telefonoRepresentante = serializers.CharField(read_only=True, default='')
    año = serializers.IntegerField(read_only=True, allow_null=True, default=None)
    periodo = serializers.CharField(read_only=True, default='')
    estado = serializers.BooleanField(read_only=True, default=True)
    fechaIngreso = serializers.DateField(read_only=True, allow_null=True, default=None)
    
    def validate_nombre(self, value):
        """Valida que el nombre tenga al menos 2 caracteres"""
        if not value or len(value.strip()) < 2:
            raise serializers.ValidationError("El nombre debe tener al menos 2 caracteres")
        return value.strip()
    
    def validate_apellido(self, value):
        """Valida que el apellido tenga al menos 2 caracteres"""
        if not value or len(value.strip()) < 2:
            raise serializers.ValidationError("El apellido debe tener al menos 2 caracteres")
        return value.strip()
    
    def validate(self, data):
        """Validación cruzada de campos"""
        # Mapear alias del frontend a campos del backend
        if 'fechaNacimiento' in data and 'fecha_nacimiento' not in data:
            data['fecha_nacimiento'] = data.get('fechaNacimiento')
        
        if 'email' in data and 'correo' not in data:
            data['correo'] = data.get('email')
        
        if 'gradoEstudioId' in data and 'grado' not in data:
            data['grado'] = data.get('gradoEstudioId')
        
        if 'cedula' in data and 'matricula' not in data:
            data['matricula'] = data.get('cedula')
        
        return data

