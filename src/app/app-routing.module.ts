import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'avatars', loadChildren: './avatars/avatars.module#AvatarsPageModule' },
  { path: 'cards', loadChildren: './cards/cards.module#CardsPageModule' },
  { path: 'concurrency', loadChildren: './concurrency/concurrency.module#ConcurrencyPageModule' },
  { path: 'ng-content', loadChildren: './ng-content/ng-content.module#NgContentPageModule' },
  { path: 'slider', loadChildren: './slider/slider.module#SliderPageModule' },
  { path: 'virtual-scroll', loadChildren: './virtual-scroll/virtual-scroll.module#VirtualScrollPageModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
