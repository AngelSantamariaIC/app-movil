// tab4.page.ts
import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Chart, ArcElement, Tooltip, Legend, Title } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend, Title);

@Component({
  selector: 'app-tab4',
  standalone: true,
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
  imports: [IonicModule, CommonModule],
})
export class Tab4Page {
  @ViewChild('donutCanvas', { static: false }) donutCanvas!: ElementRef<HTMLCanvasElement>;
  private donutChart?: Chart;

  categorias = ['Mercado', 'Ocio', 'Servicios', 'Transporte', 'Salud'];
  valores    = [150000,   180000,   120000,     90000,        40000];

  // 🔹 Se llama cuando la pestaña ya está visible y el canvas existe
  ionViewDidEnter() {
    // Pequeño delay para asegurar que el DOM esté pintado
    setTimeout(() => this.renderDonut(), 0);
  }

  ionViewWillLeave() {
    this.destroyDonut();
  }

  private renderDonut() {
    if (!this.donutCanvas?.nativeElement) return;

    const ctx = this.donutCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    this.destroyDonut(); // por si re-entramos a la pestaña

    this.donutChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: this.categorias,
        datasets: [{
          data: this.valores,
          backgroundColor: ['#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6'],
          borderWidth: 0,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false, // 👈 importante para llenar el contenedor
        cutout: '62%',
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 12, usePointStyle: true } },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.label}: $ ${new Intl.NumberFormat('es-CO').format(ctx.raw as number)}`
            }
          }
        }
      }
    });
  }

  private destroyDonut() {
    if (this.donutChart) {
      this.donutChart.destroy();
      this.donutChart = undefined;
    }
  }
}
