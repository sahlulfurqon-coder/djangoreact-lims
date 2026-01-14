from rest_framework import serializers
from .models import *


class ProjectRawMaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectRawMaterial
        fields = ['tank', 'percentage']


class ProjectSerializer(serializers.ModelSerializer):
    raw_materials = ProjectRawMaterialSerializer(many=True, required=False)

    class Meta:
        model = Project
        fields = '__all__'

    def validate(self, data):
        project_type = data.get('type', getattr(self.instance, 'type', None))
        raw_materials = data.get('raw_materials')

        # RAW MATERIAL
        if project_type == "raw_material":
            if not data.get('raw_material_type'):
                raise serializers.ValidationError({
                    "raw_material_type": "Raw material requires raw_material_type field."
                })

            if raw_materials:
                raise serializers.ValidationError({
                    "raw_materials": "Raw materials must be empty for raw_material type."
                })

        # FATBLEND
        if project_type == "fatblend":
            if raw_materials is None:
                raise serializers.ValidationError({
                    "raw_materials": "Fatblend requires raw_materials field."
                })

            if len(raw_materials) < 1:
                raise serializers.ValidationError({
                    "raw_materials": "Fatblend must contain at least 1 raw material."
                })

            total = sum(rm.get('percentage', 0) for rm in raw_materials)
            if total != 100:
                raise serializers.ValidationError({
                    "raw_materials": f"Total percentage must equal 100 (current={total})."
                })

        # FINISHED PRODUCT
        if project_type == "finished_product" and raw_materials:
            total = sum(rm.get('percentage', 0) for rm in raw_materials)
            if total != 100:
                raise serializers.ValidationError({
                    "raw_materials": f"Total percentage must equal 100 (current={total})."
                })

        return data


    def create(self, validated_data):
        raw_materials_data = validated_data.pop('raw_materials', None)
        project = Project.objects.create(**validated_data)

        if raw_materials_data:
            for rm in raw_materials_data:
                ProjectRawMaterial.objects.create(project=project, **rm)

        return project

    def update(self, instance, validated_data):
        raw_materials_data = validated_data.pop('raw_materials', None)

        # update project fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # update raw materials if provided
        if raw_materials_data is not None:
            instance.raw_materials.all().delete()
            for rm in raw_materials_data:
                ProjectRawMaterial.objects.create(project=instance, **rm)

        return instance

class AnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = Analysis
        fields = '__all__'
