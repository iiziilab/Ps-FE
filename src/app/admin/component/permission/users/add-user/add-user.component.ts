import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Status } from 'src/app/model/status.model';
import { UserInfo } from 'src/app/model/userinfo.model';
import { role } from 'src/app/model/userlog.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { PsolutionsService } from 'src/app/services/psolutions.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styles: [`
  .relative {
    position: relative;
  }
  .button-reset {
    background: rgba(0,0,0,0);
    border: none;
    cursor: pointer;
    font-family: fa5-proxima-nova,"Helvetica Neue",Helvetica,Arial,sans-serif;
    margin: 0;
    padding: 0;
    transition: all .1s ease-in;
  }
  .right-1 {
    right: 1rem;
  }
  .db {
    display: block;
  }
  .absolute {
    position: absolute;
  }
  .o-60 {
    opacity: .6;
  }
  .color-inherit {
    color: inherit;
  }
  .center-v {
    top: 50%;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
  }
  .btnicon{
    width: 60px;
  }
  .flexContainer {
    display: flex;
  }
  
  .inputField {
    flex: 1;
  }
  .passbtn button{
    height:48px;
    border-top:1px solid #ced4da;
    border-bottom:1px solid #ced4da;
    padding: 15px 4px;
    border-left:0px;
    border-right:0px;
  }`
  ]
})
export class AddUserComponent implements OnInit {

  constructor(private services: PsolutionsService,
    private formBuilder : FormBuilder,
    private route : ActivatedRoute,
    private router : Router,
    private authenticationService : AuthenticationService) {
      this.route.params.subscribe(res =>{
        this.id = res.id;
      })
      if(this.authenticationService.currentUserValue){
        this.userInsert = this.authenticationService.currentUserValue.rolePermission.userInsert;
        this.userUpdate = this.authenticationService.currentUserValue.rolePermission.userUpdate;
        this.userList = this.authenticationService.currentUserValue.rolePermission.userList;
        this.rolemodule = this.authenticationService.currentUserValue.rolePermission.roleList;
        this.permissionmodule = this.authenticationService.currentUserValue.rolePermission.permissionList;
      }
     }

     userform : FormGroup;
     id:any;
     save:boolean;
     edit:boolean;
     message:string;
     title : string = "Add User";
     selectedstatus : any = [];
     selecteddesignation : any = [];
     selectedrole : any;
     show : boolean;
     hide : boolean = true;
     chide : boolean = true;
     passwordtitle:string  = "View password";
     confirmPasswordtitle:string  = "View password";
     userInsert : boolean;
     userUpdate : boolean;
     userList : boolean;
     rolemodule : boolean;
     permissionmodule : boolean;
     emailmsg : string;
     istaken:boolean;

    public role: role[] = [];
    public status : Status[]= [];

  async ngOnInit(): Promise<void> {
    this.userform =this.formBuilder.group({
      userid:[''],
      status:[''],
      firstName : ['',Validators.required],
      lastName : [''],
      email : ['', [Validators.email, Validators.required]],
      designation :  ['',Validators.required],
      roleId :  ['',Validators.required],
      statusId :  ['',Validators.required],
      password :  ['',[Validators.required,Validators.minLength(6)]]
    })

    const res = await this.services.getRoleByStatus().toPromise();
    this.role = res;
    const statusres = await this.services.getStatus().toPromise();
    this.status = statusres;

    if(this.id){
      if(this.userUpdate){
        this.save = false;
        this.edit = true;
        this.title = "Edit User";
        const res = await this.services.getUserInfoByid(this.id).toPromise();
        if(res.roleId){
          this.selectedrole = res.roleId;
          this.selectedstatus = res.statusId;
          this.selecteddesignation = res.designation;
          // this.f.role.setValue(this.selectedrole);
          // this.f.status.setValue(this.selectedstatus);
        }
        this.userform.setValue(res);
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
    if(this.userInsert){
      this.show = true;
      try{
        const model : UserInfo={
          userid : 0,
          firstName:this.f.firstName.value,
          lastName:this.f.lastName.value,
          email: this.f.email.value,
          designation:this.selecteddesignation,
          roleId : this.selectedrole,
          statusId:this.selectedstatus,
          password:this.f.password.value

        };
        // stop here if form is invalid
        if (this.userform.invalid) {
          return;
        }
        const result = await this.services.addUserInfo(model).toPromise();
        if (result.statusCode == 200) {
          this.message = result.message;
          setTimeout(() => {
            this.router.navigate(['admin/user/list']);
          }, 600);
          //this.router.navigate(['admin/dashboard']);
      }else if(result.statusCode == 201){
        this.istaken = true;
        this.emailmsg = result.message;
        setTimeout(() => {
          this.emailmsg = "";
        }, 1200);
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

  get f() { return this.userform.controls; }

  async onEdit(): Promise<void> {
    this.show =true;
    try {
      const model : UserInfo={
        userid : this.id,
        firstName:this.f.firstName.value,
        lastName:this.f.lastName.value,
        email: this.f.email.value,
        designation:this.selecteddesignation,
        roleId : this.selectedrole,
        statusId:this.selectedstatus,
        password:this.f.password.value
      };
      // stop here if form is invalid
      if (this.userform.invalid) {
        return;
      }
      const result = await this.services.updateUserInfo(this.id, model).toPromise();
      if (result.statusCode == 200) {
        this.message = result.message;
      }
      setTimeout(() => {
        this.router.navigate(['admin/user/list']);
      }, 600);
    } catch (e) {
      console.log(e);
    }
  }
  onstatusChange(event:any) : void{
    this.selectedstatus = event.value;
    console.log(this.selectedstatus);
  }
  onroleChange(event:any) : void{
    this.selectedrole = event.value;
    console.log(this.selectedrole);
  }
  ondesignationChange(event:any) : void{
    this.selecteddesignation = event.value;
    console.log(this.selecteddesignation);
  }

  //view password
  viewpassword(){
    this.hide = !this.hide;
   if(!this.hide){
     this.passwordtitle = "Hide password";
     var p = document.getElementsByName('client_password')[0].innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0zm0 0h24v24H0zm0 0h24v24H0zm0 0h24v24H0z" fill="none"/><path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/></svg>';
   }
   else{
     this.passwordtitle = "View password";
     var p = document.getElementsByName('client_password')[0].innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0z" fill="none" /><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" /></svg>';
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
  passwordgenerated : any;
  generatepassword() {
    this.passwordgenerated = 100000 + Math.floor(Math.random() * 900000);
    let p: string = this.passwordgenerated.toString();
    this.f.password.setValue(p);
  }
}

