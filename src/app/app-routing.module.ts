import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './_guard/auth/auth.guard';

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
    canActivate: [AuthGuard],
    loadChildren: () => import('./page/auth-form/auth-form.module').then( m => m.AuthFormPageModule)
  },
  {
    path: 'today',
    canActivate: [AuthGuard],
    loadChildren: () => import('./page/today/today.module').then( m => m.TodayPageModule)
  },
  {
    path: 'settings',
    canActivate: [AuthGuard],
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
