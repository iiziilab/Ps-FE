import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { ProjectListComponent } from './component/project/project-list/project-list.component';
import { ViewProjectComponent } from './component/project/view-project/view-project.component';
import { EmployeeInfoComponent } from "./component/profile/employee-info/employee-info.component";
import { AddProjectComponent } from './component/project/add-project/add-project.component';
import { CellListComponent } from './component/project/cell-list/cell-list.component';
import { ViewMenuComponent } from './component/project/view-menu/view-menu.component';

const routes: Routes = [
  {
    path:'dashboard',
    component:DashboardComponent,
    pathMatch:'full'
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
    path:'project/edit/:id',
    component:AddProjectComponent,
  },
  {
    path:'project/cell/:id',
    component:CellListComponent,
  },
  {
    path:'project/cell/view/:id',
    component:ViewMenuComponent,
  },
  {
    path:'loginfo',
    component:EmployeeInfoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }
