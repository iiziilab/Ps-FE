import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCellComponent } from './component/cell/add-cell/add-cell.component';
import { CellListComponent } from './component/cell/cell-list/cell-list.component';
import { SubgroupComponent } from './component/cell/subgroup/subgroup.component';
import { AddClientComponent } from './component/client/add-client/add-client.component';
import { ClientListComponent } from './component/client/client-list/client-list.component';
import { ViewClientComponent } from './component/client/view-client/view-client.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { ChartDataComponent } from './component/graph/chart-data/chart-data.component';
import { ChartComponent } from './component/graph/chart/chart.component';
import { CountComponent } from './component/graph/count/count.component';
import { DataComponent } from './component/graph/data/data.component';
import { EightitemsComponent } from './component/graph/eightitems/eightitems.component';
import { FiveitemsComponent } from './component/graph/fiveitems/fiveitems.component';
import { FouritemsComponent } from './component/graph/fouritems/fouritems.component';
import { OneitemsComponent } from './component/graph/oneitems/oneitems.component';
import { SevenitemsComponent } from './component/graph/sevenitems/sevenitems.component';
import { SixitemsComponent } from './component/graph/sixitems/sixitems.component';
import { ThreeitemsComponent } from './component/graph/threeitems/threeitems.component';
import { TwoitemsComponent } from './component/graph/twoitems/twoitems.component';
import { LayoutComponent } from './component/layout/layout.component';
import { AddModelComponent } from './component/menu/add-model/add-model.component';
import { DemoUploadComponent } from './component/menu/demo-upload/demo-upload.component';
import { InteractiveComponent } from './component/menu/interactive/interactive.component';
import { OptimizationComponent } from './component/menu/optimization/optimization.component';
import { SelectMenuComponent } from './component/menu/select-menu/select-menu.component';
import { UploadMenuComponent } from './component/menu/upload-menu/upload-menu.component';
import { AddPermissionComponent } from './component/permission/permission/add-permission/add-permission.component';
import { PermissionListComponent } from './component/permission/permission/permission-list/permission-list.component';
import { ViewPermissionComponent } from './component/permission/permission/view-permission/view-permission.component';
import { AddRoleComponent } from './component/permission/role/add-role/add-role.component';
import { RoleListComponent } from './component/permission/role/role-list/role-list.component';
import { RolePermissionComponent } from './component/permission/role/role-permission/role-permission.component';
import { ViewRoleComponent } from './component/permission/role/view-role/view-role.component';
import { AddUserComponent } from './component/permission/users/add-user/add-user.component';
import { UserListComponent } from './component/permission/users/user-list/user-list.component';
import { ViewUserComponent } from './component/permission/users/view-user/view-user.component';
import { AdminInfoComponent } from './component/profile/admin-info/admin-info.component';
import { AddProjectComponent } from './component/project/add-project/add-project.component';
import { DetailProjectComponent } from './component/project/detail-project/detail-project.component';
import { ProjectListComponent } from './component/project/project-list/project-list.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children:[
      {
        path:'',
        redirectTo:'dashboard',
        pathMatch:'full'
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        pathMatch: 'full',
      },
      {
        path: 'client/list',
        component: ClientListComponent
      },
      {
        path: 'client/add',
        component: AddClientComponent
      },
      {
        path: 'client/edit/:id',
        component: AddClientComponent,
      },
      {
        path: 'client/view/:id',
        component: ViewClientComponent
      },
      {
        path:'project/list',
        component:ProjectListComponent,
      },
      {
        path:'project/add',
        component:AddProjectComponent,
      },
      {
        path:'project/edit/:id',
        component:AddProjectComponent,
      },
      {
        path:'project/view/:id',
        component:DetailProjectComponent,
      },
      {
        path:'project/cell/add/:id',
        component:AddCellComponent,
      },
      {
        path:'project/cell/edit/:id',
        component:AddCellComponent,
      },
      {
        path:'project/cell/:id',
        component:CellListComponent,
      },
      {
        path:'project/cell/view/:id',
        component:SelectMenuComponent
      },
      {
        path:'project/uploadmenu/:id',
        component:UploadMenuComponent,
      },
      {
        path:'project/upload/:id',
        component:DemoUploadComponent,
      },
      {
        path:'project/cell/optimized/:id',
        component:OptimizationComponent
      },
      {
        path : 'project/cell/interactive/:id',
        component : InteractiveComponent
      },
      {
        path:'project/cell/subgroup/:id',
        component:SubgroupComponent
      },
      // {
      //   path:'project/cell/chart/:id',
      //   component:ChartComponent
      // },
      {
        path:'project/cell/chart/:id',
        component:DataComponent
      },
      {
        path:'project/cell/chartData/:id',
        component:ChartDataComponent
      },
      {
        path:'project/cell/data/:id',
        component:DataComponent
      },
      {
        path:'project/cell/eightitems/:id',
        component:EightitemsComponent
      },
      {
        path:'project/cell/sevenitems/:id',
        component:SevenitemsComponent
      },
      {
        path:'project/cell/sixitems/:id',
        component:SixitemsComponent
      },
      {
        path:'project/cell/fiveitems/:id',
        component:FiveitemsComponent
      },
      {
        path:'project/cell/fouritems/:id',
        component:FouritemsComponent
      },
      {
        path:'project/cell/threeitems/:id',
        component:ThreeitemsComponent
      },
      {
        path:'project/cell/twoitems/:id',
        component:TwoitemsComponent
      },
      {
        path:'project/cell/oneitem/:id',
        component:OneitemsComponent
      },
      {
        path:'project/cell/count/:id',
        component:CountComponent
      },
      {
        path:'loginfo',
        component:AdminInfoComponent,
      },
      {
        path:'user/list',
        component:UserListComponent,
      },
      {
        path:'user/add',
        component:AddUserComponent,
      },
      {
        path:'user/edit/:id',
        component:AddUserComponent,
      },
      {
        path:'user/view/:id',
        component:ViewUserComponent,
      },
      {
        path:'role/list',
        component:RoleListComponent,
      },
      {
        path:'role/add',
        component:AddRoleComponent,
      },
      {
        path:'role/edit/:id',
        component:AddRoleComponent,
      },
      {
        path:'role/view/:id',
        component:ViewRoleComponent,
      },
      {
        path:'role/permission/:id',
        component : RolePermissionComponent,
      },
      {
        path:'permission/list',
        component:PermissionListComponent,
      },
      {
        path:'permission/add',
        component:AddPermissionComponent,
      },
      {
        path:'permission/edit/:id',
        component:AddPermissionComponent,
      },
      {
        path:'permission/view/:id',
        component:ViewPermissionComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
