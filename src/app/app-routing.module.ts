import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const authRedirectTo = () => {
  const isAuthenticated = false;

  return isAuthenticated ? 'today' : 'sign';
};

const routes: Routes = [
  {
    path: '',
    redirectTo: authRedirectTo(),
    pathMatch: 'full'
  },
  {
    path: 'sign',
    loadChildren: () => import('./page/auth-form/auth-form.module').then( m => m.AuthFormPageModule)
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
