import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssistantChatComponent } from '../assistant-chat/assistant-chat.component';
import { ConversationListComponent } from '../conversation-list/conversation-list.component';
import { AssistantService } from '../../services/assistant.service';

@Component({
  selector: 'app-alumno',
  standalone: true,
  imports: [
    CommonModule,
    AssistantChatComponent,
    ConversationListComponent
  ],
  templateUrl: './alumno.component.html',
  styleUrls: ['./alumno.component.css']
})
export class AlumnoComponent {
  selectedThreadId: string | null = null;
  forceNewThread = false;

  @ViewChild(ConversationListComponent) conversationListComponent!: ConversationListComponent;
  @ViewChild(AssistantChatComponent) assistantChatComponent!: AssistantChatComponent;

  constructor(private assistantService : AssistantService){}

  startNewConversation() {
    console.log('🆕 Iniciando nueva conversación');
    this.selectedThreadId = null;
    this.assistantChatComponent?.loadHistory([]);
    this.assistantChatComponent.forceNewThread = true;
  }

  onThreadCreated(newThreadId: string) {
    this.selectedThreadId = newThreadId;
    this.forceNewThread = false;
    this.conversationListComponent?.loadConversations();
  }


  onThreadSelected(thread: any) {
    this.selectedThreadId = thread.assistant_thread_id;
    this.forceNewThread = false;

    this.assistantService.getThreadHistory(thread.assistant_thread_id)
      .then(messages => {
        this.assistantChatComponent?.loadHistory(messages);
      })
      .catch(err => {
        console.error('❌ Error al cargar historial del thread:', err);
      });
  }

}
