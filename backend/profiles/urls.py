from django.conf.urls import url
from profiles import views
from rest_framework.urlpatterns import format_suffix_patterns


urlpatterns = [
    url(r'^profiles/$', views.ProfileList.as_view()),
    url(r'^profiles/(?P<pk>[0-9]+)/$', views.ProfileDetail.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
