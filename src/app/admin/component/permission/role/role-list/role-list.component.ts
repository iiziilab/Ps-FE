import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';

import { MatTableDataSource } from '@angular/material/table';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { PsolutionsService } from 'src/app/services/psolutions.service';
import { DeleteRoleComponent } from '../delete-role/delete-role.component';
import { role } from 'src/app/model/userlog.model';
import { UserStatusComponent } from '../../users/user-status/user-status.component';
import { RoleStatusComponent } from '../role-status/role-status.component';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styles: [`
  table {
    width: 100%;
  }
  .ng-sidebar-container{
    height:100vh;
  }
  ::ng-deep .ng-sidebar{
    width:300px;
    background-color:red;
  }
  [hidden] {
    display: none !important;
}
  `
  ]
})
export class RoleListComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  public pageSize = 10;
  public currentPage = 0;
  public totalSize = 0;
  public array: any;
  id: string;
  statusClass = 'active';
  roleInsert : boolean;
  roleUpdate  : boolean;
  roleDelete  : boolean;
  roleDetails : boolean;
  roleList  : boolean;
  message : string;

  displayedColumns: string[] = ['Sr.No','Name','Status','ChangePermission','action'];
  public role: role[] = [];
  dataSource = new MatTableDataSource(this.role);
  selectedRow: any;
  editmode = false;

  constructor(private router : Router,
              private route : ActivatedRoute,
              private services : PsolutionsService,
              private dialog: MatDialog,
              private authentication : AuthenticationService) {
              this.route.params.subscribe(res => {
                this.id = res.id;
              });
              if (this.authentication.currentUserValue) {
                this.roleInsert = this.authentication.currentUserValue.rolePermission.roleInsert;
                this.roleUpdate = this.authentication.currentUserValue.rolePermission.roleUpdate;
                this.roleDelete = this.authentication.currentUserValue.rolePermission.roleDelete;
                this.roleDetails = this.authentication.currentUserValue.rolePermission.roleDetails;
                this.roleList = this.authentication.currentUserValue.rolePermission.roleList;
              }
            }

  async ngOnInit(): Promise<void> {
    if(this.roleList){
      var result = await this.services.getRole().toPromise();
      this.role = result;
      this.dataSource = new MatTableDataSource(this.role);
      
      this.dataSource.paginator = this.paginator;
              this.array = result;
              this.totalSize = this.array.length;
              this.iterator();
    }else{
      this.router.navigate(['noauthorize']);
    }
    
  }
  onEdit(value: any): void{
    if(this.roleUpdate){
      this.router.navigate(['admin/role/edit/' + value.roleId]);
    }else{
      this.router.navigate(['noauthorize']);
    }
  }
    
  onView(value: any): void{
    if(this.roleDetails){
      this.router.navigate(['admin/role/view/' + value.roleId]);
    }
    else{
      this.router.navigate(['noauthorize']);
    }
  }
  async onDeleteSelected(value: any): Promise<void> {
    if(this.roleDelete){
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
    
      dialogConfig.data = {
      };
      const dialogRef = this.dialog.open(DeleteRoleComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(
          data => {
            if (data === 'no') {
                return;
            }
    
        try {
            this.services.deleteRole(value.roleId).subscribe(
              (res) => {
                  this.ngOnInit();
                }
              );
            } catch (e) {

            }
          }
        );
    }
    else{
      this.router.navigate(['noauthorize']);
    }
  }
  onAddRole(){
    if(this.roleInsert){
      this.router.navigate(['admin/role/add']);
    }
    else{
      this.router.navigate(['noauthorize']);
    }
  }
  highlight(): void {
    this.editmode = !!this.selectedRow;
  }
  public handlePage(e: any) {
    this.currentPage = e.pageIndex;
    this.pageSize = e.pageSize;
    this.iterator();
  }
  
  private iterator() {
    const end = (this.currentPage + 1) * this.pageSize;
    const start = this.currentPage * this.pageSize;
    const part = this.array.slice(start, end);
    this.dataSource = part;
  }
  
  onPermissionClick(){
    this.router.navigate(['admin/permission/list'])
  }
  onUserClick(){
    this.router.navigate(['admin/user/list'])
  }
  onRoleClick(){
    this.router.navigate(['admin/role/list'])
  }
  async onchangingStatus(value: any): Promise<void>{
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '380px';
    dialogConfig.height = '250px';

    dialogConfig.data = {
    };
    const dialogRef = this.dialog.open(RoleStatusComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      data => {
        if (data === 'Inactive') {
          value.status.statusId = 2;
          this.statusClass = 'inactive';
      }else if (data === 'Active'){
        value.status.statusId = 1;
        this.statusClass = 'active';
      }else{
        return;
      }
      try {
          //value.roleId = value.role.roleId;
          value.statusId = value.status.statusId;
          //value.status.statusName = data;
          this.services.updateRole(value.roleId,value).subscribe(
            (res) => {
                this.ngOnInit();
              }
            );
          } catch (e) {

          }
        }
    );
  }
  async onchangingPermission(value:any):Promise<void>{
    this.router.navigate(['admin/role/permission/' + value.roleId])
  }
}
  