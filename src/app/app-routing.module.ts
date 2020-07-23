import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'sign-in',
    loadChildren: () => import('./page/sign-in/sign-in.module').then( m => m.SignInPageModule)
  },
  {
    path: 'sign-up',
    loadChildren: () => import('./page/sign-up/sign-up.module').then( m => m.SignUpPageModule)
  },
  {
    path: 'today',
    loadChildren: () => import('./page/today/today.module').then( m => m.TodayPageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./page/settings/settings.module').then( m => m.SettingsPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
