from django.conf.urls import url
from wiki import views
from rest_framework.urlpatterns import format_suffix_patterns


urlpatterns = [
    url(r'^subjects/$', views.SubjectList.as_view()),
    url(r'^subjects/(?P<pk>[0-9]+)/$', views.SubjectDetail.as_view()),
    url(r'^topics/$', views.TopicList.as_view()),
    url(r'^topics/(?P<pk>[0-9]+)/$', views.TopicDetail.as_view()),
    url(r'^subtopics/$', views.SubtopicList.as_view()),
    url(r'^subtopics/(?P<pk>[0-9]+)/$', views.SubtopicDetail.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
