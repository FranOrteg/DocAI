import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { AdministradorComponent } from './components/administrador/administrador.component';
import { ProfesorComponent } from './components/profesor/profesor.component';
import { AlumnoComponent } from './components/alumno/alumno.component';

export const routes: Routes = [

    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
    { path: 'administrador', component: AdministradorComponent },
    { path: 'profesor', component: ProfesorComponent },
    { path: 'alumno', component: AlumnoComponent },
    { path: '**', redirectTo: 'login' }
];
