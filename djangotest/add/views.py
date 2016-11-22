from django.shortcuts import render

# Create your views here.
#coding:utf-8
from django.http import HttpResponse

def add(request):
	a=request.GET['a']
	b=request.GET['b']
	c=int(a)+int(b)
	return HttpResponse(str(c))
def add1(request,a,b):
	c=int(a)+int(b)
	return HttpResponse(str(c))
def index(request):
	return render(request,'home.html')