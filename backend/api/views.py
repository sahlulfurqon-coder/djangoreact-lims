from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework import status

from .models import Project, Analysis
from .serializers import ProjectSerializer, AnalysisSerializer


class ProjectViewset(viewsets.ModelViewSet):
    permission_classes = [permissions.AllowAny]
    serializer_class = ProjectSerializer
    queryset = Project.objects.all()

    def get_queryset(self):
        queryset = Project.objects.all()

        # Optional filter berdasarkan type (raw_material, fatblend, finished_product)
        project_type = self.request.query_params.get('type')
        if project_type:
            queryset = queryset.filter(type=project_type)

        return queryset

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        serializer.is_valid(raise_exception=True)
        project = serializer.save()

        return Response(
            self.get_serializer(project).data,
            status=status.HTTP_201_CREATED
        )

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()

        serializer = self.get_serializer(
            instance, data=request.data, partial=partial
        )
        serializer.is_valid(raise_exception=True)
        project = serializer.save()

        return Response(
            self.get_serializer(project).data,
            status=status.HTTP_200_OK
        )


class AnalysisViewSet(viewsets.ModelViewSet):
    serializer_class = AnalysisSerializer
    permission_classes = [permissions.AllowAny]
    queryset = Analysis.objects.all()

    def get_queryset(self):
        queryset = Analysis.objects.all()

        # Optional: filter analysis berdasarkan project
        project_id = self.request.query_params.get('project')
        if project_id:
            queryset = queryset.filter(project_id=project_id)

        return queryset

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        serializer.is_valid(raise_exception=True)
        analysis = serializer.save()

        return Response(
            AnalysisSerializer(analysis).data,
            status=status.HTTP_201_CREATED
        )
