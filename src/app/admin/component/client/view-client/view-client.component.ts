import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { PsolutionsService } from 'src/app/services/psolutions.service';

@Component({
  selector: 'app-view-client',
  templateUrl: './view-client.component.html',
  styles: [`
    .tooltip-end-top label[for="name"],label[for="email"],label[for="address"],label[for="contact1"],label[for="contact1"],
    label[for="state"],label[for="country"],label[for="pincode"],label[for="description"],label[for="contact2"]{
      color: #52595D;
      font-size : 19px;
    }
    .tooltip-end-top label{
      font-size : 18px;
    }
    .emplabel{
      font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      font-size: 20px!important;
      font-weight : 600px!important;
    }`
  ]
})
export class ViewClientComponent implements OnInit {

  id: string;
  isEditable:boolean;
  name:string;
  email:string;
  address:string;
  state:string;
  country:string;
  pincode:string;
  contact1:string;
  contact2:string;
  description:string;

  cpassword:string;
  cemail:string;

  ename:string;
  eemail:string;
  epassword : string;
  econtact:string;
  employee:Employee[];
  clientDetails : boolean;
  clientInsert : boolean;
  

  constructor(private route : ActivatedRoute,
              private formBuilder : FormBuilder,
              private router : Router,
              private services : PsolutionsService,
              private authentication : AuthenticationService) {
                this.route.params.subscribe(res => {
                  this.id = res.id;
              });
              if(this.authentication.currentUserValue){
                this.clientDetails = this.authentication.currentUserValue.rolePermission.clientDetails;
                this.clientInsert = this.authentication.currentUserValue.rolePermission.clientInsert;
              }
            }

  async ngOnInit(): Promise<void> {
    if (this.id && this.clientDetails) {
        await this.getClient(this.id);
    }else{
      this.router.navigate(['noauthorize']);
    }
    this.isEditable = false;
  }
  private async getClient(id: string): Promise<void> {
    var clientid: number = +this.id;
    const result = await this.services.getCompanyClientByid(clientid).toPromise();
    setTimeout(() => {
        this.name = result.name,
        //this.email =  result.email,
        this.address = result.address,
        this.state = result.state,
        this.country = result.country,
        this.pincode = result.pincode,
        //this.contact1 = result.contact1,
        //this.contact2 = result.contact2,
        this.description =  result.description
   },);
   console.log(109,result);
  //  const clientresult = await this.services.getUserByCid(clientid).toPromise();
  //   setTimeout(() => {
  //       this.cemail = clientresult.email,
  //       this.cpassword =  clientresult.password
  //  },);
   const employeeresult = await this.services.getEmployeeByCid(clientid).toPromise();
   setTimeout(() => {
     this.employee = employeeresult;
  //   for (let x of this.employee) {
  //       this.employee.: x.email,
  //       this.employee.password:x.password,
  //       this.employee.name:x.name,
  //       this.employee.contactNo: x.contactNo
  //     }));
  //   }
  //     this.ename = employeeresult.name,
  //     this.eemail =  employeeresult.email,
  //     this.epassword = employeeresult.password,
  //     this.econtact = employeeresult.contact
   },);
  
   
  }

  onAddClient(){
    if(this.clientInsert){
      this.router.navigate(['admin/client/add']);
    }
    else{
      this.router.navigate(['noauthorize']);
    }
  }
}
export class Employee{
  name:string; email:string; password:string; contactNo:string;
}
