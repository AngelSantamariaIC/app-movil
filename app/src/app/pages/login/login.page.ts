import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';

const API_BASE = 'http://localhost:8080';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  username = '';
  password = '';
  loading = false;

  // mejoras UX
  showPwd = false;
  remember = true; // si es false, guarda en sessionStorage
  private returnUrl = '/admin';

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private toast: ToastController
  ) {
    // si venías redirigido por el guard, respeta el returnUrl
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/admin';
  }

  async doLogin() {
    if (!this.username || !this.password) {
      (await this.toast.create({
        message: 'Ingresa usuario y contraseña',
        color: 'warning',
        duration: 1600,
      })).present();
      return;
    }

    this.loading = true;

    this.http.post<{ token?: string; access_token?: string; message?: string }>(
      `${API_BASE}/auth/login`,
      { username: this.username, password: this.password }
    )
    .pipe(finalize(() => (this.loading = false)))
    .subscribe({
      next: async (res) => {
        const token = res?.token || res?.access_token;
        if (!token) {
          (await this.toast.create({
            message: 'No se recibió un token válido del servidor',
            color: 'danger',
            duration: 1800,
          })).present();
          return;
        }

        // remember → localStorage; si no, sessionStorage
        const storage = this.remember ? localStorage : sessionStorage;
        storage.setItem('token', token);

        // limpia el otro storage para evitar confusiones
        (this.remember ? sessionStorage : localStorage).removeItem('token');
        this.router.navigateByUrl('/dashboard/tab1', { replaceUrl: true });
        (await this.toast.create({
          message: 'Bienvenido 👋',
          duration: 900,
        })).present();
        

        // this.router.navigateByUrl(this.returnUrl, { replaceUrl: true });
      },
      error: async (err: HttpErrorResponse) => {
        let msg = 'Credenciales inválidas';
        // si tu API manda mensaje, muéstralo
        if (err?.error?.message) msg = err.error.message;

        (await this.toast.create({
          message: msg,
          color: 'danger',
          duration: 2000,
        })).present();
      },
    });
  }
}
