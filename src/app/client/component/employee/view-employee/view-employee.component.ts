import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PsolutionsService } from 'src/app/services/psolutions.service';

@Component({
  selector: 'app-view-employee',
  templateUrl: './view-employee.component.html',
  styles: [
    `
    .tooltip-end-top label[for="name"],label[for="email"],label[for="contact"]{
      color: #52595D;
      font-size : 19px;
    }
    .tooltip-end-top label{
      font-size : 18px;
    }
    `
  ]
})
export class ViewEmployeeComponent implements OnInit {
  id: string;
  name:string;
  email:string;
  password : string;
  contact:string;
  

  constructor(private route : ActivatedRoute,
              private router : Router,
              private formBuilder : FormBuilder,
              private services : PsolutionsService) {
                this.route.params.subscribe(res => {
                  this.id = res.id;
              });
            }

  async ngOnInit(): Promise<void> {
    if (this.id) {
        await this.getEmployee(this.id);
    }
  }
  private async getEmployee(id: string): Promise<void> {
    var clientid: number = +this.id;
    const result = await this.services.getEmployeeByid(this.id).toPromise();
    
    setTimeout(() => {
        this.name = result.name;
        this.email =  result.email;
        this.password = result.password;
        this.contact = result.contactNo;
   },);
  }
  toggle:boolean=false;
  togglemenuclick(){
    this.toggle = !this.toggle;
    
  }
}

