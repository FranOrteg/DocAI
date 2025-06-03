import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentService } from '../../services/document.service';

@Component({
  selector: 'app-document-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})

export class DocumentListComponent implements OnChanges {
  @Input() courseId!: number;

  documents: any[] = [];
  loading = false;

  constructor(private documentService: DocumentService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['courseId'] && this.courseId) {
      this.loadDocuments();
    }
  }

  async loadDocuments() {
    this.loading = true;
    try {
      this.documents = await this.documentService.getDocumentsByCourse(this.courseId);
    } catch (error) {
      console.error('❌ Error al cargar documentos:', error);
    }
    this.loading = false;
  }

  async refresh() {
    await this.loadDocuments();
  }
}

