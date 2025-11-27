from django.contrib import admin
from school.models import Materia


@admin.register(Materia)
class MateriaAdmin(admin.ModelAdmin):
    list_display = ("nombre", "grado", "profesor")
    list_filter = ("grado", "profesor")
    search_fields = ("nombre",)

