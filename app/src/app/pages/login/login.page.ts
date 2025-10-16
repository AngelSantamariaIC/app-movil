import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './login.page.html',
})
export class LoginPage {
  username = '';
  password = '';
  loading = false;

  constructor(private http: HttpClient, private router: Router, private toast: ToastController) {}

  async doLogin() {
    this.loading = true;
    this.http.post<{access_token:string}>('http://localhost:8080/auth/login', { username: this.username, password: this.password })
      .subscribe({
        next: async (res) => {
          localStorage.setItem('token', res.access_token);
          this.loading = false;
          this.router.navigateByUrl('/admin', { replaceUrl: true });
        },
        error: async () => {
          this.loading = false;
          const t = await this.toast.create({ message: 'Credenciales inválidas', color: 'danger', duration: 2000 });
          t.present();
        }
      });
  }
}
