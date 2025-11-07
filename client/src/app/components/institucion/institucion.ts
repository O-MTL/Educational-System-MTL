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
import { InstitucionService } from '../../services/institucion';
import { Institucion } from '../../models/institucion.interface';

@Component({
  selector: 'app-institucion',
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './institucion.html',
  styleUrl: './institucion.scss'
})
export class InstitucionComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nombre', 'direccion', 'telefono', 'correo', 'acciones'];
  instituciones: Institucion[] = [];
  mostrarFormulario: boolean = false;
  nuevaInstitucion: Partial<Institucion> = {
    nombre: '',
    direccion: '',
    telefono: '',
    email: ''
  };

  constructor(private institucionService: InstitucionService) {}

  ngOnInit() {
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

  agregarInstitucion() {
    this.mostrarFormulario = true;
    this.nuevaInstitucion = {
      nombre: '',
      direccion: '',
      telefono: '',
      email: ''
    };
  }

  guardarInstitucion() {
    if (!this.nuevaInstitucion.nombre || !this.nuevaInstitucion.direccion) {
      alert('Por favor complete los campos requeridos: Nombre y Dirección');
      return;
    }

    const institucionData: any = {
      nombre: this.nuevaInstitucion.nombre.trim(),
      direccion: this.nuevaInstitucion.direccion.trim()
    };

    if (this.nuevaInstitucion.telefono && this.nuevaInstitucion.telefono.trim()) {
      institucionData.telefono = this.nuevaInstitucion.telefono.trim();
    }

    if (this.nuevaInstitucion.email && this.nuevaInstitucion.email.trim()) {
      institucionData.correo = this.nuevaInstitucion.email.trim();
    }

    this.institucionService.createInstitucion(institucionData).subscribe({
      next: (response) => {
        console.log('Institución creada exitosamente:', response);
        this.mostrarFormulario = false;
        this.loadInstituciones();
        alert('Institución creada exitosamente');
      },
      error: (error) => {
        console.error('Error al crear institución:', error);
        alert('Error al crear institución');
      }
    });
  }

  cancelarFormulario() {
    this.mostrarFormulario = false;
  }

  editarInstitucion(institucion: Institucion) {
    console.log('Editar institución:', institucion);
    alert('Funcionalidad de edición próximamente');
  }

  eliminarInstitucion(institucion: Institucion) {
    if (confirm(`¿Está seguro de eliminar la institución "${institucion.nombre}"?`)) {
      this.institucionService.deleteInstitucion(institucion.id).subscribe({
        next: () => {
          this.loadInstituciones();
          alert('Institución eliminada exitosamente');
        },
        error: (error) => {
          console.error('Error al eliminar institución:', error);
          alert('Error al eliminar institución');
        }
      });
    }
  }
}
