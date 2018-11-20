import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicImageLoader } from '../../../projects/ionic-image-loader/src/lib/ionic-image-loader.module';


import { IonicModule } from '@ionic/angular';

import { VirtualScrollPage } from './virtual-scroll.page';

const routes: Routes = [
  {
    path: '',
    component: VirtualScrollPage
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
  declarations: [VirtualScrollPage]
})
export class VirtualScrollPageModule {}
