import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { InstitucionService } from '../../../services/institucion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-nuevo-institucion-btn',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './nuevo-institucion-btn.html',
  styleUrls: ['./nuevo-institucion-btn.html']
})
export class NuevoInstitucionBtnComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private institucionService: InstitucionService,
    public dialogRef: MatDialogRef<NuevoInstitucionBtnComponent>
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      direccion: [''],
      telefono: [''],
      email: ['']
    });
  }

  guardar(): void {
    if (this.form.invalid) return;
    this.institucionService.createInstitucion(this.form.value).subscribe({
      next: (res) => this.dialogRef.close(res),
      error: (err) => alert('Error al crear: ' + JSON.stringify(err.error))
    });
  }

  cancelar(): void {
    this.dialogRef.close();
  }

  get nombre() {
    return this.form.get('nombre');
  }
}
