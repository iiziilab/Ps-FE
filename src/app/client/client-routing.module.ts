import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { EmployeeListComponent } from './component/employee/employee-list/employee-list.component';
import { ViewEmployeeComponent } from './component/employee/view-employee/view-employee.component';
import { ProjectListComponent } from './component/project/project-list/project-list.component';
import { ViewProjectComponent } from './component/project/view-project/view-project.component';
import { ClientInfoComponent } from "./component/profile/client-info/client-info.component";

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    pathMatch: 'full',
  },
  {
    path: 'employee/list',
    component: EmployeeListComponent
  },
  {
    path: 'employee/view/:id',
    component: ViewEmployeeComponent
  },
  {
    path: 'project/list',
    component: ProjectListComponent
  },
  {
    path: 'project/view/:id',
    component: ViewProjectComponent
  },
  {
    path:'loginfo',
    component:ClientInfoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
