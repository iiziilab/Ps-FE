import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';

import { MatTableDataSource } from '@angular/material/table';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { PsolutionsService } from 'src/app/services/psolutions.service';
import { DeleteProjectComponent } from '../delete-project/delete-project.component';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ProjectStatusComponent } from '../project-status/project-status.component';
import { AddCellStatusComponent } from '../add-cell-status/add-cell-status.component';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styles: [
    `
    table {
      width: 100%;
    }
    [hidden] {
      display: none !important;
  }
  .a-tap{
    color: #0c80d3;
    cursor: pointer;
  }
    `
  ]
})
export class ProjectListComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  public pageSize = 10;
  public currentPage = 0;
  public totalSize = 0;
  public array: any;
  id: string;
  message:string;
  projectInsert : boolean;
  projectUpdate : boolean;
  projectDelete : boolean;
  projectList:boolean;
  cellList : boolean;
  projectDetails : boolean;
  statusClass = 'active';
  displayedColumns: string[] = ['Sr.No','ProjectName', 'ProjectNo','Status','action'];
  public project: Project[] = [];
  dataSource = new MatTableDataSource<Project>([]);
  selectedRow: any;
  editmode = false;

  constructor(private router : Router,
              private route : ActivatedRoute,
              private services : PsolutionsService,
              private dialog: MatDialog,
              private authenticate : AuthenticationService) {
              this.route.params.subscribe(res => {
                this.id = res.id;
              });
              if (this.authenticate.currentUserValue) {
                this.projectInsert = this.authenticate.currentUserValue.rolePermission.projectInsert;
                this.projectUpdate = this.authenticate.currentUserValue.rolePermission.projectUpdate;
                this.projectDelete = this.authenticate.currentUserValue.rolePermission.projectDelete;
                this.projectDetails = this.authenticate.currentUserValue.rolePermission.projectDetails;
                this.projectList = this.authenticate.currentUserValue.rolePermission.projectList;
                this.cellList = this.authenticate.currentUserValue.rolePermission.cellList;
              }
              this.dataSource = new MatTableDataSource<Project>([]);
            }

  async ngOnInit(): Promise<void> {
    this.message ="";
    if(this.projectList){
      var result = await this.services.getProject().toPromise();
      this.project = result;
      this.dataSource = new MatTableDataSource(this.project);
      console.log(this.dataSource.filteredData.length)
      console.log(this.dataSource.data.length)
      this.dataSource.paginator = this.paginator;
      this.array = result;
      this.totalSize = this.array.length;
      this.iterator();
    }
    else{
      this.router.navigate(['noauthorize']);
    }
  }
  onEdit(value: any): void{
    if(this.projectUpdate){
      localStorage.removeItem('projectName');
      localStorage.setItem('projectName', value.projectName)
      this.router.navigate(['/admin/project/cell/view/', value.cellId]);
      this.router.navigate(['admin/project/edit/' + value.id]);
    }else{
      this.router.navigate(['noauthorize']);
    }
  }
  onView(value: any): void{
    if(this.projectDetails){
      localStorage.removeItem('projectName');
      localStorage.setItem('projectName', value.projectName)
      this.router.navigate(['admin/project/view/' + value.id]);
    }else{
      this.router.navigate(['noauthorize']);
    }
  }

  clickRow(e: any){
  localStorage.removeItem('projectName');
  localStorage.setItem('projectName', e.projectName)
  this.router.navigate(['/admin/project/cell/view/', e.cellId]);
  //[routerLink]="['/admin/project/cell/view/', element.cellId]"
  
  }
   
  async onDeleteSelected(value: any): Promise<void> {
    if(this.projectDelete){
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
    
      dialogConfig.data = {
      };
      const dialogRef = this.dialog.open(DeleteProjectComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(
          data => {
            if (data === 'no') {
                return;
            }
    
        try {
            this.services.deleteProject(value.id).subscribe(
              (res) => {
                  this.ngOnInit();
                }
              );
            } catch (e) {

            }
          }
      );
    }else{
      this.router.navigate(['noauthorize']);
    }
  }
  onAddModel(value:any):void{
    if(this.projectInsert){
      this.router.navigate(['admin/project/addcell/' + value.id]);
    }else{
      this.router.navigate(['noauthorize']);
    }
  }
  onCellList(value:any) : void{
    if(this.cellList){
      localStorage.removeItem('projectName');
      localStorage.setItem('projectName', value.projectName)
      this.router.navigate(['admin/project/cell/' + value.id]);
    }else{
      this.router.navigate(['noauthorize']);
    }
    //this.router.navigateByUrl("admin/project/upload/"+value.id);
  }
  
  onAddProject(){
    if(this.projectInsert){
      this.router.navigate(['admin/project/add']);
    }else{
      this.router.navigate(['noauthorize']);
    }
  }
  highlight(): void {
    this.editmode = !!this.selectedRow;
  }
  public handlePage(e: any) {
    this.currentPage = e.pageIndex;
    this.pageSize = e.pageSize;
    this.iterator();
  }
  
  private iterator() {
    const end = (this.currentPage + 1) * this.pageSize;
    const start = this.currentPage * this.pageSize;
    const part = this.array.slice(start, end);
    this.dataSource = part;
  }
  async onchangingStatus(value: any): Promise<void>{
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '380px';
    dialogConfig.height = '250px';
  
    dialogConfig.data = {
    };
    const dialogRef = this.dialog.open(ProjectStatusComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      data => {
        if (data === 'Inactive') {
          value.status.statusId = 2;
          this.statusClass = 'inactive';
        }else if (data === 'Active'){
          value.status.statusId = 1;
          this.statusClass = 'active';
        }else{
          return;
        }
      try {
          // value.roleId = value.role.roleId;
          value.statusId = value.status.statusId;
          value.status.statusName = data;
          this.services.addProject(value).subscribe(
            (res) => {
                this.ngOnInit();
              }
            );
          } catch (e) {

          }
        }
    );
  }
}
export class Project {
  Id: string;
  ProjectName: string;
  ProjectNo : string;
  Client:string;
  Employee : string;
  Description : string;
  StartDate : Date;
  EndDate:Date;
  DataType:string;
  statusId: any;
}
