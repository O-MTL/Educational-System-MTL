from django.contrib import admin
from school.models import Institucion


@admin.register(Institucion)
class InstitucionAdmin(admin.ModelAdmin):
    list_display = ("nombre", "telefono", "correo")
    search_fields = ("nombre", "correo")

