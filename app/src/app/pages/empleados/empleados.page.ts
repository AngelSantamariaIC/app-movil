import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { EmpleadosService, Empleado } from '../../services/empleados.service';

const API_BASE = 'http://localhost:8080';

@Component({
  selector: 'app-empleados',
  standalone: true,
  templateUrl: './empleados.page.html',
  styleUrls: ['./empleados.page.scss'],
  imports: [CommonModule, FormsModule, IonicModule, RouterLink]
})
export class EmpleadosPage implements OnInit {
  empleados: Empleado[] = [];
  fullEmpleados: Empleado[] = [];
  loading = false;
  search = '';

  // NUEVO: crear inline
  showCreate = false;
  nuevo: any = { first_name:'', last_name:'', birth_date:'', hire_date:'', gender:'M' };
  creating = false;

  constructor(
    private empleadosService: EmpleadosService,
    private http: HttpClient,
    private router: Router,
    private alertCtrl: AlertController,
    private toast: ToastController
  ) {}

  ngOnInit() { this.load(true); }

  load(reset=false) {
    if (reset) { this.empleados = []; this.fullEmpleados = []; }
    this.loading = true;
    this.empleadosService.getAll().subscribe({
      next: (data) => { this.fullEmpleados = data ?? []; this.applyFilter(); this.loading = false; },
      error: (_) => { this.loading = false; }
    });
  }

  // BÚSQUEDA
  onSearch(ev: any) {
    this.search = (ev?.target?.value || '').toLowerCase();
    this.applyFilter();
  }
  private applyFilter() {
    const q = this.search.trim();
    if (!q) { this.empleados = [...this.fullEmpleados]; return; }
    this.empleados = this.fullEmpleados.filter((e:any) => {
      const name = `${e?.first_name ?? ''} ${e?.last_name ?? ''}`.toLowerCase();
      const empNo = String(e?.emp_no ?? '');
      return name.includes(q) || empNo.includes(q);
    });
  }

  refresh(ev: CustomEvent){ this.load(true); setTimeout(() => (ev.target as any).complete(), 400); }
  initials(n?:string,a?:string){ return ((n?.[0]||'')+(a?.[0]||'')).toUpperCase(); }
  trackById = (_:number,e:any)=> e?.emp_no ?? _;

  // MOSTRAR CREAR si hay login; si no, alerta para ir a /login
  async toggleCreateOrLogin() {
    const token = localStorage.getItem('token');
    if (!token) {
      const alert = await this.alertCtrl.create({
        header: 'Inicia sesión',
        message: 'Debes iniciar sesión para crear empleados.',
        buttons: [
          { text: 'Cancelar', role: 'cancel' },
          { text: 'Ir a login', handler: () => this.router.navigateByUrl('/login') }
        ]
      });
      await alert.present();
      return;
    }
    this.showCreate = !this.showCreate;
  }

  async crearEmpleado() {
    if (!this.nuevo.first_name || !this.nuevo.last_name || !this.nuevo.birth_date || !this.nuevo.hire_date) {
      (await this.toast.create({message:'Completa los campos requeridos', color:'warning', duration:1500})).present();
      return;
    }
    this.creating = true;
    this.http.post(`${API_BASE}/employees`, this.nuevo).subscribe({
      next: async _ => {
        this.creating = false;
        this.showCreate = false;
        this.nuevo = { first_name:'', last_name:'', birth_date:'', hire_date:'', gender:'M' };
        this.load(true);
        (await this.toast.create({message:'Empleado creado', duration:1200})).present();
      },
      error: async _ => {
        this.creating = false;
        (await this.toast.create({message:'Error al crear', color:'danger', duration:1500})).present();
      }
    });
  }

  // si intentan eliminar desde aquí, solo redirigimos a admin tras login
  async confirmEliminar(emp_no: number) {
    const token = localStorage.getItem('token');
    if (!token) {
      const alert = await this.alertCtrl.create({
        header: 'Inicia sesión',
        message: 'Debes iniciar sesión para eliminar empleados.',
        buttons: [
          { text: 'Cancelar', role:'cancel' },
          { text: 'Ir a login', handler: () => this.router.navigateByUrl('/login') }
        ]
      });
      await alert.present();
      return;
    }
    const confirmAlert = await this.alertCtrl.create({
      header: 'Confirmar',
      message: `Para eliminar #${emp_no} entra al panel de administración.`,
      buttons: [{ text: 'Ir a Admin', handler: ()=> this.router.navigateByUrl('/admin') }, { text:'Cancelar', role:'cancel' }]
    });
    await confirmAlert.present();
  }
}
