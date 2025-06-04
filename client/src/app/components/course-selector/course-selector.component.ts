import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-course-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './course-selector.component.html',
  styleUrls: ['./course-selector.component.css']
})

export class CourseSelectorComponent {
  @Output() courseSelected = new EventEmitter<any>();

  courses: any[] = [];
  selectedCourseId: number | null = null;
  loading = false;

  constructor(private courseService: CourseService) {
    this.loadCourses();
  }

  async loadCourses() {
    this.loading = true;
    try {
      const res = await this.courseService.getCourses();
      this.courses = res || [];
    } catch (err) {
      console.error('❌ Error cargando cursos:', err);
      this.courses = [];
    }
    this.loading = false;
  }

  onSelect(courseId: number | null) {
    const course = this.courses.find(c => c.id === courseId);
    if (course) {
      console.log('🔍 Emitiendo curso:', course); // ← añade esto también
      this.courseSelected.emit(course);
    }
  }
  
}
