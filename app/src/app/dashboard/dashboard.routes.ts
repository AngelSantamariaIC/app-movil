// En: src/app/dashboard/dashboard.routes.ts

import { Routes } from '@angular/router';
import { DashboardPage } from './dashboard.page'; // Importa el componente de pestañas

export const routes: Routes = [
  {
    path: '',
    component: DashboardPage, // Carga el componente que tiene la barra de pestañas
    
    // Estas son las rutas HIJAS (el contenido de cada pestaña)
    children: [
      {
        path: 'tab1', // Esta es tu página de "Inicio"
        loadComponent: () => import('./tab1/tab1.page').then((m) => m.Tab1Page),
      },
    //   {
    //     path: 'tab2', // Esta será "Movimientos"
    //     loadComponent: () => import('./tab2/tab2.page').then((m) => m.Tab2Page),
    //   },
    //   {
    //     path: 'tab3', // Esta será "IA"
    //     loadComponent: () => import('./tab3/tab3.page').then((m) => m.Tab3Page),
    //   },
      // Aún necesitas crear tab4 y tab5
      // {
      //   path: 'tab4',
      //   loadComponent: () => import('./tab4/tab4.page').then((m) => m.Tab4Page),
      // },
      // {
      //   path: 'tab5',
      //   loadComponent: () => import('./tab5/tab5.page').then((m) => m.Tab5Page),
      // },
      {
        path: '',
        redirectTo: 'tab1', // Redirige /dashboard a /dashboard/tab1
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: 'tab1',
    pathMatch: 'full',
  },
];