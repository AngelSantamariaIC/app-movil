import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Subject, takeUntil, debounceTime } from 'rxjs';

const API_BASE = 'http://localhost:8080';

@Component({
  selector: 'app-tab2',
  standalone: true,
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule],
})
export class Tab2Page {
  loading = true;
  allMovimientos: any[] = [];
  filteredMovimientos: any[] = [];

  // Filtros
  typeFilter: 'all' | 'income' | 'expense' = 'all';
  rangeFilter: 'month' | '3m' | '6m' | '12m' | 'all' = 'month';
  private search$ = new Subject<string>();
  private destroy$ = new Subject<void>();
  private searchQuery = '';

  skeletonItems = Array.from({ length: 8 });

  constructor(private http: HttpClient) {
    // Debounce de búsqueda
    this.search$.pipe(debounceTime(200), takeUntil(this.destroy$))
      .subscribe(q => { this.searchQuery = q.toLowerCase(); this.applyFilters(); });
  }

  ionViewWillEnter() { this.loadAllMovimientos(); }

  ngOnDestroy() { this.destroy$.next(); this.destroy$.complete(); }

  loadAllMovimientos() {
    this.loading = true;
    this.http.get<any[]>(`${API_BASE}/movimientos/`).subscribe({
      next: (data) => {
        // Orden por fecha (desc)
        this.allMovimientos = (data || []).sort(
          (a, b) => new Date(b.movimientos_fecha).getTime() - new Date(a.movimientos_fecha).getTime()
        );
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando movimientos', err);
        this.loading = false;
      }
    });
  }

  // Pull-to-refresh
  doRefresh(ev: any) {
    this.loadAllMovimientos();
    setTimeout(() => ev.target.complete(), 600);
  }

  // Búsqueda con debounce
  onSearchInput(ev: any) {
    const q = ev?.target?.value ?? '';
    this.search$.next(q);
  }

  // Helpers
  isExpense = (m: any) => (m?.categoria?.tipo?.tipos_descripcion || '').toLowerCase() === 'gastos';

  trackById = (_: number, item: any) => item?.movimientos_id ?? item?.id ?? _;

  // Aplicar todos los filtros
  applyFilters() {
    const now = new Date();
    const start = this.getStartDate(now, this.rangeFilter);

    this.filteredMovimientos = this.allMovimientos.filter(m => {
      // Rango de fechas
      const d = new Date(m?.movimientos_fecha || 0);
      if (this.rangeFilter !== 'all' && d < start) return false;

      // Tipo
      const expense = this.isExpense(m);
      if (this.typeFilter === 'income' && expense) return false;
      if (this.typeFilter === 'expense' && !expense) return false;

      // Búsqueda
      if (this.searchQuery) {
        const cat = (m?.categoria?.categorias_descripcion || '').toLowerCase();
        const val = String(m?.movimientos_valor ?? '').toLowerCase();
        if (!cat.includes(this.searchQuery) && !val.includes(this.searchQuery)) return false;
      }

      return true;
    });
  }

  private getStartDate(now: Date, range: string) {
    const s = new Date(now);
    s.setHours(0,0,0,0);

    switch (range) {
      case 'month':
        return new Date(s.getFullYear(), s.getMonth(), 1);
      case '3m':
        return new Date(s.getFullYear(), s.getMonth() - 3, 1);
      case '6m':
        return new Date(s.getFullYear(), s.getMonth() - 6, 1);
      case '12m':
        return new Date(s.getFullYear(), s.getMonth() - 12, 1);
      default:
        return new Date(0); // all
    }
  }
}
