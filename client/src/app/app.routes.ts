import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { roleGuard } from './guards/role.guard';


export const routes: Routes = [

    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },

    {
        path: 'admin',
        canActivate: [roleGuard(['Administrador'])],
        loadComponent: () => import('./components/administrador/administrador.component').then(m => m.AdministradorComponent)
    },
    {
        path: 'profesor',
        canActivate: [roleGuard(['Profesor'])],
        loadComponent: () => import('./components/profesor/profesor.component').then(m => m.ProfesorComponent)
    },
    {
        path: 'alumno',
        canActivate: [roleGuard(['Alumno'])],
        loadComponent: () => import('./components/alumno/alumno.component').then(m => m.AlumnoComponent)
    },
    
    { path: '**', redirectTo: 'login' }
];
