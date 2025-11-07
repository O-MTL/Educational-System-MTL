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
import { MateriasService } from '../../services/materias';
import { GradosService, Grado } from '../../services/grados';
import { Materia } from '../../models/materia.interface';

@Component({
  selector: 'app-materias',
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
  templateUrl: './materias.html',
  styleUrl: './materias.scss'
})
export class MateriasComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nombre', 'descripcion', 'grado', 'acciones'];
  materias: any[] = [];
  grados: Grado[] = [];
  mostrarFormulario: boolean = false;
  nuevaMateria: Partial<Materia> = {
    nombre: '',
    descripcion: '',
    gradoEstudioId: 0
  };

  constructor(
    private materiasService: MateriasService,
    private gradosService: GradosService
  ) {}

  ngOnInit() {
    this.loadMaterias();
    this.loadGrados();
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

  agregarMateria() {
    this.mostrarFormulario = true;
    this.nuevaMateria = {
      nombre: '',
      descripcion: '',
      gradoEstudioId: 0
    };
  }

  guardarMateria() {
    if (!this.nuevaMateria.nombre || !this.nuevaMateria.gradoEstudioId || this.nuevaMateria.gradoEstudioId === 0) {
      alert('Por favor complete los campos requeridos: Nombre y Grado');
      return;
    }

    const materiaData: any = {
      nombre: this.nuevaMateria.nombre.trim(),
      grado: this.nuevaMateria.gradoEstudioId
    };

    if (this.nuevaMateria.descripcion && this.nuevaMateria.descripcion.trim()) {
      materiaData.descripcion = this.nuevaMateria.descripcion.trim();
    }

    this.materiasService.createMateria(materiaData).subscribe({
      next: (response) => {
        console.log('Materia creada exitosamente:', response);
        this.mostrarFormulario = false;
        this.loadMaterias();
        alert('Materia creada exitosamente');
      },
      error: (error) => {
        console.error('Error al crear materia:', error);
        alert('Error al crear materia');
      }
    });
  }

  cancelarFormulario() {
    this.mostrarFormulario = false;
  }

  editarMateria(materia: Materia) {
    console.log('Editar materia:', materia);
    alert('Funcionalidad de edición próximamente');
  }

  eliminarMateria(materia: Materia) {
    if (confirm(`¿Está seguro de eliminar la materia "${materia.nombre}"?`)) {
      this.materiasService.deleteMateria(materia.id).subscribe({
        next: () => {
          this.loadMaterias();
          alert('Materia eliminada exitosamente');
        },
        error: (error) => {
          console.error('Error al eliminar materia:', error);
          alert('Error al eliminar materia');
        }
      });
    }
  }
}
