import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SliderPage } from './slider.page';
import { IonicImageLoader } from '../../../projects/ionic-image-loader/src/lib/ionic-image-loader.module';


const routes: Routes = [
  {
    path: '',
    component: SliderPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicImageLoader,
    RouterModule.forChild(routes)
  ],
  declarations: [SliderPage]
})
export class SliderPageModule {}
