import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Cell } from 'src/app/model/cell.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { PsolutionsService } from 'src/app/services/psolutions.service';
import { AddCellStatusComponent } from '../../project/add-cell-status/add-cell-status.component';

@Component({
  selector: 'app-add-cell',
  templateUrl: './add-cell.component.html',
  styles: [
  ]
})
export class AddCellComponent implements OnInit {

  id:any;
  pid: any;
  listLink : string;
  modeltitleurl :string;
  modeltitle : string = "";
  addModelInsert :boolean = true;
  modelform : FormGroup;
  save: boolean;
  edit: boolean;
  message: string;
  show: boolean;
  cellList : boolean = true;
  public cell: Cell[] = [];

  constructor(private services: PsolutionsService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private dialog : MatDialog,
    private authenticationService: AuthenticationService) {
    this.route.params.subscribe(res => {
      this.pid = res.id.substring(0,res.id.lastIndexOf('&'));//projectId
      this.id = res.id.substring(res.id.lastIndexOf('&')+1);
    });
    if (this.authenticationService.currentUserValue) {//change clientInsert  to addmodelInsert
      this.addModelInsert = this.authenticationService.currentUserValue.rolePermission.clientInsert;
    } 
  }

  async ngOnInit(): Promise<void> {
    this.modelform= this.formBuilder.group({
      cellId : [''],project:null,
      projectId: [this.id],
      cellName: ['',Validators.required]
    })
    
    this.modeltitleurl = "/admin/project/cell/add/"+this.id;
    this.modeltitle ="Add";
    if(this.id != null &&  this.pid == ""){//insert/add
      if(this.addModelInsert){
        this.listLink ="/admin/project/cell/"+this.id;
        this.modeltitleurl = "/admin/project/cell/add/"+this.id;
        this.modeltitle = "Add"
        this.save = true;
        this.edit = false;
        //const res = await this.services.getCellByPid(this.id).toPromise();
        //this.modelform.setValue(res);
      }else{
        this.router.navigate(['noauthorize']);
      }
    }
    else if(this.id != null &&  this.pid != null){//update
      if(this.addModelInsert){
        this.listLink ="/admin/project/cell/"+this.pid;
        this.modeltitleurl = "/admin/project/cell/edit/"+this.id;
        this.modeltitle = "Edit"
        this.save = false;
        this.edit = true;
        const res = await this.services.getCellByid(this.id).toPromise();
        this.modelform.setValue(res);
      }else{
        this.router.navigate(['noauthorize']);
      }
    }
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
        },500);
        return;
      }
      const result = await this.services.addCell(model).toPromise();
      if (result.statusCode == 200) {
        this.router.navigate(['admin/project/uploadmenu/'+this.id+'&'+result.data.cellId]);
      }
      setTimeout(() => {
      //this.router.navigate(['admin/client/list']);
      },500);
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
        projectId: this.pid,
        cellId: this.id,
        cellName: this.f.cellName.value
      };
      // stop here if form is invalid
      if (this.modelform.invalid) {
        this.message = "Some field is not filled, please fill and try again.";
        setTimeout(async () => {
          this.message = "";
        },500);
        return;
      }
      const result = await this.services.updateCell(this.f.cellId.value, model).toPromise();
      if (result.statusCode == 200) {
        this.message = result.message;
      }
      setTimeout(async () => {
        this.message = "";
      },500);
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

  onView(value: any): void{
    if(this.cellList){
      //this.router.navigate(['admin/project/uploadmenu/' + value.id]);
    }else{
      this.router.navigate(['noauthorize']);
    }
  }

  onAddModel(value:any):void{
    //if(this.projectInsert){
      this.router.navigate(['admin/project/cell/add/' + value.id]);
    //}else{
     // this.router.navigate(['noauthorize']);
    //}
  }
}
