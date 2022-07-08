import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './admin/component/dashboard/dashboard.component';
import { LoginComponent } from './component/login/login.component';
import { NoauthorizeComponent } from './component/noauthorize/noauthorize.component';
import { AuthGuard } from './helper';

const routes: Routes = [
  {
    path:'',
    component:LoginComponent,
    pathMatch:'full'
  },
  {
    path:'noauthorize',
    component:NoauthorizeComponent,
    pathMatch:'full'
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthGuard]
  },
  {
      path: 'client', 
      loadChildren: () => import('./client/client.module').then(m => m.ClientModule),
      canActivate: [AuthGuard] 
  },
  {
    path: 'employee',
    loadChildren: () => import('./employee/employee.module').then(m => m.EmployeeModule),
    canActivate: [AuthGuard] 
  },
  // otherwise redirect to home
  { path: '**', redirectTo: '' }
    
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
