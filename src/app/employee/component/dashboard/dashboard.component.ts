import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { PsolutionsService } from 'src/app/services/psolutions.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
    `
      .heading{
        background-color: orange;
        height: 83px;
        width: 100%;
        padding: 6px;
        margin: auto;
      }
      .h2style{
        font-size:3.5em!important;
        text-align: center;
      }
    `
  ]
})
export class DashboardComponent implements OnInit {

  constructor(private router : Router,private services : PsolutionsService,
    private authenticationservice : AuthenticationService) {
      if(this.authenticationservice.currentUserValue) {
        this.eid = this.authenticationservice.currentUserValue.data.employeeId;
      }
     }

     eid:any;
  noofemployee : Number;
  noofproject : number;
  async ngOnInit(): Promise<void> {
    //project
    var projectresult = await this.services.getProjectbyEId(this.eid).toPromise();
    this.noofproject = projectresult.length;
  }
  onPaymentClick(){
    this.router.navigate(['employee/project/list']);
  }
  toggle:boolean=false;
  togglemenuclick(){
    this.toggle = !this.toggle;
    
  }
}