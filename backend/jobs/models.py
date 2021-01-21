from django.db import models

class Searches(models.Model):
    location = models.CharField(max_length=120, blank=True)
    description = models.TextField(blank=True)
    language = models.CharField(max_length=120, blank=True)
    time = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField('IP Address')

    def _str_(self):
        return self.ip_address