from django.shortcuts import render, redirect, get_object_or_404 
from .models import Student 
from .forms import StudentForm 
 
# CREATE + READ 
def student_list(request): 
    students = Student.objects.all() 
    return render(request, 'student_list.html', {'students': 
students}) 
 
# CREATE 
def student_create(request): 
    form = StudentForm(request.POST or None) 
    if form.is_valid(): 
        form.save() 
        return redirect('student_list') 
    return render(request, 'student_form.html', {'form': form}) 
 
# UPDATE 
def student_update(request, id): 
    student = get_object_or_404(Student, id=id) 
    form = StudentForm(request.POST or None, instance=student) 
    if form.is_valid(): 
        form.save() 
        return redirect('student_list') 
    return render(request, 'student_form.html', {'form': form}) 
 
# DELETE 
def student_delete(request, id): 
    student = get_object_or_404(Student, id=id) 
    student.delete() 
    return redirect('student_list') 