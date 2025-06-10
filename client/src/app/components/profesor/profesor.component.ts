import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadDocumentComponent } from '../upload-document/upload-document.component';
import { DocumentListComponent } from '../document-list/document-list.component';
import { AssistantChatComponent } from '../assistant-chat/assistant-chat.component';
import { CreateCourseComponent } from '../create-course/create-course.component';
import { CourseListComponent } from '../course-list/course-list.component';
import { ConversationListComponent } from "../conversation-list/conversation-list.component";
import { AssistantService } from '../../services/assistant.service';
import { Router } from '@angular/router';
import * as bootstrap from 'bootstrap';

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

  constructor(
    private assistantService: AssistantService,
    private router: Router
  ) { }

  selectedCourse: any = null;
  reloadCoursesFlag = Date.now(); // Para refrescar CourseList
  selectedThreadId: string | null = null;
  modalVisible = false;
  modalInstance: bootstrap.Modal | null = null;

  @ViewChild(DocumentListComponent) docListComponent!: DocumentListComponent;
  @ViewChild(AssistantChatComponent) assistantChatComponent!: AssistantChatComponent;
  @ViewChild(ConversationListComponent) conversationListComponent!: ConversationListComponent;
  
  ngAfterViewInit(): void { }

  onDocumentUploaded() {
    this.docListComponent?.refresh();
  }

  onCourseSelected(course: any) {
    if (!course || course.id === this.selectedCourse?.id) {
      return;
    }
  
    // ✔️ Curso distinto: sí resetea
    this.selectedCourse = course;
    this.selectedThreadId = null;
    this.assistantChatComponent?.loadHistory([]);
  }
  

  loadCourses() {
    console.log("🔄 Recargando cursos...");
    this.reloadCoursesFlag = Date.now(); // Triggea ngOnChanges en CourseList
  }

  onCourseCreated(course: any) {
    console.log('✅ Curso creado:', course);
    this.selectedCourse = course;
    this.reloadCoursesFlag = Date.now();

    // Cerrar modal solo si tienes instancia activa
    if (this.modalInstance) {
      this.modalInstance.hide();

      // Limpieza forzada por seguridad
      setTimeout(() => {
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) backdrop.remove();
        document.body.classList.remove('modal-open');
        document.body.style.removeProperty('overflow');
        document.body.style.removeProperty('padding-right');
      }, 300);
    }
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

  onThreadCreated(newThreadId: string) {
    console.log('🧵 Nuevo thread creado:', newThreadId);
    this.selectedThreadId = newThreadId;
    this.conversationListComponent?.loadConversations();
  }

  abrirDialogoCurso() {
    const modalEl = document.getElementById('createCourseModal');
    if (modalEl) {
      this.modalInstance = new bootstrap.Modal(modalEl, { backdrop: 'static' });
      this.modalInstance.show();
    }
  }

  logout() {
    localStorage.clear(); // o tu lógica de logout
    this.router.navigate(['/home']);
  }

  editProfile() {
    // Puedes abrir un modal o navegar a una pantalla de edición
    alert('Funcionalidad de editar perfil pendiente'); // temporal
  }

  onCourseDeleted(deletedCourseId: number) {
    if (this.selectedCourse?.id === deletedCourseId) {
      this.selectedCourse = null;
      this.selectedThreadId = null;
  
      // Opcional: Limpia el historial del chat si ya está montado
      this.assistantChatComponent?.loadHistory([]);
    }
  
    // ⚡ Refresca lista de cursos para que se actualice visualmente
    this.reloadCoursesFlag = Date.now();
  }
}
