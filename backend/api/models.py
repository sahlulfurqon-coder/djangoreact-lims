from django.db import models

# Create your models here.

class Project(models.Model):

    TYPE_CHOICES = (
        ('raw_material', 'Raw Material'),
        ('fatblend', 'Fatblend'),
        ('finished_product', 'Finished Product'),
    )

    type = models.CharField(max_length=20, choices=TYPE_CHOICES)

    name = models.CharField(max_length=100, unique=True)

    # RAW MATERIAL
    tank = models.CharField(max_length=5, null=True, blank=True)
    pengisian_ke = models.IntegerField(null=True, blank=True)
    tanggal_pengisian = models.DateField(null=True, blank=True)

    # FATBLEND & FINISHED PRODUCT
    tanggal_produksi = models.DateField(null=True, blank=True)
    line = models.CharField(max_length=2, null=True, blank=True)
    nomor_urut = models.IntegerField(null=True, blank=True)

    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    
class Analysis(models.Model):
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name='analyses'
    )

    pv = models.FloatField(null=True, blank=True)
    ffa = models.FloatField(null=True, blank=True)

    color_r = models.FloatField(null=True, blank=True)
    color_y = models.FloatField(null=True, blank=True)
    color_b = models.FloatField(null=True, blank=True)

    sfc = models.FloatField(null=True, blank=True)
    iv = models.FloatField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Analysis - Project {self.project_id}'