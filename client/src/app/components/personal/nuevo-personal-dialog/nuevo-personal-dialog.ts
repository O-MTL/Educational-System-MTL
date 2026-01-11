import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PersonalService } from '../../../services/personal';
import { Personal } from '../../../models/personal.interface';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatDatepicker } from '@angular/material/datepicker';

@Component({
  selector: 'app-nuevo-personal-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatDatepicker,
    MatNativeDateModule,
    MatButtonModule
  ],
  templateUrl: './nuevo-personal-dialog.html',
  styleUrls: ['./nuevo-personal-dialog.scss']
})
export class NuevoPersonalDialogComponent implements OnInit {
  form!: FormGroup;
  esEdicion: boolean;

  @ViewChild('picker') picker!: MatDatepicker<Date>;

  constructor(
    private fb: FormBuilder,
    private personalService: PersonalService,
    public dialogRef: MatDialogRef<NuevoPersonalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Personal | null
  ) {
    this.esEdicion = !!this.data;
  }

  openPicker() {
    if (this.picker) {
      this.picker.open(); // 👈 Método para abrir manualmente el picker
    }
  }

  
  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      cedula: ['', Validators.required],
      cargo: ['', Validators.required],
      estado: ['estado-activo', Validators.required],
      fecha_ingreso: [new Date(), Validators.required],
      email: [''],
      telefono: ['']
    });

    if (this.esEdicion) this.form.patchValue(this.data!);
  }

  

  guardar(): void {
    if (this.form.invalid) return;

     // Convertimos la fecha al formato YYYY-MM-DD
     const formValues = { ...this.form.value };
     if (formValues.fecha_ingreso instanceof Date) {
       const formattedDate = formValues.fecha_ingreso.toISOString().split('T')[0]; // YYYY-MM-DD
       formValues.fecha_ingreso = formattedDate;
     }

    const payload: Personal = { ...this.form.value, id: this.data?.id };

    const req$ = this.esEdicion
      ? this.personalService.update(this.data!.id, payload)
      : this.personalService.create(payload);

    req$.subscribe({
      next: res => this.dialogRef.close(res),
      error: err => alert('Error: ' + JSON.stringify(err.error))
    });
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}