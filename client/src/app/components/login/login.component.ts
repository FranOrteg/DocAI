import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UtilsService } from '../../services/utils.service'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private utilService: UtilsService
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [
        Validators.required
      ]),
      password: new FormControl(null, [
        Validators.required
      ])
    }, []);
  }

  async onSubmit() {
    try {
      const response = await this.authService.login(this.loginForm.value);

      if (response.fatal) {
        return alert(response.fatal);
      }

      localStorage.setItem('token', response.token);

      const token = this.utilService.getToken();

      switch (token.role) {
        case 'Administrador':
          this.router.navigate(['/admin']);
          break;
        case 'Profesor':
          this.router.navigate(['/profesor']);
          break;
        case 'Alumno':
          this.router.navigate(['/alumno']);
          break;
        default:
          alert('Rol no autorizado');
          break;
      }


    } catch (error) {
      console.log('❌ Error en login:', error);
    }

  }
}
