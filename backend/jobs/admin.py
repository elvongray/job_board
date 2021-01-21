from django.contrib import admin

from jobs.models import Searches

class SearchesAdmin(admin.ModelAdmin):  # add this
  list_display = ('ip_address', 'description', 'language', 'location', 'time') # add this

admin.site.register(Searches, SearchesAdmin)
