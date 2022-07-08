import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';

import { MatTableDataSource } from '@angular/material/table';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { PsolutionsService } from 'src/app/services/psolutions.service';
import { DeletePermissionComponent } from '../delete-permission/delete-permission.component';
import { PermissionStatusComponent } from '../permission-status/permission-status.component';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-permission-list',
  templateUrl: './permission-list.component.html',
  styles: [`
  table {
    width: 100%;
  }
  [hidden] {
    display: none !important;
}
  `
  ]
})
export class PermissionListComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  public pageSize = 10;
  public currentPage = 0;
  public totalSize = 0;
  public array: any;
  id: string;
  statusClass:any;
  permissionInsert : boolean;
  permissionUpdate : boolean;
  permissionDelete : boolean;
  permissionDetails: boolean;
  permissionList : boolean;
  message:string;


  displayedColumns: string[] = ['Sr.No', 'ModuleName','Status', 'action'];
  public permission: Permission[] = [];
  dataSource = new MatTableDataSource(this.permission);
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
                this.permissionInsert = this.authentication.currentUserValue.rolePermission.permissionInsert;
                this.permissionUpdate = this.authentication.currentUserValue.rolePermission.permissionUpdate;
                this.permissionDelete = this.authentication.currentUserValue.rolePermission.permissionDelete;
                this.permissionDetails = this.authentication.currentUserValue.rolePermission.permissionDetails;
                this.permissionList = this.authentication.currentUserValue.rolePermission.permissionList;
              }
            }

  async ngOnInit(): Promise<void> {
    if(this.permissionList){
      var result = await this.services.getModule().toPromise();
      this.permission = result;
      this.dataSource = new MatTableDataSource(this.permission);
      
      this.dataSource.paginator = this.paginator;
              this.array = result;
              this.totalSize = this.array.length;
              this.iterator();
    }else{
      this.router.navigate(['noauthorize']);
    }
  }
  onEdit(value: any): void{
    if(this.permissionUpdate){
      this.router.navigate(['admin/permission/edit/' + value.modulepermissionId]);
    }else{
      this.router.navigate(['noauthorize']);
    }
    
  }
  onView(value: any): void{
    if(this.permissionDetails){
      this.router.navigate(['admin/permission/view/' + value.modulepermissionId]);
    }else{
      this.router.navigate(['noauthorize']);
    }
  }
  async onDeleteSelected(value: any): Promise<void> {
    if(this.permissionDelete){
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
    
      dialogConfig.data = {
      };
      const dialogRef = this.dialog.open(DeletePermissionComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(
          data => {
            if (data === 'no') {
                return;
            }
    
        try {
            this.services.deleteModule(value.modulepermissionId).subscribe(
              (res) => {
                  this.ngOnInit();
                }
              );
            } catch (e) {
  
            }
          }
      );
    }else{
      this.router.navigate(['noauthorize']);
    }
  }
  onAddUserPermission(){
    if(this.permissionInsert){
      this.router.navigate(['admin/permission/add']);
    }else{
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
    const dialogRef = this.dialog.open(PermissionStatusComponent, dialogConfig);
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
          value.statusId = value.status.statusId;
          this.services.updateModule(value.modulepermissionId,value).subscribe(
            (res) => {
                this.ngOnInit();
              }
            );
          } catch (e) {

          }
        }
    );
  }
}
export class Permission {
  userpermissionId: string;
  Email: string;
  Role: string;
}
