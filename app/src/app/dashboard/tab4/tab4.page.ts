import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-tab4',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {

  // En el futuro, estas variables se cargarán desde tu API
  savingsGoal = 800000;
  savingsCurrent = 550000;
  
  budgets: any[] = [
    // ... (datos de presupuestos)
  ];
  
  constructor(private http: HttpClient) { }

  ngOnInit() {
    // Aquí llamarías a tu API para obtener los datos del plan
    // ej. this.loadPlanData();
  }

  loadPlanData() {
    // this.http.get('/api/plan').subscribe(data => { ... });
  }

}