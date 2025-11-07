import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CalificacionesService } from '../../services/calificaciones';
import { EstudiantesService } from '../../services/estudiantes';
import { MateriasService } from '../../services/materias';
import { PeriodosService } from '../../services/periodos';
import { Calificacion } from '../../models/calificacion.interface';
import { Estudiante } from '../../models/estudiante.interface';
import { Materia } from '../../models/materia.interface';
import { Periodo } from '../../models/periodo.interface';

@Component({
  selector: 'app-calificaciones',
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './calificaciones.html',
  styleUrl: './calificaciones.scss'
})
export class CalificacionesComponent implements OnInit {
  displayedColumns: string[] = ['id', 'estudiante', 'materia', 'periodo', 'nota', 'acciones'];
  calificaciones: any[] = [];
  estudiantes: Estudiante[] = [];
  materias: Materia[] = [];
  periodos: Periodo[] = [];
  mostrarFormulario: boolean = false;
  nuevaCalificacion: Partial<Calificacion> = {
    estudianteId: 0,
    materiaId: 0,
    periodoId: 0,
    nota: 0
  };

  constructor(
    private calificacionesService: CalificacionesService,
    private estudiantesService: EstudiantesService,
    private materiasService: MateriasService,
    private periodosService: PeriodosService
  ) {}

  ngOnInit() {
    this.loadCalificaciones();
    this.loadEstudiantes();
    this.loadMaterias();
    this.loadPeriodos();
  }

  loadEstudiantes() {
    this.estudiantesService.getEstudiantes().subscribe({
      next: (data) => {
        this.estudiantes = data;
      },
      error: (error) => {
        console.error('Error al cargar estudiantes:', error);
        this.estudiantes = [];
      }
    });
  }

  loadMaterias() {
    this.materiasService.getMaterias().subscribe({
      next: (data) => {
        this.materias = data;
      },
      error: (error) => {
        console.error('Error al cargar materias:', error);
        this.materias = [];
      }
    });
  }

  loadPeriodos() {
    this.periodosService.getPeriodos().subscribe({
      next: (data) => {
        this.periodos = data;
      },
      error: (error) => {
        console.error('Error al cargar períodos:', error);
        this.periodos = [];
      }
    });
  }

  loadCalificaciones() {
    this.calificacionesService.getCalificaciones().subscribe({
      next: (data) => {
        this.calificaciones = data;
      },
      error: (error) => {
        console.error('Error al cargar calificaciones:', error);
        this.calificaciones = [];
      }
    });
  }

  agregarCalificacion() {
    this.mostrarFormulario = true;
    this.nuevaCalificacion = {
      estudianteId: 0,
      materiaId: 0,
      periodoId: 0,
      nota: 0
    };
  }

  guardarCalificacion() {
    if (!this.nuevaCalificacion.estudianteId || !this.nuevaCalificacion.materiaId || 
        !this.nuevaCalificacion.periodoId || !this.nuevaCalificacion.nota) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }

    const calificacionData: any = {
      estudianteId: this.nuevaCalificacion.estudianteId,
      materiaId: this.nuevaCalificacion.materiaId,
      periodoId: this.nuevaCalificacion.periodoId,
      nota: this.nuevaCalificacion.nota
    };

    this.calificacionesService.createCalificacion(calificacionData).subscribe({
      next: (response) => {
        console.log('Calificación creada exitosamente:', response);
        this.mostrarFormulario = false;
        this.loadCalificaciones();
        alert('Calificación creada exitosamente');
      },
      error: (error) => {
        console.error('Error al crear calificación:', error);
        alert('Error al crear calificación');
      }
    });
  }

  cancelarFormulario() {
    this.mostrarFormulario = false;
  }

  editarCalificacion(calificacion: Calificacion) {
    console.log('Editar calificación:', calificacion);
    alert('Funcionalidad de edición próximamente');
  }

  eliminarCalificacion(calificacion: Calificacion) {
    if (confirm(`¿Está seguro de eliminar esta calificación?`)) {
      this.calificacionesService.deleteCalificacion(calificacion.id).subscribe({
        next: () => {
          this.loadCalificaciones();
          alert('Calificación eliminada exitosamente');
        },
        error: (error) => {
          console.error('Error al eliminar calificación:', error);
          alert('Error al eliminar calificación');
        }
      });
    }
  }

  getNotaClass(nota: number): string {
    if (nota >= 18) return 'nota-excelente';
    if (nota >= 16) return 'nota-buena';
    if (nota >= 13) return 'nota-regular';
    return 'nota-deficiente';
  }
}
