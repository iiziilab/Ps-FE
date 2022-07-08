import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { PsolutionsService } from 'src/app/services/psolutions.service';

@Component({
  selector: 'app-detail-project',
  templateUrl: './detail-project.component.html',
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
export class DetailProjectComponent implements OnInit {
  id: string;
  projectName:string;
  projectNo:string;
  client:string;
  employee:string;
  startDate:string;
  endDate:string;
  status:string;
  description : string;
  projectDetails:boolean;
  projectInsert : boolean;
  selectedclient : any=[];
  selectedemployee : any = [];

  constructor(private route : ActivatedRoute,
              private router : Router,
              private formBuilder : FormBuilder,
              private services : PsolutionsService,
              private authentication : AuthenticationService) {
                this.route.params.subscribe(res => {
                  this.id = res.id;
              });
              if(this.authentication.currentUserValue){
                this.projectDetails = this.authentication.currentUserValue.rolePermission.projectDetails;
                this.projectInsert = this.authentication.currentUserValue.rolePermission.projectInsert;
              }
            }
 
  pName: string;
  async ngOnInit(): Promise<void> {
    if (this.id && this.projectDetails) {
        await this.getProject(this.id);
    }
    else{
      this.router.navigate(['noauthorize']);
    }
    this.pName = localStorage.getItem('projectName');
  }
  private async getProject(id: string): Promise<void> {
  
    var clientid: number = +this.id;
    const result = await this.services.getProjectbyId(clientid).toPromise();
    
    
    const clientresult = await this.services.getCompanyClientByid(result.clientId).toPromise();
    console.log(69,clientresult);
    // clientresult.forEach((h:any) => {
    //   result.clientId.forEach((i:any)=>{
    //     if(h.clientId == i){
    //       this.selectedclient.push(h.name);
    //     }
    //   });
    // });
    //  clientresult.forEach((h:any) => {
    //   this.selectedclient.push(h.name);
    // });
    const empresult = await this.services.getEmployeeListByCid(result.clientId).toPromise();
    empresult.forEach((h:any) => {
      result.employeeId.forEach((i:any)=>{
        if(h.employeeId == i){
          this.selectedemployee.push(h.name);
        }
      });
    });
    
    const res = await this.services.getStatusByid(result.statusId).toPromise();
    
    setTimeout(() => {
        this.projectName = result.projectName;
        this.projectNo = result.projectNo;
        this.client = clientresult.name,//this.selectedclient;
        this.employee = this.selectedemployee;
        this.startDate = result.startDate;
        this.endDate = result.endDate;
        this.status = res.statusName;
        this.description =  result.description;
   });
  }
  onAddProject(){
    if(this.projectInsert){
    this.router.navigate(['admin/project/add']);
    }else{
      this.router.navigate(['noauthorize']);
    }
  }
}
