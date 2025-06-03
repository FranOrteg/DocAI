import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadDocumentComponent } from '../upload-document/upload-document.component';


@Component({
  selector: 'app-profesor',
  standalone: true,
  imports: [CommonModule, UploadDocumentComponent],
  templateUrl: './profesor.component.html',
  styleUrl: './profesor.component.css'
})
export class ProfesorComponent {
  
  
  onDocumentUploaded() {
    console.log('📁 Documento subido, aquí podrías actualizar la vista.');
  }
}
