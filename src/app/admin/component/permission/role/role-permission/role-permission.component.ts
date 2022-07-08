import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { rolePermission } from 'src/app/model/rolepermission.model';
import { role } from 'src/app/model/userlog.model';
import { userPermission } from 'src/app/model/userpermission.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { PsolutionsService } from 'src/app/services/psolutions.service';

@Component({
  selector: 'app-role-permission',
  templateUrl: './role-permission.component.html',
  styles: [`
   .form-check {
    margin-bottom: 0.6rem;
    padding-right: 1em!important;
}
.form-check .form-check-input {
    border-color: var(--muted!important);
    background-color: initial;
    margin-top: .2em;
}
.form-check-input[type=checkbox] {
    border-radius: var(--border-radius-sm);
}
.form-check-input {
    width: 18px!important;
    height: 18px!important;
}
.form-check-input:checked {
  background-color: var(--primary)!important;
  border-color: var(--primary)!important;
}
`
  ]
})
export class RolePermissionComponent implements OnInit {
  IsChecked:boolean;
  IsIndeterminate:boolean;
  IsDisabled:boolean;

  constructor(private services: PsolutionsService,
    private formBuilder : FormBuilder,
    private route : ActivatedRoute,
    private router : Router,
    private authenticationService : AuthenticationService) {
      this.route.params.subscribe(res =>{
        this.id = res.id;
      })
      this.IsChecked =false;
      this.IsIndeterminate =false;
      this.IsDisabled =false;
     }

    permissionform : FormGroup;
    id:any;
    save:boolean;
    edit:boolean;
    message:string;
    selectedrole : any;
    show : boolean;
    clientInsert : boolean;
    clientUpdate    : boolean;
    clientDelete : boolean;
    clientList : boolean;
    clientDetails : boolean;
    projectInsert: boolean;
    projectUpdate: boolean;
    projectDelete: boolean;
    projectList : boolean;
    projectDetails : boolean;
    userInsert: boolean;
    userUpdate: boolean;
    userDelete: boolean;
    userList : boolean;
    userDetails : boolean;
    roleInsert: boolean;
    roleUpdate: boolean;
    roleDelete: boolean;
    roleList : boolean;
    roleDetails : boolean;
    permissionInsert: boolean;
    permissionUpdate: boolean;
    permissionDelete: boolean;
    permissionList : boolean;
    permissionDetails : boolean;
    client : boolean;
    project : boolean;
    user : boolean;
    role:boolean;
    permission: boolean;
    SelectUnSelect : boolean;
    clientSelectUnSelect : boolean;
    projectSelectUnSelect : boolean;
    userSelectUnSelect : boolean;
    roleSelectUnSelect : boolean;
    permissionSelectUnSelect : boolean;
    cellList:boolean;
    upload:boolean;
    menu:boolean;

async ngOnInit(): Promise<void> {
 this.permissionform =this.formBuilder.group({
   clientInsert : [''],
   clientUpdate : [''],
   clientDelete : [''],
   clientList : [''],
   clientDetails : [''],
   projectInsert : [''],
   projectUpdate : [''],
   projectDelete : [''],
   projectList : [''],
   projectDetails : [''],
   userInsert : [''],
   userUpdate : [''],
   userDelete : [''],
   userList : [''],
   userDetails : [''],
   roleInsert : [''],
   roleUpdate : [''],
   roleDelete : [''],
   roleList : [''],
   roleDetails : [''],
   permissionInsert : [''],
   permissionUpdate : [''],
   permissionDelete : [''],
   permissionList : [''],
   permissionDetails : [''],
   rolepermissionId:[''],
   roleId:[''],
   role:[''],
   cellList:[''],
   upload:[''],
   menu:['']
 })

 const clientres = await this.services.getModuleByid(1).toPromise();
    if(clientres.statusId == 1){
      this.client =  true;
    }
    else{
      this.client =  false;
    }
    //project
    const projectres = await this.services.getModuleByid(2).toPromise();
    if(projectres.statusId == 1){
      this.project =  true;
    } else{
      this.project =  false;
    }
    //permission
    const permissionres = await this.services.getModuleByid(5).toPromise();
    if(permissionres.statusId == 1){
      this.permission =  true;
    } else{
      this.permission =  false;
    }
    //user
    const userres = await this.services.getModuleByid(3).toPromise();
    if(userres.statusId == 1){
      this.user =  true;
    } else{
      this.user =  false;
    }
    //role
    const roleres = await this.services.getModuleByid(4).toPromise();
    if(roleres.statusId == 1){
      this.role =  true;
    } else{
      this.role =  false;
    }

 if(this.id){
   this.save = false;
   this.edit = true;
   const modres = await this.services.getModule().toPromise();
   const result = await this.services.getRoleByid(this.id).toPromise();
   this.selectedrole = result.roleName;
   const res = await this.services.getRolePermissionByRoleid(this.id).toPromise();
   if(res != null){
    this.permissionform.setValue(res);
    this.clientInsert= res.clientInsert,
    this.clientUpdate = res.clientUpdate,
    this.clientDelete = res.clientDelete,
    this.clientList = res.clientList,
    this.clientDetails = res.clientDetails,
    this.projectInsert = res.projectInsert,
    this.projectUpdate = res.projectUpdate,
    this.projectDelete = res.projectDelete,
    this.projectList = res.projectList,
    this.projectDetails = res.projectDetails,
    this.userInsert = res.userInsert,
    this.userUpdate = res.userUpdate,
    this.userDelete = res.userDelete,
    this.userList = res.userList,
    this.userDetails = res.userDetails,
    this.roleInsert = res.roleInsert,
    this.roleUpdate = res.roleUpdate,
    this.roleDelete = res.roleDelete,
    this.roleList = res.roleList,
    this.roleDetails = res.roleDetails,
    this.permissionInsert = res.permissionInsert,
    this.permissionUpdate = res.permissionUpdate,
    this.permissionDelete = res.permissionDelete,
    this.permissionList = res.permissionList,
    this.permissionDetails = res.permissionDetails;
    this.cellList = res.cellList;
    this.upload = res.upload;
    this.menu = res.menu;
   }
 }
 else if(this.id === undefined){
   this.save = true;
   this.edit = false;
 }
 this.show = false;
}

async onSave(): Promise<void>{
 this.show = true;
 try{
   const model : rolePermission={
     roleId : this.id,
     clientInsert:this.clientInsert,
     clientUpdate:this.clientUpdate,
     clientDelete : this.clientDelete,
     clientDetails:this.clientDetails,
     clientList:this.clientList,
     projectInsert:this.projectInsert,
     projectUpdate:this.projectUpdate,
     projectDelete:this.projectDelete,
     projectDetails:this.projectDetails,
     projectList:this.projectList,
     userInsert:this.userInsert,
     userUpdate:this.userUpdate,
     userDelete:this.userDelete,
     userDetails:this.userDetails,
     userList:this.userList,
     roleInsert:this.roleInsert,
     roleUpdate:this.roleUpdate,
     roleDelete:this.roleDelete,
     roleDetails:this.roleDetails,
     roleList:this.roleList,
     permissionInsert:this.permissionInsert,
     permissionUpdate:this.permissionUpdate,
     permissionDelete:this.permissionDelete,
     permissionDetails:this.permissionDetails,
     permissionList:this.permissionList,
     cellList : this.cellList,
     upload : this.upload,
     menu : this.menu,
     rolepermissionId:this.id
   };
   // stop here if form is invalid
   if (this.permissionform.invalid) {
     return;
   }
   const result = await this.services.addRolePermission(model).toPromise();
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

get f() { return this.permissionform.controls; }

async onEdit(): Promise<void> {
 this.show =true;
 try {
  const model : rolePermission={
    roleId : this.id,
    clientInsert:this.clientInsert,
    clientUpdate:this.clientUpdate,
    clientDelete : this.clientDelete,
    clientDetails:this.clientDetails,
    clientList:this.clientList,
    projectInsert:this.projectInsert,
    projectUpdate:this.projectUpdate,
    projectDelete:this.projectDelete,
    projectDetails:this.projectDetails,
    projectList:this.projectList,
    userInsert:this.userInsert,
    userUpdate:this.userUpdate,
    userDelete:this.userDelete,
    userDetails:this.userDetails,
    userList:this.userList,
    roleInsert:this.roleInsert,
    roleUpdate:this.roleUpdate,
    roleDelete:this.roleDelete,
    roleDetails:this.roleDetails,
    roleList:this.roleList,
    permissionInsert:this.permissionInsert,
    permissionUpdate:this.permissionUpdate,
    permissionDelete:this.permissionDelete,
    permissionDetails:this.permissionDetails,
    permissionList:this.permissionList,
    cellList : this.cellList,
    upload : this.upload,
    menu : this.menu,
    rolepermissionId:this.id
  };
   // stop here if form is invalid
   if (this.permissionform.invalid) {
     return;
   }
   const result = await this.services.addRolePermission(model).toPromise();
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

public onclientInsertChanged(e:any){
 if(e.target.checked){
   this.clientInsert = true;
 }
 else{
   this.clientInsert = false;
 }
}
public onclientUpdateChanged(e:any){
 if(e.target.checked){
   this.clientUpdate = true;
 }
 else{
   this.clientUpdate = false;
 }
 
}
public onclientDeleteChanged(e:any){
 if(e.target.checked){
   this.clientDelete = true;
 }
 else{
   this.clientDelete = false;
 }
 
}
public onclientListChanged(e:any){
 if(e.target.checked){
   this.clientList = true;
 }
 else{
   this.clientList = false;
 }
 
}
public onclientViewChanged(e:any){
 if(e.target.checked){
   this.clientDetails = true;
 }
 else{
   this.clientDetails = false;
 }
 
}
public onprojectInsertChanged(e:any){
 if(e.target.checked){
   this.projectInsert = true;
 }
 else{
   this.projectInsert = false;
 }
 
}
public onprojectUpdateChanged(e:any){
 if(e.target.checked){
   this.projectUpdate = true;
 }
 else{
   this.projectUpdate = false;
 }
 
}
public onprojectDeleteChanged(e:any){
 if(e.target.checked){
   this.projectDelete = true;
 }
 else{
   this.projectDelete = false;
 }
 
}
public onprojectListChanged(e:any){
 if(e.target.checked){
   this.projectList = true;
 }
 else{
   this.projectList =false;
 }
 
}
public onprojectViewChanged(e:any){
 if(e.target.checked){
   this.projectDetails = true;
 }
 else{
   this.projectDetails = false;
 }
 
}
//user module
public onuserInsertChanged(e:any){
  if(e.target.checked){
    this.userInsert = true;
  }
  else{
    this.userInsert = false;
  }
  
 }
 public onuserUpdateChanged(e:any){
  if(e.target.checked){
    this.userUpdate = true;
  }
  else{
    this.userUpdate = false;
  }
  
 }
 public onuserDeleteChanged(e:any){
  if(e.target.checked){
    this.userDelete = true;
  }
  else{
    this.userDelete = false;
  }
  
 }
 public onuserListChanged(e:any){
  if(e.target.checked){
    this.userList = true;
  }
  else{
    this.userList =false;
  }
  
 }
 public onuserViewChanged(e:any){
  if(e.target.checked){
    this.userDetails = true;
  }
  else{
    this.userDetails = false;
  }
  
 }
 // role module
 public onroleInsertChanged(e:any){
  if(e.target.checked){
    this.roleInsert = true;
  }
  else{
    this.roleInsert = false;
  }
  
 }
 public onroleUpdateChanged(e:any){
  if(e.target.checked){
    this.roleUpdate = true;
  }
  else{
    this.roleUpdate = false;
  }
  
 }
 public onroleDeleteChanged(e:any){
  if(e.target.checked){
    this.roleDelete = true;
  }
  else{
    this.roleDelete = false;
  }
  
 }
 public onroleListChanged(e:any){
  if(e.target.checked){
    this.roleList = true;
  }
  else{
    this.roleList =false;
  }
  
 }
 public onroleViewChanged(e:any){
  if(e.target.checked){
    this.roleDetails = true;
  }
  else{
    this.roleDetails = false;
  }
  
 }
 //permission module
 public onpermissionInsertChanged(e:any){
  if(e.target.checked){
    this.permissionInsert = true;
  }
  else{
    this.permissionInsert = false;
  }
  
 }
 public onpermissionUpdateChanged(e:any){
  if(e.target.checked){
    this.permissionUpdate = true;
  }
  else{
    this.permissionUpdate = false;
  }
  
 }
 public onpermissionDeleteChanged(e:any){
  if(e.target.checked){
    this.permissionDelete = true;
  }
  else{
    this.permissionDelete = false;
  }
  
 }
 public onpermissionListChanged(e:any){
  if(e.target.checked){
    this.permissionList = true;
  }
  else{
    this.permissionList =false;
  }
  
 }
 public onpermissionViewChanged(e:any){
  if(e.target.checked){
    this.permissionDetails = true;
  }
  else{
    this.permissionDetails = false;
  }
  
 }
 public oncellListChanged(e:any){
  if(e.target.checked){
    this.cellList = true;
  }else{
    this.cellList = false;
  }
}
public onuploadChanged(e:any){
 if(e.target.checked){
   this.upload = true;
 }else{
   this.upload = false;
 }
}
public onmenuChanged(e:any){
 if(e.target.checked){
   this.menu = true;
 }else{
   this.menu = false;
 }
}
 public onclientSelectUnSelectChanged(e:any){
   if(e.target.checked){
    this.clientInsert = true;
    this.clientUpdate = true;
    this.clientDelete = true;
    this.clientDetails = true;
    this.clientList = true;
   }else{
    this.clientInsert = false;
    this.clientUpdate = false;
    this.clientDelete = false;
    this.clientDetails = false;
    this.clientList = false;
  }
 }

 public onprojectSelectUnSelectChanged(e:any){
  if(e.target.checked){
    this.projectInsert = true;
    this.projectUpdate = true;
    this.projectDelete = true;
    this.projectDetails = true;
    this.projectList = true;
    this.cellList = true;
    this.upload = true;
    this.menu = true;
   }else{
    this.projectInsert = false;
    this.projectUpdate = false;
    this.projectDelete = false;
    this.projectDetails = false;
    this.projectList = false;
    this.cellList = false;
    this.upload = false;
    this.menu = false;
  }
 }
 public onuserSelectUnSelectChanged(e:any){
  if(e.target.checked){
    this.userInsert = true;
    this.userUpdate = true;
    this.userDelete = true;
    this.userDetails = true;
    this.userList = true;
   }else{
    this.userInsert = false;
    this.userUpdate = false;
    this.userDelete = false;
    this.userDetails = false;
    this.userList = false;
  }
 }
 public onroleSelectUnSelectChanged(e:any){
  if(e.target.checked){
    this.roleInsert = true;
    this.roleUpdate = true;
    this.roleDelete = true;
    this.roleDetails = true;
    this.roleList = true;
   }else{
    this.roleInsert = false;
    this.roleUpdate = false;
    this.roleDelete = false;
    this.roleDetails = false;
    this.roleList = false;
  }
 }
 public onpermissionSelectUnSelectChanged(e:any){
  if(e.target.checked){
    this.permissionInsert = true;
    this.permissionUpdate = true;
    this.permissionDelete = true;
    this.permissionDetails = true;
    this.permissionList = true;
   }else{
    this.permissionInsert = false;
    this.permissionUpdate = false;
    this.permissionDelete = false;
    this.permissionDetails = false;
    this.permissionList = false;
  }
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

  OnChange(e:any){
    if(e.target.checked){
      this.userSelectUnSelect=true;
      this.roleSelectUnSelect=true;
      this.permissionSelectUnSelect=true;
      this.clientSelectUnSelect=true;
      this.projectSelectUnSelect=true;
      this.onpermissionSelectUnSelectChanged(e);
      this.onroleSelectUnSelectChanged(e);
      this.onuserSelectUnSelectChanged(e);
      this.onprojectSelectUnSelectChanged(e);
      this.onclientSelectUnSelectChanged(e);
     }else{
      this.userSelectUnSelect=false;
      this.roleSelectUnSelect=false;
      this.permissionSelectUnSelect=false;
      this.clientSelectUnSelect=false;
      this.projectSelectUnSelect=false;
      this.onpermissionSelectUnSelectChanged(e);
      this.onroleSelectUnSelectChanged(e);
      this.onuserSelectUnSelectChanged(e);
      this.onprojectSelectUnSelectChanged(e);
      this.onclientSelectUnSelectChanged(e);
    }
  }
}
