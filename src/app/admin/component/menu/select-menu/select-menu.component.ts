import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { PsolutionsService } from 'src/app/services/psolutions.service';
import { Menu } from 'src/app/model/menu.model';
import * as XLSX from 'xlsx';
import { ExcelService } from 'src/app/services/excel.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Cell } from 'src/app/model/cell.model';
import { Calc } from '../../cell/calculation/Calc';
import { matrix, matrix1, matrix2, matrix3, matrix6 } from '../../cell/calculation/matrix';
import { vector, vector1 } from '../../cell/calculation/vector';
import { Alts } from '../../cell/calculation/Alt.model';
import { ShowMessageComponent } from '../show-message/show-message.component';
import { NoofitemComponent } from '../noofitem/noofitem.component';
import { QuicknoofitemComponent } from '../quicknoofitem/quicknoofitem.component';
import { CalcInteractive } from '../../cell/calculation/CalcInteractive';
import { analyzeAndValidateNgModules } from '@angular/compiler';

@Component({
  selector: 'app-select-menu',
  templateUrl: './select-menu.component.html',
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
  ],
})
export class SelectMenuComponent implements OnInit {
  panelOpenState = false;
  constructor(private route: ActivatedRoute,
    private services: PsolutionsService,
    private router : Router,private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private authentication: AuthenticationService,
    private excel : ExcelService) {
    this.route.params.subscribe(res => {
      this.id = res.id;
    });
    if (this.authentication.currentUserValue) {
      this.menushow = this.authentication.currentUserValue.rolePermission.menu;
    }
  }

  displayedColumns: string[] = ['Item', 'ConsiderationSet', 'ForceIntoResults'];

  public menu : Menu[] = [];
  selectform : FormGroup;
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
  listLink : string;
  CellName : string;
  exportActive : boolean= false;
  @ViewChild('TABLE') table: ElementRef;
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

  isFirst: boolean = true;
  isSecond: boolean = true;
  isThrid: boolean = true;

  data_01: any[] = [];
  seg_01: any[] = [];
  weigth_01: any[] = [];
  async ngOnInit(): Promise<void> {
    this.selectform= this.formBuilder.group({
      cellId : [''],project:null,
      projectId: [''],
      threshold: ['130',Validators.required]
    })
    this.threshold = 130;
    this.showSelected = false;
    if(this.menushow){
      var project = await this.services.getCellByid(this.id).toPromise();
      console.log(227,project);
      
      this.projectid = project.projectId;
      this.listLink = "/admin/project/cell/"+this.projectid;
      this.modeltitleurl = "/admin/project/cell/view/"+this.id;// + '&' + this.cid;
      this.dropicon = "chevron_right";
      var res = await this.services.getCellByPid(this.projectid).toPromise();
      this.cellList = res;
      this.selectedCell = Number(this.id);
      var result = await this.services.getMenuByCid(this.id).toPromise();
      console.log(237,result)
      this.menu  = result;
      this.category = [ ...new Set( this.menu.map(obj => obj.categoryIndex)) ].map(o=> { return this.menu.filter(obj => obj.categoryIndex === o) } );
      result[0].category === null ? this.showHeader = true : this.showHeader = false;
      this.dataSource = new MatTableDataSource(this.menu);

      this.dataSource.data.forEach((row: any) => {
        row.consolidation = true;
      })
      this.pName = localStorage.getItem('projectName');
      var result1 = this.cellList.find(o => o.cellId === this.selectedCell);
      this.cellName = result1.cellName;
    }else{
      this.router.navigate(['noauthorize']);
    }
 
    console.log(252,this.findDetails([0]));
    var resu1 = await this.services.getAllItemReports(this.id).toPromise();
    
    this.data_01 = JSON.parse(resu1.data_1);
    this.seg_01 = JSON.parse(resu1.seg_1);
    this.weigth_01 = JSON.parse(resu1.weights_1);
  }

  highlight(): void {
    this.editmode = !!this.selectedRow;
  }
  async onCellChange(e:any){
    this.router.navigate(['admin/project/cell/view/' + e.value]);
    await this.ngOnInit();
  }

  onConsolidationChange(e:any){
    this.showFilter = false;
    this.showSelected = false;
    if(e.value === "Select"){
      this.dataSource.data.forEach((row: any) => {
        row.consolidation = true;
      })
    }else if(e.value === "Unselect"){
      this.dataSource.data.forEach((row: any) => {
        row.consolidation = false;
      })
    }else{
      this.dataSource.data.forEach((row: any) => {
        row.consolidation = true;
      })
    }
  }

  onConsolidationClick(e:any){
    this.showFilter = false;
    this.showSelected = false;
    if(e === 'Select'){
      console.log(e);
      this.dataSource.data.forEach((row: any) => {
        //row.consolidation = true;
        console.log(288,row);
        
        row.consideration = true;
      })
    }else if(e === 'Unselect'){
      console.log(e);
      this.dataSource.data.forEach((row: any) => {
        row.consideration = false;
      })
    }else if(e === 'Default'){
      console.log(e);
      this.dataSource.data.forEach((row: any) => {
        row.consolidation = true;
      })
    }
  }
 
  onIncludeClick(e:any){
    this.showFilter = false;
    this.showSelected = false;
    if(e=== "Select"){
      this.dataSource.data.forEach((row: any) => {
        row.forcedIn = true;
      })
    }else if(e === "Unselect"){
      this.dataSource.data.forEach((row: any) => {
        row.forcedIn = false;
      })
    }
  }

  onIncludeChange(e:any){
    this.showFilter = false;
    this.showSelected = false;
    if(e.value === "Select"){
      this.dataSource.data.forEach((row: any) => {
        row.forcedIn = true;
      })
    }else if(e.value === "Unselect"){
      this.dataSource.data.forEach((row: any) => {
        row.forcedIn = false;
      })
    }
  }

  onViewGroupChange(e:any){
    this.showSelected = false;
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
    this.showSelected = false;
    this.showFilter = false;
    this.isTableExpanded = !this.isTableExpanded;
    this.dataSource.data.forEach((data: any) => {
      data.isExpanded = !data.isExpanded
  })
}

  masterViewGroupReset() {
    this.showFilter = false;
    this.showSelected = false;
    this.dataSource.data.forEach((data: any) => {
      data.isExpanded = false
    })
    this.category = [ ...new Set( this.menu.map(obj => obj.categoryIndex) ) ].map(o=> { return this.menu.filter(obj => obj.categoryIndex === o) } );
  }

  masterViewGroupSelected() {
    this.showFilter = false;
    this.showSelected = true;
    this.dataSource.data.forEach((data: any) => {
      data.isExpanded = false;
    })
    this.category = [ ...new Set( this.menu.map(obj => obj.categoryIndex ) ) ].map(o=> { return this.menu.filter(obj => obj.categoryIndex === o) } ).filter(e => e.length);;
 }

  dropicon:any;

  chkConsolidation(ob: MatCheckboxChange,m:any){
    this.menu.forEach((data: any) => {
      if(m.id == data.id && ob.checked == true){
        data.consolidation = 1;
      }
      else if(m.id == data.id && ob.checked == false){
        data.consolidation = 0;
      }
    })
  }

  chkInclude(ob: MatCheckboxChange,m:any){
    this.menu.forEach((data: any) => {
      if(m.id == data.id && ob.checked == true){
        data.include = 1;
      }
      else if(m.id == data.id && ob.checked == false){
        data.include = 0;
      }
    })
  }

  chkForcedIn(ob: MatCheckboxChange,m:any){
    this.menu.forEach((data: any) => {
      if(m.id == data.id && ob.checked == true){
        data.forcedIn = 1;
      }
      else if(m.id == data.id && ob.checked == false){
        data.forcedIn = 0;
      }
    })
  }

  setThreshold(e:any){
    SelectMenuComponent.thresholdValue = (e.target as HTMLInputElement).value;
  }

  findDetails(data:any) {
    if(this.showSelected){

      console.log(413,this.menu.filter(x => x.categoryIndex === data.categoryIndex && x.consideration == 1));
      return this.menu.filter(x => x.categoryIndex === data.categoryIndex && x.consideration == 1);

    }else if(this.showFilter){
      return this.ar.filter(x => x.categoryIndex === data.categoryIndex && x.consideration == 1);
    }else{
      this.showSelected = false;
      this.showFilter = false;
      return this.menu.filter(x => x.categoryIndex === data.categoryIndex) ;
    }
  }
  
  ar :Menu[]= [];
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if(filterValue ===""){
      this.showFilter = false;
    }else{
      this.showFilter = true;
    }
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.ar = [];
    this.category = [ ...new Set( this.dataSource.filteredData.map(obj => obj.categoryIndex ) ) ].map(o=> { return this.dataSource.filteredData.filter(obj => obj.categoryIndex === o) } );
    for(var i=0;i<this.category.length;i++){
      for(var j=0;j<this.category[i].length;j++){
        this.category[i][j].consolidation = 1;
        this.ar.push(this.category[i][j])
      }
    }
  }

  alts: Alts[] = [];
  count_alts: number = 0;
  num_rows: number;
  irow: number = 0;
  list_row_data: any[] = [];
  rlines: any[][];
  rkeys: any;
  data_matrix: matrix = new matrix(0, 0, 0);
  vol_matrix: matrix1 = new matrix1(0, 0, 0);
  seg = new vector(0, 0);
  weight = new vector1(0, 0);
  seg_matrix: matrix2 = new matrix2(0, 0, 0);
  weight_matrix : matrix3 = new matrix3(0, 0, 0);
  seg_index : number = 1;

   async onOptimized(): Promise<void>{
    this.forcedintoitem = 0;
    this.menu.forEach(x=>{
      if(x.forcedIn == true){
        this.forcedintoitem++;
        this.alts_list.push(x);
      }else if(x.consideration == true){
        this.considerationsetitem++;
        this.alts_list.push(x);
      }
    })
      this.show_message_dialog = false;
      this.noofItem();
  }

  onConfiguration(){
    this.router.navigate(['admin/project/cell/view/' + this.selectedCell])
  }
  async onInteractive() : Promise<void>{
    this.router.navigate(['admin/project/cell/interactive/' + this.id])
  }

  async showMessage(): Promise<void>{
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '360px';
    dialogConfig.height = '260px';
  
    dialogConfig.data = {
      forceditem: this.forcedintoitem > 0 ? this.forcedintoitem : 0,
      considerationsetitem : this.considerationsetitem > 0 ? this.considerationsetitem : 0
    };
    const dialogRef = this.dialog.open(ShowMessageComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      data => {
      try {

          } catch (e) {

          }
        }
    );
  }

  async noofItem(): Promise<void>{
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '360px';
    dialogConfig.height = '290px';

    dialogConfig.data = {
      forceditem: this.forcedintoitem > 0 ? this.forcedintoitem : 0,
      considerationsetitem : this.considerationsetitem > 0 ? this.considerationsetitem : 0
    };
    const dialogRef = this.dialog.open(NoofitemComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      data => {
      try {
            localStorage.removeItem("chartData");
            localStorage.removeItem("chartData1");
            this.numberchosen = Number(data.numberchosen);
            if(this.considerationsetitem < this.forcedintoitem || this.considerationsetitem == 0){
                this.show_message_dialog = true;
                this.showMessage();
            }else if(this.considerationsetitem > 0 && this.considerationsetitem >= this.forcedintoitem){
              this.getAltsRecord();
              this.dataArrayMatrix();
              this.segArrayMatrix();
              this.weightArrayMatrix();
              var res = [];

              if(SelectMenuComponent.thresholdValue){
                let c = new Calc(this.alts, this.data_matrix, this.vol_matrix,this.weight, this.seg, 1, 500, SelectMenuComponent.thresholdValue);
                res = c.CalculateParallel(this.alts_arr.length, true);//this.alts_list.length
              }else{
                console.log(539, this.alts);
                let c = new Calc(this.alts, this.data_matrix, this.vol_matrix,this.weight, this.seg, 1, 500, 130);
                res = c.CalculateParallel(this.numberchosen, true);
              }
              console.log(537,res);
              localStorage.setItem("chartData", JSON.stringify(res));
              this.router.navigate(['admin/project/cell/chart/' + this.id])
            }
            this.alts = [];
          } catch (e) {

          }
        }
    );
  }

  async onQuickOptimized(): Promise<void>{
    //this.displayStyle = "block";
    const dialogConfig1 = new MatDialogConfig();
    dialogConfig1.disableClose = true;
    dialogConfig1.autoFocus = true;
    dialogConfig1.width = '360px';
    dialogConfig1.height = '295px';

    dialogConfig1.data = {
      forceditem: this.forcedintoitem > 0 ? this.forcedintoitem : 0,
      considerationsetitem : this.considerationsetitem > 0 ? this.considerationsetitem : 0
    };
    const dialogRef = this.dialog.open(QuicknoofitemComponent, dialogConfig1);
    dialogRef.afterClosed().subscribe(
      data => {
      try {
            if(data === undefined){
                this.show_message_dialog = true;
                this.showMessage();
            }else{
              this.QuickCalculation(data.numberchosen);
              this.router.navigate(['admin/project/cell/chart/' + this.id])
            }
          } catch (e) {

          }
        }
    );
  }

QuickCalculation(num: any){
  const obj1: any = [];
  var test1: any = [];
  const opetimizedItem: any = [];
  this.getAltsRecord();
  this.dataArrayMatrix();
  this.segArrayMatrix();
  this.weightArrayMatrix();
  localStorage.removeItem("chartData1");
  var res = [];
  console.log(539, this.alts);
  let c = new Calc(this.alts, this.data_matrix, this.vol_matrix,this.weight, this.seg, 1, 500, 130);
  res = c.CalculateParallel(1, true);
  console.log(537,res[0]);
  
  for(var i = 0; i < res[0][1].length; i++){
    var lastChar = res[0][2][i][0].substr(res[0][2][i][0].length - 2); // => "1"
    obj1.push({id: Number(lastChar),item: res[0][2][i][0], value:res[0][1][i]});
  }
  console.log(609,obj1);
  for(var i = 0; i < num; i++){
     test1.push({value: obj1[i].id, val: obj1[i].value})
  let c1 = new CalcInteractive(this.alts, this.data_matrix, this.data_matrix1, this.vol_matrix, this.weight, this.seg, 1, 500, 130,test1);
  res = c1.CalculateParallel1(this.count_alts, num, false); 
  console.log(627,res);
  
  opetimizedItem.push({item: obj1[i].item, value: res[28][0][0]})
 
  //test1 = uniqueArray;
  test1.forEach((e: any, index: any) => {
    if(e.value === 29){
      //delete test1[index]
      test1.splice(test1.indexOf(index), 1);
    }
  });
}

localStorage.setItem("chartData1", JSON.stringify(opetimizedItem));
 this.alts = [];
}

removeDuplicates(originalArray:any, prop: any) {
  var newArray = [];
  var lookupObject: any  = {};
  for(var i in originalArray) {
     lookupObject[originalArray[i][prop]] = originalArray[i];
  }
  for(i in lookupObject) {
      newArray.push(lookupObject[i]);
  }
  return newArray;
}

displayStyle = "none";
closePopup() {
  this.displayStyle = "none";
}
data_matrix1: matrix6 = new matrix6(0, 0, 0);
  async dataArrayMatrix() : Promise<void>{
    //var data1 = JSON.parse(localStorage.getItem('data1'))
    this.list_row_data = this.data_01;
    //this.list_row_data = this.data_1;
    this.num_rows = this.list_row_data.length;
    let data1: matrix6 = new matrix6(this.num_rows, this.count_alts + 1, 0,);
    let data: matrix = new matrix(this.num_rows, this.count_alts + 1, 0);
    let vol: matrix1 = new matrix1(this.num_rows, this.count_alts + 1, 0);
    let icol: number = 0;
    for (var i = 1; i <= this.num_rows; i++) {
      icol = 0;
      for (var j = 2; j <= this.count_alts + 1; j++) {
        icol += 1;
        data1._matrix[i - 1][icol - 1] = Math.round(this.list_row_data[i - 1][j - 1]);
        data._matrix[i - 1][icol - 1] = Math.round(this.list_row_data[i - 1][j - 1]);
        vol._matrix[i - 1][icol - 1] = Math.round(this.list_row_data[i - 1][j - 1]);
      }
    }
    this.data_matrix = data;
    this.vol_matrix = vol;
    this.data_matrix1 = data1;
  }
  async segArrayMatrix() : Promise<void>{
    
    this.list_row_data = this.seg_01;
    this.num_rows = this.list_row_data.length;
    let data: any = new matrix1(this.num_rows, 52, 0);

    let icol: number = 0;
    for (var i = 1; i <= this.num_rows; i++) {
      icol = 0;
      for (var j = 2; j <= 52; j++) {
        icol += 1;
        data._matrix[i - 1][icol - 1] = Math.round(this.list_row_data[i - 1][j - 1]);
      }
    }
    this.seg_matrix = data;
    this.seg = new vector(data.rowCount, 0);
    this.seg.l_vector = this.seg_matrix.Column;
  }
  async weightArrayMatrix() : Promise<void>{
   
    this.list_row_data = this.weigth_01;
    this.num_rows = this.list_row_data.length;
    let data: any = new matrix2(this.num_rows, 4, 0);

    let icol: number = 0;
    for (var i = 1; i <= this.num_rows; i++) {
      icol = 0;
      for (var j = 2; j <= 4; j++) {
        icol += 1;
        data._matrix[i - 1][icol - 1] = Math.round(this.list_row_data[i - 1][j - 1]);
      }
    }
    this.weight_matrix = data;
    this.weight = new vector1(data.rowCount, 0);
    this.weight.l_vector = this.weight_matrix.Column;
  }

  getAltsRecord(){
    this.alts = [];
    //(let i = 0; i < this.alts_list.length; i++)
    // for (let i = 0; i < this.alts_list.length; i++) {
    //   var a: Alts = new Alts();
    //   a.Id = this.alts_list[i].id;
    //   a.Include = this.alts_list[i].include == "1" ? true : false;
    //   a.ShortDescription = this.alts_list[i].shortDescription;
    //   a.LongDescription = this.alts_list[i].shortDescription;
    //   a.CategoryIndex = this.alts_list[i].categoryIndex;
    //   a.Category = this.alts_list[i].category;
    //   a.ID_Model = this.alts_list[i].id;
    //   a.Parm = "";
    //   a.Parm = "";
    //   a.Consideration_Set = this.alts_list[i].consolidation == "1" ? true : false;
    //   a.Default_Consideration_Set = a.Consideration_Set;
    //   a.Forced_In = this.alts_list[i].forcedIn == "1" ? true : false;;
    //   if (a.Consideration_Set) {
    //     this.count_alts += 1;
    //     this.alts.push(a);
    //   }
    // }
    
    for (let i = 0; i < this.alts_arr.length; i++) {
      var a: Alts = new Alts();
      a.Id = this.alts_arr[i].ID;
      a.Include = this.alts_arr[i].Include == 1 ? true : false;
      a.ShortDescription = this.alts_arr[i].ShortDescription;
      a.LongDescription = this.alts_arr[i].ShortDescription;
      a.CategoryIndex = this.alts_arr[i].CategoryIndex;
      a.Category = this.alts_arr[i].Category;
      a.ID_Model = this.alts_arr[i].ID;
      a.Parm = "";
      a.Parm = "";
      a.Consideration_Set = this.alts_arr[i].Consideration == 1 ? true : false;
      a.Default_Consideration_Set = a.Consideration_Set;
      a.Forced_In = false;
      if (a.Include) {
        this.count_alts += 1;
        this.alts.push(a);
      }
    }
  }
 
  alts_arr: any = [
    
    {ID: 1, Include: 1, ShortDescription: 'Item 1',LongDescription: 'Item 1', CategoryIndex: 1, Category: 'Category 1', Consideration:1},
    {ID: 2, Include: 1, ShortDescription: 'Item 2',LongDescription: 'Item 2', CategoryIndex: 1, Category: 'Category 1', Consideration:1},
    {ID: 3, Include: 1, ShortDescription: 'Item 3',LongDescription: 'Item 3', CategoryIndex: 1, Category: 'Category 1', Consideration:1},
    {ID: 4, Include: 1, ShortDescription: 'Item 4',LongDescription: 'Item 4', CategoryIndex: 2, Category: 'Category 2', Consideration:1},
    {ID: 5, Include: 1, ShortDescription: 'Item 5',LongDescription: 'Item 5', CategoryIndex: 1, Category: 'Category 1', Consideration:1},
    {ID: 6, Include: 1, ShortDescription: 'Item 6',LongDescription: 'Item 6', CategoryIndex: 1, Category: 'Category 1', Consideration:1},
    {ID: 7, Include: 1, ShortDescription: 'Item 7',LongDescription: 'Item 7', CategoryIndex: 1, Category: 'Category 1', Consideration:1},
    {ID: 8, Include: 1, ShortDescription: 'Item 8',LongDescription: 'Item 8', CategoryIndex: 2, Category: 'Category 2', Consideration:1},
    {ID: 9, Include: 1, ShortDescription: 'Item 9',LongDescription: 'Item 9', CategoryIndex: 1, Category: 'Category 1', Consideration:1},
    {ID: 10, Include:1, ShortDescription: 'Item 10',LongDescription: 'Item 10', CategoryIndex: 1, Category: 'Category 1', Consideration:1},
    {ID: 11, Include:1, ShortDescription: 'Item 11',LongDescription: 'Item 11', CategoryIndex: 1, Category: 'Category 1', Consideration:1},
    {ID: 12, Include:1, ShortDescription: 'Item 12',LongDescription: 'Item 12', CategoryIndex: 1, Category: 'Category 1', Consideration:1},
    {ID: 13, Include:1, ShortDescription: 'Item 13',LongDescription: 'Item 13', CategoryIndex: 3, Category: 'Category 3', Consideration:1},
    {ID: 14, Include:1, ShortDescription: 'Item 14',LongDescription: 'Item 14', CategoryIndex: 3, Category: 'Category 3', Consideration:1},
    {ID: 15, Include:1, ShortDescription: 'Item 15',LongDescription: 'Item 15', CategoryIndex: 3, Category: 'Category 3', Consideration:1},
    {ID: 16, Include:1, ShortDescription: 'Item 16',LongDescription: 'Item 16', CategoryIndex: 1, Category: 'Category 1', Consideration:1},
    {ID: 17, Include:1, ShortDescription: 'Item 17',LongDescription: 'Item 17', CategoryIndex: 1, Category: 'Category 1', Consideration:1},
    {ID: 18, Include:1, ShortDescription: 'Item 18',LongDescription: 'Item 18', CategoryIndex: 1, Category: 'Category 1', Consideration:1},
    {ID: 19, Include:1, ShortDescription: 'Item 19',LongDescription: 'Item 19', CategoryIndex: 1, Category: 'Category 1', Consideration:1},
    {ID: 20, Include:1, ShortDescription: 'Item 20',LongDescription: 'Item 20', CategoryIndex: 3, Category: 'Category 3', Consideration:1},
    {ID: 21, Include:1, ShortDescription: 'Item 21',LongDescription: 'Item 21', CategoryIndex: 1, Category: 'Category 1', Consideration:1},
    {ID: 22, Include:1, ShortDescription: 'Item 22',LongDescription: 'Item 22', CategoryIndex: 1, Category: 'Category 1', Consideration:1},
    {ID: 23, Include:1, ShortDescription: 'Item 23',LongDescription: 'Item 23', CategoryIndex: 1, Category: 'Category 1', Consideration:1},
    {ID: 24, Include:1, ShortDescription: 'Item 24',LongDescription: 'Item 24', CategoryIndex: 1, Category: 'Category 1', Consideration:1},
    {ID: 25, Include:1, ShortDescription: 'Item 25',LongDescription: 'Item 25', CategoryIndex: 1, Category: 'Category 1', Consideration:1},
    {ID: 26, Include:1, ShortDescription: 'Item 26',LongDescription: 'Item 26', CategoryIndex: 1, Category: 'Category 1', Consideration:1},
    {ID: 27, Include:1, ShortDescription: 'Item 27',LongDescription: 'Item 27', CategoryIndex: 1, Category: 'Category 1', Consideration:1},
    {ID: 28, Include:1, ShortDescription: 'Item 28',LongDescription: 'Item 28', CategoryIndex: 1, Category: 'Category 1', Consideration:1},
    {ID: 29, Include:1, ShortDescription: 'Item 29',LongDescription: 'Item 29', CategoryIndex: 1, Category: 'Category 1', Consideration:1},
    {ID: 30, Include:1, ShortDescription: 'Item 30',LongDescription: 'Item 30', CategoryIndex: 1, Category: 'Category 1', Consideration:1}
];

}
