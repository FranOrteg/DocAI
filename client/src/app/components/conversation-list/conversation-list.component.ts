import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssistantService } from '../../services/assistant.service';

@Component({
  selector: 'app-conversation-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './conversation-list.component.html',
  styleUrls: ['./conversation-list.component.css']
})
export class ConversationListComponent implements OnChanges {
  @Input() courseId!: number;
  @Output() threadSelected = new EventEmitter<any>();

  conversations: any[] = [];
  loading = false;

  constructor(private assistanService: AssistantService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['courseId'] && this.courseId) {
      this.loadConversations();
    }
  }

  async loadConversations() {
    this.loading = true;
    try {
      this.conversations = await this.assistanService.getThreadsByCourse(this.courseId);
    } catch (error) {
      console.error('❌ Error al cargar conversaciones:', error);
    }
    this.loading = false;
  }

  selectThread(thread: any) {
    this.threadSelected.emit(thread);
  }

  deleteThread(threadId: number, event: MouseEvent) {
    event.stopPropagation();
  
    if (!confirm('¿Estás seguro de que quieres borrar esta conversación?')) return;
  
    this.assistanService.deleteThread(threadId)
      .then(() => {
        // Recargar lista de conversaciones
        this.loadConversations();
      })
      .catch(error => {
        console.error('❌ Error al borrar conversación:', error);
      });
  }
  
}
