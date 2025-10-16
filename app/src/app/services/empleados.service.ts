import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Empleado {
  id?: number;
  nombre: string;
  cargo: string;
  salario: number;
  activo: boolean;
}

@Injectable({ providedIn: 'root' })
export class EmpleadosService {
  private apiUrl = 'http://127.0.0.1:8000/employees'; // Ajusta a tu backend

  constructor(private http: HttpClient) {}

  getAll(): Observable<Empleado[]> {
    return this.http.get<Empleado[]>(this.apiUrl);
  }

  create(data: Empleado): Observable<Empleado> {
    return this.http.post<Empleado>(this.apiUrl, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
