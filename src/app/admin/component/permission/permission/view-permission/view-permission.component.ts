import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { PsolutionsService } from 'src/app/services/psolutions.service';

@Component({
  selector: 'app-view-permission',
  templateUrl: './view-permission.component.html',
  styles: [`
  .tooltip-end-top label[for="status"],label[for="moduleName"]{
    color: #52595D;
    font-size : 19px;
  }
  .tooltip-end-top label{
    font-size : 18px;
  }`
  ]
})
export class ViewPermissionComponent implements OnInit {

  id: string;
  isEditable:boolean;
  moduleName:string;
  statusName:string;
  permissionDetails:boolean;
  permissionInsert : boolean;
  usermodule:boolean;
  rolemodule:boolean;
  permissionmodule:boolean;

  constructor(private route : ActivatedRoute,
              private router : Router,
              private services : PsolutionsService,
              private authentication : AuthenticationService) {
                this.route.params.subscribe(res => {
                  this.id = res.id;
              });
              if(this.authentication.currentUserValue){
                this.permissionDetails = this.authentication.currentUserValue.rolePermission.permissionDetails;
                this.permissionmodule = this.authentication.currentUserValue.rolePermission.permissionList;
                this.usermodule = this.authentication.currentUserValue.rolePermission.userList;
                this.rolemodule = this.authentication.currentUserValue.rolePermission.roleList;
                this.permissionInsert = this.authentication.currentUserValue.rolePermission.permissionInsert;
              }
            }

  async ngOnInit(): Promise<void> {
    if (this.id && this.permissionDetails) {
      await this.getPermission(this.id);
    }else{
      this.router.navigate(['noauthorize']);
    }
    this.isEditable = false;
  }
  private async getPermission(id: string): Promise<void> {
    const res = await this.services.getModuleByid(this.id).toPromise();
    const res1 = await this.services.getStatusByid(res.statusId).toPromise();
    setTimeout(() => {
        this.moduleName = res.moduleName,
        this.statusName =  res1.statusName
   },);
  }

  onAddUserPermission(){
    if(this.permissionInsert){
      this.router.navigate(['admin/permission/edit/'+this.id]);
    }
    else{
      this.router.navigate(['noauthorize']);
    }
  }
  onPermissionClick(){
    if(this.permissionmodule){
      this.router.navigate(['admin/permission/list'])
    }
    else{
      this.router.navigate(['noauthorize']);
    }
  }
  onUserClick(){
    if(this.usermodule){
      this.router.navigate(['admin/user/list'])
    }
    else{
      this.router.navigate(['noauthorize']);
    }
  }
  onRoleClick(){
    if(this.rolemodule){
      this.router.navigate(['admin/role/list'])
    }
    else{
      this.router.navigate(['noauthorize']);
    }
  }
}