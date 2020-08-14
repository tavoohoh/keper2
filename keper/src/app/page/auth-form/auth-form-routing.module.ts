import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthFormPage } from './auth-form.page';

const routes: Routes = [
  {
    path: '',
    component: AuthFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthFormRoutingModule {}
