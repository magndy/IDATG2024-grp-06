from . models import *
from django.shortcuts import render

def index(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        email = request.POST.get('email')
        if name and email:
            table = Userdb()
            table.username = request.POST.get('name')
            table.email = request.POST.get('email')
            table.save()
            return render(request, 'testInput.html', {'message': 'Data saved successfully!'})
    return render(request, 'testInput.html')
