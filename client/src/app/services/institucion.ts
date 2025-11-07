import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Institucion } from '../models/institucion.interface';

@Injectable({
  providedIn: 'root'
})
export class InstitucionService {
  private apiUrl = 'http://localhost:8000/api/instituciones/';

  constructor(private http: HttpClient) {}

  // Obtener todas las instituciones
  getInstituciones(): Observable<Institucion[]> {
    return this.http.get<{results: Institucion[], count: number, next: string | null, previous: string | null}>(this.apiUrl)
      .pipe(
        map(response => response.results || [])
      );
  }

  // Obtener institución por ID
  getInstitucion(id: number): Observable<Institucion> {
    return this.http.get<Institucion>(`${this.apiUrl}${id}/`);
  }

  // Crear nueva institución
  createInstitucion(institucion: Partial<Institucion>): Observable<Institucion> {
    return this.http.post<Institucion>(this.apiUrl, institucion);
  }

  // Actualizar institución
  updateInstitucion(id: number, institucion: Partial<Institucion>): Observable<Institucion> {
    return this.http.put<Institucion>(`${this.apiUrl}${id}/`, institucion);
  }

  // Eliminar institución
  deleteInstitucion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }
}
