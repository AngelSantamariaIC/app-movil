import { Component } from '@angular/core';

import { Empleado } from '../modelos/empleado';
import { HttpClientModule,HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  mensaje = 'Aún no has hecho clic';
  clics = 0;
  saludar() {
    this.clics++;
    this.mensaje = `¡Hola! Has hecho clic ${this.clics} vez${this.clics === 1 ? '' : 'es'}.`;
  }


empleados: Empleado[] = [];
loading=true;
constructor(private http: HttpClient){}

ngOnInit(){
    this.http.get<Empleado[]>('assets/empleados.json')
    .pipe(
      finalize(() => this.loading = false)
    )
    .subscribe({
      next: (data) => {
        this.empleados = data ?? [];
        console.log('this.empleados', this.empleados);
      },
      error: (err) => {
        console.error('Error cargando empleados:', err);
        this.empleados = [];
      }
      
    });
}
}



