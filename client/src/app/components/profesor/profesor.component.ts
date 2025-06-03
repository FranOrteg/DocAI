import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadDocumentComponent } from '../upload-document/upload-document.component';
import { AssistantChatComponent } from '../assistant-chat/assistant-chat.component'; 

@Component({
  selector: 'app-profesor',
  standalone: true,
  imports: [CommonModule, UploadDocumentComponent, AssistantChatComponent], 
  templateUrl: './profesor.component.html',
  styleUrl: './profesor.component.css'
})

export class ProfesorComponent {
  courseId = 1;

  onDocumentUploaded() {
    console.log('📁 Documento subido');
  }
}
