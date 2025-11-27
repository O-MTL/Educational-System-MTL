from django.contrib import admin
from school.models import Periodo


@admin.register(Periodo)
class PeriodoAdmin(admin.ModelAdmin):
    list_display = ("nombre", "fecha_inicio", "fecha_fin")
    list_filter = ("fecha_inicio", "fecha_fin")

