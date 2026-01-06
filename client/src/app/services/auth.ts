import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Usuario, LoginRequest, LoginResponse } from '../models/usuario.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // API endpoints for Django backend authentication
  private readonly loginUrl = 'http://localhost:8000/api/auth/login/';
  private readonly registerUrl = 'http://localhost:8000/api/auth/register/';

  private readonly currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  public readonly currentUser$ = this.currentUserSubject.asObservable();

  constructor(private readonly http: HttpClient) {
    // Restaurar sesión desde localStorage al iniciar
    this.loadUserFromStorage();
  }

  // Cargar usuario/token desde localStorage (si existen)
  private loadUserFromStorage(): void {
    if (globalThis.window === undefined) return;

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

  // Login with Django backend - returns LoginResponse with usuario object
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<any>(this.loginUrl, credentials).pipe(
      map(response => {
        // Build Usuario object from Django response
        // Note: 'rol' comes from response.user.rol (added by AuthViewSet in school/api/views.py)
        const user: Usuario = {
          id: response.user.id,
          username: response.user.username,
          email: response.user.email,
          /**
           * IMPORTANT: The 'rol' property comes from within the 'user' object.
           * 
           * Original Error: "Cannot read properties of undefined (reading 'rol')"
           * Cause: tap() was used instead of map(), so the transformed response wasn't returned.
           * Fix: Changed to map() to return the LoginResponse with usuario.rol.
           * 
           * Educational System Roles:
           * - 'Administrador': is_superuser = True (full system access)
           * - 'Docente': is_staff = True (teacher access)
           * - 'Estudiante': regular user (student access)
           */
          rol: response.user.rol || 'Usuario',
          token: response.token || response.access
        };

        const loginResponse: LoginResponse = {
          token: response.token || response.access,
          refreshToken: response.refresh,
          usuario: user,
          expiresIn: 3600
        };

        // Save auth data and update current user subject
        this.saveAuthData(loginResponse);
        this.currentUserSubject.next(user);

        // Return the transformed response so login.ts receives usuario.rol
        return loginResponse;
      }),
      catchError(error => {
        console.error('Login error:', error);
        return throwError(() => new Error(error.error?.detail || error.error?.error || 'Error en autenticación'));
      })
    );
  }

  // Register new user with Django backend
  registerUser(userData: { username: string; email: string; password: string }): Observable<any> {
    return this.http.post<any>(this.registerUrl, userData).pipe(
      tap(() => {
        // Auto-login after registration can be implemented here if needed
      }),
      catchError(error => {
        console.error('Register error:', error);
        const msg = error.error?.error || error.error?.username || 'Error al registrar usuario';
        return throwError(() => new Error(msg));
      })
    );
  }

  // Logout: clears all stored auth data
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
    if (globalThis.window === undefined) {
      return null;
    }
    return localStorage.getItem('token');
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
    if (globalThis.window === undefined) return;

    localStorage.setItem('token', loginResponse.token);
    // Guarda el refreshToken si lo usas (ej: para renovar sesión)
    if (loginResponse.refreshToken) {
      localStorage.setItem('refreshToken', loginResponse.refreshToken);
    }
    localStorage.setItem('currentUser', JSON.stringify(loginResponse.usuario));
  }

  private clearStorage(): void {
    if (globalThis.window === undefined) return;

    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser');
  }
}