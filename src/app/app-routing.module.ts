import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './guards/auth/auth.guard';
import { AuthFormPage } from './modules/auth/auth.component';
import { TabListPage } from './modules/tab/list/list.component';
import { TabFormPage } from './modules/tab/form/form.component';
import { DefaultLayout } from './layouts/default/default.component';
import { AdminListPage } from './modules/admin/list/list.component';
import { GroupListPage } from './modules/group/list/list.component';
import { ConfigListPage } from './modules/config/list/list.component';
import { SocialListPage } from './modules/social/list/list.component';
import { ConfigFormPage } from './modules/config/form/form.component';
import { DashboardPage } from './modules/dashboard/dashboard.component';
import { CategoryListPage } from './modules/category/list/list.component';
import { CategoryFormPage } from './modules/category/form/form.component';
import { PermissionListPage } from './modules/permission/list/list.component';

const routes: Routes = [
  { path: 'entrar', component: AuthFormPage },

  { path: '', canActivate: [AuthGuard], component: DefaultLayout, children: [
    { path: '', component: DashboardPage },
    { path: 'sociais', component: SocialListPage },
    { path: 'abas', children: [
      { path: '', component: TabListPage },
      { path: 'formulario', component: TabFormPage },
      { path: 'formulario/:id', component: TabFormPage },
    ]},
    { path: 'categorias', children: [
      { path: '', component: CategoryListPage },
      { path: 'formulario', component: CategoryFormPage },
      { path: 'formulario/:id', component: CategoryFormPage },
    ]},
    { path: 'configuracoes', children: [
      { path: '', component: ConfigListPage },
      { path: 'formulario', component: ConfigFormPage },
      { path: 'formulario/:id', component: ConfigFormPage },
    ]},
    { path: 'auth', children: [
      { path: 'grupos', component: GroupListPage },
      { path: 'usuarios', component: AdminListPage },
      { path: 'permissoes', component: PermissionListPage }
    ]},
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
