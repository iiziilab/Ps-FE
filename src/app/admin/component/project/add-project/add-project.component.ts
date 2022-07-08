import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Client } from 'src/app/model/client.model';
import { Employee } from 'src/app/model/employee.model';
import { Project } from 'src/app/model/project.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { PsolutionsService } from 'src/app/services/psolutions.service';
import { DatePipe } from '@angular/common';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DateValidator } from '../../shared/date.validator';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styles: [`.mat-form-field-flex {
    display: inline-flex;
    align-items: baseline;
    box-sizing: border-box;
    width: 100%;
    background-color: transparent;
    padding:0;
    padding-left : 12px;
}
.mat-form-field{
  display:block;
  position: relative;
  text-align: left;
}
.mat-form-field-appearance-fill .mat-form-field-flex {
   background-color: transparent!important; 
   border-radius: 0!important;
   padding: 0!important;
}
`
  ]
})
export class AddProjectComponent implements OnInit {

projectform : FormGroup;
id: number;
save : boolean;
edit : boolean;
message : string;
selectedclient : any;
selectedemployee : any=[];
selecteddataType : any;
selectedstatus : any;
show : boolean;
maxDate: any;
minDate: Date;
dateSent : any;
dateReceived : any;
canChangeStatus : boolean;
projectInsert : boolean;
projectUpdate : boolean;

public client: ClientData[] = [];
public employee: EmployeeData[] =[];
public status : Status[];

  constructor(private services : PsolutionsService,
    private formBuilder : FormBuilder,
    private route : ActivatedRoute,
    private router : Router,
    private authenticationService : AuthenticationService,
    public datepipe: DatePipe) {
      this.route.params.subscribe(res =>{
        this.id = res.id;
      })
      this.canChangeStatus = true;
        if (this.authenticationService.currentUserValue) {
          this.projectInsert = this.authenticationService.currentUserValue.rolePermission.projectInsert;
          this.projectUpdate = this.authenticationService.currentUserValue.rolePermission.projectUpdate;
        }
        const currentYear = new Date().getFullYear();
    this.minDate = new Date();
    this.maxDate = new Date(currentYear + 1, 11, 31);
     }
  actionName: string = 'Add'; 
  pName: string;
  async ngOnInit(): Promise<void> {

    this.projectform = this.formBuilder.group({
      id : [''],
      projectName : ['',Validators.required],
      projectNo : ['',Validators.required],
      clientId : ['',Validators.required],
      employeeId : ['',Validators.required],
      startDate: ['',[Validators.required,DateValidator.dateVaidator]],
      endDate : ['',[Validators.required,DateValidator.dateVaidator]],
      dataType: [''],
      statusId : ['',Validators.required],
      status :[''],
      description : [''],
      created: [''],
      clientCompany: ['']
    })
    const clientres = await this.services.getCompanyClient().toPromise();
    this.client = clientres;
    const statusres = await this.services.getStatus().toPromise();
    this.status = statusres;

    this.maxDate = new Date();
    this.maxDate = this.datepipe.transform(this.maxDate, 'dd-MM-yyyy');
    
    if(this.id){
      this.actionName = 'Edit'
      this.pName = localStorage.getItem('projectName');
      if(this.projectUpdate){
        this.save = false;
        this.edit = true;
        const  projectres = await this.services.getProjectbyId(this.id).toPromise();
        
        projectres.startDate = projectres.startDate.slice(0,10);
        projectres.endDate = projectres.endDate.slice(0,10);

        this.projectform.setValue(projectres);
        this.dateReceived = this.f.startDate.value;

        if(this.f.clientId.value){
          this.selectedclient = this.f.clientId.value;
          const employeeres = await this.services.getEmployeeListByCid(projectres.clientId).toPromise();
          
          this.employee = employeeres;
          this.selectedemployee = this.f.employeeId.value;
          this.selecteddataType = this.f.dataType.value;
          this.selectedstatus = this.f.statusId.value;
        }
      }else{
        this.router.navigate(['noauthorize']);
      }
    }
    else if(this.id === undefined){
      this.save = true;
      this.edit = false;
    }
    this.show = false;
  }

  get f(){
    return this.projectform.controls;
  }

  async onSave(event : any) : Promise<void>{
    if(this.projectInsert){
      this.show = true;
      try{
        const model : Project={
          id : 0,
          projectName : this.f.projectName.value,
          projectNo : this.f.projectNo.value,
          clientId : this.selectedclient,
          employeeId : this.selectedemployee,
          startDate : this.f.startDate.value,
          endDate : this.f.endDate.value,
          dataType : this.selecteddataType,
          statusId : this.selectedstatus,
          description : this.f.description.value
        };
        //stop here if form is invalid
        if(this.projectform.invalid){
          this.message = "Please fill all essential fields.";
          setTimeout(() => {
            this.message ="";
          }, 600);
          return;
        }
        if(!this.error.isError && !this.errorDate.isError && !this.errorSDate.isError){
          const result = await this.services.addProject(model).toPromise();
          if(result.statusCode == 200){
            (event.target as HTMLButtonElement).disabled = true;
            this.message = result.message;
            setTimeout(() => {
              this.router.navigate(['admin/project/list']);
            }, 600);
          }
          this.message = result.message;
        }else{
          this.message = "Please check the start or end date";
          setTimeout(() => {
            this.message ="";
          }, 600);
          return;
        }
      }
      catch(ex){
        console.log(ex);
      }
    }else{
      this.router.navigate(['noauthorize']);
    }
  }
  
  async onEdit() : Promise<void>{
    this.show = true;
    try{
      const model : Project={
        id : this.id,
        projectName : this.f.projectName.value,
        projectNo : this.f.projectNo.value,
        clientId : this.selectedclient,
        employeeId : this.selectedemployee,
        startDate : this.f.startDate.value,
        endDate : this.f.endDate.value,
        dataType : this.selecteddataType,
        statusId : this.selectedstatus,
        description : this.f.description.value
      };
      //stop here if form is invalid
      if(this.projectform.invalid){
        this.message = "Please fill all essential fields.";
        return;
      }
      const result = await this.services.addProject(model).toPromise();
      if(result.statusCode == 200){
        this.message = result.message;
        setTimeout(() => {
          this.router.navigate(['admin/project/list']);
        }, 600);
      }
      this.message = result.message;
    }
    catch(ex){
      console.log(ex)
    }
  }
  onstatusChange(event:any) : void{
    this.selectedstatus = event.value;
  }
  ondatatypeChange(event:any) : void{
    this.selecteddataType = event.value;
  }
  async onClientChange(event:any) : Promise<void>{
    this.selectedclient = event.value; //as string[];
    //let y1 = this.selectedclient as string[];
    const employeeres = await this.services.getEmployeeListByCid(this.selectedclient).toPromise();
    this.employee = employeeres;
  }
  onEmployeeChange(event:any) : void{
    this.selectedemployee =event.value  as string[];
  }
  changeDate(){
    this.dateSent=this.f.startDate.value;
    const cd = this.datepipe.transform(this.dateSent, 'dd-MM-yyyy');
    const c = cd.slice(-4);
    var d = new Date(this.dateSent);
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    this.datepipe.transform(new Date(day,month,year + 1), 'dd-MM-yyyy');
    this.f.endDate.setValue(this.datepipe.transform(new Date(year + 1,month-1,day-1 ),'yyyy-MM-dd'));
    this.dateReceived=this.dateSent
  }
  onAddProject() {
    this.router.navigate(['admin/project/add']);
  }
  events: string[] = [];

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.events.push(`${type}: ${event.value}`);
  }
  error: any = {
    isError: false,
    errorMessage: ''
 };
 errorSDate: any = {
  isError: false,
  errorMessage: ''
};
errorDate: any = {
  isError: false,
  errorMessage: ''
};
 
 compareTwoDates() {
  if (new Date(this.f.endDate.value).getTime() < new Date(this.f.startDate.value).getTime()) {
    this.error = {
        isError: true,
        errorMessage: 'End Date can not be less than start date '};
    }else{
      this.error = {
        isError: false,
        errorMessage: ''};
    }
  }
  validateSDate(){
    var myDate = new Date(this.f.startDate.value);
    if(myDate instanceof Date){
      this.errorSDate = {
        isError: true,
        errorMessage: 'Invalid Start Date.'};
        this.validateDate();
    }else{
      this.errorSDate = {
        isError: false,
        errorMessage: ''};
    }
  }
  validateDate(){
    if(isNaN(this.f.endDate.value) && !isNaN(Date.parse(this.f.startDate.value))){
      this.errorDate = {
        isError: true,
        errorMessage: 'Invalid End Date.'};
    }else{
      this.errorDate = {
        isError: false,
        errorMessage: ''};
    }
  }
}

export class ClientData {
  name?: string;
  clientId?: string;
}
export class EmployeeData {
  name?: string;
  id?: string;
  employeeId?: string;
  roleid?:any;
}
export class Status {
  statusId?: string;
  statusName?: string;
}
