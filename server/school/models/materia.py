from django.db import models
from .profesor import Profesor
from .grado import Grado


class Materia(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True, null=True)
    profesor = models.ForeignKey(Profesor, on_delete=models.SET_NULL, null=True, related_name="materias")
    grado = models.ForeignKey(Grado, on_delete=models.CASCADE, related_name="materias")

    def __str__(self):
        return f"{self.nombre} ({self.grado.nombre})"

