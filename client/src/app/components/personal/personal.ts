import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Personal } from '../../models/personal.interface';
import { PersonalService } from '../../services/personal';
import { NuevoPersonalDialogComponent } from './nuevo-personal-dialog/nuevo-personal-dialog';

@Component({
  selector: 'app-personal',
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
  templateUrl: './personal.html',
  styleUrls: ['./personal.scss']
})
export class PersonalComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nombre', 'apellido', 'cedula', 'cargo', 'fecha_ingreso', 'estado', 'acciones'];
  personal: Personal[] = [];

  constructor(private personalService: PersonalService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadPersonal();
  }

  private loadPersonal(): void {
    this.personalService.getAll().subscribe({
      next: data => this.personal = data ?? [],
      error: err => console.error('Error al cargar personal', err)
    });
  }

  agregarPersonal(): void {
    const ref = this.dialog.open(NuevoPersonalDialogComponent, { width: '500px' });
    ref.afterClosed().subscribe(res => {
      if (res) this.loadPersonal();
    });
  }

  editarPersonal(p: Personal): void {
    const ref = this.dialog.open(NuevoPersonalDialogComponent, {
      width: '500px',
      data: p
    });
    ref.afterClosed().subscribe(res => {
      if (res) this.loadPersonal();
    });
  }

  eliminarPersonal(p: Personal): void {
    if (!p?.id) return;
    const ok = confirm(`¿Eliminar a ${p.nombre} ${p.apellido}?`);
    if (!ok) return;
    this.personalService.delete(p.id).subscribe({
      next: () => this.loadPersonal(),
      error: err => console.error('Error al eliminar', err)
    });
  }


  // Métodos para mostrar estado
  getEstadoTexto(estado: string): string {
    switch (estado) {
      case 'estado-activo':
        return 'Activo';
      case 'estado-inactivo':
        return 'Inactivo';
      case 'estado-baja':
        return 'Baja Temporal';
      default:
        return 'Desconocido';
    }
  }

  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'estado-activo':
        return 'estado-activo';
      case 'estado-inactivo':
        return 'estado-inactivo';
      case 'estado-baja':
        return 'estado-baja';
      default:
        return '';
    }
  }


}