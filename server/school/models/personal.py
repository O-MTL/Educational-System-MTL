from django.db import models
from .institucion import Institucion


class Personal(models.Model):
    CARGO_CHOICES = [
        ('Docente', 'Docente'),
        ('Administrativo', 'Administrativo'),
        ('Obrero', 'Obrero'),
    ]
    
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    cedula = models.CharField(max_length=20, unique=True)
    cargo = models.CharField(max_length=20, choices=CARGO_CHOICES)
    fecha_ingreso = models.DateField()
    estado = models.BooleanField(default=True)
    email = models.EmailField(blank=True, null=True)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    institucion = models.ForeignKey(Institucion, on_delete=models.CASCADE, related_name="personal", null=True, blank=True)

    def __str__(self):
        return f"{self.nombre} {self.apellido} - {self.cargo}"

