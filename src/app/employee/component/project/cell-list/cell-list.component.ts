import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Cell } from 'src/app/model/cell.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { PsolutionsService } from 'src/app/services/psolutions.service';

@Component({
  selector: 'app-cell-list',
  templateUrl: './cell-list.component.html',
  styles: [`
  table {
    width: 100%;
  }
  [hidden] {
    display: none !important;
}
  `
  ]
})
export class CellListComponent implements OnInit {

  id:any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public pageSize = 10;
  public currentPage = 0;
  public totalSize = 0;
  public array: any;
  addModelInsert :boolean = true;
  cellList : boolean = true;
  displayedColumns: string[] = ['Sr.No','CellName','action'];
  public cell: Cell[] = [];
  dataSource = new MatTableDataSource(this.cell);
  selectedRow: any;
  editmode = false;
  listLink : string;

  projectName: string;
  constructor(private services: PsolutionsService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private authenticationService: AuthenticationService) {
    this.route.params.subscribe(res => {
      this.id = res.id;//projectId 
    }); 
  }

  async ngOnInit(): Promise<void> {
      this.listLink ="/employee/project/cell/"+this.id;
      var result = await this.services.getCellByPid(this.id).toPromise();
      this.cell = result;
      this.dataSource = new MatTableDataSource(this.cell);
      this.dataSource.paginator = this.paginator;
      this.array = result;
      this.totalSize = this.array.length;
      this.iterator();
      this.projectName = localStorage.empProject;
  }

  onView(value: any): void{
    localStorage.setItem('empcell', value.cellName);
    
    if(this.cellList){
      this.router.navigate(['employee/project/cell/view/'  + value.projectId + '&' + value.cellId]);
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

  toggle:boolean=false;
  togglemenuclick(){
    this.toggle = !this.toggle;
    
  }
}

