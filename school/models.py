# Create your models here.


from django.db import models


class Institucion(models.Model):
    nombre = models.CharField(max_length=150)
    direccion = models.CharField(max_length=255)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    correo = models.EmailField(blank=True, null=True)

    def __str__(self):
        return self.nombre


class Periodo(models.Model):
    nombre = models.CharField(max_length=100)
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField()

    def __str__(self):
        return self.nombre


class Grado(models.Model):
    nombre = models.CharField(max_length=50)
    descripcion = models.TextField(blank=True, null=True)
    institucion = models.ForeignKey(Institucion, on_delete=models.CASCADE, related_name="grados")

    def __str__(self):
        return f"{self.nombre} - {self.institucion.nombre}"


class Profesor(models.Model):
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    correo = models.EmailField(blank=True, null=True)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    institucion = models.ForeignKey(Institucion, on_delete=models.CASCADE, related_name="profesores")

    def __str__(self):
        return f"{self.nombre} {self.apellido}"


class Materia(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True, null=True)
    profesor = models.ForeignKey(Profesor, on_delete=models.SET_NULL, null=True, related_name="materias")
    grado = models.ForeignKey(Grado, on_delete=models.CASCADE, related_name="materias")

    def __str__(self):
        return f"{self.nombre} ({self.grado.nombre})"


class Alumno(models.Model):
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    matricula = models.CharField(max_length=20, unique=True)
    fecha_nacimiento = models.DateField(blank=True, null=True)
    correo = models.EmailField(blank=True, null=True)
    grado = models.ForeignKey(Grado, on_delete=models.SET_NULL, null=True, related_name="alumnos")

    def __str__(self):
        return f"{self.nombre} {self.apellido}"


class Calificacion(models.Model):
    alumno = models.ForeignKey(Alumno, on_delete=models.CASCADE, related_name="calificaciones")
    materia = models.ForeignKey(Materia, on_delete=models.CASCADE, related_name="calificaciones")
    periodo = models.ForeignKey(Periodo, on_delete=models.CASCADE, related_name="calificaciones")
    calificacion = models.DecimalField(max_digits=5, decimal_places=2)

    class Meta:
        unique_together = ('alumno', 'materia', 'periodo')

    def __str__(self):
        return f"{self.alumno} - {self.materia}: {self.calificacion}"

