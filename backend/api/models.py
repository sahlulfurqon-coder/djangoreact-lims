from django.db import models


class Project(models.Model):

    TYPE_CHOICES = (
        ('raw_material', 'Raw Material'),
        ('fatblend', 'Fatblend'),
        ('finished_product', 'Finished Product'),
    )

    type = models.CharField(max_length=20, choices=TYPE_CHOICES)

    name = models.CharField(max_length=100, unique=True)

    # RAW MATERIAL FIELDS
    tank = models.CharField(max_length=5, null=True, blank=True)
    pengisian_ke = models.IntegerField(null=True, blank=True)
    tanggal_pengisian = models.DateField(null=True, blank=True)
    # Raw Material Type
    raw_material_type = models.CharField(max_length=50, null=True, blank=True)

    # PRODUCTION FIELDS (FATBLEND & FINISHED PRODUCT)
    tanggal_produksi = models.DateField(null=True, blank=True)
    line = models.CharField(max_length=2, null=True, blank=True)
    nomor_urut = models.IntegerField(null=True, blank=True)

    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class ProjectRawMaterial(models.Model):
    """
    Komposisi raw material untuk FATBLEND dan FINISHED PRODUCT
    """
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name='raw_materials'
    )
    
    raw_material_project = models.ForeignKey(
        Project,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name='used_in_projects'
    )

    tank = models.CharField(max_length=5)
    percentage = models.FloatField()

    class Meta:
        verbose_name = "Raw Material Composition"
        verbose_name_plural = "Raw Material Compositions"

    def __str__(self):
        return f"{self.project.name} - {self.tank} ({self.percentage}%)"


class Analysis(models.Model):
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name='analyses'
    )

    pv = models.FloatField(null=True, blank=True)
    ffa = models.FloatField(null=True, blank=True)

    # Color
    color_r = models.FloatField(null=True, blank=True)
    color_y = models.FloatField(null=True, blank=True)
    color_b = models.FloatField(null=True, blank=True)

    # Functional tests
    sfc = models.FloatField(null=True, blank=True)
    iv = models.FloatField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Analysis - Project {self.project_id}'
