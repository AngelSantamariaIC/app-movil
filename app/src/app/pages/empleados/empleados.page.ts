import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EmpleadosService, Empleado } from '../../services/empleados.service';

@Component({
  selector: 'app-empleados',
  standalone: true,
  templateUrl: './empleados.page.html',
  styleUrls: ['./empleados.page.scss'],
  imports: [
    CommonModule,     // *ngIf, *ngFor, etc.
    FormsModule,      // si usas ngModel
    IonicModule       // <ion-*> components (ion-text, ion-list, etc.)
  ]
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
        console.log('Empleados cargados:', data);
        this.empleados = data;
        this.loading = false;
      },
      error: (err) => {
        console.log("Error cargando empleados:", err);
        console.error('Error cargando empleados:', err);
        this.loading = false;
      }
    });
  }
}
