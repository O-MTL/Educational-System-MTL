import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Calificacion } from '../models/calificacion.interface';

@Injectable({
  providedIn: 'root'
})
export class CalificacionesService {
  private apiUrl = 'http://localhost:8000/api/calificaciones/';

  constructor(private http: HttpClient) {}

  // Obtener todas las calificaciones
  getCalificaciones(): Observable<Calificacion[]> {
    return this.http.get<{results: Calificacion[], count: number, next: string | null, previous: string | null}>(this.apiUrl)
      .pipe(
        map(response => response.results || [])
      );
  }

  // Obtener calificación por ID
  getCalificacion(id: number): Observable<Calificacion> {
    return this.http.get<Calificacion>(`${this.apiUrl}${id}/`);
  }

  // Crear nueva calificación
  createCalificacion(calificacion: Partial<Calificacion>): Observable<Calificacion> {
    const data: any = {
      alumno: calificacion.estudianteId,
      materia: calificacion.materiaId,
      periodo: calificacion.periodoId,
      calificacion: calificacion.nota
    };
    return this.http.post<Calificacion>(this.apiUrl, data);
  }

  // Actualizar calificación
  updateCalificacion(id: number, calificacion: Partial<Calificacion>): Observable<Calificacion> {
    const data: any = {
      alumno: calificacion.estudianteId,
      materia: calificacion.materiaId,
      periodo: calificacion.periodoId,
      calificacion: calificacion.nota
    };
    return this.http.put<Calificacion>(`${this.apiUrl}${id}/`, data);
  }

  // Eliminar calificación
  deleteCalificacion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }
}
