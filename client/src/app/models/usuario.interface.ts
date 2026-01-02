export interface Usuario {
    id: number;
    username: string;
    email: string;
    rol: 'Administrador' | 'Docente' | 'Estudiante' | 'Personal';
    token: string;
    password?: string;
    personalId?: number;    // Referencia al personal si es docente/administrativo/obrero
    estudianteId?: number;  // Referencia al estudiante si es estudiante
    estado?: boolean;
    ultimoAcceso?: Date;
    fechaCreacion?: Date;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    usuario: Usuario;
    expiresIn: number;
    refreshToken?: string; // Token de refresco opcional para JWT
}
