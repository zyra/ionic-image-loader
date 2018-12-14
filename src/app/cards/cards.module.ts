import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { IonicImageLoader } from '../../../projects/ionic-image-loader/src/lib/ionic-image-loader.module';

import { CardsPage } from './cards.page';

const routes: Routes = [
  {
    path: '',
    component: CardsPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicImageLoader,
    RouterModule.forChild(routes),
  ],
  declarations: [CardsPage],
})
export class CardsPageModule {
}
