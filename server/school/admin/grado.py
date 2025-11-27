from django.contrib import admin
from school.models import Grado


@admin.register(Grado)
class GradoAdmin(admin.ModelAdmin):
    list_display = ("nombre", "institucion")
    list_filter = ("institucion",)
    search_fields = ("nombre",)

