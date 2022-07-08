import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Cell } from 'src/app/model/cell.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { PsolutionsService } from 'src/app/services/psolutions.service';
import { DeleteMenuComponent } from '../delete-menu/delete-menu.component';

@Component({
  selector: 'app-add-model',
  templateUrl: './add-model.component.html',
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
export class AddModelComponent implements OnInit {

  id:any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public pageSize = 10;
  public currentPage = 0;
  public totalSize = 0;
  public array: any;
  modeltitleurl :string;
  addModelInsert :boolean = true;
  modelform : FormGroup;
  save: boolean;
  edit: boolean;
  message: string;
  show: boolean;
  cellList : boolean = true;
  displayedColumns: string[] = ['Sr.No','CellName','action'];
  public cell: Cell[] = [];
  dataSource = new MatTableDataSource(this.cell);
  selectedRow: any;
  editmode = false;

  constructor(private services: PsolutionsService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private authenticationService: AuthenticationService) {
    this.route.params.subscribe(res => {
      this.id = res.id;//projectId 
    });
    if (this.authenticationService.currentUserValue) {//change clientInsert  to addmodelInsert
      this.addModelInsert = this.authenticationService.currentUserValue.rolePermission.clientInsert;
    } 
  }

  async ngOnInit(): Promise<void> {
    this.modelform= this.formBuilder.group({
      cellId : [''],project:null,
      projectId: [''],
      cellName: ['',Validators.required]
    })
    //if(this.cellList){
      var result = await this.services.getCellByPid(this.id).toPromise();
      this.cell = result;
      this.dataSource = new MatTableDataSource(this.cell);
      this.dataSource.paginator = this.paginator;
      this.array = result;
      this.totalSize = this.array.length;
      this.iterator();
    // }
    // else{
    //   this.router.navigate(['noauthorize']);
    // }
    this.modeltitleurl ="";
    this.modeltitleurl = "/admin/project/addcell/"+this.id;
    this.show = false;
  }

  get f() { return this.modelform.controls; }

  async onSave(): Promise<void> {
    if(this.addModelInsert){
      this.show =true;
    try {
      const model: Cell = {
        cellId: 0,
        cellName: this.f.cellName.value,
        projectId: this.id
      };
      // stop here if form is invalid
      if (this.modelform.invalid) {
        this.message = "Some field is not filled, please fill and try again.";
        setTimeout(async () => {
          this.message = "";
        },1000);
        return;
      }
      const result = await this.services.addCell(model).toPromise();
      if (result.statusCode == 200) {
        this.router.navigate(['admin/project/uploadmenu/'+this.id]);
      }
      setTimeout(() => {
      //this.router.navigate(['admin/client/list']);
      },1000);
    }
    catch (ex) {
      console.log(ex);
    }
    }
    else{
      this.router.navigate(['noauthorize']);
    }
  }

  async onEdit(): Promise<void> {
    this.show =true;
    try {
      const model: Cell = {
        projectId: this.id,
        cellId: this.f.cellId.value,
        cellName: this.f.cellName.value
      };
      // stop here if form is invalid
      if (this.modelform.invalid) {
        this.message = "Some field is not filled, please fill and try again.";
        setTimeout(async () => {
          this.message = "";
        },1000);
        return;
      }
      const result = await this.services.updateCell(this.f.cellId.value, model).toPromise();
      if (result.statusCode == 200) {
        this.message = result.message;
      }
      setTimeout(async () => {
        this.message = "";
      },1000);
    } catch (e) {
      console.log(e);
    }
  }

  onUpload(value : any) : void{
    if(this.cellList){
      this.router.navigate(['admin/project/uploadmenu/' + value.projectId]);
    }else{
      this.router.navigate(['noauthorize']);
    }
  }

  async onEditCell(value: any): Promise<void>{

      this.save = false;
      this.edit = true;
      const res = await this.services.getCellByid(value.cellId).toPromise();
      this.modelform.setValue(res);
    // if(this.cellList){
    //   this.router.navigate(['admin/project/addcell/' + value.cellId]);
    // } else{
    //   this.router.navigate(['noauthorize']);
    // }
  }

  onView(value: any): void{
    if(this.cellList){
      //this.router.navigate(['admin/project/uploadmenu/' + value.id]);
    }else{
      this.router.navigate(['noauthorize']);
    }
  }

  async onDeleteSelected(value: any): Promise<void> {
    if(this.cellList){
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
    
      dialogConfig.data = {
      };
      const dialogRef = this.dialog.open(DeleteMenuComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(
          data => {
            if (data === 'no') {
                return;
            }
    
        try {
            this.services.deleteCell(value.id).subscribe(
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
