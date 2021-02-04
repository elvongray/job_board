import requests
import json

from django.http import HttpResponse, HttpResponseNotFound, HttpResponseBadRequest
from django.views import View
from django.core.cache import cache
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from jobs.models import Searches
from jobs.models import UserClicks


class JobView(View):
    def fetch_requests(self, params={}):
        return requests.get('https://jobs.github.com/positions.json', params=params)

    def search_for_jobs(self, request):
        page = request.GET.get('page')
        search = request.GET.get('search')
        language = request.GET.get('language')
        location = request.GET.get('location')
        params = {'page': page, 'search': search, 'description': language, 'location': location}

        response = self.fetch_requests(params)

        if response.ok and response.json():
            search = Searches(
                location=location, description=search, language=language, ip_address=request.META.get('REMOTE_ADDR')
            )
            search.save()

            return HttpResponse(response.text, content_type="application/json")
        else:
            return HttpResponseNotFound()

    def get(self, request):
        httpResponse = None

        if not request.GET:
            """
            Load the first page when the user first visits the page without setting any
            search values
            """
            if not cache.get('page0'):
                response = self.fetch_requests()

                if response.ok:
                    cache.set('page0', response.text, 60 * 60 * 24)
                    httpResponse = response.text
                else:
                    return HttpResponseNotFound()
            else:
                response = cache.get('page0')
                return HttpResponse(response, content_type="application/json")
        else:
            page = request.GET.get('page')

            if 'search' not in request.GET:
                if not cache.get('page{}'.format(page)):
                    response = self.fetch_requests({'page': page})

                    if response.ok:
                        cache.set('page{}'.format(page), response.text, 60 * 60 * 24)
                        httpResponse = response.text
                        #import pdb; pdb.set_trace()
                    else:
                        return HttpResponseNotFound()
                else:
                    response = cache.get('page{}'.format(page))
                    return HttpResponse(response, content_type="application/json")
            else:
                return self.search_for_jobs(request)

        return HttpResponse(httpResponse, content_type="application/json")



@method_decorator(csrf_exempt, name='dispatch')
class UserClicksView(View):
    def post(self, request):
        body = json.loads(request.body)

        if body.get('path'):
            obj, _ = UserClicks.objects.get_or_create(path=body.get('path'))
            obj.number_of_clicks += 1
            obj.save()
            return HttpResponse('', content_type="application/json")
        else:
            return HttpResponseBadRequest()
