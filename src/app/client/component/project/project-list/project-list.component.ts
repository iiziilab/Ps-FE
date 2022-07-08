import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { PsolutionsService } from 'src/app/services/psolutions.service';

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
  cid:any;

  displayedColumns: string[] = ['Sr.No','ProjectName', 'ProjectNo','Status','action'];
  public project: Project[] = [];
  dataSource = new MatTableDataSource(this.project);
  selectedRow: any;
  editmode = false;

  constructor(private router : Router,
    private route : ActivatedRoute,
    private services : PsolutionsService,
    private authentication : AuthenticationService) {
    this.route.params.subscribe(res => {
      this.id = res.id;
    });
    if(this.authentication.currentUserValue) {
      this.cid = this.authentication.currentUserValue.data.clientId;
    }
  }


  async ngOnInit(): Promise<void> {
    var result = await this.services.getProjectbyCId(this.cid).toPromise();
    this.project = result;
    console.log(result);
    console.log(result.length);
    this.dataSource = new MatTableDataSource(this.project);
    
    console.log(this.dataSource.filteredData);
    this.dataSource.paginator = this.paginator;
            this.array = result;
            this.totalSize = this.array.length;
            this.iterator();
  }

  onView(value: any): void{
    this.router.navigate(['client/project/view/' + value.id]);
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
  toggle:boolean=false;
  togglemenuclick(){
    this.toggle = !this.toggle;
    
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
}
