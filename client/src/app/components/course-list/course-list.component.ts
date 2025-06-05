import { Component, Input,Output, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent implements OnChanges {
 
  @Input() reloadTrigger: any; 
  @Output() courseSelected = new EventEmitter<any>();

  courses: any[] = [];
  loading = false;

  constructor(private courseService: CourseService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['reloadTrigger']) {
      this.loadCourses();
    }
  }

  async loadCourses() {
    this.loading = true;
    try {
      this.courses = await this.courseService.getCoursesByUser();
    } catch (error) {
      console.error('❌ Error al cargar cursos:', error);
    }
    this.loading = false;
  }

  async delete(courseId: number) {
    if (confirm('¿Estás seguro de que quieres borrar este curso? Se eliminarán también sus documentos y el asistente.')) {
      try {
        await this.courseService.deleteCourse(courseId);
        await this.loadCourses();
      } catch (error) {
        alert('Error al borrar el curso');
        console.error(error);
      }
    }
  }

  selectCourse(course: any) {
    this.courseSelected.emit(course);
  }
  
}
