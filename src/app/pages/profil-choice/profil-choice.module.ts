import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilChoicePageRoutingModule } from './profil-choice-routing.module';

import { ProfilChoicePage } from './profil-choice.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilChoicePageRoutingModule
  ],
  declarations: [ProfilChoicePage]
})
export class ProfilChoicePageModule {}
