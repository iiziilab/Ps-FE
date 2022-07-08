import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';

import { MatTableDataSource } from '@angular/material/table';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { PsolutionsService } from 'src/app/services/psolutions.service';
import { DeleteUserComponent } from '../delete-user/delete-user.component';
import { UserInfo } from 'src/app/model/userinfo.model';
import { UserStatusComponent } from '../user-status/user-status.component';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
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
export class UserListComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  public pageSize = 10;
  public currentPage = 0;
  public totalSize = 0;
  public array: any;
  id: string;
  statusClass = 'active';
  userInsert :boolean;
  userUpdate :boolean;
  userDelete :boolean;
  userDetails:boolean;
  userList :boolean;
  message : string;

  displayedColumns: string[] = ['Sr.No','Name', 'Email','Status','action'];
  public UserInfo: UserInfo[] = [];
  dataSource = new MatTableDataSource(this.UserInfo);
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
                this.userInsert = this.authentication.currentUserValue.rolePermission.userInsert;
                this.userUpdate = this.authentication.currentUserValue.rolePermission.userUpdate;
                this.userDelete = this.authentication.currentUserValue.rolePermission.userDelete;
                this.userDetails = this.authentication.currentUserValue.rolePermission.userDetails;
                this.userList = this.authentication.currentUserValue.rolePermission.userList;
              }
            }

  async ngOnInit(): Promise<void> {
    if(this.userList){
      var result = await this.services.getUserInfo().toPromise();

      this.UserInfo = result;
      
      this.dataSource = new MatTableDataSource(this.UserInfo);
    
      this.dataSource.paginator = this.paginator;
              this.array = result;
              this.totalSize = this.array.length;
              this.iterator();
    }
    else{
     this.router.navigate(['noauthorize']);
    }
  }
  onEdit(value: any): void{
    if(this.userUpdate){
      this.router.navigate(['admin/user/edit/' + value.userid]);
    }else{
      this.router.navigate(['noauthorize']);
    }
  }
  onView(value: any): void{
    if(this.userDetails){
      this.router.navigate(['admin/user/view/' + value.userid]);
    }
    else{
     this.router.navigate(['noauthorize']);
    }
  }
  async onDeleteSelected(value: any): Promise<void> {
    if(this.userDelete){
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
    
      dialogConfig.data = {
      };
      const dialogRef = this.dialog.open(DeleteUserComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(
          data => {
            if (data === 'no') {
                return;
            }
    
        try {
            this.services.deleteUserInfo(value.userid).subscribe(
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
  onAddUser(){
    if(this.userInsert){
      this.router.navigate(['admin/user/add']);
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
    const dialogRef = this.dialog.open(UserStatusComponent, dialogConfig);
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
          value.status.statusName = data;
          this.services.updateUserInfo(value.userid,value).subscribe(
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
