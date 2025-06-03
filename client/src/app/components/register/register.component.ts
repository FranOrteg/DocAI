import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  formularioRegister!: FormGroup<{
    name: FormControl<string | null>;
    email: FormControl<string | null>;
    password: FormControl<string | null>;
    role: FormControl<'Administrador' | 'Profesor' | 'Alumno' | null>;
  }>;

  roles = ['Administrador', 'Profesor', 'Alumno'];
  passwordType: string = 'password';

  constructor(private authService: AuthService, private router: Router) {
    this.formularioRegister = new FormGroup({
      name: new FormControl<string | null>(null, [Validators.required]),
      email: new FormControl<string | null>(null, [Validators.required, Validators.email]),
      password: new FormControl<string | null>(null, [Validators.required]),
      role: new FormControl<'Administrador' | 'Profesor' | 'Alumno' | null>(null, [Validators.required])
    });
  }

  async onSubmit() {
    if (this.formularioRegister.invalid) return;

    const formValue = this.formularioRegister.value;

    const user = {
      name: formValue.name ?? '',
      email: formValue.email ?? '',
      password: formValue.password ?? '',
      role: formValue.role ?? 'Alumno'  
    };

    const response = await this.authService.register(user);

    if ('token' in response) {
      this.authService.saveToken(response.token as string);
      alert('Registro exitoso');
      this.router.navigate(['/login']);
    } else if ('fatal' in response) {
      alert('Error: ' + response.fatal);
    }

    this.formularioRegister.reset();
  }

  checkPasswordType() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
  }

  checkError(control: string, validator: string) {
    return this.formularioRegister.get(control)?.hasError(validator) &&
           this.formularioRegister.get(control)?.touched;
  }
}
