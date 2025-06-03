import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadDocumentComponent } from '../upload-document/upload-document.component';
import { DocumentListComponent } from '../document-list/document-list.component';
import { AssistantChatComponent } from '../assistant-chat/assistant-chat.component';

@Component({
  selector: 'app-profesor',
  standalone: true,
  imports: [CommonModule, UploadDocumentComponent, DocumentListComponent, AssistantChatComponent],
  templateUrl: './profesor.component.html',
  styleUrls: ['./profesor.component.css']
})
export class ProfesorComponent {
  courseId = 1;

  @ViewChild(DocumentListComponent) docListComponent!: DocumentListComponent;

  onDocumentUploaded() {
    console.log('📁 Documento subido. Recargando lista de documentos...');
    this.docListComponent.refresh();
  }
}
