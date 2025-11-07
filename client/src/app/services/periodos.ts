import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Periodo } from '../models/periodo.interface';

@Injectable({
  providedIn: 'root'
})
export class PeriodosService {
  private apiUrl = 'http://localhost:8000/api/periodos/';

  constructor(private http: HttpClient) {}

  // Obtener todos los períodos
  getPeriodos(): Observable<Periodo[]> {
    return this.http.get<{results: Periodo[], count: number, next: string | null, previous: string | null}>(this.apiUrl)
      .pipe(
        map(response => {
          const periodos = response.results || [];
          // Convertir fechas de string a Date
          return periodos.map(p => ({
            ...p,
            fechaInicio: p.fechaInicio ? new Date(p.fechaInicio) : new Date(),
            fechaFin: p.fechaFin ? new Date(p.fechaFin) : new Date()
          }));
        })
      );
  }

  // Obtener período por ID
  getPeriodo(id: number): Observable<Periodo> {
    return this.http.get<Periodo>(`${this.apiUrl}${id}/`).pipe(
      map(p => ({
        ...p,
        fechaInicio: p.fechaInicio ? new Date(p.fechaInicio) : new Date(),
        fechaFin: p.fechaFin ? new Date(p.fechaFin) : new Date()
      }))
    );
  }

  // Crear nuevo período
  createPeriodo(periodo: Partial<Periodo>): Observable<Periodo> {
    const data: any = {
      nombre: periodo.nombre,
      fecha_inicio: periodo.fechaInicio ? this.formatDate(periodo.fechaInicio) : null,
      fecha_fin: periodo.fechaFin ? this.formatDate(periodo.fechaFin) : null
    };
    return this.http.post<Periodo>(this.apiUrl, data);
  }

  // Actualizar período
  updatePeriodo(id: number, periodo: Partial<Periodo>): Observable<Periodo> {
    const data: any = {
      nombre: periodo.nombre,
      fecha_inicio: periodo.fechaInicio ? this.formatDate(periodo.fechaInicio) : null,
      fecha_fin: periodo.fechaFin ? this.formatDate(periodo.fechaFin) : null
    };
    return this.http.put<Periodo>(`${this.apiUrl}${id}/`, data);
  }

  // Eliminar período
  deletePeriodo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }

  private formatDate(date: Date | string): string {
    if (typeof date === 'string') {
      return date.split('T')[0];
    }
    return date.toISOString().split('T')[0];
  }
}
