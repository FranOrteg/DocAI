import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.css']
})
export class CourseFormComponent implements OnChanges {
  @Input() course: any = null;
  @Output() saved = new EventEmitter<void>();

  courseForm!: FormGroup;
  isEditing = false;
  loading = false;

  constructor(private fb: FormBuilder, private courseService: CourseService) {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['course'] && this.course) {
      this.isEditing = !!this.course.id;
      this.courseForm.patchValue(this.course);
    }
  }

  initForm() {
    this.courseForm = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });
  }

  async submitForm() {
    if (this.courseForm.invalid) return;

    this.loading = true;
    const formData = this.courseForm.value;

    try {
      if (this.isEditing) {
        await this.courseService.updateCourse(this.course.id, formData);
      } else {
        await this.courseService.createCourse(formData);
      }

      this.saved.emit();
    } catch (err) {
      console.error('❌ Error al guardar curso:', err);
    } finally {
      this.loading = false;
    }
  }
}
