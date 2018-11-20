import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicImageLoader } from '../../../projects/ionic-image-loader/src/lib/ionic-image-loader.module';


import { IonicModule } from '@ionic/angular';

import { NgContentPage } from './ng-content.page';

const routes: Routes = [
  {
    path: '',
    component: NgContentPage
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
  declarations: [NgContentPage]
})
export class NgContentPageModule {}
