import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Usuario, LoginRequest, LoginResponse } from '../models/usuario.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // ✅ Corregido: usa los endpoints reales de Django
  private loginUrl = 'http://localhost:8000/api/auth/login/';
  private registerUrl = 'http://localhost:8000/api/auth/register/';
  // Nota: change-password no está implementado aún en Django

  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Restaurar sesión desde localStorage al iniciar
    this.loadUserFromStorage();
  }

  // Cargar usuario/token desde localStorage (si existen)
  private loadUserFromStorage(): void {
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('currentUser');

    if (token && savedUser) {
      try {
        const user = JSON.parse(savedUser);
        this.currentUserSubject.next(user);
      } catch (e) {
        console.warn('Datos de usuario corruptos en localStorage', e);
        this.clearStorage();
      }
    }
  }

  // ✅ Login real con Django + JWT (SimpleJWT)
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<any>(this.loginUrl, credentials).pipe(
      tap(response => {
        // La respuesta de SimpleJWT es:
        // { refresh: '...', access: '...', user: { id, username, email } }
        const user: Usuario = {
          id: response.user.id,
          username: response.user.username,
          email: response.user.email,
          // ⚠️ rol no viene por defecto de `User`; lo tendrás que agregar en Django
          rol: response.user.rol || 'Usuario', // provisional
          token: response.access // Token JWT requerido por el tipo Usuario
        };

        const loginResponse: LoginResponse = {
          token: response.access, // JWT de acceso
          refreshToken: response.refresh, // opcional: para renovar token
          usuario: user,
          expiresIn: 3600 // 1h típico de SimpleJWT (puedes calcularlo del token si quieres)
        };

        this.saveAuthData(loginResponse);
        this.currentUserSubject.next(user);
      }),
      catchError(error => {
        console.error('Login error:', error);
        return throwError(() => new Error(error.error?.detail || 'Error en autenticación'));
      })
    );
  }

  // ✅ Registro real
  registerUser(userData: { username: string; email: string; password: string }): Observable<any> {
    return this.http.post<any>(this.registerUrl, userData).pipe(
      tap(response => {
        // Opcional: loguear automáticamente tras registro
        // this.saveAuthData({...})
      }),
      catchError(error => {
        console.error('Register error:', error);
        const msg = error.error?.error || error.error?.username || 'Error al registrar usuario';
        return throwError(() => new Error(msg));
      })
    );
  }

  // ✅ Logout: limpia todo
  logout(): void {
    this.clearStorage();
    this.currentUserSubject.next(null);
  }

  // ✅ Helpers de autenticación (sin cambios — ya estaban bien)
  getCurrentUser(): Usuario | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.getCurrentUser() && !!this.getToken();
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user ? user.rol === role : false;
  }

  hasAnyRole(roles: string[]): boolean {
    const user = this.getCurrentUser();
    return user ? roles.includes(user.rol) : false;
  }

  getToken(): string | null {
    return typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  }

  // ✅ Obtener encabezados con token (útil para interceptores)
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    });
  }

  // ❗ changePassword no está implementado aún en Django → comentado hasta que lo agregues
  /*
  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/change-password`, {
      oldPassword,
      newPassword
    }, { headers: this.getAuthHeaders() }).pipe(
      catchError(error => {
        console.error('Change password error:', error);
        return throwError(() => new Error('Error al cambiar contraseña'));
      })
    );
  }
  */

  // 👇 Métodos auxiliares privados

  private saveAuthData(loginResponse: LoginResponse): void {
    if (typeof window === 'undefined') return;

    localStorage.setItem('token', loginResponse.token);
    // Guarda el refreshToken si lo usas (ej: para renovar sesión)
    if (loginResponse.refreshToken) {
      localStorage.setItem('refreshToken', loginResponse.refreshToken);
    }
    localStorage.setItem('currentUser', JSON.stringify(loginResponse.usuario));
  }

  private clearStorage(): void {
    if (typeof window === 'undefined') return;

    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser');
  }
}