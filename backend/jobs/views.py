import requests

from django.http import HttpResponse, HttpResponseNotFound
from django.views import View
from django.core.cache import cache


class JobView(View):
    def get(self, request):
        httpResponse = None

        if not request.GET:
            if not cache.get('page0'):
                response = requests.get('https://jobs.github.com/positions.json')

                if response.ok:
                    cache.set('page0', response.text, 60 * 60 * 24)
                    httpResponse = response.text
                    #import pdb; pdb.set_trace()
                else:
                    return HttpResponseNotFound()
            else:
                response = cache.get('page0')
                return HttpResponse(response, content_type="application/json")
        else:
            page = request.GET.get('page')

            if not cache.get('page{}'.format(page)):
                response = requests.get('https://jobs.github.com/positions.json', params={'page': page})

                if response.ok:
                    cache.set('page{}'.format(page), response.text, 60 * 60 * 24)
                    httpResponse = response.text
                    #import pdb; pdb.set_trace()
                else:
                    return HttpResponseNotFound()
            else:
                response = cache.get('page{}'.format(page))
                return HttpResponse(response, content_type="application/json")

        return HttpResponse(httpResponse, content_type="application/json")

