import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { PsolutionsService } from 'src/app/services/psolutions.service';

@Component({
  selector: 'app-view-project',
  templateUrl: './view-project.component.html',
  styles: [
    `
    .tooltip-end-top label[for="projectName"],label[for="projectNo"],label[for="client"],label[for="employee"],label[for="startDate"],
    label[for="endDate"],label[for="status"],label[for="description"]{
      color: #52595D;
      font-size : 19px;
    }
    .tooltip-end-top label{
      font-size : 18px;
    }
    `
  ]
})
export class ViewProjectComponent implements OnInit {
  id: string;
  projectName:string;
  projectNo:string;
  projectDetails:boolean;
  client:string;
  employee:string;
  startDate:string;
  endDate:string;
  status:string;
  description : string;
  selectedclient : any=[];
  selectedemployee : any = [];

  constructor(private route : ActivatedRoute,
              private router : Router,
              private services : PsolutionsService,
              private authentication : AuthenticationService) {
                this.route.params.subscribe(res => {
                  this.id = res.id;
              });
              if(this.authentication.currentUserValue){
                //this.projectDetails = this.authentication.currentUserValue.rolePermission.projectDetails;
              }
            }

  async ngOnInit(): Promise<void> {
    if (this.id) {
        await this.getProject(this.id);
    }
  }
  private async getProject(id: string): Promise<void> {
    var clientid: number = +this.id;
    const result = await this.services.getProjectbyId(clientid).toPromise();
    await this.services.getCompanyClientListByid(result.clientId).toPromise().then(x=>{
      x.forEach((h:any) => {
        result.clientId.forEach((i:any)=>{
          if(h.clientId == i){
            this.selectedclient.push(h.name);
          }
        });
      });
    });
    
    await this.services.getEmployeeListByEid(result.employeeId).toPromise().then(x=>{
      x.forEach((h:any) => {
        result.employeeId.forEach((i:any)=>{
          if(h.employeeId == i){
            this.selectedemployee.push(h.name);
          }
        });
      });
    });
    const res = await this.services.getStatusByid(result.statusId).toPromise();
    setTimeout(() => {
        this.projectName = result.projectName;
        this.projectNo =  result.projectNo;
        this.client = this.selectedclient;
        this.employee = this.selectedemployee;
        this.startDate = result.startDate;
        this.endDate = result.endDate;
        this.status = res.statusName;
        this.description =  result.description;
   },);
  }
  toggle:boolean=false;
  togglemenuclick(){
    this.toggle = !this.toggle;
    
  }
}

