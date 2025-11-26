import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Institucion } from '../../models/institucion.interface';
import { InstitucionService } from '../../services/institucion';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NuevoInstitucionBtnComponent } from './nuevo-institucion-btn/nuevo-institucion-btn';

@Component({
  selector: 'app-institucion',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatToolbarModule,
    MatDialogModule
  ],
  templateUrl: './institucion.html',
  styleUrl: './institucion.scss'
})
export class InstitucionComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nombre', 'direccion', 'telefono', 'correo', 'acciones'];
  instituciones: Institucion[] = [];

  constructor(private institucionService: InstitucionService, private dialog: MatDialog) {}

  ngOnInit() {
    this.loadInstitucion();
  }

  loadInstitucion() {
    this.institucionService.getAll().subscribe({
      next: (data: Institucion[] | null) => {
        this.instituciones = data ?? [];
      },
      error: (error: unknown) => {
        console.error('Error al cargar instituciones:', error);
      }
    });
  }
  
  agregarInstitucion(): void {
    const ref = this.dialog.open(NuevoInstitucionBtnComponent, {
      width: '500px'
    });
  
    ref.afterClosed().subscribe((nuevo: Institucion) => {
      if (nuevo) this.loadInstitucion();   // recarga tabla
    });
  }
  
  editarInstitucion(inst: Institucion) {
    console.log('Editar institucion:', inst);
  }
  
  eliminarInstitucion(institucion: Institucion) {
    if (!institucion?.id) return;

    const confirmed = confirm(`¿Está seguro de eliminar a ${institucion.nombre}?`);
    if (!confirmed) return;

    this.institucionService.delete(institucion.id).subscribe({
      next: () => {
        this.loadInstitucion();
      },
      error: (error: unknown) => {
        console.error('Error al eliminar institucion:', error);
      }
    });
  }
}
