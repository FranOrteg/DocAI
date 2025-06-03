import { Component, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-upload-document',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './upload-document.component.html',
  styleUrl: './upload-document.component.css'
})
export class UploadDocumentComponent {

  @Output() uploadSuccess = new EventEmitter<void>();

  uploadForm = new FormGroup({
    courseId: new FormControl('', Validators.required),
    document: new FormControl(null, Validators.required)
  });

  constructor(private http: HttpClient) {}

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.uploadForm.patchValue({ document: file });
  }

  async onSubmit() {
    if (this.uploadForm.invalid) return;

    const formData = new FormData();
    formData.append('document', this.uploadForm.value.document!);
    
    const courseId = this.uploadForm.value.courseId!;
    try {
      await this.http.post(`http://localhost:3000/api/documents/${courseId}`, formData).toPromise();
      alert('✅ Documento subido correctamente');
      this.uploadForm.reset();
      this.uploadSuccess.emit();
    } catch (err) {
      console.error('❌ Error al subir documento:', err);
      alert('Error al subir documento');
    }
  }
}
