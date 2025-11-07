import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Grado {
  id: number;
  nombre: string;
  descripcion?: string;
  institucion?: number;
  institucion_nombre?: string;
}

@Injectable({
  providedIn: 'root'
})
export class GradosService {
  // Usar URL absoluta para evitar problemas con el router de Angular
  private apiUrl = 'http://localhost:8000/api/grados/';

  constructor(private http: HttpClient) { 
    console.log('GradosService - apiUrl:', this.apiUrl);
  }

  // Obtener todos los grados
  getGrados(): Observable<Grado[]> {
    console.log('GradosService - Obteniendo grados desde:', this.apiUrl);
    // La API devuelve datos paginados, necesitamos extraer el array 'results'
    return this.http.get<{results: Grado[], count: number, next: string | null, previous: string | null}>(this.apiUrl)
      .pipe(
        map(response => {
          console.log('GradosService - Respuesta recibida:', response);
          return response.results || [];
        })
      );
  }

  // Obtener grado por ID
  getGrado(id: number): Observable<Grado> {
    return this.http.get<Grado>(`${this.apiUrl}${id}/`);
  }

  // Crear nuevo grado
  createGrado(grado: Partial<Grado>): Observable<Grado> {
    return this.http.post<Grado>(this.apiUrl, grado);
  }

  // Actualizar grado
  updateGrado(id: number, grado: Partial<Grado>): Observable<Grado> {
    return this.http.put<Grado>(`${this.apiUrl}${id}/`, grado);
  }

  // Eliminar grado
  deleteGrado(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }
}

