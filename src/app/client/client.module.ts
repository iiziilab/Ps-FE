import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientRoutingModule } from './client-routing.module';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { FooterComponent } from './component/footer/footer.component';
import { HeaderComponent } from './component/header/header.component';
import { LayoutComponent } from './component/layout/layout.component';
import { EmployeeListComponent } from './component/employee/employee-list/employee-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatCardModule} from '@angular/material/card';
import {MatTabsModule} from '@angular/material/tabs';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MAT_DATE_LOCALE, MatNativeDateModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {MatDialogModule} from '@angular/material/dialog';
import {MatChipsModule} from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ViewEmployeeComponent } from './component/employee/view-employee/view-employee.component';
import { ProjectListComponent } from './component/project/project-list/project-list.component';
import { ViewProjectComponent } from './component/project/view-project/view-project.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import {ScrollingModule} from '@angular/cdk/scrolling';
import { MaterialModule } from '../material.module';
import { ClientInfoComponent } from './component/profile/client-info/client-info.component';
import { SidebarComponent } from './component/sidebar/sidebar.component';


@NgModule({
  declarations: [
    DashboardComponent,
    FooterComponent,
    HeaderComponent,
    LayoutComponent,
    EmployeeListComponent,
    ViewEmployeeComponent,
    ProjectListComponent,
    ViewProjectComponent,
    ClientInfoComponent,
    SidebarComponent
  ],
  imports: [
    CommonModule,
    ClientRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    // MatTableModule,
    // MatSortModule,
    // MatPaginatorModule,
    // MatMenuModule, 
    // MatFormFieldModule, 
    // MatInputModule,
    // MatIconModule, 
    // MatDatepickerModule, 
    // MatNativeDateModule,
    // MatListModule, 
    // MatSelectModule, 
    // MatDialogModule,
    // MatCardModule, 
    // MatChipsModule,
    // MatTabsModule,
    // MatCheckboxModule,
    MaterialModule,
    RouterModule, 
    FlexLayoutModule,
    ScrollingModule
  ]
})
export class ClientModule { }
