import rest_framework
from rest_framework import serializers
from rest_framework import viewsets
from rest_framework import permissions
from Home.models import *


class AuthUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuthUser
        fields = ['username', 'id', 'first_name','last_name']
