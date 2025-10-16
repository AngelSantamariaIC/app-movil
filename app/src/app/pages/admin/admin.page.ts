import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {
  empleados:any[] = [];
  loading = false;
  nuevo = { first_name:'', last_name:'', hire_date:'', birth_date:'', gender:'M' };

  constructor(private http: HttpClient, private toast: ToastController, private router: Router) {}

  ngOnInit(){ this.load(); }

  private headers() {
    const t = localStorage.getItem('token') || '';
    return { headers: new HttpHeaders({ Authorization: `Bearer ${t}` }) };
  }

  load() {
    this.loading = true;
    this.http.get<any[]>('http://localhost:8080/employees?limit=50&offset=0', this.headers())
      .subscribe({ next: d => { this.empleados = d ?? []; this.loading = false; },
                   error: _ => { this.loading = false; }});
  }

  async crear() {
    this.http.post('http://localhost:8080/employees', this.nuevo, this.headers())
      .subscribe({ next: async _ => { this.nuevo = { first_name:'', last_name:'', hire_date:'', birth_date:'', gender:'M' }; this.load();
                        (await this.toast.create({message:'Creado',duration:1200})).present(); },
                   error: async _ => (await this.toast.create({message:'Error al crear',color:'danger',duration:1500})).present() });
  }

  async eliminar(emp_no:number) {
    this.http.delete(`http://localhost:8080/employees/${emp_no}`, this.headers())
      .subscribe({ next: async _ => { this.load(); (await this.toast.create({message:'Eliminado',duration:1200})).present(); },
                   error: async _ => (await this.toast.create({message:'Error al eliminar',color:'danger',duration:1500})).present() });
  }

  salir(){ localStorage.removeItem('token'); this.router.navigateByUrl('/'); }
}
