import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadDocumentComponent } from '../upload-document/upload-document.component';
import { DocumentListComponent } from '../document-list/document-list.component';
import { AssistantChatComponent } from '../assistant-chat/assistant-chat.component';
import { CreateCourseComponent } from '../create-course/create-course.component';
import { CourseListComponent } from '../course-list/course-list.component';
import { ConversationListComponent } from "../conversation-list/conversation-list.component";

@Component({
  selector: 'app-profesor',
  standalone: true,
  imports: [
    CommonModule,
    UploadDocumentComponent,
    DocumentListComponent,
    AssistantChatComponent,
    CreateCourseComponent,
    CourseListComponent,
    ConversationListComponent
],
  templateUrl: './profesor.component.html',
  styleUrls: ['./profesor.component.css']
})
export class ProfesorComponent implements AfterViewInit {
  selectedCourse: any = null;
  reloadCoursesFlag = Date.now(); // Para refrescar CourseList

  @ViewChild(DocumentListComponent) docListComponent!: DocumentListComponent;

  ngAfterViewInit(): void {}

  onDocumentUploaded() {
    this.docListComponent?.refresh();
  }

  onCourseSelected(course: any) {
    this.selectedCourse = course;
  }

  loadCourses() {
    console.log("🔄 Recargando cursos...");
    this.reloadCoursesFlag = Date.now(); // Triggea ngOnChanges en CourseList
  }

  onCourseCreated(course: any) {
    console.log('✅ Curso creado:', course);
    this.selectedCourse = course;
    this.reloadCoursesFlag = Date.now();
  }
  

  onThreadSelected(thread: any) {
    console.log('📂 Thread seleccionado:', thread);
    // Aquí puedes cargar los mensajes por thread.id y mostrarlos
  }
  
}
