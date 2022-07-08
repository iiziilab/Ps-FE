import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';

import { MatTableDataSource } from '@angular/material/table';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { PsolutionsService } from 'src/app/services/psolutions.service';
import { DeleteClientComponent } from '../delete-client/delete-client.component';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Employee } from '../view-client/view-client.component';
import { ToastrService  } from 'ngx-toastr';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styles: [`
  table {
    width: 100%;
  }
  [hidden] {
    display: none !important;
}
.modal-body, .modal-footer, .modal-header {
  /* padding: var(--card-spacing); */
  padding: 10px 20px 10px 20px !important;
}
.card .card-body, .card .card-footer, .card .card-header {
  /* padding: var(--card-spacing); */
  padding: 5px 10px 5px 10px;
}
.mb-5 {
  margin-bottom: 0rem !important;
  max-height: 225px;
  overflow: auto;
}
  `
  ]
})
export class ClientListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public pageSize = 10;
  public currentPage = 0;
  public totalSize = 0;
  public array: any;
  id: string;
  message : string;
  clientInsert : boolean;
  clientUpdate : boolean;
  clientDelete : boolean;
  clientDetails : boolean;
  clientList : boolean;
  closetoast : boolean;

  employee:Employee[];
  // displayedColumns: string[] = ['Sr.No','Name', 'Email','Address', 'Action'];
  displayedColumns: string[] = ['Sr.No','Name','Address', 'Action'];
  public clientDTO: clientDTO[] = [];
  dataSource = new MatTableDataSource(this.clientDTO);
  selectedRow: any;
  editmode = false;

  constructor(private router : Router,
              private route : ActivatedRoute,
              private services : PsolutionsService,
              private dialog: MatDialog,
              private authentication : AuthenticationService,
              private toastr:ToastrService  ) {
              this.route.params.subscribe(res => {
                this.id = res.id;
              });
              if (this.authentication.currentUserValue) {
                this.clientInsert = this.authentication.currentUserValue.rolePermission.clientInsert;
                this.clientUpdate = this.authentication.currentUserValue.rolePermission.clientUpdate;
                this.clientDelete = this.authentication.currentUserValue.rolePermission.clientDelete;
                this.clientDetails = this.authentication.currentUserValue.rolePermission.clientDetails;
                this.clientList = this.authentication.currentUserValue.rolePermission.clientList;
              }
            }

  async ngOnInit(): Promise<void> {
   
    if(this.clientList){
      var result = await this.services.getCompanyClient().toPromise();
      this.clientDTO = result;
      this.dataSource = new MatTableDataSource(this.clientDTO);
      
      this.dataSource.paginator = this.paginator;
            this.array = result;
            this.totalSize = this.array.length;
            this.iterator();
    } else{
      this.router.navigate(['noauthorize']);
    }
  }
  onEdit(value: any): void{
    if(this.clientUpdate){
      this.router.navigate(['admin/client/edit/' + value.clientId]);
    } else{
      this.router.navigate(['noauthorize']);
    }
  }
  onView(value: any): void{
    if(this.clientDetails){
      this.router.navigate(['admin/client/view/' + value.clientId]);
    } else{
      this.router.navigate(['noauthorize']);
    }
  }
  async onDeleteSelected(value: any): Promise<void> {
    if(this.clientDelete){
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
    
      dialogConfig.data = {
      };
      const dialogRef = this.dialog.open(DeleteClientComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(
          data => {
            if (data === 'no') {
                return;
            }
    
        try {
            this.services.deleteCompanyClient(value.clientId).subscribe(
              (res) => {
                console.log(125, res);
                if(res.statusCode === 200){
                    this.services.deleteEmployeebyCid(value.clientId).subscribe((r)=>{
                    this.ngOnInit();
                  })
                }else{
                  this.toastr.info(res.message);
                }
              });
            }catch(e){

            }
          }
      );
    } else{
      //this.message = "You are not authorised to access this module section.";
      // setTimeout(() => {
      //   this.message ="";
      // }, 1500);
      this.router.navigate(['noauthorize']);
    }
  }
  onAddClient(){
    if(this.clientInsert){
      this.router.navigate(['admin/client/add']);
    } else{
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
  closeToast(){
    this.closetoast = true;
  }
  displayStyle = "none";
  
  async openPopup(val: any)  {
    console.log(158,val);
    const employeeresult = await this.services.getEmployeeByCid(val.clientId).toPromise();
    this.employee = employeeresult;
    this.displayStyle = "block";
  }
  closePopup() {
    this.displayStyle = "none";
  }
}
export class clientDTO {
  clientId: string;
  Name: string;
  Email: string;
  Address: string;
}
