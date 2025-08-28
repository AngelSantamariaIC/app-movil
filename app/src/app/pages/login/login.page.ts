import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  usuario = '';
  password = '';
  mensajeOk = '';
  mensajeErr = '';

  ingresar() {
    if (this.usuario === 'admin' && this.password === '1234') {
      this.mensajeOk = `Bienvenido, ${this.usuario}`;
      this.mensajeErr = '';
    } else {
      this.mensajeErr = 'Credenciales incorrectas.';
      this.mensajeOk = '';
    }
  }

  limpiar() {
    this.usuario = '';
    this.password = '';
    this.mensajeOk = '';
    this.mensajeErr = '';
  }
}
