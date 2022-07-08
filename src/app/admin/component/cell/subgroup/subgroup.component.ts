import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Cell } from 'src/app/model/cell.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { PsolutionsService } from 'src/app/services/psolutions.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-subgroup',
  templateUrl: './subgroup.component.html',
  styles: [`

  th, tr,td {
     border-collapse: collapse;
     padding: 0;
     border-bottom-width: 1px;
     border-bottom-style: solid;
     border-bottom-color: rgba(0,0,0,.12);
 }
 thead{
   font-family: Roboto, "Helvetica Neue", sans-serif !important;
 }
 
 th, td {
     padding: 11px;
     text-align: left;
 }
 
 table {
     width: 100%;
     text-align: center !important;
   }
 
  th {
   font-family: Roboto, "Helvetica Neue", sans-serif !important;
     vertical-align: middle !important;
   }
   .mat-sort-header-container {
     justify-content: center !important;
   }
 
 .expandable-btn{
   wdith: 40px;
   height : 30px;
   position: absolute;
   display: inline-flex;
   align-items: center;
   justify-content: center;
   position: relative;
   box-sizing: border-box;
   -webkit-tap-highlight-color: transparent;
   background-color: transparent;
   outline: 0px!important;
   border: 0px;
   margin: 0px;
   cursor: pointer;
   -webkit-user-select: none;
   user-select: none;
   vertical-align: middle;
   -webkit-appearance: none;
   -moz-appearance: none;
   appearance: none;
   text-decoration: none;
   text-align: center;
   flex: 0 0 auto;
   font-size: 1.5rem;
   padding: 8px;
   border-radius: 50%;
   overflow: visible;
   transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
 }
 .mat-form-field-infix {
   border-top: 0.35375em solid transparent!important;
 }
 .mat-form-field-appearance-fill .mat-form-field-infix {
   padding: 0.23em 0 0.27em 0!important;
 }
 .mat-select-value {
   padding-top: 0px!important;
 }
 .excelbtn{
   width:160px;
   background-color: rgba(0,0,0,.04);
   padding: 12px;
   line-height: 1.6;
   height: 60px;
   border: 0px;
   margin: 0px;
   cursor: pointer;
   outline: 0px!important;
   color : rgba(0,0,0,.6);
   margin: 0 7px
 }
 .headcell > .mat-form-field {
  margin: 0 7px;
  width: 110px;
}
.mat-stroked-button{
  height: 60px;
  width: 139px;
  background-color: #f3f2f2;
  vertical-align: top;
  border: none;
  color: #787676;
}
 `
  ]
})
export class SubgroupComponent implements OnInit {

  constructor(private route: ActivatedRoute,
    private services: PsolutionsService,
    private router : Router,
    private authentication: AuthenticationService) {
    this.route.params.subscribe(res => {
      this.id = res.id;
    });
    if (this.authentication.currentUserValue) {
      this.menushow = this.authentication.currentUserValue.rolePermission.menu;
    }
  }

  displayedColumns: string[] = ['Available', 'Subgroup'];

  public subgroup : Subgroup[] = [];
  id: any;
  cid:any;
  selectedRow: any;
  editmode = false;
  selectedConsolidation: string;
  selectedforce: string;
  selectedviewgroup: string;
  isTableExpanded = false;
  dataSource = new MatTableDataSource(this.subgroup);
  category : any;
  modeltitleurl : string;
  listLink : string;
  CellName : string;
  exportActive : boolean= false;
  showHeader : boolean = true;
  projectid: any;
  menushow : boolean;
  showSelected : boolean;
  showFilter : boolean;
  threshold : number;
  search : string;
  cellList : Cell[] = [];
  selectedCell : any;
  public static thresholdValue : any;
  alts_list : any[] = [];
  show_message_dialog : boolean;
  forcedintoitem : number = 0;
  considerationsetitem : number = 0;
  numberchosen : number;

  pName: string;
  cellName: string;
  async ngOnInit(): Promise<void> {

    if(this.menushow){
      this.pName = localStorage.getItem('projectName');
      var res = await this.services.getCellByid(this.id).toPromise();
      this.cellName = res.cellName;
      this.projectid = res.projectId;
      this.listLink = "/admin/project/cell/"+this.projectid;
      this.modeltitleurl = "/admin/project/cell/subgroup/"+this.id;
      this.dropicon = "chevron_right";
      var res1 = await this.services.getCellByPid(this.projectid).toPromise();
      this.cellList = res1;
      this.selectedCell = Number(this.id);
      this.dataSource = new MatTableDataSource(this.data1);
      this.category = [ ...new Set( this.data1.map(obj => obj.categoryIndex) ) ].map(o=> { 
        return this.data1.filter(obj => obj.categoryIndex === o)
      });
    }else{
      this.router.navigate(['noauthorize']);
    }
  }

  highlight(): void {
    this.editmode = !!this.selectedRow;
  }

  onConsolidationChange(e:any){
    console.log(e.value);
    if(e.value === "Show All"){
      this.dataSource = new MatTableDataSource(this.data1);
      this.category = [ ...new Set( this.data1.map(obj => obj.categoryIndex) ) ].map(o=> { 
        return this.data1.filter(obj => obj.categoryIndex === o)
      });
    }else if(e.value === "Show Selected"){
      this.dataSource.data.forEach((row: any) => {
        this.category = [ ...new Set( this.data1.map(obj => obj.categoryIndex) ) ].map(o=> { 
          return this.data1.filter(obj => obj.categoryIndex === o && obj.available === row.available)
        });
      })
    }else{
      this.dataSource = new MatTableDataSource(this.data1);
    }
  }
 
  onViewGroupChange(e:any){
    console.log(e.value);
    if(e.value === "Reset"){
      this.dataSource = new MatTableDataSource(this.subgroup);
    }else if(e.value === "Show Selected"){
      this.isTableExpanded = !this.isTableExpanded;
      this.dataSource.data.forEach((data: any) => {
        if(data.isExpanded == true){
          data.isExpanded = !data.isExpanded
        }
      })
    }else if(e.value === "Expand/Collapse Groups"){
      this.isTableExpanded = !this.isTableExpanded;
      this.dataSource.data.forEach((data: any) => {
        data.isExpanded = !data.isExpanded
      })
    }
  }

  async onCellChange(e:any){
    this.router.navigate(['admin/project/cell/view/' + e.value]);
    await this.ngOnInit();
  }

  async onOptimized(): Promise<void>{
    this.forcedintoitem = 0;
  }

  masterExpandCollapseGroups() {
    this.isTableExpanded = !this.isTableExpanded;

    this.dataSource.data.forEach((data: any) => {
      data.isExpanded = !data.isExpanded
    })
  }
  masterViewGroupSelectAll() {
    this.dataSource.data.forEach((row: any) => {
      row.isExpanded = true;
      row.available = true;
    })
  }
  masterViewGroupUnSelectAll() {
    this.dataSource.data.forEach((row: any) => {
      row.isExpanded = true;
      row.available = false;
    })
  }
  dropicon:any;


  findDetails(data:any) {
    return this.data1.filter(x => x.categoryIndex === data.categoryIndex);
  }
   data1 = [
      {subgroup: 'Total Sample', categoryIndex: 0, category: 'Total', available : false,isExpanded:false},
      {subgroup: 'Segment 0', categoryIndex: 1, category: 'Category 1', available : false,isExpanded:false},
      {subgroup: 'Segment 1', categoryIndex: 1, category: 'Category 1', available : false,isExpanded:false},
      {subgroup: 'Segment 2', categoryIndex: 2, category: 'Category 2', available : false,isExpanded:false},
      {subgroup: 'Segment 3', categoryIndex: 2, category: 'Category 2', available : false,isExpanded:false},
      {subgroup: 'Segment 4', categoryIndex: 2, category: 'Category 2', available : false,isExpanded:false}
  ];
}
export interface Subgroup{
  available : boolean;
  subgroup : string;
  category : string;
  categoryIndex : number;
  isExpanded : boolean;
}
