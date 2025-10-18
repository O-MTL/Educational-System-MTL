import { Routes } from '@angular/router';
import { PersonalComponent } from './components/personal/personal';
import { GradoEstudioComponent } from './components/grado-estudio/grado-estudio';
import { MateriasComponent } from './components/materias/materias';
import { InstitucionComponent } from './components/institucion/institucion';
import { CalificacionesComponent } from './components/calificaciones/calificaciones';
import { LoginComponent } from './components/auth/login/login';
import { DashboardComponent } from './components/dashboard/dashboard';
import { MainLayoutComponent } from './components/layout/main-layout/main-layout';
import { EstudiantesComponent } from './components/estudiantes/estudiantes';
import { PeriodosComponent } from './components/periodos/periodos';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'app',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'estudiantes',
        component: EstudiantesComponent
      },
      {
        path: 'personal',
        component: PersonalComponent
      },
      {
        path: 'grado-estudio',
        component: GradoEstudioComponent
      },
      { path: 'grados', redirectTo: '/app/grado-estudio' },
      {
        path: 'materias',
        component: MateriasComponent
      },
      {
        path: 'periodos',
        component: PeriodosComponent
      },
      {
        path: 'institucion',
        component: InstitucionComponent
      },
      {
        path: 'calificaciones',
        component: CalificacionesComponent
      }
    ]
  },
  { path: '**', redirectTo: '/login' }
];
