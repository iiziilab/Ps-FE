import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Status } from 'src/app/model/status.model';
import { role } from 'src/app/model/userlog.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { PsolutionsService } from 'src/app/services/psolutions.service';

@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styles: [
  ]
})
export class AddRoleComponent implements OnInit {

  constructor(private services: PsolutionsService,
    private formBuilder : FormBuilder,
    private route : ActivatedRoute,
    private router : Router,
    private authenticationService : AuthenticationService) {
      this.route.params.subscribe(res =>{
        this.id = res.id;
      })
      if(this.authenticationService.currentUserValue){
        this.roleInsert = this.authenticationService.currentUserValue.rolePermission.roleInsert;
        this.roleUpdate = this.authenticationService.currentUserValue.rolePermission.roleUpdate;
        this.rolemodule = this.authenticationService.currentUserValue.rolePermission.roleList;
        this.usermodule = this.authenticationService.currentUserValue.rolePermission.userList;
        this.permissionmodule = this.authenticationService.currentUserValue.rolePermission.permissionList;
      }
     }

     roleform : FormGroup;
     id:any;
     save:boolean;
     edit:boolean;
     message:string;
     title : string = "Add Role";
     selectedstatus : any;
     show : boolean;
     roleInsert: boolean;
     roleUpdate : boolean;
     usermodule: boolean;
     rolemodule:boolean;
     permissionmodule:boolean;
     public status: Status[];

  async ngOnInit(): Promise<void> {
    this.roleform =this.formBuilder.group({
      roleName : ['',Validators.required],
      statusId : ['',Validators.required],
      roleId :['']
    })
 
    const statusres = await this.services.getStatus().toPromise();
    this.status = statusres;

    if(this.id){
      if(this.roleUpdate){
        this.save = false;
        this.edit = true;
        this.title = "Edit Role"
        const res = await this.services.getRoleByid(this.id).toPromise();
        this.selectedstatus = res.statusId;
        //this.f.role.setValue(res.roleName);
        this.roleform.setValue(res);
      }
      else{
        this.router.navigate(['noauthorize']);
      }
    }
    else if(this.id === undefined){
      this.save = true;
      this.edit = false;
    }
    this.show = false;
  }

  async onSave(): Promise<void>{
    if(this.roleInsert){
      this.show = true;
    try{
      const model : Role={
        roleId : 0,
        roleName:this.f.roleName.value,
        statusId : this.selectedstatus
      };
      // stop here if form is invalid
      if (this.roleform.invalid) {
        return;
      }
      const result = await this.services.addRole(model).toPromise();
      if (result.statusCode == 200) {
        this.message = result.message;
        setTimeout(() => {
          this.router.navigate(['admin/role/list']);
        }, 600);
        //this.router.navigate(['admin/dashboard']);
    }
  }
    catch(ex){
      console.log(ex);
    }
    }
    else{
      this.router.navigate(['noauthorize']);
    }
  }

  get f() { return this.roleform.controls; }

  async onEdit(): Promise<void> {
    this.show =true;
    try {
      const model : Role={
        roleId : this.id,
        roleName:this.f.roleName.value,
        statusId : this.selectedstatus
      };
      // stop here if form is invalid
      if (this.roleform.invalid) {
        return;
      }
      const result = await this.services.updateRole(this.id, model).toPromise();
      if (result.statusCode == 200) {
        this.message = result.message;
      }
      setTimeout(() => {
        this.router.navigate(['admin/role/list']);
      }, 600);
    } catch (e) {
      console.log(e);
    }
  }
  onstatusChange(event:any) : void{
    this.selectedstatus = event.target.value;
    console.log(this.selectedstatus);
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
export class Role{
  roleId : number;
  roleName: string;
  statusId : number;
}


