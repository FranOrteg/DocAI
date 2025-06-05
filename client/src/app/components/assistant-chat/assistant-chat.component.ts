import { Component, Input } from '@angular/core';
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
export class AssistantChatComponent {
  @Input() courseId!: number;

  messages: { from: 'user' | 'assistant'; text: string }[] = [];
  userInput = '';
  loading = false;

  constructor(private assistantService: AssistantService) {}

  async sendMessage() {
    if (!this.userInput.trim()) return;

    const userMessage = this.userInput.trim();
    this.messages.push({ from: 'user', text: userMessage });
    this.userInput = '';
    this.loading = true;

    try {
      const res = await this.assistantService.sendMessage(this.courseId, userMessage);
      this.messages.push({ from: 'assistant', text: res.respuesta });
    } catch (error) {
      this.messages.push({ from: 'assistant', text: '⚠️ Error al obtener respuesta del asistente.' });
      console.error(error);
    }

    this.loading = false;
  }

  // ✅ Método para cargar historial externo
  loadHistory(history: { role: string; content: string }[]) {
    this.messages = history.map(msg => ({
      from: msg.role === 'user' ? 'user' : 'assistant',
      text: msg.content
    }));
  }
}
