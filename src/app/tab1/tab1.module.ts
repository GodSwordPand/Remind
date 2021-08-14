import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { Tab1PageRoutingModule } from './tab1-routing.module';

import { NgCircleProgressModule } from 'ng-circle-progress';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    Tab1PageRoutingModule,
    NgCircleProgressModule.forRoot({
        // définir les valeurs par défaut ici
        space: -5,
        outerStrokeWidth: 5,
        outerStrokeColor: "#76C2AF",
        innerStrokeColor: "#ffffff",
        innerStrokeWidth: 5,
        imageSrc: "assets/images/music.svg",
        imageHeight: 72,
        imageWidth: 72,
        showImage: true,
        showBackground: false,
        animation: false
      })
  ],
  declarations: [Tab1Page]
})
export class Tab1PageModule {}
