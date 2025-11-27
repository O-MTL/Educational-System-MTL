from django.db import models
from .grado import Grado


class Alumno(models.Model):
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    matricula = models.CharField(max_length=20, unique=True)
    fecha_nacimiento = models.DateField(blank=True, null=True)
    correo = models.EmailField(blank=True, null=True)
    grado = models.ForeignKey(Grado, on_delete=models.SET_NULL, null=True, related_name="alumnos")

    def __str__(self):
        return f"{self.nombre} {self.apellido}"

