import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

const API_BASE = 'http://localhost:8080';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule], // Asegúrate que CommonModule y FormsModule estén
})
export class Tab2Page {

  loading = true;
  allMovimientos: any[] = []; // Guarda la lista completa de la API
  filteredMovimientos: any[] = []; // Guarda los resultados del filtro

  constructor(private http: HttpClient) {}

  // ionViewWillEnter se ejecuta CADA VEZ que la pestaña se muestra
  ionViewWillEnter() {
    this.loadAllMovimientos();
  }

  loadAllMovimientos() {
    this.loading = true;
    
    // Llama al endpoint GET /movimientos/ que lista TODO
    this.http.get<any[]>(`${API_BASE}/movimientos/`).subscribe({
      next: (data) => {
        this.allMovimientos = data;
        this.filteredMovimientos = data; // Al inicio, la lista filtrada es igual
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando todos los movimientos', err);
        this.loading = false;
        // Aquí podrías mostrar un Toast de error
      }
    });
  }

  // Función para la barra de búsqueda
  handleSearch(event: any) {
    const query = event.target.value?.toLowerCase() || '';
    
    // Filtra la lista 'allMovimientos'
    this.filteredMovimientos = this.allMovimientos.filter(mov => {
      // Comprueba si el texto está en la descripción de la categoría
      const categoriaMatch = mov.categoria.categorias_descripcion.toLowerCase().includes(query);
      // Comprueba si el texto está en el valor
      const valorMatch = mov.movimientos_valor.toString().toLowerCase().includes(query);
      
      return categoriaMatch || valorMatch;
    });
  }

}