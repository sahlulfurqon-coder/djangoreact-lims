from rest_framework import viewsets, permissions
from .models import Project
from .models import Analysis
from .serializers import ProjectSerializer
from .serializers import AnalysisSerializer

class ProjectViewset(viewsets.ModelViewSet):
    permission_classes = [permissions.AllowAny]
    serializer_class = ProjectSerializer

    def get_queryset(self):
        return Project.objects.all()
    
class AnalysisViewSet(viewsets.ModelViewSet):
    queryset = Analysis.objects.all()
    serializer_class = AnalysisSerializer

    def get_queryset(self):
        project_id = self.request.query_params.get('project')
        if project_id:
            return self.queryset.filter(project_id=project_id)
        return self.queryset
