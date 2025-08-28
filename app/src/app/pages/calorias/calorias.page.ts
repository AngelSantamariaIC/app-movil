import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calorias',
  standalone: false,
  templateUrl: './calorias.page.html',
  styleUrls: ['./calorias.page.scss'],
})
export class CaloriasPage {
  peso = '';
  altura = '';
  edad = '';
  resultado = '';

  private toNumber(s: string): number | null {
    const n = Number((s ?? '').toString().replace(',', '.').trim());
    return isNaN(n) ? null : n;
  }

  calcular() {
    const p = this.toNumber(this.peso);
    const a = this.toNumber(this.altura);
    const e = this.toNumber(this.edad);

    if (p === null || a === null || e === null) {
      this.resultado = 'Completa valores válidos (números).';
      return;
    }
    if (p <= 0 || a <= 0 || e <= 0) {
      this.resultado = 'Los valores deben ser mayores que 0.';
      return;
    }

    // Fórmula simplificada pedida (varón): TMB = 10*p + 6.25*a - 5*e + 5
    const tmb = 10 * p + 6.25 * a - 5 * e + 5;
    this.resultado = `Tu gasto calórico diario estimado es: ${tmb.toFixed(0)} kcal`;
  }

  limpiar() {
    this.peso = ''; this.altura = ''; this.edad = ''; this.resultado = '';
  }
}
