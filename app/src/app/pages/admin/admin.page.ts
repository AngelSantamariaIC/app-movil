import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

type Empleado = {
  emp_no?: number;
  first_name: string;
  last_name: string;
  birth_date: string; // YYYY-MM-DD
  hire_date: string;  // YYYY-MM-DD
  gender: 'M' | 'F';
};

const API_BASE = 'http://localhost:8080';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {
  empleados: Empleado[] = [];
  fullEmpleados: Empleado[] = [];   // <- para filtrar
  loading = false;
  creating = false;

  // paginación
  page = 0;
  limit = 20;

  // búsqueda
  search = '';

  nuevo: Empleado = {
    first_name: '',
    last_name: '',
    hire_date: '',
    birth_date: '',
    gender: 'M',
  };

  constructor(
    private http: HttpClient,
    private toast: ToastController,
    private router: Router
  ) {}

  ngOnInit() { this.load(true); }

  /** Carga empleados con paginación.
   *  @param reset Si true, reinicia el offset y limpia la lista.
   */
  load(reset = false) {
    if (reset) {
      this.page = 0;
      this.empleados = [];
      this.fullEmpleados = [];
    }

    this.loading = true;
    const offset = this.page * this.limit;

    this.http
      .get<Empleado[]>(`${API_BASE}/employees?limit=${this.limit}&offset=${offset}`)
      .subscribe({
        next: (data) => {
          const nuevos = data ?? [];
          // acumulamos en fullEmpleados y aplicamos filtro
          this.fullEmpleados = [...this.fullEmpleados, ...nuevos];
          this.applyFilter();
          this.loading = false;
        },
        error: async () => {
          this.loading = false;
          (await this.toast.create({
            message: 'Error cargando empleados',
            color: 'danger',
            duration: 1500,
          })).present();
        },
      });
  }

  verMas() {
    if (this.loading) return;
    this.page++;
    this.load();
  }

  refresh(ev: CustomEvent) {
    this.load(true);
    setTimeout(() => (ev.target as any).complete(), 400);
  }

  /** Crear empleado */
  async crear() {
    if (!this.nuevo.first_name || !this.nuevo.last_name || !this.nuevo.birth_date || !this.nuevo.hire_date) {
      (await this.toast.create({ message: 'Completa los campos requeridos', color: 'warning', duration: 1500 })).present();
      return;
    }

    this.creating = true;

    // Si tienes interceptor de auth, no pases headers aquí.
    this.http.post(`${API_BASE}/employees`, this.nuevo).subscribe({
      next: async () => {
        this.creating = false;
        this.nuevo = { first_name: '', last_name: '', hire_date: '', birth_date: '', gender: 'M' };
        this.load(true);
        (await this.toast.create({ message: 'Empleado creado', duration: 1200 })).present();
      },
      error: async () => {
        this.creating = false;
        (await this.toast.create({ message: 'Error al crear', color: 'danger', duration: 1500 })).present();
      },
    });
  }

  /** Eliminar empleado */
  async eliminar(emp_no?: number) {
    if (!emp_no) return;
    const ok = confirm(`¿Eliminar empleado #${emp_no}?`);
    if (!ok) return;

    this.http.delete(`${API_BASE}/employees/${emp_no}`).subscribe({
      next: async () => {
        // quitar de ambas listas para mantener búsqueda consistente
        this.fullEmpleados = this.fullEmpleados.filter(e => e.emp_no !== emp_no);
        this.applyFilter();
        (await this.toast.create({ message: 'Empleado eliminado', duration: 1200 })).present();
      },
      error: async () => {
        (await this.toast.create({ message: 'Error al eliminar', color: 'danger', duration: 1500 })).present();
      },
    });
  }

  salir() {
    localStorage.removeItem('token');
    this.router.navigateByUrl('/', { replaceUrl: true });
  }

  /** Búsqueda local */
  onSearch(ev: any) {
    this.search = (ev?.target?.value || '').toLowerCase();
    this.applyFilter();
  }

  private applyFilter() {
    const q = this.search.trim();
    if (!q) {
      this.empleados = [...this.fullEmpleados];
      return;
    }
    this.empleados = this.fullEmpleados.filter((e: any) => {
      const name = `${e?.first_name ?? ''} ${e?.last_name ?? ''}`.toLowerCase();
      const empNo = String(e?.emp_no ?? '');
      return name.includes(q) || empNo.includes(q);
    });
  }

  // helpers UI
  initials = (n?: string, a?: string) => ((n?.[0] || '') + (a?.[0] || '')).toUpperCase();
  trackById = (_: number, e: any) => e?.emp_no ?? _;
}
