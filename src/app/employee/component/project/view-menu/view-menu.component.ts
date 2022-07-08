import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Menu } from 'src/app/model/menu.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { PsolutionsService } from 'src/app/services/psolutions.service';

@Component({
  selector: 'app-view-menu',
  templateUrl: './view-menu.component.html',
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
    margin: 0 5px;
    width: 150px;
  }
  .mat-stroked-button{
    height: 60px;
    width: 150px;
    background-color: #f3f2f2;
    vertical-align: top;
    border: none;
    color: #787676;
    margin : 0 5px;
  }
  .mat-expansion-panel {
    box-sizing: content-box;
    display: contents;
    margin: 0;
    border-radius: 4px;
    overflow: hidden;
    transition: margin 225ms cubic-bezier(0.4, 0, 0.2, 1),box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
  }
  .button-panle{
    border: none;
    display: block;
    margin: 10px;
    background: transparent;
    color: #121111;
    font-size: 15px;
  }
  mat-expansion-panel-header {
    padding: 0;
  }
  mat-expansion-panel .mat-expansion-panel-header.cdk-keyboard-focused:not([aria-disabled=true]), .mat-expansion-panel .mat-expansion-panel-header.cdk-program-focused:not([aria-disabled=true]), .mat-expansion-panel:not(.mat-expanded) .mat-expansion-panel-header:hover:not([aria-disabled=true]) {
    background: transparent;
  }
  .mat-expansion-panel-header.mat-expanded:focus, .mat-expansion-panel-header.mat-expanded:hover {
    background: transparent;
  }
  .mat-expansion-panel-header.mat-expanded {
    height: 35px;
  }
  i.fa.fa-compass {
    font-size: 35px;
    color: #fff;
  }
  .form-label{
    float: left;
    padding: 6px 15px 0px 0px;
  }
  .input-cell{
    height: 20px;
    width: 200px;
  }

 `
  ]
})
export class ViewMenuComponent implements OnInit {

  constructor(private route: ActivatedRoute,
    private services: PsolutionsService,
    private authentication: AuthenticationService) {
    this.route.params.subscribe(res => {
      this.id = res.id.substring(0,res.id.lastIndexOf('&'));//projectId
      this.cid = res.id.substring(res.id.lastIndexOf('&')+1);
    });
    if (this.authentication.currentUserValue) {

    }
  }

  displayedColumns: string[] = ['Item', 'ConsiderationSet', 'ForceIntoResults'];

  public menu: Menu[] = [];
  id: any;
  cid:any;
  selectedRow: any;
  editmode = false;
  selectedConsolidation: string;
  selectedforce: string;
  selectedviewgroup: string;
  isTableExpanded = false;
  dataSource = new MatTableDataSource(this.menu);
  category : any;
  modeltitleurl : string;
  cellName: string;
  projectName: string;

  async ngOnInit(): Promise<void> {
    this.modeltitleurl = "/admin/project/cell/view/"+this.id + '&' + this.cid;
    this.dropicon = "chevron_right";
    var result = await this.services.getMenuByCid(this.cid).toPromise();
    this.menu = result;
    this.category = [ ...new Set( this.menu.map(obj => obj.categoryIndex) ) ].map(o=> { return this.menu.filter(obj => obj.categoryIndex === o) } );
    //this.category = [ ...new Set( this.menu.map(obj => obj.categoryIndex) ) ].map(o=> { return this.menu.find(obj => obj.categoryIndex === o) } );
    this.dataSource = new MatTableDataSource(this.menu);
    this.cellName = localStorage.empcell;
    this.projectName = localStorage.empProject;
  }

  highlight(): void {
    this.editmode = !!this.selectedRow;
  }

  
  toggle: boolean = false;
  togglemenuclick() {
    this.toggle = !this.toggle;
  }

  onConsolidationClick(e:any){
    if(e === "Select"){
      this.dataSource.data.forEach((row: any) => {
      row.consideration = true;
      })
    }else if(e === "Unselect"){
      this.dataSource.data.forEach((row: any) => {
      row.consideration = false;
      })
    }else{
      this.dataSource = new MatTableDataSource(this.menu);
    }
  }

  onConsolidationChange(e:any){
    if(e.value === "Select"){
      this.dataSource.data.forEach((row: any) => {
        row.consolidation = true;
      })
    }else if(e.value === "Unselect"){
      this.dataSource.data.forEach((row: any) => {
        row.consolidation = false;
      })
    }else{
      this.dataSource = new MatTableDataSource(this.menu);
    }
  }

  onIncludeClick(e:any){
    console.log(e);
    if(e === "Select"){
      this.dataSource.data.forEach((row: any) => {
        row.include = true;
      })
    }else if(e === "Unselect"){
      this.dataSource.data.forEach((row: any) => {
        row.include = false;
      })
    }
  }
 
  onIncludeChange(e:any){
    console.log(e.value);
    if(e.value === "Select"){
      this.dataSource.data.forEach((row: any) => {
        row.include = true;
      })
    }else if(e.value === "Unselect"){
      this.dataSource.data.forEach((row: any) => {
        row.include = false;
      })
    }
  }
  onViewGroupChange(e:any){
    console.log(e.value);
    if(e.value === "Reset"){
      this.dataSource = new MatTableDataSource(this.menu);
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

  masterExpandCollapseGroups() {
    this.isTableExpanded = !this.isTableExpanded;

    this.dataSource.data.forEach((data: any) => {
      data.isExpanded = !data.isExpanded
    })
  }
  masterViewGroupReset() {
    this.dataSource = new MatTableDataSource(this.menu);
  }
  masterViewGroupSelected() {
    this.isTableExpanded = !this.isTableExpanded;
  
      this.dataSource.data.forEach((data: any) => {
        if(!data.expanded)
        data.expanded = !data.expanded
      })
  }
  dropicon:any;


  findDetails(data:any) {
    return this.menu.filter(x => x.categoryIndex === data.categoryIndex);
  }
  
}


