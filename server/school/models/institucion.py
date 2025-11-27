from django.db import models


class Institucion(models.Model):
    nombre = models.CharField(max_length=150)
    direccion = models.CharField(max_length=255)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    correo = models.EmailField(blank=True, null=True)

    def __str__(self):
        return self.nombre

