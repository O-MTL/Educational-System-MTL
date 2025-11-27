from django.db import models
from .institucion import Institucion


class Grado(models.Model):
    nombre = models.CharField(max_length=50)
    descripcion = models.TextField(blank=True, null=True)
    institucion = models.ForeignKey(Institucion, on_delete=models.CASCADE, related_name="grados")

    def __str__(self):
        return f"{self.nombre} - {self.institucion.nombre}"

