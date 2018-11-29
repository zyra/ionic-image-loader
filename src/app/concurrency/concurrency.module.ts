import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ConcurrencyPage } from './concurrency.page';

import { IonicImageLoader } from '../../../projects/ionic-image-loader/src/lib/ionic-image-loader.module';

const routes: Routes = [
  {
    path: '',
    component: ConcurrencyPage
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
  declarations: [ConcurrencyPage]
})
export class ConcurrencyPageModule {}
