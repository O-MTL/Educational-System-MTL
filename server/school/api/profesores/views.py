from rest_framework import viewsets
from school.models import Profesor
from school.api.profesores.serializers import ProfesorSerializer


class ProfesorViewSet(viewsets.ModelViewSet):
    queryset = Profesor.objects.all()
    serializer_class = ProfesorSerializer
    
    def get_queryset(self):
        queryset = Profesor.objects.all()
        institucion_id = self.request.query_params.get('institucion', None)
        if institucion_id:
            queryset = queryset.filter(institucion_id=institucion_id)
        return queryset

