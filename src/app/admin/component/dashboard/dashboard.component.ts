import { Component,ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { PsolutionsService } from 'src/app/services/psolutions.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [`.active{
    color:blue;
  }
  canvas {
    height: 470px !important;
    width: 470px !important;
}
  `
  ]
})
export class DashboardComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  constructor(private router : Router,
    private services : PsolutionsService,
    private authentication : AuthenticationService) { 
      if (this.authentication.currentUserValue) {
        this.client = this.authentication.currentUserValue.rolePermission.clientList;
        this.project = this.authentication.currentUserValue.rolePermission.projectList;
        this.permission = this.authentication.currentUserValue.rolePermission.permissionList;
        this.user = this.authentication.currentUserValue.rolePermission.userList;
        this.role = this.authentication.currentUserValue.rolePermission.roleList;
      }

    }

  d: number[] = [];
  noofclient : Number;
  noofproject : number;
  noofpermission : number;
  noofmenu : number;
  client : boolean;
  project : boolean;
  permission : boolean;
  user : boolean;
  role : boolean;
  menu:boolean = true;
  userNo:any;
  empNo:number;
  clientNo:number;
  newuser:number;
  newproject:number;
  newclient:number;
  newemployee:number;
  totalrole:number;
  async ngOnInit(): Promise<void> {
    //client
    if(this.client){
      var clientresult = await this.services.getCompanyClient().toPromise();
      this.noofclient = clientresult.length;
    }
    
    //project
    if(this.project){
      var projectresult = await this.services.getProject().toPromise();
      this.noofproject = projectresult.length;
    }

    //permission
    if(this.permission){
      var permissionresult = await this.services.getModule().toPromise();
      this.noofpermission = permissionresult.length;
    }
    
    await this.services.getUserInfoByDate().toPromise().then(x=> this.newuser = x.length);
    await this.services.getUserByDate().toPromise().then(x=> this.newclient = x.length);
    await this.services.getEmployeeByDate().toPromise().then(x=> this.newemployee = x.length);
    await this.services.getProjectByDate().toPromise().then(x=> this.newproject = x.length);
    await this.services.getAllRole().toPromise().then(x=> this.totalrole = x.length);
    await this.services.getUserInfo().toPromise().then(x=> this.userNo =x.length );
    await this.services.getEmployee().toPromise().then(x=> this.empNo =x.length );
    await this.services.getCompanyClient().toPromise().then(x=> this.clientNo =x.length );
    var data = [this.userNo,this.clientNo,this.empNo];
    this.pieChartData = {
      labels:  [] ,datasets: [{data :[]}]
    };
    //this.pieChartData = data as any [];
    this.pieChartData.labels.push('User');
    this.pieChartData.labels.push('Client');
    this.pieChartData.labels.push('Employee');
    this.pieChartData.datasets[0].data.push(this.userNo);
    this.pieChartData.datasets[0].data.push(this.clientNo);
    this.pieChartData.datasets[0].data.push(this.empNo);
    console.log(this.pieChartData);
  }
  onClientClick(){
    this.router.navigate(['admin/client/list']);
    //this.router.navigate(['admin/c'])
  }
  onPaymentClick(){
    this.router.navigate(['admin/project/list']);
  }
  onPermissionClick(){
    if(this.user){
      this.onUserClick()
    }else if(this.role){
      this.onRoleClick()
    }else if(this.permission){
      this.router.navigate(['admin/permission/list'])
    }
  }
  onUserClick(){
    this.router.navigate(['admin/user/list'])
  }
  onRoleClick(){
    this.router.navigate(['admin/role/list'])
  }
  onMenuClick(){
    this.router.navigate(['admin/menu/select'])
  }
//   // Pie
//   public pieChartOptions: ChartOptions = {
//     responsive: true,
//   };
//   public pieChartLabels: Label[] = ['User', 'Client', 'Employee'];
//   //public pieChartData: SingleDataSet = [this.userNo, this.clientNo, this.empNo];
//   public pieChartData:any = [
//     { 
//         data: []
//     }
// ];
//   public pieChartType: ChartType = 'pie';
//   public pieChartLegend = true;
//   public pieChartPlugins:any[] = [];
//   // CHART COLOR.
//   public pieChartColor:any = [
//     {
//         backgroundColor: ['rgba(30, 169, 224, 0.8)',
//         'rgba(255,165,0,0.9)',
//         'rgba(255, 102, 0, 0.9)',
//         'rgba(255, 161, 181, 0.9)',
//         'rgba(139, 136, 136, 0.9)'
//         ]
//     }
// ]
// Pie
public pieChartOptions: ChartConfiguration['options'] = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
      position: 'top',
    },
    datalabels: {
      formatter: (value, ctx) => {
        if (ctx.chart.data.labels) {
          return ctx.chart.data.labels[ctx.dataIndex];
        }
      },
    },
  }
};
// public pieChartData: ChartData<'pie', number[], string | string[]> = {
//   labels:  [] ,datasets: [{data :[]}]
// };
public pieChartData: ChartData<'pie', number[], string | string[]>;
// public pieChartData: ChartData<'pie', number[], string | string[]> = {
//   labels: [ [ 'Download', 'Sales' ], [ 'In', 'Store', 'Sales' ], 'Mail Sales' ],
//   datasets: [ {
//     data: [ 300, 500, 100 ]
//   } ]
// };
public pieChartType: ChartType = 'pie';
public pieChartPlugins = [ DatalabelsPlugin ];
  toggle:boolean=false;
  togglemenuclick(){
    this.toggle = !this.toggle;
  }
}
interface df{
 user:number;
 client : number;
 employee : number
}