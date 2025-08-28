import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  mensaje = 'Aún no has hecho clic';
  clics = 0;
  saludar() {
    this.clics++;
    this.mensaje = `¡Hola! Has hecho clic ${this.clics} vez${this.clics === 1 ? '' : 'es'}.`;
  }
}
