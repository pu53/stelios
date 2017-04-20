from django.conf.urls import url
from profiles import views
from rest_framework.urlpatterns import format_suffix_patterns


urlpatterns = [
    url(r'^users/$', views.UserList.as_view()),
    url(r'^users/(?P<pk>[0-9]+)/$', views.UserDetail.as_view()),
    url(r'^users/data/(?P<pk>[0-9]+)/$', views.UserSubjects.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
