from django.contrib import admin
from school.models import Calificacion


@admin.register(Calificacion)
class CalificacionAdmin(admin.ModelAdmin):
    list_display = ("alumno", "materia", "periodo", "calificacion")
    list_filter = ("materia", "periodo", "alumno__grado")
    search_fields = ("alumno__nombre", "alumno__apellido", "materia__nombre")

