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
import { GradosService, Grado } from '../../services/grados';
import { InstitucionService } from '../../services/institucion';
import { Institucion } from '../../models/institucion.interface';

@Component({
  selector: 'app-grado-estudio',
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
  templateUrl: './grado-estudio.html',
  styleUrl: './grado-estudio.scss'
})
export class GradoEstudioComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nombre', 'descripcion', 'institucion', 'acciones'];
  grados: Grado[] = [];
  instituciones: Institucion[] = [];
  mostrarFormulario: boolean = false;
  nuevoGrado: Partial<Grado> = {
    nombre: '',
    descripcion: '',
    institucion: undefined
  };

  constructor(
    private gradosService: GradosService,
    private institucionService: InstitucionService
  ) {}

  ngOnInit() {
    this.loadGrados();
    this.loadInstituciones();
  }

  loadInstituciones() {
    this.institucionService.getInstituciones().subscribe({
      next: (data) => {
        this.instituciones = data;
      },
      error: (error) => {
        console.error('Error al cargar instituciones:', error);
        this.instituciones = [];
      }
    });
  }

  loadGrados() {
    this.gradosService.getGrados().subscribe({
      next: (data) => {
        this.grados = data;
      },
      error: (error) => {
        console.error('Error al cargar grados:', error);
        this.grados = [];
      }
    });
  }

  agregarGrado() {
    this.mostrarFormulario = true;
    this.nuevoGrado = {
      nombre: '',
      descripcion: '',
      institucion: undefined
    };
  }

  guardarGrado() {
    if (!this.nuevoGrado.nombre || !this.nuevoGrado.institucion) {
      alert('Por favor complete los campos requeridos: Nombre e Institución');
      return;
    }

    const gradoData: any = {
      nombre: this.nuevoGrado.nombre.trim(),
      institucion: this.nuevoGrado.institucion
    };

    if (this.nuevoGrado.descripcion && this.nuevoGrado.descripcion.trim()) {
      gradoData.descripcion = this.nuevoGrado.descripcion.trim();
    }

    this.gradosService.createGrado(gradoData).subscribe({
      next: (response) => {
        console.log('Grado creado exitosamente:', response);
        this.mostrarFormulario = false;
        this.loadGrados();
        alert('Grado creado exitosamente');
      },
      error: (error) => {
        console.error('Error al crear grado:', error);
        let errorMessage = 'Error desconocido';
        if (error.error?.detail) {
          if (typeof error.error.detail === 'object') {
            const errors = Object.keys(error.error.detail).map(key => {
              const value = error.error.detail[key];
              return `${key}: ${Array.isArray(value) ? value.join(', ') : value}`;
            });
            errorMessage = errors.join('\n');
          } else {
            errorMessage = error.error.detail;
          }
        } else if (error.error?.error) {
          errorMessage = error.error.error;
        }
        alert('Error al crear grado:\n\n' + errorMessage);
      }
    });
  }

  cancelarFormulario() {
    this.mostrarFormulario = false;
  }

  editarGrado(grado: Grado) {
    console.log('Editar grado:', grado);
    // TODO: Implementar modal/dialog para editar grado
    alert('Funcionalidad de edición próximamente');
  }

  eliminarGrado(grado: Grado) {
    if (confirm(`¿Está seguro de eliminar el grado "${grado.nombre}"?`)) {
      this.gradosService.deleteGrado(grado.id).subscribe({
        next: () => {
          this.loadGrados();
          alert('Grado eliminado exitosamente');
        },
        error: (error) => {
          console.error('Error al eliminar grado:', error);
          alert('Error al eliminar grado');
        }
      });
    }
  }
}
