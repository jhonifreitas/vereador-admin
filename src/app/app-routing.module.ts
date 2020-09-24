import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './guards/auth/auth.guard';
import { AuthFormPage } from './modules/auth/auth.component';
import { DefaultLayout } from './layouts/default/default.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';

const routes: Routes = [
  { path: 'auth', children: [
    { path: 'login', component: AuthFormPage }
  ]},

  { path: '', canActivate: [AuthGuard], component: DefaultLayout, children: [
    { path: '', component: DashboardComponent },
  ]},

  // ERROR PAGES
  { path: 'error/403', loadChildren: () => import('./layouts/error/403/403.module').then( m => m.Error403Module) },
  { path: '**', loadChildren: () => import('./layouts/error/404/404.module').then( m => m.Error404Module) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
