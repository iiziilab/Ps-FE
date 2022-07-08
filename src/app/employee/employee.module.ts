import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EmployeeRoutingModule } from './employee-routing.module';
import { HeaderComponent } from './component/header/header.component';
import { LayoutComponent } from './component/layout/layout.component';
import { DashboardComponent } from "./component/dashboard/dashboard.component";
import { FooterComponent } from "./component/footer/footer.component";
import { ProjectListComponent } from './component/project/project-list/project-list.component';
import { ViewProjectComponent } from './component/project/view-project/view-project.component';
import { MaterialModule } from '../material.module';
import { EmployeeInfoComponent } from './component/profile/employee-info/employee-info.component';
import { AddProjectComponent } from './component/project/add-project/add-project.component';
import { MarkAsteriskDirective } from './directives/mark-asterisk.directive';
import { CellListComponent } from './component/project/cell-list/cell-list.component';
import { ViewMenuComponent } from './component/project/view-menu/view-menu.component';
import { SidebarComponent } from './component/sidebar/sidebar.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTooltipModule} from '@angular/material/tooltip';
import {ClipboardModule} from '@angular/cdk/clipboard';

@NgModule({
  declarations: [
    HeaderComponent,
    LayoutComponent,
    ProjectListComponent,
    ViewProjectComponent,
    DashboardComponent,
    FooterComponent,
    EmployeeInfoComponent,
    AddProjectComponent,
    MarkAsteriskDirective,
    CellListComponent,
    ViewMenuComponent,
    SidebarComponent
  ],
  imports: [
    CommonModule,
    EmployeeRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatExpansionModule,
    MatTooltipModule,
    ClipboardModule
  ]
})
export class EmployeeModule { }
