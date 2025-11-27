from django.db import models
from .institucion import Institucion


class Profesor(models.Model):
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    correo = models.EmailField(blank=True, null=True)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    institucion = models.ForeignKey(Institucion, on_delete=models.CASCADE, related_name="profesores")

    def __str__(self):
        return f"{self.nombre} {self.apellido}"

