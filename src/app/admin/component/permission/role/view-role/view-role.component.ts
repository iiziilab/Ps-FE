import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { PsolutionsService } from 'src/app/services/psolutions.service';

@Component({
  selector: 'app-view-role',
  templateUrl: './view-role.component.html',
  styles: [`
  .tooltip-end-top label[for="role"]{
    color: #52595D;
    font-size : 19px;
  }
  .tooltip-end-top label{
    font-size : 18px;
  }`
  ]
})
export class ViewRoleComponent implements OnInit {

  id: string;
  isEditable:boolean;
  role:string;
  usermodule:boolean;
  rolemodule:boolean;
  permissionmodule:boolean;
  roleDetails: boolean;
  roleInsert : boolean;
  

  constructor(private route : ActivatedRoute,
              private router : Router,
              private services : PsolutionsService,
              private authentication : AuthenticationService) {
                this.route.params.subscribe(res => {
                  this.id = res.id;
              });
              if(this.authentication.currentUserValue){
                this.roleDetails = this.authentication.currentUserValue.rolePermission.roleDetails;
                this.rolemodule = this.authentication.currentUserValue.rolePermission.roleList;
                this.permissionmodule = this.authentication.currentUserValue.rolePermission.permissionList;
                this.usermodule = this.authentication.currentUserValue.rolePermission.userList;
                this.roleInsert = this.authentication.currentUserValue.rolePermission.roleInsert;
              }
            }

  async ngOnInit(): Promise<void> {
    if (this.id && this.roleDetails) {
        await this.getRole(this.id);
    }else{
      this.router.navigate(['noauthorize']);
    }
    this.isEditable = false;
  }
  private async getRole(id: string): Promise<void> {
    const result = await this.services.getRoleByid(this.id).toPromise();
    setTimeout(() => {
        this.role = result.roleName
   },);
  }

  onAddClient(){
    if(this.roleInsert){
      this.router.navigate(['admin/role/add']);
    }
    else{
      this.router.navigate(['noauthorize']);
    }
  }
}
