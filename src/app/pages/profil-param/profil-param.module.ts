import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilParamPageRoutingModule } from './profil-param-routing.module';

import { ProfilParamPage } from './profil-param.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilParamPageRoutingModule
  ],
  declarations: [ProfilParamPage]
})
export class ProfilParamPageModule {}
