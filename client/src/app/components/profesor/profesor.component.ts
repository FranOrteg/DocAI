import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadDocumentComponent } from '../upload-document/upload-document.component';
import { DocumentListComponent } from '../document-list/document-list.component';
import { AssistantChatComponent } from '../assistant-chat/assistant-chat.component';
import { CourseSelectorComponent } from '../course-selector/course-selector.component';
import { CreateCourseComponent } from '../create-course/create-course.component';


@Component({
  selector: 'app-profesor',
  standalone: true,
  imports: [
    CommonModule, 
    UploadDocumentComponent, 
    DocumentListComponent, 
    AssistantChatComponent, 
    CourseSelectorComponent,
    CreateCourseComponent
  ],
  templateUrl: './profesor.component.html',
  styleUrls: ['./profesor.component.css']
})

export class ProfesorComponent {
  selectedCourse: any = null;

  @ViewChild(DocumentListComponent) docListComponent!: DocumentListComponent;
  @ViewChild(CourseSelectorComponent) courseSelector!: CourseSelectorComponent;

  onDocumentUploaded() {
    console.log('📁 Documento subido. Recargando lista de documentos...');
    this.docListComponent.refresh();
  }

  onCourseSelected(course: any) {
    console.log('📚 Curso seleccionado:', course); 
    this.selectedCourse = course;
  }

  loadCourses() {
    console.log("Cargando Cursos");
    this.courseSelector.loadCourses();
  }
  
}
