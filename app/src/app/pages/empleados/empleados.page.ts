import { Component, OnInit } from '@angular/core';
import { EmpleadosService, Empleado } from '../../services/empleados.service';

@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.page.html',
  styleUrls: ['./empleados.page.scss'],
})
export class EmpleadosPage implements OnInit {
  empleados: Empleado[] = [];
  loading = true;

  constructor(private empleadosService: EmpleadosService) {}

  ngOnInit() {
    this.loadEmpleados();
  }

  loadEmpleados() {
    this.empleadosService.getAll().subscribe({
      next: (data) => {
        this.empleados = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando empleados:', err);
        this.loading = false;
      }
    });
  }
}
