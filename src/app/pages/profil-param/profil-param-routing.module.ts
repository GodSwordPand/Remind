import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfilParamPage } from './profil-param.page';

const routes: Routes = [
  {
    path: '',
    component: ProfilParamPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfilParamPageRoutingModule {}
