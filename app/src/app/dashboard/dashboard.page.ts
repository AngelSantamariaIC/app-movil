import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterLink } from '@angular/router'; // Añade esto si tu HTML usa routerLink

@Component({
  selector: 'app-dashboard',
  standalone: true,
  // Asegúrate de que 'IonicModule' y 'RouterLink' estén en los imports
  imports: [IonicModule, CommonModule, FormsModule, RouterLink], 
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage {

  constructor() {
    // El constructor está vacío.
    // No llames a la API aquí.
  }

}