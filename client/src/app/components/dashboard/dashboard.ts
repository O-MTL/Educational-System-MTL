import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../services/auth';
import { Usuario } from '../../models/usuario.interface';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    MatToolbarModule,
    MatMenuModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {
  currentUser: Usuario | null = null;
  dashboardCards: any[] = [];
  quickStats: any[] = [];
  recentActivities: any[] = [];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.setupDashboardCards();
    this.setupQuickStats();
    this.setupRecentActivities();
  }

  private setupDashboardCards() {
    if (!this.currentUser) return;

    const baseCards = [
      {
        title: 'Estudiantes',
        icon: 'school',
        route: '/app/estudiantes',
        color: 'primary',
        roles: ['Administrador', 'Docente'],
        description: 'Gestionar estudiantes'
      },
      {
        title: 'Personal',
        icon: 'people',
        route: '/app/personal',
        color: 'accent',
        roles: ['Administrador'],
        description: 'Gestionar personal docente y administrativo'
      },
      {
        title: 'Materias',
        icon: 'book',
        route: '/app/materias',
        color: 'warn',
        roles: ['Administrador', 'Docente'],
        description: 'Gestionar materias académicas'
      },
      {
        title: 'Grados de Estudio',
        icon: 'class',
        route: '/app/grado-estudio',
        color: 'primary',
        roles: ['Administrador'],
        description: 'Gestionar grados y niveles'
      },
      {
        title: 'Calificaciones',
        icon: 'grade',
        route: '/app/calificaciones',
        color: 'accent',
        roles: ['Administrador', 'Docente'],
        description: 'Gestionar calificaciones'
      },
      {
        title: 'Períodos',
        icon: 'event',
        route: '/app/periodos',
        color: 'warn',
        roles: ['Administrador'],
        description: 'Gestionar períodos académicos'
      },
      {
        title: 'Institución',
        icon: 'business',
        route: '/app/institucion',
        color: 'primary',
        roles: ['Administrador'],
        description: 'Información de la institución'
      }
    ];

    this.dashboardCards = baseCards.filter(card =>
      card.roles.includes(this.currentUser!.rol)
    );
  }

  private setupQuickStats() {
    if (!this.currentUser) return;

    if (this.currentUser.rol === 'Administrador') {
      this.quickStats = [
        { label: 'Estudiantes', value: 0, icon: 'school', color: 'primary' },
        { label: 'Docentes', value: 0, icon: 'people', color: 'accent' },
        { label: 'Grados', value: 0, icon: 'class', color: 'warn' },
        { label: 'Materias', value: 0, icon: 'book', color: 'primary' }
      ];
    } else if (this.currentUser.rol === 'Docente') {
      this.quickStats = [
        { label: 'Mis Estudiantes', value: 0, icon: 'school', color: 'primary' },
        { label: 'Mis Materias', value: 0, icon: 'book', color: 'accent' },
        { label: 'Calificaciones Pendientes', value: 0, icon: 'grade', color: 'warn' },
        { label: 'Período Actual', value: 'Activo', icon: 'event', color: 'primary' }
      ];
    } else if (this.currentUser.rol === 'Estudiante') {
      this.quickStats = [
        { label: 'Mi Grado', value: 'N/A', icon: 'class', color: 'primary' },
        { label: 'Mis Materias', value: 0, icon: 'book', color: 'accent' },
        { label: 'Promedio General', value: 'N/A', icon: 'grade', color: 'warn' },
        { label: 'Período Actual', value: 'Activo', icon: 'event', color: 'primary' }
      ];
    }
  }

  private setupRecentActivities() {
    if (!this.currentUser) return;

    if (this.currentUser.rol === 'Administrador') {
      this.recentActivities = [
        { action: 'Nuevo estudiante registrado', time: 'Hace 2 horas', icon: 'person_add' },
        { action: 'Calificaciones actualizadas', time: 'Hace 4 horas', icon: 'grade' },
        { action: 'Personal agregado', time: 'Ayer', icon: 'group_add' }
      ];
    } else if (this.currentUser.rol === 'Docente') {
      this.recentActivities = [
        { action: 'Calificaciones ingresadas', time: 'Hace 1 hora', icon: 'grade' },
        { action: 'Nueva materia asignada', time: 'Hace 3 horas', icon: 'book' },
        { action: 'Reunión programada', time: 'Mañana', icon: 'event' }
      ];
    } else if (this.currentUser.rol === 'Estudiante') {
      this.recentActivities = [
        { action: 'Nueva calificación recibida', time: 'Hace 2 horas', icon: 'grade' },
        { action: 'Materia actualizada', time: 'Ayer', icon: 'book' },
        { action: 'Período iniciado', time: 'Hace 1 semana', icon: 'event' }
      ];
    }
  }

  getDashboardTitle(): string {
    if (!this.currentUser) return 'Dashboard';

    switch (this.currentUser.rol) {
      case 'Administrador':
        return 'Panel de Administración';
      case 'Docente':
        return 'Panel del Docente';
      case 'Estudiante':
        return 'Mi Panel de Estudiante';
      default:
        return 'Dashboard';
    }
  }

  getDashboardSubtitle(): string {
    if (!this.currentUser) return 'Gestión de la Plataforma Educativa';

    switch (this.currentUser.rol) {
      case 'Administrador':
        return 'Gestiona toda la plataforma educativa';
      case 'Docente':
        return 'Gestiona tus clases y estudiantes';
      case 'Estudiante':
        return 'Consulta tu información académica';
      default:
        return 'Gestión de la Plataforma Educativa';
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  // Funciones específicas para Administrador
  getAdminFunctions() {
    return [
      {
        title: 'Gestión de Usuarios',
        description: 'Administrar usuarios del sistema',
        action: () => console.log('Gestión de usuarios')
      },
      {
        title: 'Reportes del Sistema',
        description: 'Generar reportes estadísticos',
        action: () => console.log('Generar reportes')
      },
      {
        title: 'Configuración',
        description: 'Configurar parámetros del sistema',
        action: () => console.log('Configuración')
      }
    ];
  }

  // Funciones específicas para Docente
  getTeacherFunctions() {
    return [
      {
        title: 'Mis Clases',
        description: 'Ver y gestionar mis clases asignadas',
        action: () => console.log('Mis clases')
      },
      {
        title: 'Registrar Asistencia',
        description: 'Registrar asistencia de estudiantes',
        action: () => console.log('Registrar asistencia')
      },
      {
        title: 'Planificación',
        description: 'Planificar actividades académicas',
        action: () => console.log('Planificación')
      }
    ];
  }

  // Funciones específicas para Estudiante
  getStudentFunctions() {
    return [
      {
        title: 'Mis Calificaciones',
        description: 'Ver mis calificaciones por materia',
        action: () => console.log('Mis calificaciones')
      },
      {
        title: 'Mi Horario',
        description: 'Consultar mi horario de clases',
        action: () => console.log('Mi horario')
      },
      {
        title: 'Mis Asignaciones',
        description: 'Ver tareas y asignaciones pendientes',
        action: () => console.log('Mis asignaciones')
      }
    ];
  }

  // Función para obtener funciones específicas según el rol
  getRoleSpecificFunctions() {
    if (!this.currentUser) return [];

    switch (this.currentUser.rol) {
      case 'Administrador':
        return this.getAdminFunctions();
      case 'Docente':
        return this.getTeacherFunctions();
      case 'Estudiante':
        return this.getStudentFunctions();
      default:
        return [];
    }
  }

  // Función para obtener estadísticas específicas según el rol
  getRoleSpecificStats() {
    if (!this.currentUser) return [];

    switch (this.currentUser.rol) {
      case 'Administrador':
        return [
          { label: 'Total Estudiantes', value: 0, trend: '+5%' },
          { label: 'Total Docentes', value: 0, trend: '+2%' },
          { label: 'Grados Activos', value: 0, trend: '0%' },
          { label: 'Materias Registradas', value: 0, trend: '+3%' }
        ];
      case 'Docente':
        return [
          { label: 'Estudiantes Asignados', value: 0, trend: '0%' },
          { label: 'Materias Impartidas', value: 0, trend: '0%' },
          { label: 'Calificaciones Pendientes', value: 0, trend: '-10%' },
          { label: 'Horas Impartidas', value: 0, trend: '+15%' }
        ];
      case 'Estudiante':
        return [
          { label: 'Promedio General', value: 'N/A', trend: '0%' },
          { label: 'Materias Inscritas', value: 0, trend: '0%' },
          { label: 'Asistencia', value: '95%', trend: '+2%' },
          { label: 'Tareas Pendientes', value: 0, trend: '-5%' }
        ];
      default:
        return [];
    }
  }
}
