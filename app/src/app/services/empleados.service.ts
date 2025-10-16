import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Empleado {
  emp_no: number;
  first_name: string;
  last_name: string;
  birth_date: string;
  hire_date: string;
  gender: string;
}

@Injectable({ providedIn: 'root' })
export class EmpleadosService {
  private base = `${environment.apiBaseUrl}/employees`; // Ajusta a tu backend

  constructor(private http: HttpClient) {}

  getAll(): Observable<Empleado[]> {
    return this.http.get<Empleado[]>(this.base);
  }

  create(emp: Empleado): Observable<Empleado> {
    return this.http.post<Empleado>(this.base, emp);
  }

  delete(id: number): Observable<void> {
    //console.log('token:', localStorage.getItem('token'));
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
