import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AssistantService } from '../../services/assistant.service';

@Component({
  selector: 'app-assistant-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './assistant-chat.component.html',
  styleUrls: ['./assistant-chat.component.css']
})
export class AssistantChatComponent implements OnChanges {
  @Input() courseId!: number;
  @Input() threadId: string | null = null;
  @Input() forceNewThread: boolean = false;
  @Input() resetTrigger: number = 0;
  @Output() threadCreated = new EventEmitter<string>();

  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  messages: { from: 'user' | 'assistant'; text: string }[] = [];
  userInput = '';
  loading = false;

  constructor(private assistantService: AssistantService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['resetTrigger']) {
      console.log('🔁 Reset trigger activado, limpiando chat');
      this.messages = [];
      this.forceNewThread = true;
    }
  }  

  async sendMessage() {
    if (!this.userInput.trim()) return;

    const userMessage = this.userInput.trim();
    this.messages.push({ from: 'user', text: userMessage });
    this.userInput = '';
    this.loading = true;

    // 👇 Detectar "inicio desde cero"
    if (!this.threadId && this.messages.length === 1) {
      this.forceNewThread = true;
    }

    try {
      const res = await this.assistantService.sendMessage(
        this.courseId,
        userMessage,
        this.threadId,
        this.forceNewThread
      );

      if (!this.threadId && res.threadId) {
        this.threadId = res.threadId;
        this.threadCreated.emit(this.threadId); // ⬅️ emitir evento al padre
      }
      this.forceNewThread = false; // Resetear tras enviar

      this.messages.push({ from: 'assistant', text: res.respuesta });
    } catch (error) {
      this.messages.push({ from: 'assistant', text: '⚠️ Error al obtener respuesta del asistente.' });
      console.error(error);
    }

    this.loading = false;
    this.forceNewThread = false;
  }

  // ✅ Método para cargar historial externo
  loadHistory(history: { role: string; content: string }[]) {
    this.messages = history.map(msg => ({
      from: msg.role === 'user' ? 'user' : 'assistant',
      text: msg.content
    }));
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  scrollToBottom() {
    try {
      this.messagesContainer.nativeElement.scrollTop =
        this.messagesContainer.nativeElement.scrollHeight;
    } catch (_) { }
  }
}
