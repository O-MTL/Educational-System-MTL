from django.contrib import admin
from school.models import Alumno


@admin.register(Alumno)
class AlumnoAdmin(admin.ModelAdmin):
    list_display = ("matricula", "nombre", "apellido", "grado", "correo")
    list_filter = ("grado",)
    search_fields = ("nombre", "apellido", "matricula")

