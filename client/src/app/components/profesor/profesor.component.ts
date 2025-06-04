import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadDocumentComponent } from '../upload-document/upload-document.component';
import { DocumentListComponent } from '../document-list/document-list.component';
import { AssistantChatComponent } from '../assistant-chat/assistant-chat.component';
import { CourseSelectorComponent } from '../course-selector/course-selector.component';
import { CreateCourseComponent } from '../create-course/create-course.component';
import { CourseListComponent } from '../course-list/course-list.component';

@Component({
  selector: 'app-profesor',
  standalone: true,
  imports: [
    CommonModule,
    UploadDocumentComponent,
    DocumentListComponent,
    AssistantChatComponent,
    CourseSelectorComponent,
    CreateCourseComponent,
    CourseListComponent
  ],
  templateUrl: './profesor.component.html',
  styleUrls: ['./profesor.component.css']
})
export class ProfesorComponent implements AfterViewInit {
  selectedCourse: any = null;
  reloadCoursesFlag = 0;

  @ViewChild(DocumentListComponent) docListComponent!: DocumentListComponent;
  @ViewChild(CourseSelectorComponent) courseSelector!: CourseSelectorComponent;

  ngAfterViewInit(): void {}

  onDocumentUploaded() {
    this.docListComponent?.refresh();
  }

  onCourseSelected(course: any) {
    this.selectedCourse = course;
  }

  loadCourses() {
    console.log("🔄 Recargando cursos...");
    this.courseSelector?.loadCourses();
    this.reloadCoursesFlag = Date.now(); // Triggea ngOnChanges en CourseList
  }

  onCourseCreated(course: any) {
    console.log('✅ Curso creado:', course);
    this.selectedCourse = course;

    this.courseSelector.loadCourses();    // actualiza selector
    this.reloadCoursesFlag = Date.now();  // actualiza lista
  }
}
