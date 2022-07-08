import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from 'src/app/model/project.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { PsolutionsService } from 'src/app/services/psolutions.service';

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
}`
  ]
})
export class AddProjectComponent implements OnInit {

  projectform : FormGroup;
  id: number;
  save : boolean;
  edit : boolean;
  message : string;
  selectedclient : any=[];
  selectedemployee : any=[];
  selecteddataType : any;
  selectedstatus : any;
  show : boolean;
  maxDate: any;
  minDate: Date;
  dateSent : any;
  dateReceived : any;
  canChangeStatus : boolean;
  editProject : boolean;
  editprojectlink : string;

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
      if((this.authenticationService.currentUserValue.data.role.roleName==="admin") || (this.authenticationService.currentUserValue.data.role.roleName
        ==="client") || (this.authenticationService.currentUserValue.data.role.roleName === "superAdmin")){
          this.canChangeStatus = true;
        }
        else{
          this.canChangeStatus = false;
        }
        if(this.authenticationService.currentUserValue) {
          this.editProject = this.authenticationService.currentUserValue.data.editProject;
        }
        const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 0, 0, 1);
    this.maxDate = new Date(currentYear + 1, 11, 31);
     }

  async ngOnInit(): Promise<void> {
    if(this.editProject){
      this.editprojectlink = "/employee/project/edit/"+this.id;
      this.projectform = this.formBuilder.group({
      id : [''],
      projectName : ['',Validators.required],
      projectNo : ['',Validators.required],
      clientId : ['',Validators.required],
      employeeId : ['',Validators.required],
      startDate: ['',Validators.required],
      endDate : ['',Validators.required],
      dataType: [''],
      statusId : ['',Validators.required],
      status :[''],
      description : [''],
    })
    this.projectform.get('endDate').disable();
    const clientres = await this.services.getCompanyClient().toPromise();
    this.client = clientres;
    const statusres = await this.services.getStatus().toPromise();
    this.status = statusres;

    this.maxDate = new Date();
    this.maxDate = this.datepipe.transform(this.maxDate, 'dd-MM-yyyy');
    console.log(this.maxDate);
    

    if(this.id){
        this.save = false;
        this.edit = true;
        const  projectres = await this.services.getProjectbyId(this.id).toPromise();
        projectres.startDate = projectres.startDate.slice(0,10);
        projectres.endDate = projectres.endDate.slice(0,10);
        this.projectform.setValue(projectres);
        this.dateReceived = this.f.startDate.value;
        if(this.f.clientId.value){
          this.selectedclient = this.f.clientId.value;
          const employeeres = await this.services.getEmployeeListByCid(this.f.clientId.value).toPromise();
          this.employee = employeeres;
          this.selectedemployee = this.f.employeeId.value;
          this.selecteddataType = this.f.dataType.value;
          this.selectedstatus = this.f.statusId.value;
        }
      }
      else if(this.id === undefined){
        this.save = true;
        this.edit = false;
      }
      this.show = false;
    }else{
      this.router.navigate(['noauthorize']);
    }
  }

  get f(){
    return this.projectform.controls;
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
          this.router.navigate(['employee/project/list']);
        }, 1000);
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
    this.selectedclient=event.value  as string[];
    let y1 = this.selectedclient as string[];
    const employeeres = await this.services.getEmployeeListByCid(this.selectedclient).toPromise();
    this.employee = employeeres;
  }
  onEmployeeChange(event:any) : void{
    this.selectedemployee =event.value  as string[];
    console.log(this.selectedemployee);
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
 
  toggle:boolean=false;
  togglemenuclick(){
    this.toggle = !this.toggle;
    
  }
  events: string[] = [];

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.events.push(`${type}: ${event.value}`);
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
