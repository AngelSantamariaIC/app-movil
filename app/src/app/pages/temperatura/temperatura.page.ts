import { Component, OnInit } from '@angular/core';
type Unidad = 'C' | 'F' | 'K';

@Component({
  selector: 'app-temperatura',
  standalone: false,
  templateUrl: './temperatura.page.html',
  styleUrls: ['./temperatura.page.scss'],
})
export class TemperaturaPage {
  valor = '';
  origen: Unidad = 'C';
  destino: Unidad = 'F';
  resultado = '';

  private toNumber(s: string): number | null {
    const n = Number((s ?? '').toString().replace(',', '.').trim());
    return isNaN(n) ? null : n;
  }
  private sim(u: Unidad) { return u === 'C' ? '°C' : u === 'F' ? '°F' : 'K'; }

  convertir() {
    const v = this.toNumber(this.valor);
    if (v === null) { this.resultado = 'Ingresa un número válido.'; return; }
    if (this.origen === 'K' && v < 0) { this.resultado = 'Kelvin no puede ser negativo.'; return; }

    let out = v;
    const par = `${this.origen}>${this.destino}`;

    if (this.origen !== this.destino) {
      switch (par) {
        case 'C>F': out = v * 9/5 + 32; break;
        case 'C>K': out = v + 273.15; break;
        case 'F>C': out = (v - 32) * 5/9; break;
        case 'F>K': out = ((v - 32) * 5/9) + 273.15; break;
        case 'K>C': out = v - 273.15; break;
        case 'K>F': out = ((v - 273.15) * 9/5) + 32; break;
      }
    }
    this.resultado = `${out.toFixed(2)} ${this.sim(this.destino)}`;
  }

  limpiar() {
    this.valor = ''; this.origen = 'C'; this.destino = 'F'; this.resultado = '';
  }
}