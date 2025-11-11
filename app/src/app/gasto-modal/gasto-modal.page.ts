import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

const API_BASE = 'http://localhost:8080'; // Tu URL de API

@Component({
  selector: 'app-gasto-modal',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './gasto-modal.page.html',
  styleUrls: ['./gasto-modal.page.scss'],
})
export class GastoModalPage implements OnInit {
  
  // Variables del formulario
  movimientos_fecha: string = new Date().toISOString();
  movimientos_id_categoria: number | null = null;
  movimientos_valor: number | null = null;

  // Variables de estado
  categoriasGasto: any[] = [];
  loading = false;
  
  constructor(
    private modalCtrl: ModalController,
    private http: HttpClient,
    private toast: ToastController
  ) {}

  ngOnInit() {
    this.cargarCategorias();
  }

  // 1. Carga las categorías de gastos desde la API
  cargarCategorias() {
    this.http.get<any[]>(`${API_BASE}/categorias/gastos`).subscribe({
      next: (data) => {
        this.categoriasGasto = data;
      },
      error: (err) => {
        console.error('Error cargando categorías', err);
        this.toast.create({ message: 'Error al cargar categorías', color: 'danger', duration: 2000 }).then(t => t.present());
      }
    });
  }

  // 2. Cierra el modal sin guardar
  cancelar() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  // 3. Guarda el nuevo movimiento
  async guardarMovimiento() {
    if (!this.movimientos_fecha || !this.movimientos_id_categoria || !this.movimientos_valor) {
      (await this.toast.create({ message: 'Completa todos los campos', color: 'warning', duration: 2000 })).present();
      return;
    }
    
    this.loading = true;

    const payload = {
      movimientos_fecha: this.movimientos_fecha,
      movimientos_id_categoria: this.movimientos_id_categoria,
      movimientos_valor: this.movimientos_valor
    };

    // Llama al endpoint de crear movimiento que ya teníamos
    this.http.post(`${API_BASE}/movimientos/`, payload)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: async (res) => {
          (await this.toast.create({ message: 'Gasto registrado', color: 'success', duration: 1500 })).present();
          // Devuelve 'refresh' para que el dashboard sepa que debe actualizarse
          this.modalCtrl.dismiss({ refresh: true }, 'confirm');
        },
        error: async (err) => {
          (await this.toast.create({ message: 'Error al registrar el gasto', color: 'danger', duration: 2000 })).present();
        }
      });
  }
}