import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { Media, MediaObject } from '@ionic-native/media/ngx';

import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  catsJson = {};
  audiosJson = {};

  file: MediaObject;
  playIcon = 'pause';

  constructor(
    public media: Media,
    public platform: Platform,
    private apiService: ApiService
  ) {
    this.platform.ready().then(() => {
      this.readAudio();
    });
    this.getDataA();
    this.getDataC();
  }


  percent:number = 0;
  maxPercent:number = 100;
  radius:number = 40;
  progress:number = 0;
  timer: any = false;

  startAudio(){
    if(this.timer){
      clearInterval(this.timer);
    }

    let totalSec = 60;

    this.timer = setInterval(() =>{
      if(this.percent == this.radius){
        clearInterval(this.timer); //kill timer
      }
      this.percent = Math.floor((this.progress / totalSec) * 100);
      this.progress++;
    }, 1000)
  }

  readAudio() {
    this.file = this.media.create('../../assets/audio/hunter.mp3');
    // to listen to plugin events:
    this.file.onStatusUpdate.subscribe(status => console.log(status)); // fires when file status changes
    this.file.onSuccess.subscribe(() => console.log('Action is successful'));
    this.file.onError.subscribe(error => console.log('Error!', error));
  }

  playPause() {
    if(this.playIcon == 'pause') {
      this.playIcon = 'play';
      this.file.pause();
    } else {
      this.playIcon = 'pause';
      this.file.play();
    }
  }

  async getDataC(){
    this.apiService.ask("categories").subscribe((res: any) => {
      this.catsJson = res;
      this.catsJson = Array.of(this.catsJson);
      console.log(this.catsJson);
    },
    err => console.error(err),
  );
  }
  async getDataA(){
    this.apiService.ask("audio").subscribe((res: any) => {
      this.audiosJson = res;
      this.audiosJson = Array.of(res);
      console.log(this.audiosJson);
    },
    err => console.error(err),
  );
  }

  refreshPage(){
    this.getDataA();
    this.getDataC();
  }

}
