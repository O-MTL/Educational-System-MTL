from django.contrib import admin
from school.models import Profesor


@admin.register(Profesor)
class ProfesorAdmin(admin.ModelAdmin):
    list_display = ("nombre", "apellido", "institucion", "correo")
    list_filter = ("institucion",)
    search_fields = ("nombre", "apellido")

