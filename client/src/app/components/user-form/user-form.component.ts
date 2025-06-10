import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnChanges {
  @Input() user: any = null;
  @Output() saved = new EventEmitter<void>();

  userForm!: FormGroup;
  isEditing = false;
  loading = false;

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user'] && this.user) {
      this.isEditing = !!this.user.id;
      this.userForm.patchValue({ ...this.user, password: '' }); // nunca mostramos la password
    }
  }

  initForm() {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      password: [''] // solo requerido en creación
    });
  }

  async submitForm() {
    if (this.userForm.invalid) return;

    this.loading = true;

    const formData = this.userForm.value;

    try {
      if (this.isEditing) {
        await this.userService.updateUser(this.user.id, formData);
      } else {
        await this.userService.createUser(formData);
      }

      this.saved.emit();
    } catch (err) {
      console.error('❌ Error al guardar usuario:', err);
    } finally {
      this.loading = false;
    }
  }
}
