import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-create-course',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-course.component.html',
  styleUrls: ['./create-course.component.css']
})

export class CreateCourseComponent {
  @Output() courseCreated = new EventEmitter<void>();

  name = '';
  description = '';
  loading = false;
  error = '';

  constructor(private courseService: CourseService) {}

  async createCourse() {
    if (!this.name.trim()) {
      this.error = 'El nombre del curso es obligatorio.';
      return;
    }

    this.loading = true;
    this.error = '';
    try {
      await this.courseService.createCourse({ name: this.name, description: this.description });
      this.courseCreated.emit();
      this.name = '';
      this.description = '';
    } catch (err) {
      this.error = '❌ Error al crear el curso.';
      console.error(err);
    }
    this.loading = false;
  }
}
