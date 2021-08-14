import { Component } from '@angular/core';

import { Router } from '@angular/router';

import { ActionSheetController } from '@ionic/angular';

import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  accountJson = {};

  constructor(
    public actionSheetController: ActionSheetController,
    private router: Router,
    private apiService: ApiService
  ) {}

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Se deconnecter',
        role: 'sign_out',
        icon: 'exit-outline',
        handler: () => {
          console.log('Sign Out clicked');
          this.apiService.logout();
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  async getData(){
    this.apiService.ask("users/1").subscribe((res: any) => {
      this.accountJson = res;
      this.accountJson = Array.of(res);
      console.log(this.accountJson);
    },
    err => console.error(err),
  );
  }
}
