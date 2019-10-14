import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StockComponent } from './stock/stock.component';
import { HomeComponent } from './home/home.component';
import { StockResolver } from '../resolvers/stock.resolver';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'stock',
    component: StockComponent,
    // Disabled as long as we aren't doing any requests
    // resolve: {
    //   stocks: StockResolver
    // }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
