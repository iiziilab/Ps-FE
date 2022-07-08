import { NgModule } from '@angular/core';
import {RouterModule} from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { HeaderComponent } from './component/header/header.component';
import { FooterComponent } from './component/footer/footer.component';
import { LayoutComponent } from './component/layout/layout.component';

import { DeleteClientComponent } from './component/client/delete-client/delete-client.component';
import { ViewClientComponent } from './component/client/view-client/view-client.component';
import { ProjectListComponent } from './component/project/project-list/project-list.component';
import { AddProjectComponent } from './component/project/add-project/add-project.component';
import { DeleteProjectComponent } from './component/project/delete-project/delete-project.component';
import { DetailProjectComponent } from './component/project/detail-project/detail-project.component';
import { AddClientComponent } from './component/client/add-client/add-client.component';
import { ClientListComponent } from './component/client/client-list/client-list.component';
import { AdminInfoComponent } from './component/profile/admin-info/admin-info.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import {ScrollingModule} from '@angular/cdk/scrolling';
import { MaterialModule } from '../material.module';
import { AddUserComponent } from './component/permission/users/add-user/add-user.component';
import { UserListComponent } from './component/permission/users/user-list/user-list.component';
import { DeleteUserComponent } from './component/permission/users/delete-user/delete-user.component';
import { ViewUserComponent } from './component/permission/users/view-user/view-user.component';
import { AddRoleComponent } from './component/permission/role/add-role/add-role.component';
import { RoleListComponent } from './component/permission/role/role-list/role-list.component';
import { DeleteRoleComponent } from './component/permission/role/delete-role/delete-role.component';
import { ViewRoleComponent } from './component/permission/role/view-role/view-role.component';
import { PermissionListComponent } from './component/permission/permission/permission-list/permission-list.component';
import { AddPermissionComponent } from './component/permission/permission/add-permission/add-permission.component';
import { DeletePermissionComponent } from './component/permission/permission/delete-permission/delete-permission.component';
import { ViewPermissionComponent } from './component/permission/permission/view-permission/view-permission.component';
import { UserStatusComponent } from './component/permission/users/user-status/user-status.component';
import { RolePermissionComponent } from './component/permission/role/role-permission/role-permission.component';
import { RoleStatusComponent } from './component/permission/role/role-status/role-status.component';
import { PermissionStatusComponent } from './component/permission/permission/permission-status/permission-status.component';
import { SidebarComponent } from './component/sidebar/sidebar.component';
import { SidebarModule } from 'ng-sidebar';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ProjectStatusComponent } from './component/project/project-status/project-status.component';
import { MarkAsteriskDirective } from './directives/mark-asterisk.directive';
import { SelectMenuComponent } from './component/menu/select-menu/select-menu.component';
import { AddModelComponent } from './component/menu/add-model/add-model.component';
import { AddCellStatusComponent } from './component/project/add-cell-status/add-cell-status.component';
import { UploadMenuComponent } from './component/menu/upload-menu/upload-menu.component';
import { DeleteMenuComponent } from './component/menu/delete-menu/delete-menu.component';
import { CellListComponent } from './component/cell/cell-list/cell-list.component';
import { AddCellComponent } from './component/cell/add-cell/add-cell.component';
import { DeleteCellComponent } from './component/cell/delete-cell/delete-cell.component';
import { PermissionComponent } from './component/client/permission/permission.component';
import { TrimFormFieldsDirective } from './directives/trim-form-fields.directive';
// import { ChartsModule } from 'ng2-charts';
import { NgChartsModule } from 'ng2-charts';
import { DemoUploadComponent } from './component/menu/demo-upload/demo-upload.component';
import { LoaderComponent } from './component/menu/loader/loader.component';
import { NoofitemComponent } from './component/menu/noofitem/noofitem.component';
import { SubgroupComponent } from './component/cell/subgroup/subgroup.component';
import { InteractiveComponent } from './component/menu/interactive/interactive.component';
import { OptimizationComponent } from './component/menu/optimization/optimization.component';
import { ChartComponent } from './component/graph/chart/chart.component';
import { ChartDataComponent } from './component/graph/chart-data/chart-data.component';
import { DataComponent } from './component/graph/data/data.component';
import { FiveitemsComponent } from './component/graph/fiveitems/fiveitems.component';
import { FouritemsComponent } from './component/graph/fouritems/fouritems.component';
import { ThreeitemsComponent } from './component/graph/threeitems/threeitems.component';
import { TwoitemsComponent } from './component/graph/twoitems/twoitems.component';
import { OneitemsComponent } from './component/graph/oneitems/oneitems.component';
import { CountComponent } from './component/graph/count/count.component';
import { SixitemsComponent } from './component/graph/sixitems/sixitems.component';
import { SevenitemsComponent } from './component/graph/sevenitems/sevenitems.component';
import { EightitemsComponent } from './component/graph/eightitems/eightitems.component';
import { ShowMessageComponent } from './component/menu/show-message/show-message.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTooltipModule} from '@angular/material/tooltip';
import { BreadcrumbComponent } from './component/graph/breadcrumb/breadcrumb.component';
import {ClipboardModule} from '@angular/cdk/clipboard';

@NgModule({
  declarations: [
    AddClientComponent,
    ClientListComponent,
    DashboardComponent,
    HeaderComponent,
    FooterComponent,
    LayoutComponent,
    DeleteClientComponent,
    ViewClientComponent,
    ProjectListComponent,
    AddProjectComponent,
    DeleteProjectComponent,
    DetailProjectComponent,
    AdminInfoComponent,
    AddUserComponent,
    UserListComponent,
    DeleteUserComponent,
    ViewUserComponent,
    AddRoleComponent,
    RoleListComponent,
    DeleteRoleComponent,
    ViewRoleComponent,
    PermissionListComponent,
    AddPermissionComponent,
    DeletePermissionComponent,
    ViewPermissionComponent,
    UserStatusComponent,
    RolePermissionComponent,
    RoleStatusComponent,
    PermissionStatusComponent,
    SidebarComponent,
    ProjectStatusComponent,
    MarkAsteriskDirective,
    SelectMenuComponent,
    AddModelComponent,
    AddCellStatusComponent,
    UploadMenuComponent,
    DeleteMenuComponent,
    CellListComponent,
    AddCellComponent,
    DeleteCellComponent,
    PermissionComponent,
    TrimFormFieldsDirective,
    DemoUploadComponent,
    LoaderComponent,
    NoofitemComponent,
    SubgroupComponent,
    InteractiveComponent,
    OptimizationComponent,
    ChartComponent,
    ChartDataComponent,
    DataComponent,
    FiveitemsComponent,
    FouritemsComponent,
    ThreeitemsComponent,
    TwoitemsComponent,
    OneitemsComponent,
    CountComponent,
    SixitemsComponent,
    SevenitemsComponent,
    EightitemsComponent,
    ShowMessageComponent,
    BreadcrumbComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule, 
    FlexLayoutModule,
    MatExpansionModule,
    ScrollingModule,
    MatTooltipModule,
    SidebarModule.forRoot(),
    ClipboardModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgChartsModule
  ]
})
export class AdminModule { }
