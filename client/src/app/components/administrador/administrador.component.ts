import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListComponent } from '../user-list/user-list.component';
import { CourseListComponent } from '../course-list/course-list.component';
import { UserFormComponent } from '../user-form/user-form.component';
import { CourseFormComponent } from '../course-form/course-form.component';
import { Router } from '@angular/router';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-administrador',
  standalone:true,
  imports: [
    CommonModule,
    UserListComponent,
    CourseListComponent,
    UserFormComponent,
    CourseFormComponent
  ],
  templateUrl: './administrador.component.html',
  styleUrl: './administrador.component.css'
})

export class AdministradorComponent {
  selectedUser: any = null;
  selectedCourse: any = null;
  reloadUsersFlag = Date.now();
  reloadCoursesFlag = Date.now();
  isCreatingUser = false;
  isCreatingCourse = false;

  modalInstance: bootstrap.Modal | null = null;

  constructor(private router: Router) {}

  onUserSelected(user: any) {
    this.selectedCourse = null;
    this.selectedUser = user;
    this.isCreatingUser = false;
  }

  onCourseSelected(course: any) {
    this.selectedUser = null;
    this.selectedCourse = course;
    this.isCreatingCourse = false;
  }

  onCreateNew(type: 'user' | 'course') {
    if (type === 'user') {
      this.selectedUser = {};
      this.selectedCourse = null;
      this.isCreatingUser = true;
    } else {
      this.selectedCourse = {};
      this.selectedUser = null;
      this.isCreatingCourse = true;
    }
  }

  onUserSaved() {
    this.reloadUsersFlag = Date.now();
    this.selectedUser = null;
  }

  onCourseSaved() {
    this.reloadCoursesFlag = Date.now();
    this.selectedCourse = null;
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/home']);
  }

  editProfile() {
    alert('Funcionalidad de editar perfil pendiente');
  }
}
