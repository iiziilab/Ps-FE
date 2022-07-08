import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Cell } from 'src/app/model/cell.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { PsolutionsService } from 'src/app/services/psolutions.service';
import { AddCellStatusComponent } from '../../project/add-cell-status/add-cell-status.component';
import { DeleteCellComponent } from '../delete-cell/delete-cell.component';
import * as XLSX from 'xlsx';
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
  commonId: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public pageSize = 10;
  public currentPage = 0;
  public totalSize = 0;
  public array: any;
  menushow :boolean;
  upload:boolean;
  cellList : boolean;
  displayedColumns: string[] = ['Sr.No','CellName','action'];
  public cell: Cell[] = [];
  dataSource = new MatTableDataSource(this.cell);
  selectedRow: any;
  editmode = false;
  listLink : string;
  titelUp: string;
  isShowData: boolean = false;
  isShowupload: boolean = false;
  isShow: boolean = true;
  modelform: FormGroup;

  constructor(private services: PsolutionsService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private authenticationService: AuthenticationService) {
    this.route.params.subscribe(res => {
      this.id = res.id;//projectId 
    });
    if (this.authenticationService.currentUserValue) {
      this.menushow = this.authenticationService.currentUserValue.rolePermission.menu;
      this.upload = this.authenticationService.currentUserValue.rolePermission.upload;
      this.cellList = this.authenticationService.currentUserValue.rolePermission.cellList;
    } 
  }

  pName: string;
  async ngOnInit(): Promise<void> {
    if(this.cellList){
      this.listLink ="/admin/project/cell/"+this.id;
      var result = await this.services.getCellByPid(this.id).toPromise();
      this.cell = result;
      this.dataSource = new MatTableDataSource(this.cell);
      this.dataSource.paginator = this.paginator;
      this.array = result;
      this.totalSize = this.array.length;
      this.iterator();
      this.authenticationService.Id$.subscribe((val) => this.ngLoad());
    }
    else{
      this.router.navigate(['noauthorize']);
    }
    this.pName = localStorage.getItem('projectName');
  }
   
 ngLoad(){
    this.ngOnInit();
    this.titelUp = '';
    this.isShow = true;
    this.isShowupload = false;
    this.isShowData = false;
  }

  async onUpload() : Promise<void>{
    if(this.upload){
      //this.router.navigate(['admin/project/uploadmenu/' + this.id]);
      localStorage.removeItem('_id');
      localStorage.setItem('_id',this.id)
      this.titelUp = 'Upload';
      this.isShow = false;
      this.isShowupload = true;
      this.isShowData = false;
    }else{
      this.router.navigate(['noauthorize']);
    }
  }

  async onEditCell(value: any): Promise<void>{
    if(this.cellList){
      this.router.navigate(['admin/project/cell/edit/' + value.cellId]);
    } else{
      this.router.navigate(['noauthorize']);
    }
  }

  onView(value: any): void{
    if(this.menushow){
      this.router.navigate(['admin/project/cell/view/' + value.cellId]);
    }else{
      this.router.navigate(['noauthorize']);
    }
  }

  onInteractiveCell(value:any):void{
    if(this.menushow){
      this.router.navigate(['admin/project/cell/interactive/' + value.cellId]);
    }else{
      this.router.navigate(['noauthorize']);
    }
  }

  onSubgroup(value: any):void{
    this.router.navigate(['admin/project/cell/subgroup/' + value.cellId]);
  }
  
  cellname: string = 'Cell';
  onOptimization(value:any):void{
    if(this.menushow){
     // this.router.navigate(['admin/project/cell/optimized/' + value.cellId]);
      localStorage.removeItem('_id');
      localStorage.setItem('_id',value.cellId);
      this.commonId = value;
      this.cellname = value.cellName;
      this.titelUp = 'Upload Data';
      this.isShowData = true;
      this.isShow = false;
    }else{
      this.router.navigate(['noauthorize']);
    }
  }

  async onAddingCell(): Promise<void>{
    const res = await this.services.getCellByPid(this.id).toPromise();
    if (res.length >= 1) {
      this.onAddCell();
    }
    else{
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.width="300px";
      dialogConfig.height = "260px";
      dialogConfig.data = {
      }; 
      const dialogRef = this.dialog.open(AddCellStatusComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(
          data => {
            if (data === 'no') {
              this.router.navigate(['admin/project/uploadmenu/'+ this.id]);
              return;
            }else if(data === 'yes'){
            try {
              this.onAddCell();
            } catch (e) {

            }
          }
        }
      );
    }
  }

  onAddCell(): void{
    if(this.cellList){
      this.router.navigate(['admin/project/cell/add/'+this.id]);
    }else{
      this.router.navigate(['noauthorize']);
    }
  }

  async onDeleteSelected(value: any): Promise<void> {
    //if(this.cellList){
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
    
      dialogConfig.data = {
      };
      const dialogRef = this.dialog.open(DeleteCellComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(
          data => {
            if (data === 'no') {
                return;
            }
    
        try {
            this.services.deleteCell(value.cellId).subscribe(
              (res) => {
                  console.log(181, res);
                  this.ngOnInit();
                }
              );
            } catch (e) {

            }
          }
      );
    // }else{
    //   this.router.navigate(['noauthorize']);
    // }
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

 async goBackCell(){
  console.log(218,'cleck me');
  
  this.cellname = 'Cell';
  this.titelUp = '';
  this.isShow = true;
  this.isShowupload = false;
  this.isShowData = false;
  }
}
