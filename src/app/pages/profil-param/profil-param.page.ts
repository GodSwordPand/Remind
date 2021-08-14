import { Component, OnInit } from '@angular/core';

import { ActionSheetController } from '@ionic/angular';

import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-profil-param',
  templateUrl: './profil-param.page.html',
  styleUrls: ['./profil-param.page.scss'],
})
export class ProfilParamPage{

  memberAccessJson = {};

  constructor(
    public actionSheetController: ActionSheetController,
    private apiService: ApiService
  ) {
    this.getDataAccess();
  }


  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Quitter le groupe',
        role: 'leave_group',
        icon: 'exit-outline',
        handler: () => {
          console.log('Leave group clicked');
        }
      }, {
        text: 'Modifier le nom du groupe',
        icon: 'pencil-sharp',
        handler: () => {
          console.log('Edite name clicked');
        }
      },  {
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

  async getDataAccess(){
    this.apiService.ask("appartenirs").subscribe((res: any) => {
      this.memberAccessJson = res;
      this.memberAccessJson = Array.of(res);
      console.log(this.memberAccessJson);
    },
    err => console.error(err),
  );
  }
}
