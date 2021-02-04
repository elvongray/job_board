from django.contrib import admin

from jobs.models import Searches
from jobs.models import UserClicks

class SearchesAdmin(admin.ModelAdmin):  # add this
  list_display = ('ip_address', 'description', 'language', 'location', 'time') # add this

admin.site.register(Searches, SearchesAdmin)


class UserClicksAdmin(admin.ModelAdmin):  # add this
  list_display = ('path', 'number_of_clicks') # add this

admin.site.register(UserClicks, UserClicksAdmin)
