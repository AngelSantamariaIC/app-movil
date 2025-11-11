import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GastoModalPageRoutingModule } from './gasto-modal-routing.module';

import { GastoModalPage } from './gasto-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GastoModalPageRoutingModule,
    GastoModalPage,
  ],
})
export class GastoModalPageModule {}
