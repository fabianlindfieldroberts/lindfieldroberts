from django_hosts import patterns, host
from django.conf import settings

host_patterns = patterns('',
    host(r'www', settings.ROOT_URLCONF, name='www'),
    host(r'geireann', 'lindfieldroberts.urls_geireann', name='geireann'),
    host(r'fabian', 'lindfieldroberts.urls_fabian', name='fabian')
)