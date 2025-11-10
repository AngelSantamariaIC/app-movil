import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs'; // Para hacer varias llamadas a la vez
import { RouterLink } from '@angular/router'; // Importa RouterLink

// Asegúrate de que esta sea la URL de tu API
const API_BASE = 'http://localhost:8080';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  // ¡Asegúrate de importar CommonModule y RouterLink!
  imports: [IonicModule, CommonModule, FormsModule, RouterLink], 
})
export class Tab1Page implements OnInit {
  
  user: any = null; // Para "Hola, Karol"
  balance: any = null; // Para el balance
  movimientos: any[] = []; // Para el flujo del mes
  loading = true;

  constructor(
    private http: HttpClient,
    private modalCtrl: ModalController // Para abrir el modal de "Registrar Gasto"
  ) {}

  ngOnInit() {
    this.loadData();
  }

  // Carga todos los datos de la API cuando la página inicia
  loadData() {
    this.loading = true;

    // Hacemos 3 llamadas a la API en paralelo
    forkJoin({
      user: this.http.get(`${API_BASE}/users/me`),
      balance: this.http.get(`${API_BASE}/movimientos/balance`),
      movimientos: this.http.get<any[]>(`${API_BASE}/movimientos/flujo-mes`)
    }).subscribe({
      next: (data) => {
        this.user = data.user;
        this.balance = data.balance;
        this.movimientos = data.movimientos;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando datos del dashboard', err);
        this.loading = false;
        // Aquí podrías mostrar un Toast de error
      }
    });
  }

  // Esta función se llamará cuando la página vuelva a mostrarse
  // (ej. después de cerrar un modal)
  ionViewWillEnter() {
    this.loadData();
  }

  // Función para el botón "Registrar Gastos"
  async registrarGasto() {
    // Aquí deberás crear un Modal para registrar el gasto
    // Por ahora, solo es un ejemplo:
    console.log('Abrir modal de registrar gasto...');
    
    // const modal = await this.modalCtrl.create({
    //   component: TuModalDeGastoPage,
    // });
    // await modal.present();
    
    // const { data } = await modal.onDidDismiss();
    // if (data && data.refresh) {
    //   this.loadData(); // Refresca los datos si el modal lo indica
    // }
  }
}