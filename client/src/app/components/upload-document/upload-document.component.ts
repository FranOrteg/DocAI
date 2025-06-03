import { Component, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DocumentService } from '../../services/document.service';

@Component({
  selector: 'app-upload-document',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './upload-document.component.html',
  styleUrls: ['./upload-document.component.css']
})
export class UploadDocumentComponent {

  @Output() uploadSuccess = new EventEmitter<void>();

  uploadForm = new FormGroup({
    courseId: new FormControl<number | null>(null, Validators.required),
    document: new FormControl<File | null>(null, Validators.required)
  });

  constructor(private documentService: DocumentService) {}

  onFileChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0] || null;
    this.uploadForm.patchValue({ document: file });
  }

  async onSubmit() {
    if (this.uploadForm.invalid) return;

    const courseId = this.uploadForm.value.courseId!;
    const file = this.uploadForm.value.document!;

    try {
      await this.documentService.uploadDocument(courseId, file);
      alert('✅ Documento subido correctamente');
      this.uploadForm.reset();
      this.uploadSuccess.emit();
    } catch (err) {
      console.error('❌ Error al subir documento:', err);
      alert('Error al subir documento');
    }
  }
}
