import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Materia } from '../models/materia.interface';

@Injectable({
  providedIn: 'root'
})
export class MateriasService {
  private apiUrl = 'http://localhost:8000/api/materias/';

  constructor(private http: HttpClient) {}

  // Obtener todas las materias
  getMaterias(): Observable<Materia[]> {
    return this.http.get<{results: Materia[], count: number, next: string | null, previous: string | null}>(this.apiUrl)
      .pipe(
        map(response => response.results || [])
      );
  }

  // Obtener materia por ID
  getMateria(id: number): Observable<Materia> {
    return this.http.get<Materia>(`${this.apiUrl}${id}/`);
  }

  // Crear nueva materia
  createMateria(materia: Partial<Materia>): Observable<Materia> {
    return this.http.post<Materia>(this.apiUrl, materia);
  }

  // Actualizar materia
  updateMateria(id: number, materia: Partial<Materia>): Observable<Materia> {
    return this.http.put<Materia>(`${this.apiUrl}${id}/`, materia);
  }

  // Eliminar materia
  deleteMateria(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }
}
