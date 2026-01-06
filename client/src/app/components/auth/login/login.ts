import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../services/auth';
import { LoginRequest } from '../../../models/usuario.interface';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  error = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.error = '';

      const credentials: LoginRequest = this.loginForm.value;

      this.authService.login(credentials).subscribe({
        next: (response) => {
          this.loading = false;
          // Redirigir según el rol del usuario
          this.redirectByRole(response.usuario.rol);
        },
        error: (error) => {
          this.loading = false;
          this.error = 'Credenciales inválidas. Intente nuevamente.';
          console.error('Error de login:', error);
        }
      });
    }
  }
  /**
   * Redirects user to appropriate route based on their role.
   * Educational System Roles:
   * - Administrador: Full system access (superuser)
   * - Docente: Teacher access (staff member)
   * - Estudiante: Student access (regular user)
   * 
   * Note: Currently all roles redirect to dashboard.
   * Customize routes per role here when different pages are implemented.
   * @param rol - User's role from authentication response (currently unused but kept for future routing)
   */
  private redirectByRole(_rol: string) {
    // All roles currently redirect to dashboard
    // Future: implement role-specific routes (e.g., /app/admin, /app/teacher, /app/student)
    this.router.navigate(['/app/dashboard']);
  }
}
