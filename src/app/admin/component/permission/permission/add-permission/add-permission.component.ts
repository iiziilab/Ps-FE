import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Module } from 'src/app/model/module.model';
import { Status } from 'src/app/model/status.model';
import { role } from 'src/app/model/userlog.model';
import { userPermission } from 'src/app/model/userpermission.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { PsolutionsService } from 'src/app/services/psolutions.service';

@Component({
  selector: 'app-add-permission',
  templateUrl: './add-permission.component.html',
  styles: [`  .dropdown-toggle.show::after {
    transform: rotate(
135deg); 
}
 .dropdown-toggle::after {
   width: 5px;
   height: 5px;
   border: initial;
   transform: rotate(
45deg);
   border-top: 1px solid;
   border-right: 1px solid;
   margin-top: initial;
   vertical-align: middle;
   margin-bottom: 2px;
}
.dropdown-menu {
 line-height: 1.3;
 background-color: transparent!important;
 border-radius: var(--border-radius-md);
 border: none;
 color: var(--body);
 font-family: var(--font);
 font-size: 1em;
}`
  ]
})
export class AddPermissionComponent implements OnInit {

  constructor(private services: PsolutionsService,
    private formBuilder : FormBuilder,
    private route : ActivatedRoute,
    private router : Router,
    private authenticationService : AuthenticationService) {
      this.route.params.subscribe(res =>{
        this.id = res.id;
      })
      if(this.authenticationService.currentUserValue){
        this.permissionInsert = this.authenticationService.currentUserValue.rolePermission.permissionInsert;
        this.permissionUpdate = this.authenticationService.currentUserValue.rolePermission.permissionUpdate;
        this.usermodule = this.authenticationService.currentUserValue.rolePermission.userList;
        this.rolemodule = this.authenticationService.currentUserValue.rolePermission.roleList;
        this.permissionmodule = this.authenticationService.currentUserValue.rolePermission.permissionList;
      }
     }

     permissionform : FormGroup;
     id:any;
     save:boolean;
     edit:boolean;
     message:string;
     title : string ="Edit"
     selectedstatus : any;
     show : boolean;
     permissionInsert : boolean;
     permissionUpdate : boolean;
     usermodule : boolean;
     rolemodule : boolean;
     permissionmodule : boolean;
     public status : Status[];

  async ngOnInit(): Promise<void> {
    this.permissionform =this.formBuilder.group({
      moduleName : ['',Validators.required],
      statusId : ['',Validators.required],
      modulepermissionId : ['']
    })
    const statusres = await this.services.getStatus().toPromise();
    this.status = statusres;

    if(this.id){
      if(this.permissionUpdate){
        this.save = false;
        this.edit = true;
        const res = await this.services.getModuleByid(this.id).toPromise();
        this.selectedstatus = res.statusId;
        this.permissionform.setValue(res);
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
    if(this.permissionInsert){
      this.show = true;
    try{
      const model : Module={
        modulepermissionId : 0,
        ModuleName:this.f.moduleName.value,
        statusId : this.selectedstatus
      };
      // stop here if form is invalid
      if (this.permissionform.invalid) {
        return;
      }
      const result = await this.services.addModule(model).toPromise();
      if (result.statusCode == 200) {
        this.message = result.message;
        setTimeout(() => {
          this.router.navigate(['admin/permission/list']);
        }, 600);
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

  get f() { return this.permissionform.controls; }

  async onEdit(): Promise<void> {
    this.show =true;
    try {
      const model : Module={
        modulepermissionId : this.id,
        ModuleName:this.f.moduleName.value,
        statusId : this.selectedstatus
      };
      // stop here if form is invalid
      if (this.permissionform.invalid) {
        return;
      }
      const result = await this.services.updateModule(this.id, model).toPromise();
      if (result.statusCode == 200) {
        this.message = result.message;
      }
      setTimeout(() => {
        this.router.navigate(['admin/permission/list']);
      }, 600);
    } catch (e) {
      console.log(e);
    }
  }
  onstatusChange(event:any) : void{
    this.selectedstatus = event.target.value;
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


