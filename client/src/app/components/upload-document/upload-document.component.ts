import { Component, Output, EventEmitter, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DocumentService } from '../../services/document.service';
import { DocumentListComponent } from '../document-list/document-list.component';

@Component({
  selector: 'app-upload-document',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './upload-document.component.html',
  styleUrls: ['./upload-document.component.css']
})
export class UploadDocumentComponent implements AfterViewInit{
  @Input() courseId!: number;
  @Output() uploadSuccess = new EventEmitter<void>();
  @ViewChild('docList') docListComponent!: DocumentListComponent;
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef<HTMLInputElement>;

  uploadForm = new FormGroup({
    document: new FormControl<File | null>(null, Validators.required)
  });

  constructor(private documentService: DocumentService) {}

  ngAfterViewInit() {
    console.log('✅ fileInput está definido:', this.fileInput);
  }  

  onFileChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0] || null;
    this.uploadForm.patchValue({ document: file });
  }

  async onSubmit() {
    if (this.uploadForm.invalid || !this.courseId) return;
  
    const file = this.uploadForm.value.document!;
    try {
      await this.documentService.uploadDocument(this.courseId, file);
      alert('✅ Documento subido correctamente');
  
      this.uploadForm.reset();
  
      if (this.fileInput) {
        this.fileInput.nativeElement.value = '';
      }
  
      console.log('Input file actual:', this.fileInput?.nativeElement?.value);

      this.uploadSuccess.emit();
    } catch (err) {
      console.error('❌ Error al subir documento:', err);
      alert('Error al subir documento');
    }
  }
  

  onDocumentUploaded() {
    this.docListComponent.refresh();
  }
  
}
