import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CategoryComponent } from './components/category/category.component';
import { DialogModalComponent } from './components/dialog-modal/dialog-modal.component';
import { ProductsComponent } from './components/products/products.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'category', component: CategoryComponent },
  { path: 'product', component: ProductsComponent },
  { path: 'dialogModalComponent', component: DialogModalComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
