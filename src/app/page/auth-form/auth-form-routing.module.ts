import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthFormPage } from './auth-form.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'up',
    pathMatch: 'full'
  },
  {
    path: 'up',
    component: AuthFormPage
  },
  {
    path: 'in',
    component: AuthFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthFormRoutingModule {}
