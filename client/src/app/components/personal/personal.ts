import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Personal } from '../../models/personal.interface';
import { PersonalService } from '../../services/personal';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
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
  styleUrl: './personal.scss'
})
export class PersonalComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nombre', 'apellido', 'cedula', 'cargo', 'estado', 'acciones'];
  personal: Personal[] = [];

  constructor(private personalService: PersonalService, private dialog: MatDialog ) {}

  ngOnInit() {
    this.loadPersonal();
  }

  loadPersonal() {
    this.personalService.getAll().subscribe({
      next: (data) => {
        this.personal = data;
      },
      error: (error) => {
        console.error('Error al cargar personal:', error);
      }
    });
  }

  agregarPersonal(): void {
    const ref = this.dialog.open(NuevoPersonalDialogComponent, {
      width: '500px'
    });

    ref.afterClosed().subscribe(nuevo => {
      if (nuevo) this.loadPersonal();   // recarga tabla
    });
  }


  editarPersonal(personal: Personal) {
    console.log('Editar personal:', personal);
    // TODO: Implementar modal/dialog para editar personal
  }

  eliminarPersonal(personal: Personal) {
    if (confirm(`¿Está seguro de eliminar a ${personal.nombre} ${personal.apellido}?`)) {
      this.personalService.delete(personal.id).subscribe({
        next: () => {
          this.loadPersonal();
        },
        error: (error) => {
          console.error('Error al eliminar personal:', error);
        }
      });
    }
  }
}
