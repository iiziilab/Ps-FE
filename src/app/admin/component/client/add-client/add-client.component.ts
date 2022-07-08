import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, NgForm, Validators, AbstractControl, FormArray } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Client } from 'src/app/model/client.model';
import { Employee } from 'src/app/model/employee.model';
import { Userlog } from 'src/app/model/userlog.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { PsolutionsService } from 'src/app/services/psolutions.service';
import { PermissionComponent } from '../permission/permission.component';

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
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
.center-v1 {
  top: 50%;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
}
.btnicon{
  line-height: 1rem;
  width: 44px;
  height: 40px;
  margin: 2px;
  border: initial;
  border-radius: var(--border-radius-md);
  color: var(--light-text)!important;
  white-space: nowrap;
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
}

  `
  ]  // transform: translateY(-50%);s
})// .pass input{
//   border-top-right-radius:0!important;
//   border-bottom-right-radius:0!important;
//   border-right:0px;
// }
export class AddClientComponent implements OnInit {
  constructor(private services: PsolutionsService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router, private dialog: MatDialog,
    private authenticationService: AuthenticationService) {
    this.route.params.subscribe(res => {
      this.id = res.id;
    });
    if (this.authenticationService.currentUserValue) {
      this.clientInsert = this.authenticationService.currentUserValue.rolePermission.clientInsert;
      this.clientUpdate = this.authenticationService.currentUserValue.rolePermission.clientUpdate;
    }
  }

  clientbasicform: FormGroup;
  clientloginform: FormGroup;
  employeeform: FormGroup;

  employeeList: FormArray;
  clientId: number;
  id: number;
  save: boolean;
  edit: boolean;
  message: string;
  option: [];
  selected: any;
  selectedstate: any;
  show: boolean;

  logid: number;
  logsave: boolean;
  logedit: boolean;
  logmessage: string;
  logshow: boolean;

  employeesave: boolean;
  employeeedit: boolean;
  employeemessage: string;
  employeeshow: boolean;
  passwordgenerated: number;
  clientInsert: boolean;
  clientUpdate: boolean;
  clienttitle: string = "Add";
  clienttitleurl: string = "/admin/client/add";

  email: string;
  empemail: boolean;
  EmployeeDetails: string;
  emp_permission: EmpPermission[] = [];
  hide: boolean = true;
  ehide: boolean = true;
  typecheck: string = "password";
  passwordtitle: string = "View password";
  epasswordtitle: string = "View password";
  disabled = false;

  // public MasterType: BillMasterItemType[];

  async ngOnInit(): Promise<void> {
    this.clientbasicform = this.formBuilder.group({
      clientId: [''],
      name: ['', Validators.required],//, Validators.pattern("^[a-zA-Z]+$")
      //email: ['', [Validators.email, Validators.required]],
      email: [''],
      address: [''],
      state: [''],
      country: ['USA'],
      pincode: [''],
      contact1: ['',],
      contact2: [''], //Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]
      description: [''],
      created:['']
    })
    this.clientbasicform.controls.country.disable();
    this.clientloginform = this.formBuilder.group({
      id: [''],
      clientId: [''],
      clientCompany: [''],
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: [''],
      roleid: [''],
      created:['']
    })

    this.employeeform = this.formBuilder.group({
      employee: this.formBuilder.array([this.createEmployee()])
    })
    // set employeeList to this field
    this.employeeList = this.employeeform.get('employee') as FormArray;

    if (this.id) {
      this.clienttitleurl = "";
      this.clienttitle = "Edit";
      this.clienttitleurl = "/admin/client/edit/" + this.id;
      if (this.clientUpdate) {
        this.save = false;
        this.edit = true;
        const clientresult = await this.services.getCompanyClientByid(this.id).toPromise();
       
        this.selectedstate = clientresult.state;
        this.clientId = clientresult.clientId;
        //const clientlogresult = await this.services.getUserByCid(this.clientId).toPromise();
        //this.logid = clientlogresult.id;
        const employeeresult = await this.services.getEmployeeByCid(this.clientId).toPromise();
        this.isCount = 0;
        employeeresult.map((x: any) => {
          this.isCount ++;
        })
        this.clientbasicform.setValue(clientresult);
        //this.clientloginform.setValue(clientlogresult);
        this.setEmployeeValue(employeeresult);
      }
      else {
        this.router.navigate(['noauthorize']);
      }
    }
    else if (this.id === undefined) {
      this.save = true;
      this.edit = false;
    }
    this.show = false;
  }

  // employee formgroup
  createEmployee(): FormGroup {
    return this.formBuilder.group({
      //id: [''],
      clientId: [''],
      employeeId: [''],
      clientCompany: [''],
      //employee:,
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      contactNo: ['']
    })
  }
   isCount: number = 1;
  // add a employee form group
  addEmployee() {
    // if (this.employeeList.value.length >= 1) {
    //   this.removeShow = true;
    // }
    this.employeeList.push(this.createEmployee());
    this.isCount ++;
  }

  // remove employee from group
  removeShow: boolean = false;
  async removeEmployee(index: number): Promise<void> {
    if (this.employeeList.value.length < 2) {
      this.removeShow = false;
    }
    if (this.id) {
      if (this.employeeList.value.length > 1 && this.getEmployeeFormGroup(index).controls['employeeId'].value != '') {
        await this.services.deleteEmployee(this.getEmployeeFormGroup(index).controls['employeeId'].value)
        .toPromise().then(x => console.log(""));
        this.employeeList.removeAt(index);
        this.isCount --;
      }else{
        if (this.isCount != 1) {
          this.employeeList.removeAt(index);
          this.isCount --;
        }
      }
    } else if (this.id === undefined) {
      // if (this.employeeList.value.length > 1) {
      //   this.employeeList.removeAt(index);
      // }
      if (this.isCount != 1) {
        this.employeeList.removeAt(index);
        this.isCount --;
      }
    }
  }

  async addPermissionDialog(i: number): Promise<void> {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '380px';
    dialogConfig.height = '280px';

    if (this.id) {
      dialogConfig.data = {
        eid: this.getEmployeeFormGroup(i).controls['employeeId'].value
      };
    } else if (this.id === undefined) {
      dialogConfig.data = {
        id: i
      };
    }

    const dialogRef = this.dialog.open(PermissionComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      data => {
        var index = this.emp_permission.findIndex(x => x.id == data.id);
        index === -1 ? this.emp_permission.push(data) : this.emp_permission[index] = data;
      }
    );
  }

  // get the formgroup under employee form array
  getEmployeeFormGroup(index: number): FormGroup {
    //this.employeeList.controls[index].updateValueAndValidity();
    const formGroup = this.employeeList.controls[index] as FormGroup;
    return formGroup;
  }

  // checkArray(index:number) {
  //   (this.employeeform.get("employee") as FormArray).controls.forEach((x, i) => {
  //     if (i != index) x.get("password").updateValueAndValidity();
  //   });
  // }

  // returns all form groups under employee
  get employeeFormGroup() {
    return this.employeeform.get('employee') as FormArray;
  }

  get f() { return this.clientbasicform.controls; }
  get g() { return this.clientloginform.controls; }

  async onSave(event: any): Promise<void> {
    if (this.clientInsert) {
      this.show = true;
      try {
        const model: Client = {
          clientId: 0,
          name: this.f.name.value,
          email: this.f.email.value,
          address: this.f.address.value,
          state: this.selectedstate,//this.f.state.value,
          country: this.f.country.value,
          pincode: this.f.pincode.value,
          contact1: this.f.contact1.value,
          contact2: this.f.contact2.value,
          description: this.f.description.value,
        };
        // stop here if form is invalid
        // if (this.clientbasicform.invalid || this.clientloginform.invalid) {
        //   this.logmessage = "Some field is not filled, please fill and try again.";
        //   setTimeout(async () => {
        //     this.logmessage = "";
        //   }, 1000);
        //   return;
        // }
       
        if (this.clientbasicform.invalid) {
          this.message = "Some field is not filled, please fill and try again.";
          setTimeout(async () => {
            this.message = "";
          }, 1000);
          return;
        }else {
          for (let i = 0; i < this.employeeList.length; i++) {
            if (this.employeeform.invalid || this.getEmployeeFormGroup(i).controls['email'].value === '' || this.getEmployeeFormGroup(i).controls['password'].value === '' || this.getEmployeeFormGroup(i).controls['name'].value === '') {
              this.employeemessage = "Some field is not filled, please fill and try again.";
              setTimeout(async () => {
                this.employeemessage = "";
              }, 1000);
              return;
            }
          }
        }
       
        await this.services.addCompanyClient(model).toPromise().then(async p => {
          if (p.statusCode == 200) {
            this.clientId = p.data.clientId;
            //await this.onSaveClientlog();
            await this.onSaveEmployee();
            //(event.target as HTMLButtonElement).disabled = true;
            this.employeemessage = p.message;
            setTimeout(() => {
              this.employeemessage = "";
              this.router.navigate(['admin/client/list']);
            }, 1000);
          }
          else if(p.statusCode == 1 || p.statusCode == 2){
          }
        });
      }
      catch (ex) {
        console.log(ex);
      }
    }
    else {
      this.router.navigate(['noauthorize']);
    }
  }
  async onEdit(): Promise<void> {
    this.show = true;
    try {
      const model: Client = {
        clientId: this.id,
        name: this.f.name.value,
        email: this.f.email.value,
        address: this.f.address.value,
        state: this.selectedstate,//this.f.state.value,
        country: this.f.country.value,
        pincode: this.f.pincode.value,
        contact1: this.f.contact1.value,
        contact2: this.f.contact2.value,
        description: this.f.description.value,
      };
      // stop here if form is invalid
      if (this.clientbasicform.invalid) {
        this.message = "Some field is not filled, please fill and try again.";
        setTimeout(async () => {
          this.message = "";
        }, 1000);
        return;
      }
      const result = await this.services.updateCompanyClient(this.id, model).toPromise();
      if (result.statusCode == 200) {
        this.message = result.message;
        this.clientId = result.data.clientId;
      }
      setTimeout(async () => {
        this.message = "";
      }, 1000);
    } catch (e) {
      console.log(e);
    }
  }

  onChangedSort(event: Event): void {
    
  }

  async onSaveClientlog(): Promise<void> {
    try {
      const model: Userlog = {
        id: 0, clientId: this.clientId,
        email: this.g.email.value,
        password: this.g.password.value,
        role: { roleId: 3, roleName: 'client' },
      };
      const result = await this.services.addUser(model).toPromise();
      if (result.statusCode == 200) {
        //this.logmessage = result.message;
      }
    }
    catch (ex) {
      console.log(ex);
    }
  }

  async onSaveEmployee(): Promise<void> {
    try {
      for (let i = 0; i < this.employeeList.length; i++) {
        const model: Employee = {
          employeeId: 0,
          clientId: this.clientId,
          email: this.getEmployeeFormGroup(i).controls['email'].value,
          password: this.getEmployeeFormGroup(i).controls['password'].value,
          name: this.getEmployeeFormGroup(i).controls['name'].value,
          contactNo: this.getEmployeeFormGroup(i).controls['contactNo'].value,
          changePassword: true,
          editProject: false,
          viewProject: true
        };
        if (this.employeeform.invalid) {
          this.employeemessage = "Some field is not filled, please fill and try again.";
          setTimeout(async () => {
            this.employeemessage = "";
          }, 1000);
          return;
        }
        const result = await this.services.addEmployee(model).toPromise();
        this.EmpStatus = result;
        if (result.statusCode == 200) {
          for (let j = 0; j < this.emp_permission.length; j++) {
            if (this.emp_permission[j].id == i) {
              const mod: any = {
                id: result.data.employeeId,
                changePassword: this.emp_permission[j].changePassword,
                editProject: this.emp_permission[j].editProject,
                viewProject: this.emp_permission[j].viewProject
              };
              const res = await this.services.updateEmployeePermission(mod).toPromise();
              if (res.statusCode == 200) {
              
              }
            } else {
              //break;
            }
          }
        } else if (result.statusCode == 201) {
          this.empemail = true;
          this.employeemessage = result.message;
          setTimeout(() => {
            this.employeemessage = "";
          }, 1000);
        }
        
      }
      //this.employeemessage = this.EmpStatus.message;
      this.emp_permission = [];
    }
    catch (ex) {
      console.log(ex);
    }
  }
  public EmpStatus: any;
  async onEditEmployee(): Promise<void> {
    try {
      for (let i = 0; i < this.employeeList.length; i++) {
        if (this.employeeform.invalid || this.getEmployeeFormGroup(i).controls['email'].value === '' || this.getEmployeeFormGroup(i).controls['password'].value === '' || this.getEmployeeFormGroup(i).controls['name'].value === '') {
          this.employeemessage = "Some field is not filled, please fill and try again.";
          setTimeout(async () => {
            this.employeemessage = "";
          }, 1000);
          return;
        }
        const model: any = {
          id: this.getEmployeeFormGroup(i).controls['employeeId'].value,
          email: this.getEmployeeFormGroup(i).controls['email'].value,
          password: this.getEmployeeFormGroup(i).controls['password'].value,
          name: this.getEmployeeFormGroup(i).controls['name'].value,
          contactNo: this.getEmployeeFormGroup(i).controls['contactNo'].value,
        };
        if (this.getEmployeeFormGroup(i).controls['email'].value != '' && this.getEmployeeFormGroup(i).controls['name'].value != '' && this.getEmployeeFormGroup(i).controls['password'].value != '') {
          if (model.id === "") {
            const m: Employee = {
              employeeId: 0,
              clientId: this.clientId,
              email: this.getEmployeeFormGroup(i).controls['email'].value,
              password: this.getEmployeeFormGroup(i).controls['password'].value,
              name: this.getEmployeeFormGroup(i).controls['name'].value,
              contactNo: this.getEmployeeFormGroup(i).controls['contactNo'].value,
              changePassword: true,
              editProject: false,
              viewProject: true
            };
            if (this.employeeform.invalid) {
              this.employeemessage = "Some field is not filled, please fill and try again.";
              setTimeout(async () => {
                this.employeemessage = "";
              }, 1000);
              return;
            }
            await this.services.addEmployee(m).toPromise().then(async x => {
              if (x.statusCode == 200) {
                for (let j = 0; j < this.emp_permission.length; j++) {
                  if (this.emp_permission[j].id == i) {
                    const mod: any = {
                      id: x.data.employeeId,
                      changePassword: this.emp_permission[j].changePassword,
                      editProject: this.emp_permission[j].editProject,
                      viewProject: this.emp_permission[j].viewProject
                    };
                    await this.services.updateEmployeePermission(mod).toPromise().then(x => {
                      if (x.statusCode == 200) {
                        console.log(x);
                      }
                    });
                  } else {
                    break;
                  }
                }

              } else if (x.statusCode == 201) {
                this.employeemessage = x.message;
                setTimeout(() => {
                  this.employeemessage = "";
                }, 1000);
              }
            })
          } else {
            await this.services.UpdateEmp(model).toPromise().then(x => {
              this.EmpStatus = x;
            });
          }
        }
      }

      this.employeemessage = "Record updated successfully";
      setTimeout(async () => {
        this.employeemessage = "";
      }, 1000);
    } catch (e) {
      console.log(e);
    }
  }
  async onEditClientlog(): Promise<void> {
    try {
      const model: Userlog = {
        id: this.logid, clientId: this.clientId,
        email: this.g.email.value,
        password: this.g.password.value,
        role: { roleId: 3, roleName: 'client' }
      };
      // stop here if form is invalid
      if (this.clientloginform.invalid) {
        this.logmessage = "Some field is not filled, please fill and try again.";
        setTimeout(async () => {
          this.logmessage = "";
        }, 1000);
        return;
      }
      const result = await this.services.updateClient(this.logid, model).toPromise();

      if (result.statusCode == 200) {
        this.logmessage = result.message;

      }
      setTimeout(async () => {
        this.logmessage = "";
      }, 1000);
    } catch (e) {
      console.log(e);
    }
  }
  generatepassword() {
    this.passwordgenerated = 100000 + Math.floor(Math.random() * 900000);
    let p: string = this.passwordgenerated.toString();
    this.g.password.setValue(p);
  }
  generatepassword1(i: number) {
    this.passwordgenerated = 100000 + Math.floor(Math.random() * 900000);
    let p: string = this.passwordgenerated.toString();
    this.getEmployeeFormGroup(i).controls['password'].setValue(p);
  }

  // copy email
  copyemail(event: any) {
    this.email = event.target.value;
    this.g.email.setValue(this.email);
  }

  // set value in formarray
  setEmployeeValue(item: Employee[]) {
    // const formArray = new FormArray([]);
    // for (let x of item) {
    //   formArray.push(this.formBuilder.group({
    //     employeeId:x.employeeId,
    //     clientId: x.clientId,
    //     email: x.email,
    //     password:x.password,
    //     name:x.name,
    //     contactNo: x.contactNo
    //   }));
    //   this.employeeList.push(formArray)
    // }
    if (item.length > 0) {
      this.employeeList.removeAt(0);
    }

    for (let x of item) {
      (this.employeeform.get('employee') as FormArray).push(this.formBuilder.group({
        employeeId: x.employeeId,
        clientId: x.clientId,
        email: x.email,
        password: x.password,
        name: x.name,
        contactNo: x.contactNo
      }));
    }
  }

  // Only Integer Numbers
  isShowContact: boolean = false;
  keyPressNumbers(event: any) {
    var charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 0-9
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      this.isShowContact = true;
      return false;
     
    } else {
      this.isShowContact = false;
      return true;
    }
  }

  // Only AlphaNumeric with Some Characters [-_ ]
  keyPressAlphaNumericWithCharacters(event: any) {

    var inp = String.fromCharCode(event.keyCode);
    // Allow numbers, alpahbets, space, underscore
    if (/[a-zA-Z0-9-_ ]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  // Only AlphaNumeric
  keyPressAlphaNumeric(event: any) {

    var inp = String.fromCharCode(event.keyCode);

    if (/[a-zA-Z0-9]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  // Only Numbers with Decimals
  keyPressNumbersDecimal(event: any) {
    var charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31
      && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  //view password
  viewpassword1(i: any, event: any, p: any) {
    let pp = (document.getElementsByName(i)[0] as HTMLInputElement);

    if (pp.type == "password") {
      pp.type = "text";
      this.epasswordtitle = "Hide password";
      document.getElementsByName(i)[1].innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0zm0 0h24v24H0zm0 0h24v24H0zm0 0h24v24H0z" fill="none"/><path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/></svg>';
    }
    else {
      pp.type = "password";
      this.epasswordtitle = "View password";
      document.getElementsByName(i)[1].innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0z" fill="none" /><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" /></svg>';
    }
  }
  viewpassword() {
    this.hide = !this.hide;
    if (!this.hide) {
      this.passwordtitle = "Hide password";
      var p = document.getElementsByName('client_password')[0].innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0zm0 0h24v24H0zm0 0h24v24H0zm0 0h24v24H0z" fill="none"/><path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/></svg>';
    }
    else {
      this.passwordtitle = "View password";
      var p = document.getElementsByName('client_password')[0].innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0z" fill="none" /><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" /></svg>';
    }

  }

  onAddClient() {
    this.router.navigate(['admin/client/add']);
  }

  onstateChange(event: any): void {
    this.selectedstate = event.value;
  }

  checkPassword(index:any) {
    this.getEmployeeFormGroup(index).controls['password'].clearValidators();
    this.getEmployeeFormGroup(index).controls['password'].setValidators([Validators.required, Validators.minLength(6)]);
    this.getEmployeeFormGroup(index).controls['password'].updateValueAndValidity();
  }
  
  indexes: any;
  checkEmail(index:any) {
    console.log(index);
    
    this.indexes = index;
    this.getEmployeeFormGroup(index).controls['email'].clearValidators();
    this.getEmployeeFormGroup(index).controls['email'].setValidators([Validators.required,Validators.email]);
    this.getEmployeeFormGroup(index).controls['email'].updateValueAndValidity();
  }

  checkName(index:any) {
    this.getEmployeeFormGroup(index).controls['name'].clearValidators();
    this.getEmployeeFormGroup(index).controls['name'].setValidators(Validators.required);
    this.getEmployeeFormGroup(index).controls['name'].updateValueAndValidity();
  }

  checkContact(index:any) {
    this.getEmployeeFormGroup(index).controls['contactNo'].clearValidators();
    this.getEmployeeFormGroup(index).controls['contactNo'].setValidators(Validators.required);
    this.getEmployeeFormGroup(index).controls['contactNo'].updateValueAndValidity();
  }
  showEmail: any;
  valuechange(val: any, iw: number) {
    var check = false;
    for (let i = 0; i < this.employeeList.length; i++) {
      if(check === false){
        if(i != iw){
          console.log(val, iw);
          if(val === this.getEmployeeFormGroup(i).controls['email'].value){
              this.showEmail = iw; 
              check = true;  
              this.disabled = true;     
          }else{
            this.showEmail = 100;  
            this.disabled = false; 
          }
        }
      }
    }
  }
}

export interface EmpPermission {
  id: number;
  changePassword: boolean;
  viewProject: boolean;
  editProject: boolean;
}