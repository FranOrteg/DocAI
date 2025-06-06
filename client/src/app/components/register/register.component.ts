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
      email: new FormControl<string | null>(null, [Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]),
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

    try {
      const response = await this.authService.register(user);
      console.log('Respuesta del backend:', response);

      if ('success' in response && 'id' in response) {
        alert('Registro exitoso');
        this.router.navigate(['/login']);
      } else if ('fatal' in response) {
        alert('Error: ' + response.fatal);
      } else {
        alert('Error inesperado al registrar el usuario.');
      }
    } catch (error) {
      console.error('Error en el registro:', error);
      alert('Error de conexión o del servidor.');
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


  navigateHome(){
    this.router.navigate(['/home']);
  }

}
