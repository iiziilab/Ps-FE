import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { PsolutionsService } from 'src/app/services/psolutions.service';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styles: [`
  .tooltip-end-top label[for="firstName"],label[for="email"],label[for="lastName"],label[for="role"],label[for="status"],
  label[for="designation"]{
    color: #52595D;
    font-size : 19px;
  }
  .tooltip-end-top label{
    font-size : 18px;
  }`
  ]
})
export class ViewUserComponent implements OnInit {

  id: string;
  isEditable:boolean;
  firstname:string;
  lastname:string;
  email:string;
  role:any =[];
  designation:string;
  status:string;
  userInsert:boolean;
  userDetails:boolean;
  userList:boolean;
  rolemodule:boolean;
  permissionmodule:boolean;
  roleid :any = [];

  
  constructor(private route : ActivatedRoute,
              private router : Router,
              private services : PsolutionsService,
              private authentication : AuthenticationService) {
                this.route.params.subscribe(res => {
                  this.id = res.id;
              });
              if(this.authentication.currentUserValue){
                this.userInsert = this.authentication.currentUserValue.rolePermission.userInsert;
                this.userDetails = this.authentication.currentUserValue.rolePermission.userDetails;
                this.userList = this.authentication.currentUserValue.rolePermission.userList;
                this.rolemodule = this.authentication.currentUserValue.rolePermission.roleList;
                this.permissionmodule = this.authentication.currentUserValue.rolePermission.permissionList;
              }
            }

  async ngOnInit(): Promise<void> {
    if (this.id && this.userDetails) {
        await this.getUser(this.id);
    }else{
      this.router.navigate(['noauthorize']);
    }
    this.isEditable = false;
  }
  private async getUser(id: string): Promise<void> {
    const result = await this.services.getUserInfoByid(this.id).toPromise();
    const roleres = await this.services.getRoleListByid(result.roleId).toPromise();
    const res = await this.services.getStatusByid(result.statusId).toPromise();

    setTimeout(() => {
        this.firstname = result.firstName,
        this.lastname = result.lastName,
        this.email =  result.email,
        this.role = roleres.map((function(t:any){return t.roleName})),
        this.designation = result.designation,
        this.status = res.statusName
   },0);
  }

  onAddClient(){
    if(this.userInsert){
      this.router.navigate(['admin/user/add']);
    }else{
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
    if(this.userList){
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