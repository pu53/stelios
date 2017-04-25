from django.conf.urls import url
from quiz import views
from rest_framework.urlpatterns import format_suffix_patterns


urlpatterns = [
	url(r'^quiz/$', views.QuizList.as_view()),
	url(r'^quiz/(?P<pk>[0-9]+)/$', views.QuizDetail.as_view()),
	url(r'^question/$', views.QuestionList.as_view()),
	url(r'^question/(?P<pk>[0-9]+)/$', views.QuestionDetail.as_view()),
	url(r'^choice/$', views.ChoiceList.as_view()),
	url(r'^choice/(?P<pk>[0-9]+)/$', views.ChoiceDetail.as_view()),
	url(r'^quiz/data/(?P<pk>[0-9]+)/$', views.QuizData.as_view()),
	url(r'^quiz/true/(?P<pk>[0-9]+)$', views.QuizCorrectAnswers.as_view()),
	url(r'^quizsubjectname/$', views.quizSubjectName.as_view()),
	url(r'result/quiz/(?P<pk>[0-9]+)/$', views.SingleQuizResults.as_view()),
	url(r'result/quiz/save/$', views.SaveQuizResult.as_view()),
	url(r'result/stats/(?P<metric>[a-zA-Z0-9_]+)/(?P<scope>[a-zA-Z0-9_]+)/(?P<pk>[0-9]+)/$', views.QuizStatistics.as_view())
]

urlpatterns = format_suffix_patterns(urlpatterns)
