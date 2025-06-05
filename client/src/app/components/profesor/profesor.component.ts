import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadDocumentComponent } from '../upload-document/upload-document.component';
import { DocumentListComponent } from '../document-list/document-list.component';
import { AssistantChatComponent } from '../assistant-chat/assistant-chat.component';
import { CreateCourseComponent } from '../create-course/create-course.component';
import { CourseListComponent } from '../course-list/course-list.component';
import { ConversationListComponent } from "../conversation-list/conversation-list.component";
import { AssistantService } from '../../services/assistant.service';

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

  constructor(private assistantService: AssistantService) { }

  selectedCourse: any = null;
  reloadCoursesFlag = Date.now(); // Para refrescar CourseList
  selectedThreadId: string | null = null;

  @ViewChild(DocumentListComponent) docListComponent!: DocumentListComponent;
  @ViewChild(AssistantChatComponent) assistantChatComponent!: AssistantChatComponent;

  ngAfterViewInit(): void { }

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
    this.selectedThreadId = thread.assistant_thread_id;

    this.assistantService.getThreadHistory(thread.assistant_thread_id)
      .then(messages => {
        console.log('📜 Historial del thread:', messages);
        this.assistantChatComponent?.loadHistory(messages);
      })
      .catch(err => {
        console.error('❌ Error al cargar historial del thread:', err);
      });
  }

  startNewConversation() {
    console.log('🆕 Iniciando nueva conversación');
    this.selectedThreadId = null;
    this.assistantChatComponent?.loadHistory([]);
    this.assistantChatComponent.forceNewThread = true; // 🔥 Clave
  }


}
