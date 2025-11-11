import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GastoModalPage } from './gasto-modal.page';

const routes: Routes = [
  {
    path: '',
    component: GastoModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GastoModalPageRoutingModule {}
