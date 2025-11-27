from rest_framework import viewsets
from school.models import Institucion
from school.api.instituciones.serializers import InstitucionSerializer


class InstitucionViewSet(viewsets.ModelViewSet):
    queryset = Institucion.objects.all()
    serializer_class = InstitucionSerializer

