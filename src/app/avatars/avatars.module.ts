import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicImageLoader } from '../../../projects/ionic-image-loader/src/lib/ionic-image-loader.module';


import { IonicModule } from '@ionic/angular';

import { AvatarsPage } from './avatars.page';

const routes: Routes = [
  {
    path: '',
    component: AvatarsPage
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
  declarations: [AvatarsPage]
})
export class AvatarsPageModule {}
