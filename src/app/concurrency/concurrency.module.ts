import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ConcurrencyPage } from './concurrency.page';

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
    RouterModule.forChild(routes)
  ],
  declarations: [ConcurrencyPage]
})
export class ConcurrencyPageModule {}
