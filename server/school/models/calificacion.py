from django.db import models
from .alumno import Alumno
from .materia import Materia
from .periodo import Periodo


class Calificacion(models.Model):
    alumno = models.ForeignKey(Alumno, on_delete=models.CASCADE, related_name="calificaciones")
    materia = models.ForeignKey(Materia, on_delete=models.CASCADE, related_name="calificaciones")
    periodo = models.ForeignKey(Periodo, on_delete=models.CASCADE, related_name="calificaciones")
    calificacion = models.DecimalField(max_digits=5, decimal_places=2)

    class Meta:
        unique_together = ('alumno', 'materia', 'periodo')

    def __str__(self):
        return f"{self.alumno} - {self.materia}: {self.calificacion}"

