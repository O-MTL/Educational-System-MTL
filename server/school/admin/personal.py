from django.contrib import admin
from school.models import Personal


@admin.register(Personal)
class PersonalAdmin(admin.ModelAdmin):
    list_display = ("nombre", "apellido", "cedula", "cargo", "estado", "institucion")
    list_filter = ("cargo", "estado", "institucion")
    search_fields = ("nombre", "apellido", "cedula")

