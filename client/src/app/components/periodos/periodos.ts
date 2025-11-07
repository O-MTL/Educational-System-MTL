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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { PeriodosService } from '../../services/periodos';
import { Periodo } from '../../models/periodo.interface';

@Component({
  selector: 'app-periodos',
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
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './periodos.html',
  styleUrl: './periodos.scss'
})
export class PeriodosComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nombre', 'fechaInicio', 'fechaFin', 'acciones'];
  periodos: Periodo[] = [];
  mostrarFormulario: boolean = false;
  nuevoPeriodo: Partial<Periodo> = {
    nombre: '',
    fechaInicio: new Date(),
    fechaFin: new Date()
  };

  constructor(private periodosService: PeriodosService) {}

  ngOnInit() {
    this.loadPeriodos();
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

  agregarPeriodo() {
    this.mostrarFormulario = true;
    this.nuevoPeriodo = {
      nombre: '',
      fechaInicio: new Date(),
      fechaFin: new Date()
    };
  }

  guardarPeriodo() {
    if (!this.nuevoPeriodo.nombre || !this.nuevoPeriodo.fechaInicio || !this.nuevoPeriodo.fechaFin) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }

    const periodoData: any = {
      nombre: this.nuevoPeriodo.nombre.trim(),
      fechaInicio: this.nuevoPeriodo.fechaInicio,
      fechaFin: this.nuevoPeriodo.fechaFin
    };

    this.periodosService.createPeriodo(periodoData).subscribe({
      next: (response) => {
        console.log('Período creado exitosamente:', response);
        this.mostrarFormulario = false;
        this.loadPeriodos();
        alert('Período creado exitosamente');
      },
      error: (error) => {
        console.error('Error al crear período:', error);
        alert('Error al crear período');
      }
    });
  }

  cancelarFormulario() {
    this.mostrarFormulario = false;
  }

  editarPeriodo(periodo: Periodo) {
    console.log('Editar período:', periodo);
    alert('Funcionalidad de edición próximamente');
  }

  eliminarPeriodo(periodo: Periodo) {
    if (confirm(`¿Está seguro de eliminar el período "${periodo.nombre}"?`)) {
      this.periodosService.deletePeriodo(periodo.id).subscribe({
        next: () => {
          this.loadPeriodos();
          alert('Período eliminado exitosamente');
        },
        error: (error) => {
          console.error('Error al eliminar período:', error);
          alert('Error al eliminar período');
        }
      });
    }
  }

  formatDate(date: Date | string): string {
    if (!date) return '-';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('es-ES');
  }
}
