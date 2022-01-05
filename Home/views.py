from django.shortcuts import render
# Create your views here.
from django.views.generic import TemplateView
from django.contrib.auth.views import LoginView, LogoutView
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from wsgiref.util import FileWrapper
from django.http import JsonResponse
from django.views import View
from django.contrib.auth import authenticate, login
import filetype
from django.contrib.auth import logout
from django.views.decorators.csrf import csrf_exempt
from Home.models import *
from Home.serializers import *
from django.views.decorators.csrf import csrf_exempt
import datetime
from django.core.files.storage import FileSystemStorage
from datetime import datetime
from shutil import make_archive
from django.http import HttpResponse
from django.http import FileResponse
import base64
import os


class HomePageView(TemplateView):
    template_name = "Home.html"


# class NewPageView(TemplateView):
#     template_name = "new.html"


# class AboutPageView(TemplateView):
#     template_name = "about.html"


# class EduPageView(TemplateView):
#     template_name = "Dao-tao.html"


# @method_decorator(login_required, name='dispatch')
# class AdminPageView(TemplateView):
#     template_name = "admin.html"


# class LoginView(LoginView):
#     redirect_authenticated_user = True
#     template_name = "login.html"


# class Login(View):
#     def post(self, request):
#         if request.method == 'POST':
#             username = request.POST.get('username')
#             password = request.POST.get('password')
#             user = authenticate(username=username, password=password)
#             if user is not None and (user.is_authenticated):
#                 login(request, user)
#                 return JsonResponse("done", status=200, safe=False)
#             else:
#                 return JsonResponse("fail", status=200, safe=False)


# class Logout(View):
#     def get(self, request):
#         if request.method == 'GET':
#             logout(request)
#             return JsonResponse("done", status=200, safe=False)


# class Getuser(View):
#     def get(self, request):
#         if request.user.is_authenticated == True:
#             username = request.user.username
#             return JsonResponse(username, status=200, safe=False)


# @method_decorator(csrf_exempt, name='dispatch')
# class GetFileUpload(View):
#     def post(self, request):
#         now = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
#         title = request.POST.get('title')
#         content = request.POST.get('content')
#         user_create_id = request.user.id
#         deadline = request.POST.get('deadline') if request.POST.get(
#             'deadline') != 'Invalid date' else None
#         for file in request.FILES.getlist('file'):
#             fs = FileSystemStorage(
#                 location='/home/thomasvu/Documents/IOTWeb/upload/')
#             filename = fs.save(file.name, file)
#             uploaded_file_url = fs.url(filename)  # gets the url
#         Task.objects.bulk_create(
#             [
#                 Task(task_title=title, task_content=content,
#                      deadline=deadline, user_create_id=user_create_id, created_at=now, taskstatus=0),
#             ]
#         )
#         id_task = Task.objects.filter(
#             user_create_id=user_create_id).latest('id').id
#         if len(request.FILES.getlist('file')) != 0:
#             Filelist.objects.bulk_create([
#                 Filelist(file_path='/home/thomasvu/Documents/IOTWeb/upload/' +
#                          file.name, task_id=id_task, file_type=filetype.guess('/home/thomasvu/Documents/IOTWeb/upload/' + file.name).mime) for file in request.FILES.getlist('file')
#             ])
#         return JsonResponse('done', status=200, safe=False)


# @method_decorator(csrf_exempt, name='dispatch')
# class GetListTask(View):
#     def get(self, request):
#         data_Json = []
#         task_query = Task.objects.all()
#         list_task = TaskSerializer(instance=task_query, many=True).data
#         list_file = FilelistSerializer(instance=Filelist.objects.all(
#         ), many=True).data if Filelist.objects.all() is not None else None
#         data_Json.append(list_task)
#         data_Json.append(list_file)
#         list_user_query = AuthUser.objects.values(
#             'username', 'id', 'last_name', 'first_name')
#         list_user = AuthUserSerializer(
#             instance=list_user_query, many=True).data
#         data_Json.append(list_user)
#         return JsonResponse(data_Json, status=200, safe=False)


# @method_decorator(csrf_exempt, name='dispatch')
# class DownloadFile(View):
#     def post(self, request, *args, **kwargs):
#         file_path = request.POST['path']
#         file_name = request.POST['name']
#         file_type = request.POST['type']
#         print(file_name)
#         with open(file_path, "rb") as image_file:
#             encoded_string = base64.b64encode(image_file.read())
#         response = FileResponse(open(str(file_path),  'rb'))
#         # response['Content-Disposition'] = 'attachment; filename=file_name'
#         return HttpResponse(encoded_string, status=200, content_type="text/plain")


# @method_decorator(csrf_exempt, name='dispatch')
# class DeleteTask(View):
#     def post(self, request):
#         task_id = request.POST.get('taskID')
#         files = Filelist.objects.filter(task=task_id)
#         if len(files) != 0:
#             for file in files:
#                 try:
#                     os.remove(file.file_path)
#                 except Exception:
#                     print(Exception)
#                 except OSError as e:
#                     print(e)
#                 file.delete()
#         Task.objects.filter(id=task_id).delete()
#         return JsonResponse('check', status=200, safe=False)


# @method_decorator(csrf_exempt, name='dispatch')
# class FinishTask(View):
#     def post(self, request):
#         task_id = request.POST.get('taskID')
#         task = Task.objects.get(id=task_id)
#         task.taskstatus = 1
#         task.save()
#         return JsonResponse('check', status=200, safe=False)


# @method_decorator(csrf_exempt, name='dispatch')
# class RemoveFile(View):
#     def post(self, request):
#         file_id = request.POST.get('id')
#         file = Filelist.objects.get(id=file_id)
#         try:
#             os.remove(file.file_path)
#         except Exception:
#             print(Exception)
#         except OSError as e:
#             print(e)
#         file.delete()
#         return JsonResponse('check', status=200, safe=False)


# @method_decorator(csrf_exempt, name='dispatch')
# class EditTask(View):
#     def post(self, request):
#         id_task = request.POST.get('id')
#         title = request.POST.get('title')
#         content = request.POST.get('content')
#         deadline = request.POST.get('deadline') if request.POST.get(
#             'deadline') != 'Invalid date' else None
#         for file in request.FILES.getlist('file'):
#             fs = FileSystemStorage(
#                 location='/home/thomasvu/Documents/IOTWeb/upload/')
#             filename = fs.save(file.name, file)
#             uploaded_file_url = fs.url(filename)  # gets the url
#         task = Task.objects.get(id=id_task)
#         task.task_title = title
#         task.task_content = content
#         task.deadline = deadline
#         task.save()
#         if len(request.FILES.getlist('file')) != 0:
#             Filelist.objects.bulk_create([
#                 Filelist(file_path='/home/thomasvu/Documents/IOTWeb/upload/' +
#                          file.name, task_id=id_task, file_type=filetype.guess('/home/thomasvu/Documents/IOTWeb/upload/' + file.name).mime) for file in request.FILES.getlist('file')
#             ])
#         return JsonResponse('done', status=200, safe=False)
