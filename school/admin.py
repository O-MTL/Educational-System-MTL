# Register your models here.
from django.contrib import admin
from .models import Institucion, Periodo, Grado, Profesor, Materia, Alumno, Calificacion


@admin.register(Institucion)
class InstitucionAdmin(admin.ModelAdmin):
    list_display = ("nombre", "telefono", "correo")
    search_fields = ("nombre", "correo")


@admin.register(Periodo)
class PeriodoAdmin(admin.ModelAdmin):
    list_display = ("nombre", "fecha_inicio", "fecha_fin")
    list_filter = ("fecha_inicio", "fecha_fin")


@admin.register(Grado)
class GradoAdmin(admin.ModelAdmin):
    list_display = ("nombre", "institucion")
    list_filter = ("institucion",)
    search_fields = ("nombre",)


@admin.register(Profesor)
class ProfesorAdmin(admin.ModelAdmin):
    list_display = ("nombre", "apellido", "institucion", "correo")
    list_filter = ("institucion",)
    search_fields = ("nombre", "apellido")


@admin.register(Materia)
class MateriaAdmin(admin.ModelAdmin):
    list_display = ("nombre", "grado", "profesor")
    list_filter = ("grado", "profesor")
    search_fields = ("nombre",)


@admin.register(Alumno)
class AlumnoAdmin(admin.ModelAdmin):
    list_display = ("matricula", "nombre", "apellido", "grado", "correo")
    list_filter = ("grado",)
    search_fields = ("nombre", "apellido", "matricula")


@admin.register(Calificacion)
class CalificacionAdmin(admin.ModelAdmin):
    list_display = ("alumno", "materia", "periodo", "calificacion")
    list_filter = ("materia", "periodo", "alumno__grado")
    search_fields = ("alumno__nombre", "alumno__apellido", "materia__nombre")
