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
	#returns the information needed to determine the result of a quiz
	#url(r'^quiz/result/(?P<pk>[0-9]+)/$', views.QuizFeedbackData.as_view()),
	#url(r'^question/full/$')
	#url(r'^answer/$', views.AnswerList.as_view()),
	#url(r'^answer/(?P<pk>[0-9]+)/$', views.AnswerDetail.as_view()),
	url(r'^choice/istrue/(?P<pk>[0-9]+)$', views.ChoiceIsTrue.as_view()),
	url(r'result/quiz/(?P<pk>[0-9]+)$', views.SingleQuizResults.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
