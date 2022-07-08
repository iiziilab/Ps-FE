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
  client:string;
  employee:string;
  startDate:string;
  endDate:string;
  status:string;
  description : string;
  viewProject : boolean;
  selectedclient : any=[];
  selectedemployee : any = [];

  constructor(private route : ActivatedRoute,
              private router : Router,
              private services : PsolutionsService,
              private authentication : AuthenticationService) {
                this.route.params.subscribe(res => {
                  this.id = res.id;
              });
              if(this.authentication.currentUserValue) {
                this.viewProject = this.authentication.currentUserValue.data.viewProject;
              }
            }

  async ngOnInit(): Promise<void> {
    if (this.id && this.viewProject) {
        await this.getProject(this.id);
    }else{
      this.router.navigate(['noauthorize']);
    }
  }
  private async getProject(id: string): Promise<void> {
    var pid: number = +this.id;
    try{
      const result = await this.services.getProjectbyId(pid).toPromise();
      var clientid: number = +result.client;
      const clientresult = await this.services.getCompanyClientListByid(result.clientId).toPromise();
      // clientresult.forEach((h:any) => {
      //   result.clientId.forEach((i:any)=>{
      //     if(h.clientId == i){
      //       this.selectedclient.push(h.name);
      //     }
      //   });
      // });
      clientresult.forEach((h:any) => {
        this.selectedclient.push(h.name);
      });
      const empresult = await this.services.getEmployeeListByEid(result.employeeId).toPromise();
      empresult.forEach((h:any) => {
        result.employeeId.forEach((i:any)=>{
          if(h.employeeId == i){
            this.selectedemployee.push(h.name);
          }
        });
      });
      const res = await this.services.getStatusByid(result.statusId).toPromise();
      
      this.projectName = result.projectName;
      this.projectNo =  result.projectNo;
      this.client = this.selectedclient;
      this.employee = this.selectedemployee;
      this.startDate = result.startDate;
      this.endDate = result.endDate;
      this.description =  result.description;
      this.status =res.statusName;
    }catch(ex){

    }
  }
  toggle:boolean=false;
  togglemenuclick(){
    this.toggle = !this.toggle;
  }
}

