import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';


const API_BASE = 'http://localhost:8080';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  // --- Variables del formulario (NUEVAS Y ANTIGUAS) ---
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  
  // Nuevas variables para datos_personales
  direccion = '';
  celular = '';
  ciudad = '';
  tipoIdentificacionId: number | null = null; // Para el <ion-select>
  identificacion = '';

  // Variables de estado
  loading = false;
  showPwd = false;
  showConfirmPwd = false;

  // Variable para el dropdown
  tiposDeIdentificacion: any[] = []; // Aquí se guardará la lista de la API

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private toast: ToastController
  ) { }

  ngOnInit() {
    this.cargarTiposIdentificacion();
  }

  async cargarTiposIdentificacion() {
    const url = `${API_BASE}/tipos/identificacion`; 
  
    this.http.get<any[]>(url).subscribe({
    
    next: (data) => {
      // Ahora deberías ver esto en tu consola (F12)
      console.log('Tipos de identificación cargados:', data);
      this.tiposDeIdentificacion = data;
    },
    error: async (err) => {
      // Esto se disparaba porque la URL era incorrecta (404)
      (await this.toast.create({
        message: 'Error al cargar los tipos de identificación',
        color: 'danger',
        duration: 2000,
      })).present();
    }
  });
}

  async doRegister() {
    // ... (tus validaciones de contraseñas no coinciden, etc. van aquí)
    if (this.password !== this.confirmPassword) {
      // ... (mostrar toast de error)
      return;
    }

    this.loading = true;

    // --- NUEVO PAYLOAD (Coincide con UsuarioCreateCompleto) ---
    const payload = {
      usuarios_email: this.email,
      usuarios_nombres_apellidos: this.name,
      usuarios_contrasena: this.password,
      datos_personales: {
        usuarios_datos_direccion: this.direccion,
        usuarios_datos_celular: this.celular,
        usuarios_datos_ciudad: this.ciudad,
        usuarios_datos_id_tipo_identif: this.tipoIdentificacionId,
        usuarios_datos_identificacion: this.identificacion
      }
    };

    this.http.post(`${API_BASE}/users/`, payload) // Envía el payload completo
    .pipe(finalize(() => (this.loading = false)))
    .subscribe({
      next: async (res) => {
        (await this.toast.create({
          message: '¡Registro exitoso! Ahora puedes iniciar sesión.',
          duration: 1800,
        })).present();
        this.router.navigateByUrl('/login', { replaceUrl: true });
      },
      error: async (err: HttpErrorResponse) => {
        // ... (tu manejo de errores de FastAPI)
        let msg = 'Error al registrarse.';
        if (err?.error?.detail) {
            msg = Array.isArray(err.error.detail) ? err.error.detail[0].msg : err.error.detail;
        }
        (await this.toast.create({
          message: msg,
          color: 'danger',
          duration: 2500,
        })).present();
      },
    });
  }
}
