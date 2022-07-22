import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { PsolutionsService } from 'src/app/services/psolutions.service';
import { Menu } from 'src/app/model/menu.model';
import * as XLSX from 'xlsx';
import { ExcelService } from 'src/app/services/excel.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Cell } from 'src/app/model/cell.model';
import { Calc } from '../../cell/calculation/Calc';
import { Alts } from '../../cell/calculation/Alt.model';
import { matrix, matrix1, matrix2, matrix3, matrix6, } from '../../cell/calculation/matrix';
import { vector, vector1 } from '../../cell/calculation/vector';
import { HttpClient, JsonpClientBackend } from '@angular/common/http';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NoofitemComponent } from '../noofitem/noofitem.component';
import { CalcInteractive } from '../../cell/calculation/CalcInteractive';
import { single } from 'rxjs/operators';
//import { stringify } from 'querystring';

@Component({
  selector: 'app-interactive',
  templateUrl: './interactive.component.html',
  styles: [`th, tr,td {
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
.highlight{
    height: 38px;
    color: red;
    font-size: 20px;
    font-weight: 500;
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
  padding: 0;
}
.button-panle{
  border: none;
  display: block;
  margin: 10px;
  background: transparent;
  color: #121111;
  font-size: 15px;
}
i.fa.fa-file-excel-o {
  font-size: 20px;
  padding-right: 5px;
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
.btn-back{
    border: 1px solid;
    background: transparent;
    color: #e23952;
    left: 0;
    
}
i.fa.fa-arrow-left {
  font-size: 17px;
}
.form-label{
  float: left;
  padding: 6px 15px 0px 0px;
}
.input-cell{
  height: 20px;
  width: 200px;
}
.reach-text{
    height: 40px;
    width: 150px;
    background: yellow;
    text-align: center;
    padding: 9px;
}
`
]
})
export class InteractiveComponent implements OnInit {

  constructor(private route: ActivatedRoute,
    private services: PsolutionsService,
    private router : Router,
    private authentication: AuthenticationService,
    private dialog: MatDialog,
    private excel : ExcelService,
    private http : HttpClient) {
    this.route.params.subscribe(res => {
      this.id = res.id;
    });
    if (this.authentication.currentUserValue) {
      this.menushow = this.authentication.currentUserValue.rolePermission.menu;
    }
  }

  displayedColumns: string[] = ['Item', 'Include', 'TotalReach','IncrementalReach','Reach'];

  public menu: Menu[] = [];
  public interactive : InteractiveMenu[] = [];
  public interactive1: InteractiveMenu1[] = [];
  id: any;
  cid:any;
  selectedRow: any;
  editmode = false;
  selectedInclusion: string;
  selectedexport: string;
  selectedviewgroup: string;
  isTableExpanded = false;
  dataSource = new MatTableDataSource(this.interactive);
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
  threshold : number;
  cellList : Cell[] = [];
  selectedCell : any;
  Reach:any;
  dropicon:any;
  alts_list : any[] = [];
  interactive_result : any[] = [];
  public static thresholdValue : any;

  pName: string;
  cellName: string;
  isFirst: boolean = true;
  isSecond: boolean = true;
  isThrid: boolean = true;

  data_01: any[] = [];
  seg_01: any[] = [];
  weigth_01: any[] = [];
  async ngOnInit(): Promise<void> {
    
    this.Reach = '0.0%';
    this.threshold = 130;
    this.showSelected = false;
    if(this.menushow){
      var project = await this.services.getCellByid(this.id).toPromise();
      this.projectid = project.projectId;
      this.CellName = project.cellName;
      this.listLink = "/admin/project/cell/"+this.projectid;
      this.modeltitleurl = "/admin/project/cell/view/"+this.id;
      this.dropicon = "chevron_right";
      var res = await this.services.getCellByPid(this.projectid).toPromise();
      this.cellList = res;
      this.selectedCell = Number(this.id);
      
      var result = await this.services.getMenuByCid(this.id).toPromise();
      this.menu = result;
      let num = 1;
      
      result.forEach((x:Menu)=>{
        const itr : InteractiveMenu = {
          Menu : x,
          reach : 0.0,
          incrementalreach : 0.0,
          rank:0,
          index: 0,
          value: num,
        }
        this.interactive.push(itr);
        num ++;
      })
      
      this.category = [ ...new Set( this.interactive.map(obj => obj.Menu.categoryIndex) ) ].map(o=> { return this.interactive.filter(obj => obj.Menu.categoryIndex === o) } );
     //this.category = [ ...new Set( this.interactive.map(obj => obj.Menu.categoryIndex) ) ].map(o=> { return this.interactive1.filter(obj => obj.categoryIndex === o) }); 
     result[0].category === null ? this.showHeader = true : this.showHeader = false;
      // this.dataSource = new MatTableDataSource(this.interactive);
      this.dataSource = new MatTableDataSource(this.interactive);

      this.dataSource.data.forEach((row: any) => {
        row.Menu.include = 0;
      });

      this.pName = localStorage.getItem('projectName');
    }else{
      this.router.navigate(['noauthorize']);
    }
    var result1 = await this.services.getAllItemReports(this.id).toPromise();
    
    this.data_01 = JSON.parse(result1.data_1);
    this.seg_01 = JSON.parse(result1.seg_1);
    this.weigth_01 = JSON.parse(result1.weights_1);
  }

  highlight(): void {
    this.editmode = !!this.selectedRow;
  }
  async onCellChange(e:any){
    this.router.navigate(['admin/project/cell/view/' + e.value]);
    await this.ngOnInit();
  }

  masterExpandCollapseGroups() {
    this.showSelected = false;
    this.isTableExpanded = !this.isTableExpanded;

    this.dataSource.data.forEach((data: any) => {
      data.Menu.isExpanded = !data.Menu.isExpanded
    })
  }

  onInclusionChange(e:any){
    this.showSelected = false;
    if(e === "Select"){
      this.dataSource.data.forEach((row: any) => {
        this.itemStr = [];
        row.Menu.include = 1;
        this.calculator(row, false);
        this.interactiveitemreport(row.Menu);
      })
    }else if(e === "Unselect"){
      this.dataSource.data.forEach((row: any) => {
        row.Menu.include = 0;
        row.reach = 0.0,
        row.incrementalreach = 0.0,
        row.rank = 0;
        row.index = 0;
      })
      this.Reach = "0%";
    }else if(e === "Default"){
      this.dataSource.data.forEach((row: any) => {
        row.Menu.include = 0;
      })
      this.interactive_result = [];
    }
  }
 
  async demoData(files: FileList): Promise<void> {


  }

  onExportChange(e:any){
    this.showSelected = false;
    this.generateExcel();
  }
  onConfiguration(){
    this.router.navigate(['admin/project/cell/view/' + this.selectedCell]);
  }

  //go back Invanteries
  goBackCell(){
    this.router.navigate(['admin/project/cell/view/' + this.selectedCell]);
  } 
  onViewGroupChange(e:any){
    this.showSelected = false;
    if(e.value === "Reset"){
      this.dataSource.data.forEach((data: any) => {
        //if(data.Menu.isExpanded)
          data.Menu.isExpanded = false;
      })
      this.showSelected = false;
      this.category = [ ...new Set( this.interactive.map(obj => obj.Menu.categoryIndex) ) ].map(o=> 
      { 
        return this.interactive.filter(obj => obj.Menu.categoryIndex === o) 
      });
    }else if(e.value === "Show Selected"){
      this.showSelected = true;
      this.dataSource.data.forEach((data: any) => {
        //if(data.Menu.isExpanded)
          data.Menu.isExpanded = false;
      })
      this.category = [ ...new Set( this.interactive.map(obj => obj.Menu.categoryIndex ) ) ].map(o=> 
      { 
        return this.interactive.filter(obj => obj.Menu.categoryIndex === o) 
      }).filter(e => e.length);
    }
  }

  onViewGroupClick(e:any){
    this.showSelected = false;
    if(e === "Reset"){
      this.dataSource.data.forEach((data: any) => {
        //if(data.Menu.isExpanded)
          data.Menu.isExpanded = false;
      })
      this.showSelected = false;
      this.category = [ ...new Set(this.interactive.map(obj => obj.Menu.categoryIndex)) ].map(o=> 
      { 
        return this.interactive.filter(obj => obj.Menu.categoryIndex === o) 
      });
    }else if(e === "Show Selected"){
      console.log(e);
      this.showSelected = true;
      this.dataSource.data.forEach((data: any) => {
        //if(data.Menu.isExpanded)
          data.Menu.isExpanded = false;
      })
      this.category = [ ...new Set( this.interactive.map(obj => obj.Menu.categoryIndex ) ) ].map(o=> 
      { 
        return this.interactive.filter(obj => obj.Menu.categoryIndex === o) 
      }).filter(e => e.length);
    }
  }

  itemStr1: any = [];
  chkInclude(ob: MatCheckboxChange,m:any){
    this.alts_list = [];
    this.itemStr1 = [];
    this.interactive.forEach((data: any) => {
      if(m.id == data.Menu.id && ob.checked == true){
        data.Menu.include = 1;
        m.include = 1;
        //this.itemStr1.push(data.Menu.value);
        this.calculator(data,false);
        this.interactiveitemreport(data.Menu);
      }
      else if(m.id == data.Menu.id && ob.checked == false){
        data.Menu.include = 0;
        data.reach = 0.0,
        data.incrementalreach = 0.0,
        data.rank = 0;
        data.index = 0;
        //this.interactive_result = [];
        this.calculator(data, true);
        if(this.interactive_result.length > 0){
          this.interactiveitemreport(data.Menu);
        }else{
          this.Reach = '0.0%';
        }
      }
    })
  }
  
  storLcl: any = [];
  objValue: any = {};
  objItem: any = [];
  calculator(d1: any, check: boolean){
       this.getAltsRecord();
       this.dataArrayMatrix();
       this.segArrayMatrix();
       this.weightArrayMatrix();
    var res : any[] = [];
    let single = 0;
    let sin1 = 0;
    if(InteractiveComponent.thresholdValue){
      let c = new Calc(this.alts, this.data_matrix, this.vol_matrix, this.weight, this.seg, 1, 500,InteractiveComponent.thresholdValue);//
      res = c.CalculateParallel1(this.alts_list,false);//CalculateParallel1
    }else{
      this.interactive_result = [];
      let arrTest: any =  [];
      let test1: any = [];
      let arr: any = [];
      let arr1: any = [];
      var case1 = true;
      this.objItem = [];
      for (var i = 1; i <= this.itemStr1.length; i++) {
          const ob = {
            id: i,  value: this.itemStr1[i-1]
          };
          arrTest.push(ob);
          single++;
          sin1 = this.itemStr1[i-1];
      }
      
      arrTest.sort(function(a: any, b: any){return b.value - a.value});
      for(var i = 1; i <= arrTest.length; i++){
        let arrt1: any = [];
        arr.push({id: i, value:arrTest[i-1]['value']});
        arrt1.push({id: i, value:arrTest[i-1]['value']});
        let c = new CalcInteractive(this.alts, this.data_matrix, this.data_matrix1, this.vol_matrix, this.weight, this.seg, 1, 500, 130,arrt1);
        res = c.CalculateParallel1(this.count_alts, d1.value, false); 
        
        //arr1.push({value: arrTest[i-1]['value'], val: parseFloat((res[sin1-1][0][0]*100).toFixed(1))})
        test1.push({value: arrTest[i-1]['value'], val: parseFloat((res[sin1-1][0][0]*100).toFixed(1))}); //
        if(arrTest[i-1]['value'] == 20 || arrTest[i-1]['value'] == 29 || arrTest[i-1]['value'] == 30){
          if(arrTest.length > 1 && arrTest.length < 20){
            case1 = true
          }
        }
      }
      //arr1.sort(function(a: any, b: any){return b.value - a.value});

      test1.sort(function(a: any, b: any){return b.val - a.val});
      var valueArr = test1.map(function(item:any){ return item.val });
      var isDuplicate = valueArr.some(function(item:any, idx:any){ 
          return valueArr.indexOf(item) != idx 
      });
      
      var dataArr = test1.map((item: any)=>{
        return [item.val,item]
      }); // creates array of array
      var maparr = new Map(dataArr); // create key value pair from array of array
      var result: any = [...maparr.values()];//converting back to array from mapobject
      if(isDuplicate){
        let c = new CalcInteractive(this.alts, this.data_matrix, this.data_matrix1, this.vol_matrix, this.weight, this.seg, 1, 500, 130,test1);
        res = c.CalculateParallel1(this.count_alts, d1.value, false); 
        this.interactive_result.push(res[sin1-1]);
        this.objItem.push({item: 29, reach: 0, itemreach: 0})
      }
      var ctr = test1.length;
      // if(case1 == true && test1.length > 1){
      arr1 = [];
        for(var i = 1; i < test1.length; i ++){
          arr1.push(test1[i]);
        }
        //arr1.sort(function(a: any, b: any){return a.value - b.value});
        //arr1.sort(function(a: any, b: any){return b.val - a.val});
        //   if(test1.length > 3){
        //     arr1.sort(function(a: any, b: any){return a.value - b.value});
        //   }
        //  else{
        //   arr1.sort(function(a: any, b: any){return b.val - a.val});
        //  }
        ctr--;
       //}
      let lenghT = test1.length;
      let arr2: any = [];
      if(isDuplicate){
        arr1 = [];
        ctr = result.length;
        lenghT = result.length;
        for(var i = 1; i < result.length; i++){
          arr1.push(result[i]);
        }
        ctr--;
      }
      
      //arr2.sort(function(a: any, b: any){return a.value - b.value});
      arr1.sort(function(a: any, b: any){return a.value - b.value});
      let obj11: any = {};
      this.objValue = test1[0];
     
      //console.log(494,result);
      //console.log(495,arr1);
      //
      // arr1.forEach((x: any, ind: any) => {
      //   if(result.length > 1){
      //     if(test1[1].value === 29){
      //       //obj11 = x;
      //       arr1.splice(ind,1);
      //       //ctr++;
      //       //arr1.remove(x); 
      //     }
      //   }
      // }) 
      
      
      for(var i = 1; i <= lenghT; i++){
          let calArr: any = [];
          if(case1){
            for(var j = 1; j <= ctr; j++){
              calArr.push(arr1[j-1]);
              obj11 = arr1[j-1];
            } 
            calArr.push(test1[0])
            //calArr.push(test1[0]);
          }
          if(test1.length >= 2 && ctr < 2 && ctr > 0){
            calArr = [];
            calArr.push(test1[0]);
            if(isDuplicate){
              calArr.push(result[1]);
              obj11 = result[1];
            }else{
              calArr.push(test1[1]);
              obj11 = test1[1];
            }
         }

            let c = new CalcInteractive(this.alts, this.data_matrix, this.data_matrix1, this.vol_matrix, this.weight, this.seg, 1, 500, 130,calArr);
            res = c.CalculateParallel1(this.count_alts, d1.value, false); 
            this.interactive_result.push(res[sin1-1]);
            //this.objItem.push({item: obj11.value, reach: 0, itemreach: 0})
            if(ctr > 0){
              this.objItem.push({item: obj11.value, reach: 0, itemreach: 0})
            }else{
              this.objItem.push({item: this.objValue.value, reach: 0, itemreach: 0})
            }
            ctr--;
            //console.log(567,'res', res);
      }
    }

    this.objItem.sort(function(a: any, b: any){
      return b.reach - a.reach
    });
    
    this.caclulFilter();
  }
  caclulFilter(){
  //  let arrArr: any = [];
  //  this.storLcl = [];
  //  this.obj = [];
  //  let rankcount = 0;
  //  var lng = this.interactive_result.length;
   for (let d = 0; d < this.interactive_result.length; d++){
     //let ggss: number = Math.abs(parseFloat(((this.interactive_result[d][0][0]-this.interactive_result[d-1][0][0])* 100).toFixed(1)));
     let reach1 = 0.0;//parseFloat((this.interactive_result[d][0][0]* 100).toFixed(1));
     let inreach1 = 0.0; //parseFloat((this.interactive_result[d][0][0]* 100).toFixed(1));
     if(d == 0){
      //reach1 = parseFloat((this.interactive_result[d][0][0]* 100).toFixed(1));
      //inreach1 = parseFloat((this.interactive_result[d][0][0]* 100).toFixed(1));
      this.objItem[d].reach = parseFloat((this.interactive_result[d][0][0]* 100).toFixed(1));
      this.objItem[d].itemreach = this.interactive_result[d][0][0];
     }
     else{
      //reach1 = parseFloat((this.interactive_result[d][0][0]* 100).toFixed(1));
      //inreach1 = Math.abs(parseFloat(((this.interactive_result[d][0][0]-this.interactive_result[d-1][0][0])* 100).toFixed(1)));
      this.objItem[d].reach = parseFloat((this.interactive_result[d][0][0]* 100).toFixed(1));
      this.objItem[d].itemreach = this.interactive_result[d][0][0];
     }
      // const obj1: any = {
      //   inreach: inreach1,
      //   rank: 0,
      // }
      // this.obj.push(obj1)
      // arrArr.push(obj1);
      // this.storLcl.push(obj1);
    }

    //  arrArr.sort(function(a: any, b: any){return b.inreach - a.inreach});
    //  for (var i = 0; i < arrArr.length; i++) {
    //  arrArr[i].rank = i + 1;
    //   //this.obj[i].rank = i + 1;
    //  }
    //  //arrArr.sort(function(a: any, b: any){return b.reach - a.reach});
    //  this.obj.sort(function(a: any, b: any){return b.reach - a.reach});
    //  //this.storLcl.sort(function(a: any, b: any){return b.rank1 - a.rank1});
    //  for(var i = 0; i < this.storLcl.length; i++){
    //   this.storLcl[i].rank1 = i;
    //  }
  }

  //arrA: [] = [];
  obj: any = [];
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
  data_matrix1: matrix6 = new matrix6(0, 0, 0);


  async dataArrayMatrix() : Promise<void>{
    this.list_row_data = this.data_01;
    this.num_rows = this.list_row_data.length;
    let data1: matrix6 = new matrix6(this.num_rows, this.count_alts + 1, 0,);
    let data: matrix = new matrix(this.num_rows, this.count_alts + 1, 0,);
    let vol: matrix1 = new matrix1(this.num_rows, this.count_alts + 1, 0);
    let icol: number = 0;
    let n1 = 0;
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

  getAltsRecordforOptimized(){
    // for(var i = 1; i <= this.alts_1.length; i++){
    //   var a: Alts = new Alts();
    //   a.Id = this.alts_1[i - 1][11];
    //   a.Include = this.alts_1[i - 1][12];
    //   a.ShortDescription = this.alts_1[i - 1][16];
    //   a.LongDescription = this.alts_1[i - 1][13];
    //   a.CategoryIndex = this.alts_1[i - 1][6];
    //   a.Category = this.alts_1[i - 1][5];
    //   a.ID_Model = this.alts_1[i - 1][11];
    //   a.Parm = this.alts_1[i - 1][14];
    //   a.Parm = this.alts_1[i - 1][14];
    //   a.Consideration_Set = this.alts_1[i - 1][7];
    //   a.Default_Consideration_Set = a.Consideration_Set;
    //   a.Forced_In = false;
    //   if (a.Include) {
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

  itemStr: any = [];
  countStr: number = 0;
  getAltsRecord(){
    this.itemStr1 = [];
    this.countStr = 0;
    this.alts_list = [];
    this.alts = [];
   // this.itemStr = [];
    this.count_alts = 0;
    this.interactive.forEach(x=>{
      //if(x.Menu.include == true){
        this.alts_list.push(x);
        var a: Alts = new Alts();
        a.Id = x.Menu.menuId;
        a.Include = x.Menu.include == "1" ? true : false;
        a.ShortDescription = x.Menu.shortDescription;
        a.LongDescription = x.Menu.shortDescription;
        a.CategoryIndex = x.Menu.categoryIndex;
        a.Category = x.Menu.category;
        a.ID_Model = x.Menu.menuId;
        a.Parm = "";
        a.Parm = "";
        a.Consideration_Set = x.Menu.consideration == "1" ? true : false;
        a.Default_Consideration_Set = a.Consideration_Set;
        a.Forced_In = false;
        //if (a.Include) {
        this.count_alts += 1;
        this.alts.push(a);
        //}
        if(x.Menu.include === 1){
         //this.itemStr.push(a.LongDescription);
         this.itemStr1.push(x.value);
         this.countStr ++;
        }
      //}
    })
  }
//33.76439002 no.7 row
  data_1 = [
    ['1', '126.3299875', '239.5961103', '153.7382837', '429.5514095', '467.6921705', '332.2277231', '19.07297696', '494.2981711', '52.47075969', '11.78507448', '488.3457724', '43.85892096', '118.4203493', '13.07631984', '26.4673063', '19.29215895', '4.729060228', '0.991466856', '48.14393268', '90.07622894', '115.6105314', '284.3062737', '177.8805629', '257.843934', '142.374879', '196.1377388', '28.13071344', '78.07912419', '359.0966387', '191.221652'],
    ['2', '453.768623', '25.7412329', '388.9359713', '14.05738868', '46.69716722', '26.7401692', '8.551668232', '2.765970855', '1.559646303', '7.216528611', '2.804053135', '16.9266968', '60.47499896', '51.49716864', '4.394719037', '14.1723956', '22.95194837', '0.125341463', '3.549955882', '373.4313002', '272.1966113', '289.2565205', '480.6667276', '479.2181325', '236.8161934', '34.14654136', '18.17371454', '455.8772885', '27.25872131', '463.7848078'],
    ['3', '8.510537385', '27.40191036', '6.069038868', '34.63928205', '20.84688243', '14.23139751', '5.862618942', '28.21193404', '14.37806174', '7.893543134', '12.73683251', '11.51582874', '38.24980296', '17.70330346', '18.16013504', '17.32277492', '15.56644693', '36.81587617', '6.456151176', '37.82808106', '30.62044582', '12.52925124', '24.86062966', '13.37804192', '17.63182464', '17.97950385', '51.93357958', '22.9340057', '33.19292269', '34.72657609'],
    ['4', '11.11123136', '7.229874033', '1.836084226', '16.76105697', '21.23151111', '18.91412315', '1.907954904', '49.0068353', '6.198603586', '4.500027088', '2.994056716', '1.21812606', '1.393630237', '3.029659167', '6.050866646', '1.066137477', '0.789260637', '0.067815879', '1.1363415', '60.22719475', '34.00226062', '1.47324367', '0.442511096', '0.519148651', '0.616191316', '8.493428759', '2.689280336', '3.545280255', '137.764072', '4.3980066'],
    ['5', '38.61135076', '79.90471435', '5.813880199', '4.339011716', '59.52266676', '30.6483554', '7.263553092', '17.4454404', '31.12827535', '33.02374118', '17.15840787', '10.82838273', '11.97088919', '54.12786651', '57.25807285', '21.53508878', '101.0662029', '97.9770412', '75.54995483', '23.7383787', '19.10741115', '21.99081739', '66.94966155', '8.64666933', '8.303598622', '20.72684644', '5.488749512', '47.47266434', '174.0559572', '192.7255212'],
    ['6', '438.6095926', '376.8755604', '470.1290279', '459.1565647', '438.8453379', '397.3944919', '489.0944084', '468.1842812', '482.7850873', '466.0439591', '467.4398769', '473.4706546', '485.5804143', '466.979408', '485.0059248', '466.8706522', '448.7249282', '478.2822144', '473.1592233', '467.1534352', '402.7051613', '384.9984358', '470.4155772', '478.3358369', '478.4374833', '426.8267704', '482.2596862', '479.1171562', '451.3867038', '412.6708771'],
    ['7', '33.76439002', '464.0971295', '364.7743116', '477.5725438', '474.0176988', '486.0889423', '453.897321', '490.957129', '447.1431607', '414.8003546', '492.4983192', '290.4934991', '374.964654', '420.8492483', '224.9500382', '445.1085826', '459.636768', '437.5734311', '483.230408', '495.5950799', '452.7123809', '492.9247565', '200.0224969', '80.65329341', '414.4008999', '493.0984793', '484.5193805', '113.0887971', '358.2727901', '222.1251059'],
    ['8', '9.806878595', '83.08868821', '63.9178349', '40.28895837', '6.041713086', '16.43803395', '2.721844419', '44.79175639', '18.91639808', '31.23434434', '4.529852349', '7.3388149', '21.68417781', '14.97211972', '6.995347237', '17.67032525', '143.0581354', '140.7425156', '14.76398607', '21.3063758', '6.97879332', '19.62524008', '43.52496414', '36.85209086', '29.02517559', '34.88547732', '26.94733061', '20.39229945', '4.562130947', '16.90244213'],
    ['9', '15.8518068', '42.34550528', '24.42769478', '119.5394476', '67.83073444', '46.95538046', '27.35440943', '95.7289114', '31.75014669', '56.71836657', '66.23492522', '13.99027552', '18.92286001', '34.60138661', '7.881505367', '48.86945103', '8.027503629', '17.34437468', '10.70257546', '8.957514716', '18.16611508', '20.28795745', '36.56000572', '9.157255114', '49.95086644', '31.60318515', '70.17009061', '29.45573785', '118.4277017', '5.273781303'],
    ['10', '59.99313281', '93.83986738', '44.39022915', '136.9121923', '56.00434239', '68.50310615', '24.3518436', '129.5806833', '36.08923943', '34.37479507', '187.2404609', '82.06294043', '75.6241061', '24.03844726', '113.0566457', '153.5241953', '139.1874856', '21.79305159', '24.88274982', '60.34692044', '39.93294459', '82.30924667', '13.4880678', '89.45913064', '63.33499482', '144.0411334', '103.2281987', '24.04267362', '106.2660928', '30.94129279'],
   ['11', '464.2090289', '481.998252', '493.7163082', '495.9825238', '475.4699979', '490.1184518', '487.4457551', '493.9869595', '494.2985499', '493.4570382', '486.6320738', '441.6182503', '474.7375447', '317.0160661', '381.9884026', '462.8968288', '453.9348827', '487.2486807', '471.7976427', '470.93891', '411.4689339', '479.0030523', '427.6884695', '465.8496503', '474.1520166', '466.080697', '468.6952176', '450.3887216', '391.7586234', '344.3903197'],
   ['12', '11.01251782', '8.375896518', '12.4178685', '43.0443584', '17.12675458', '15.65161628', '68.40731686', '111.0985253', '33.36516947', '14.49463427', '15.93462396', '25.42229531', '41.13488764', '7.024954936', '17.70711477', '16.20296511', '7.00970866', '6.009506238', '131.7232348', '2.848666053', '5.895466986', '24.2646661', '10.12308486', '71.56587782', '17.24583674', '45.09285901', '84.26705802', '7.08677546', '19.14793546', '11.50178835'],
   ['13', '40.60598094', '84.27344093', '36.80419139', '377.785629', '396.2808078', '218.7299116', '0.517344996', '482.617706', '0.704083892', '0.43586593', '204.811938', '0.551093208', '3.623864041', '3.815302712', '1.22540566', '3.319523632', '17.22042071', '0.038278832', '0.830004937', '263.6242274', '212.2381744', '15.28709979', '240.8978225', '67.80965685', '7.036122609', '27.96396275', '11.83094838', '35.49749168', '53.04266667', '206.373331'],
   ['14', '382.1516798', '219.2200584', '423.1089977', '3.843072258', '54.20740685', '75.80842231', '71.19625486', '28.32218678', '6.188223594', '4.736603579', '47.85850776', '27.78625065', '138.4296971', '17.79758829', '236.5427934', '29.57502521', '11.58256086', '1.060274294', '5.612183615', '241.532266', '32.34455024', '79.96096162', '418.7849995', '366.0033333', '208.0290167', '377.9482976', '142.1796055', '457.9855848', '274.3176554', '489.3562951'],
   ['15', '52.2635609', '125.5740762', '48.44707041', '216.8395184', '32.21905174', '31.4781078', '22.84849466', '176.5544587', '96.93802974', '187.6260969', '123.3346581', '85.00579708', '74.10509021', '95.47607499', '101.0617059', '46.21062214', '23.74946588', '84.61777831', '59.21202185', '279.6728619', '83.22777891', '88.16481852', '7.92299394', '26.56107955', '25.16638927', '53.57697188', '19.52639511', '65.37578252', '88.13671794', '46.27684741'],
   ['16', '267.9599296', '187.4058381', '16.68188161', '28.29314734', '476.8436443', '183.8618876', '13.5070073', '145.3153762', '94.24769258', '2.116514472', '5.456856621', '263.835649', '173.9794992', '62.91115087', '187.8236334', '42.51568845', '8.598271514', '291.997322', '187.9054617', '488.5206344', '465.5001506', '34.14371757', '78.60889813', '80.53919143', '49.96440049', '50.90676902', '16.05498147', '307.9889647', '113.7402622', '204.5929274'],
   ['17', '151.0378194', '73.49290659', '7.772893534', '4.923394624', '238.6651541', '127.1576345', '12.82045939', '281.1744763', '22.74007177', '2.060783144', '426.5368788', '13.35235583', '35.34678459', '6.128155554', '32.42798467', '26.46696271', '13.22985367', '5.997223613', '6.350532976', '373.8600442', '182.6858347', '69.09165542', '242.0641841', '9.686434447', '26.03337255', '53.58809313', '6.147770629', '33.79474977', '249.4286009', '203.2420104'],
   ['18', '17.261583', '30.90335683', '19.97819286', '68.65733562', '12.24100214', '17.24158646', '14.02996576', '28.40455111', '28.68052246', '1.31813615', '26.00022102', '132.8801548', '62.66616054', '6.98819139', '29.27282909', '59.80210637', '72.17039342', '50.72711372', '77.01144258', '80.54120475', '27.01415769', '118.2514888', '65.1858231', '195.0929672', '63.64126167', '26.43081741', '37.43831666', '33.45796682', '60.29712539', '72.17746802'],
   ['19', '0.397562588', '12.85791688', '1.820126743', '5.638152543', '9.982313065', '3.870399732', '2.627016883', '8.590814563', '27.42965901', '4.171353321', '4.402791257', '17.29475308', '113.8794123', '21.93477464', '8.042651608', '64.00413212', '10.83010198', '53.86704936', '1.727540598', '18.02278804', '76.63200292', '148.4495072', '18.14295277', '3.842796279', '17.79157858', '11.49443503', '11.39517435', '0.647453118', '1.244305233', '0.119691992'],
   ['20', '172.7162542', '349.8394427', '301.3911187', '498.0673008', '317.0822973', '365.231555', '389.9210843', '499.6923636', '467.122064', '385.1531098', '498.965388', '420.1911815', '448.0221641', '209.0863365', '462.2521297', '448.3053864', '26.91345507', '65.2132406', '368.7896425', '493.4581882', '198.1948535', '387.2495477', '428.9660287', '389.5832823', '472.0299332', '464.2227712', '460.1381403', '420.5568625', '473.8732415', '471.3284648'],
   ['21', '381.1722522', '391.3670094', '212.6028552', '192.6219145', '229.4477602', '198.6013576', '382.7513691', '218.1604195', '443.1448548', '169.7193383', '48.7165477', '254.8146962', '359.2794949', '387.8009636', '271.7571196', '306.6777473', '396.724448', '323.6902325', '303.177299', '159.5812609', '143.3529884', '256.9109693', '93.9980832', '250.8994925', '292.0118177', '327.4448345', '238.3266902', '221.2232753', '258.5057282', '80.78756386'],
   ['22', '2.510268527', '37.56546593', '0.967716058', '8.451236983', '475.6541077', '319.4178254', '19.5932637', '230.8781915', '144.6790607', '9.383240832', '22.1756816', '294.0990796', '222.2946552', '388.4766169', '396.1432287', '337.55916', '264.6585655', '215.2639648', '384.2109153', '489.0043616', '364.9324222', '48.66780274', '28.32104998', '10.46124153', '29.18008428', '163.0843422', '132.182049', '9.057824527', '69.88012911', '9.743746686'],
   ['23', '370.4557699', '234.5450044', '306.9994624', '330.6015933', '39.56036427', '56.82079924', '82.66522505', '393.3265238', '4.71692537', '8.427769283', '100.0483789', '1.927784081', '92.8676098', '6.201147413', '9.575530107', '4.087909762', '2.207484721', '0.088295941', '8.124120135', '308.6184818', '66.47004032', '474.4358486', '470.3387062', '484.9955645', '178.4269547', '171.3685446', '88.82830137', '386.6839669', '414.7275306', '452.2884404'],
   ['24', '80.62616006', '85.54803249', '48.21810753', '26.36078039', '56.83362274', '7.740135294', '59.3441859', '120.2845377', '26.31940899', '1.954732686', '78.18907094', '26.02717313', '21.3792027', '8.777999562', '84.54845854', '23.07036914', '54.30208794', '33.92897565', '327.9278183', '151.307116', '48.61479676', '294.5988949', '90.09863883', '297.3933017', '121.4374373', '91.42221461', '93.21568008', '164.0592448', '314.0993318', '6.798731011'],
   ['25', '129.7211223', '337.3829977', '83.39378173', '330.9689138', '253.9376734', '203.7120052', '187.2330974', '393.0376731', '183.9967241', '180.2838563', '84.5928992', '308.884331', '218.094916', '66.75293303', '361.8057626', '265.8583984', '226.6615142', '243.811112', '236.8941064', '365.4064538', '149.8183433', '240.8459217', '144.5760129', '336.1279574', '179.6609909', '202.4991131', '138.7967223', '211.6534183', '319.294682', '155.3705949'],
   ['26', '18.70185015', '1.524622757', '5.904673458', '246.4584073', '447.605295', '272.3343705', '30.24733251', '279.7769541', '233.5752595', '5.061443252', '340.1685938', '360.0665441', '65.97179579', '62.04364109', '90.320185', '91.67075382', '198.2785452', '3.222940047', '353.8336769', '436.0506589', '91.64982726', '139.878693', '23.36571704', '70.28400805', '34.19309936', '11.10518714', '7.997271758', '13.7553201', '18.24899681', '42.88593977'],
   ['27', '37.50110252', '95.22762032', '3.620108901', '2.053960675', '17.4432995', '7.449948556', '215.8544539', '5.319094038', '263.1408213', '3.10708123', '10.04597944', '387.1794043', '92.76381954', '87.87300321', '339.368115', '99.14312642', '233.6916152', '459.5629381', '364.4166585', '478.0229256', '331.2450479', '44.82320827', '35.99019605', '68.63893055', '37.55889822', '330.9000186', '365.4785362', '41.58568217', '80.3945081', '254.677619'],
   ['28', '284.7362505', '87.22141005', '5.573607202', '24.84809819', '424.5031415', '262.211887', '2.580408855', '258.1192997', '5.744620192', '0.43694248', '196.5861267', '10.42448331', '6.132437879', '18.22624705', '77.44704069', '16.14265365', '313.7786869', '9.51150803', '28.09943488', '497.5250364', '486.9583681', '17.87932524', '52.0485259', '188.3512528', '54.21810783', '474.715969', '428.8911068', '152.0410651', '461.2528251', '229.3331681'],
   ['29', '492.053047', '429.476423', '392.2574293', '389.904593', '498.5664423', '494.1855726', '402.5392404', '484.6665473', '420.4148079', '383.9516319', '489.3775138', '463.6721744', '407.6598488', '429.2464853', '438.6580201', '470.7219391', '371.4477188', '354.1668931', '406.4737915', '499.5026606', '483.4213945', '469.8381399', '492.1953704', '496.6774661', '465.9983365', '489.6602572', '484.4260375', '496.6524078', '497.4530636', '495.8177937'],
   ['30', '74.84753027', '461.3246037', '272.7492452', '286.475039', '363.5994717', '214.9342272', '305.1495204', '469.876369', '302.326634', '11.26509187', '480.4359014', '87.19748214', '467.4696311', '45.08806104', '177.1873765', '74.91539898', '100.3765281', '69.10412575', '171.2557857', '459.6519845', '336.1746164', '429.4510239', '315.5712372', '299.1169649', '386.1638612', '489.7029145', '458.6186048', '134.2087276', '457.1082511', '332.9084938'],
   ['31', '61.40716966', '179.6632737', '29.13510348', '0.697150568', '390.1515776', '46.92956422', '20.1540403', '4.637292504', '155.6598167', '22.54454401', '0.694706397', '32.78128003', '122.9999933', '5.437244582', '17.03806566', '47.54521477', '50.84215883', '276.8076733', '194.9363118', '9.95447331', '11.8514101', '50.51976341', '123.814346', '18.15718002', '119.8826815', '215.0799694', '165.3132895', '93.79897963', '164.1594978', '407.5202558'],
   ['32', '489.3629628', '159.3975692', '431.5723389', '40.18936976', '460.9433804', '268.7841369', '226.1809095', '47.05242045', '49.19713', '4.485632192', '8.571114504', '62.50513772', '243.3160723', '198.8762393', '151.1927931', '74.3117713', '356.7876104', '40.0024559', '249.4875476', '396.3297326', '417.0483801', '317.6814852', '495.7565679', '484.661801', '293.7331837', '105.9554614', '100.2300063', '494.8457758', '428.9185455', '498.9831983'],
   ['33', '24.52631263', '297.9587586', '266.5827704', '216.1654006', '479.2533264', '195.9551989', '30.17320823', '440.7409759', '56.08002226', '86.9214927', '108.0422055', '34.97882179', '387.090665', '88.61931834', '81.70896093', '145.622598', '33.38363792', '193.185562', '46.86519033', '470.413627', '327.0003681', '334.9631315', '421.5610263', '119.7280876', '180.7308413', '117.0505877', '75.13805231', '78.33180756', '286.919382', '16.83528015'],
   ['34', '10.31790163', '45.68510636', '9.723397669', '40.07434421', '20.38659427', '56.17027831', '12.63954722', '62.39015953', '32.71071836', '10.87733524', '15.75175918', '24.02666049', '14.37781433', '18.34477696', '16.13733122', '11.04639933', '34.90724585', '1.092462343', '31.50599288', '47.77307658', '48.06891519', '17.54742734', '15.29435923', '2.669845223', '10.54902158', '17.92126599', '7.155375663', '12.88553644', '16.53268465', '3.623081809'],
   ['35', '22.09847228', '169.3357254', '43.00889374', '104.0389277', '42.04847489', '99.3482925', '112.2177247', '211.7928766', '65.46890603', '208.8241099', '9.654719751', '81.44326501', '114.3418546', '20.98411421', '194.1602689', '136.0868909', '74.42240679', '99.68242425', '55.7605616', '15.19828708', '22.19627838', '22.80260817', '117.5159948', '39.59891858', '59.56839567', '74.73109281', '82.61272632', '26.01963921', '48.7583527', '5.147997528'],
   ['36', '470.5957819', '408.3170331', '368.4636193', '362.8277542', '429.1516734', '437.7147697', '288.3987383', '455.8572873', '397.0052368', '363.4884879', '419.7498441', '257.145941', '411.6141351', '384.0339039', '425.9281712', '382.915975', '480.9933718', '127.7018968', '387.4288456', '450.9588035', '424.2611995', '250.2713269', '430.2114999', '295.1912463', '476.0950398', '453.5475574', '395.5169803', '464.5986211', '490.9288423', '354.6002512'],
   ['37', '87.68096455', '136.8974305', '336.6288845', '23.11344141', '27.88623673', '65.61448589', '230.6057951', '179.5610179', '220.891058', '160.882619', '117.2339613', '326.8854235', '261.5877783', '102.1600748', '342.7133647', '141.2822883', '137.6688017', '157.6143461', '207.3886644', '105.8983475', '43.22630001', '246.0255259', '254.063274', '409.07884', '423.3628504', '176.6392624', '233.5610981', '235.1838179', '328.61253', '293.7582262'],
   ['38', '13.10174811', '6.672007715', '1.523170347', '11.08428308', '356.66737', '94.94667875', '138.3285753', '151.7585105', '46.72266436', '0.94509646', '315.70688', '244.9986189', '166.4286211', '350.1224163', '175.8303325', '46.195264', '450.9565088', '481.1926295', '430.3671077', '301.2413814', '56.34540433', '42.94092069', '163.0541412', '171.2627104', '26.64258253', '70.47278455', '47.489648', '18.39857112', '67.43252595', '171.1943989'],
   ['39', '462.3752358', '350.9276124', '465.0503514', '261.0454043', '493.4117118', '464.572696', '469.7605243', '395.5298424', '423.623146', '409.7466216', '467.5065652', '461.9444255', '494.2403994', '491.7338066', '482.1003167', '431.253088', '451.2666891', '446.8505177', '460.2200997', '497.3911001', '495.1208999', '492.1709968', '498.3701471', '486.680073', '492.2031751', '312.0890635', '304.6508375', '464.9476506', '491.5427833', '495.8708922'],
   ['40', '392.2206159', '17.29664811', '32.50958552', '24.59132954', '51.83497506', '33.32726279', '22.78854325', '359.5084014', '4.228814989', '0.966495587', '326.602211', '5.089914025', '22.60177982', '0.654136119', '82.79686883', '4.687289229', '1.0763874', '0.124522087', '4.187285585', '14.39525082', '4.788983319', '41.82887492', '389.99857', '410.8429232', '152.4661483', '17.68171415', '33.5339338', '378.7315276', '279.3013874', '488.3959125'],
   ['41', '41.70861963', '23.46843314', '34.16251728', '35.00961617', '10.07081192', '10.30530639', '193.7396634', '84.37206689', '33.03206527', '22.05551116', '47.32367926', '22.45151565', '132.6874173', '5.053865178', '38.40312199', '11.62693885', '48.61627135', '15.2227578', '43.48722458', '83.94996525', '40.73055532', '128.232388', '161.42698', '173.82652', '198.0851485', '79.33906883', '46.08411904', '30.35313', '23.40843019', '64.74860366'],
   ['42', '461.2529833', '37.77575459', '134.5257369', '269.6316347', '224.3463326', '126.8121867', '7.62899545', '404.8799002', '0.479589003', '0.794501495', '6.41694232', '2.608583482', '16.96658404', '6.427472624', '15.71094405', '3.447829489', '2.392810559', '0.156944262', '1.019048014', '36.02628538', '18.28460093', '40.75185254', '474.1075418', '401.1946509', '140.9186673', '50.40799863', '92.41396829', '431.5244772', '275.6950704', '418.8052546'],
   ['43', '4.376149736', '36.91532086', '109.6365348', '14.08394938', '126.4218462', '80.87993726', '182.6551363', '25.92690688', '8.209873299', '17.31298948', '55.53673994', '40.37771674', '10.29834716', '101.996933', '111.6540082', '82.55222398', '349.4045349', '103.767985', '366.920945', '49.91208329', '172.1538927', '21.49063347', '81.34733036', '9.708784342', '1.986237808', '17.57329389', '4.428800194', '8.356913897', '9.13200181', '26.98158315'],
   ['44', '206.6892997', '3.947769592', '45.19240927', '0.417011083', '268.7519489', '20.41375559', '12.35911191', '5.247496156', '4.681568801', '0.831059614', '171.7554031', '2.218521327', '65.09271167', '12.30570878', '5.238892941', '5.430171447', '25.41999848', '8.09879738', '23.95738558', '0.791503492', '4.979436058', '25.16051384', '421.3517422', '58.31673025', '26.67592519', '142.6847435', '70.31743144', '70.29307626', '235.863661', '448.8851501'],
   ['45', '474.4062598', '19.33232217', '298.8256591', '49.9873264', '422.5196566', '110.0384529', '15.71172654', '39.40149654', '17.37343295', '0.852797528', '2.359297088', '72.38975124', '97.26268846', '105.7317142', '66.83208034', '115.0059787', '39.17010944', '4.848408703', '89.14660172', '259.3126441', '14.59551781', '311.1891756', '445.5783939', '437.3627224', '294.5945278', '457.2861885', '456.703351', '440.4789865', '467.0412833', '320.9164104'],
   ['46', '18.46920949', '1.906455688', '1.365014158', '4.467841075', '8.294752088', '2.702651187', '6.503752262', '12.15817192', '2.650640478', '0.921143992', '1.368895983', '4.261517214', '21.24825479', '2.080642286', '45.82998922', '5.347725598', '56.93537743', '4.716567061', '19.85108227', '12.29355388', '0.816411897', '72.25378736', '332.6359664', '98.61341131', '2.559811006', '2.122000117', '2.858169254', '62.04649084', '5.653238844', '236.1406836'],
   ['47', '7.891640067', '18.15692189', '5.638015411', '4.7496335', '178.8755133', '28.16633162', '0.61038355', '22.87823374', '17.226871', '1.381038369', '4.621744459', '6.847953953', '4.315655472', '1.60343851', '23.35858204', '9.61394572', '148.719363', '65.94205482', '29.66401291', '44.95066449', '42.37726149', '1.227714114', '4.819451635', '6.355889455', '4.033461759', '28.33949217', '30.82726438', '3.874857974', '84.72692529', '1.567211046'],
   ['48', '4.102893281', '68.22901742', '2.489846297', '5.465721839', '448.4203471', '184.0267197', '82.15582201', '178.6740328', '83.04489366', '23.24576727', '301.4181492', '37.02745573', '389.7401511', '46.20705136', '94.42474975', '93.52727171', '284.4814485', '250.0162933', '351.2422034', '463.4864121', '134.2995965', '426.8230659', '28.07127108', '22.94799167', '107.0996402', '352.4663921', '190.3520894', '21.10402648', '42.60163897', '451.12169'],
   ['49', '193.7603395', '407.1745903', '236.0644956', '16.46194205', '4.629451863', '34.4441119', '397.5715752', '66.87357544', '96.55429409', '7.338864439', '18.50320098', '13.33257866', '431.9516073', '16.17166559', '340.4807744', '13.51316537', '15.59974047', '39.26891285', '63.68064711', '3.993473033', '4.42104265', '381.005922', '413.7997634', '270.6759237', '236.0914728', '340.9111147', '245.8829473', '202.7074224', '257.3776345', '419.72185'],
   ['50', '1.268981974', '2.896902006', '3.426850744', '1.067478606', '115.2555509', '3.434221956', '1.02697943', '1.347346531', '0.631455888', '0.359171087', '3.682120054', '0.5839599', '14.84836257', '0.326432525', '1.873316408', '3.458462529', '0.225908422', '1.052234273', '0.578088728', '0.298031237', '1.614301548', '12.97211964', '8.848234857', '0.54497547', '12.6786486', '16.02991289', '14.1462351', '0.272283449', '24.17475688', '0.659122792'],
   ['51', '26.86671143', '68.59859564', '28.81894826', '11.43287196', '34.85039698', '56.92443962', '9.160338915', '23.73647513', '108.0870404', '77.20146745', '149.7474084', '74.92366909', '61.49601774', '85.72715258', '25.15218088', '87.80627303', '15.84563536', '37.40467786', '11.37866006', '89.51293868', '160.7327544', '15.80723714', '145.3181078', '9.297091922', '50.99012377', '27.62538596', '40.15545192', '31.35227232', '14.82929114', '52.81099157'],
   ['52', '25.54059626', '84.46040675', '12.97071818', '13.97632407', '80.44782088', '31.05940173', '455.3005924', '23.61821934', '339.2570588', '9.842314164', '319.3659053', '89.88119142', '416.0983957', '36.97311626', '332.0730197', '173.5089414', '125.9063602', '135.1645985', '147.0141149', '234.6343873', '330.7940937', '217.8599858', '7.594453664', '198.7089144', '294.4882226', '273.0634033', '171.1548309', '11.45732904', '100.1591491', '22.45714501'],
   ['53', '54.33892889', '302.527845', '58.12611622', '101.8059047', '486.6820296', '417.8949366', '10.43883698', '234.5667924', '130.8277871', '83.35685665', '314.7361839', '137.8211777', '135.5166482', '365.9841008', '23.3350408', '58.53704788', '404.0575621', '4.080888921', '150.5587655', '497.8226315', '495.5539196', '293.3618057', '106.7337692', '145.2821244', '131.3313446', '398.8841183', '125.2159145', '16.07582108', '451.349331', '145.3800616'],
   ['54', '4.639572556', '12.62189753', '2.531632622', '14.78496924', '2.493773649', '6.865326654', '3.638697757', '6.900544258', '7.063699971', '1.088278747', '14.34986422', '9.158396682', '0.891088975', '10.17357229', '18.02844982', '2.843158689', '13.39836604', '0.925631104', '2.5722657', '9.878704351', '2.37716117', '1.949971366', '2.401509802', '7.271961909', '5.587540065', '3.669069805', '3.793911321', '3.198179051', '26.51083639', '5.353730652'],
   ['55', '166.0735984', '108.9638506', '239.6998879', '105.206168', '292.1615337', '67.62807978', '46.33175023', '95.25174375', '212.615448', '198.0200904', '76.6547293', '78.13459154', '202.0208124', '31.70275333', '69.12648124', '349.9420647', '28.11913804', '23.5442122', '172.5847472', '125.3783323', '63.51508709', '354.4519577', '218.3595437', '318.4109945', '293.1441226', '188.2312285', '221.9466078', '139.8594519', '162.4212819', '207.8323092'],
   ['56', '107.5512423', '5.731334357', '30.27625816', '347.0507398', '0.758949448', '6.78553018', '9.372846437', '479.420122', '3.901712227', '7.078148364', '370.7634456', '1.537462091', '37.61821124', '21.58702015', '7.22758237', '5.229326431', '12.25221816', '0.184014176', '1.722941956', '98.99801393', '40.98704106', '207.832305', '404.2437701', '79.11330843', '143.0804059', '29.53586612', '59.12288797', '290.5211252', '114.7014965', '468.1472335'],
   ['57', '388.0550096', '86.92109876', '15.57790393', '8.028355217', '321.4765708', '175.2037024', '9.49316321', '40.59390777', '15.69496428', '14.62803547', '35.86501215', '182.1089219', '57.31271427', '100.9601448', '75.74008245', '86.23546199', '114.7662854', '26.37362203', '16.21069389', '428.2153659', '239.2491659', '279.7557468', '186.6013108', '481.6364172', '290.800885', '429.5060092', '325.9708171', '330.0463694', '364.5567514', '479.4691702'],
   ['58', '36.0454545', '60.20993085', '36.5002219', '180.4010294', '87.26881638', '135.2840413', '14.19357487', '184.8036072', '82.50207563', '18.05020305', '42.95004823', '89.84004006', '39.11292953', '47.25520354', '95.29263048', '39.80276555', '51.80264447', '79.01479702', '35.35309462', '160.4328955', '110.3786193', '18.55593652', '71.46563967', '141.2997059', '22.91541355', '48.43174916', '78.45544471', '23.2982853', '275.9748324', '26.42497938'],
   ['59', '151.7032468', '13.90600858', '21.58032421', '11.19608991', '65.45288906', '4.252251242', '227.370655', '56.33908575', '11.05798217', '0.262211952', '83.36434566', '46.19189918', '300.4023751', '6.290188451', '70.74121211', '8.367370921', '5.311479452', '6.073323269', '30.2982411', '25.09352594', '2.61391541', '340.1961381', '173.3557974', '117.8459032', '257.9112552', '127.996364', '45.16887567', '77.73698307', '63.52584898', '63.85685888'],
   ['60', '288.7713974', '438.0596189', '34.53366669', '25.24412681', '61.79592808', '155.7902988', '45.23681846', '88.15121769', '79.7873255', '325.0869689', '36.10913777', '51.01651984', '12.02325998', '30.74249821', '181.3710027', '12.61411277', '60.71792963', '164.7333211', '131.1813562', '488.6600447', '412.2463723', '14.43225855', '8.041874694', '323.0167033', '27.52422631', '268.1839524', '192.08957', '294.7497527', '195.7128084', '396.9229621'],
   ['61', '464.532248', '486.5687313', '441.6525869', '469.6306178', '314.0399689', '405.5609162', '483.3203278', '485.918746', '492.6492011', '486.3061534', '428.804802', '461.4683994', '450.3226581', '437.4407922', '406.451331', '451.3944871', '436.2954689', '469.8137015', '466.2003996', '485.4469797', '413.5669453', '427.8400788', '449.8318689', '470.3413421', '491.4647828', '465.0573216', '467.977801', '472.7410967', '490.6210846', '479.3150463'],
   ['62', '496.5528088', '402.9052883', '387.0089999', '470.1500029', '490.3334823', '482.7365075', '370.3494555', '499.2184387', '405.93626', '212.9025993', '499.5454045', '473.6947059', '482.0317641', '489.7808913', '469.6308182', '461.3144879', '483.342615', '380.0144169', '462.2328703', '499.4698893', '498.4770917', '484.1870843', '493.8057917', '484.0544784', '495.3899382', '488.3779276', '442.7120201', '488.3152104', '488.7667578', '474.3713542'],
   ['63', '2.086994536', '199.1227031', '14.0823932', '15.28520041', '28.53511734', '31.68870565', '95.21802003', '55.63494497', '240.5969838', '207.5412854', '5.01640418', '92.1715518', '372.355762', '29.35285381', '270.7285243', '133.3269644', '1.208194581', '34.1028335', '14.27467709', '21.52154592', '0.781867752', '233.0806522', '144.5119243', '19.92001263', '98.06587117', '425.8427845', '465.5564768', '3.383123498', '70.92660083', '2.256535303'],
   ['64', '22.00187996', '319.2273348', '31.90098777', '489.9152885', '480.8623944', '385.2205345', '295.7298583', '451.5107061', '419.0129929', '457.090014', '492.4429053', '117.1745129', '148.7331645', '183.8506947', '233.720325', '330.6174909', '323.0226927', '489.8665642', '386.5835152', '355.2079715', '178.8692935', '231.7008498', '4.082104695', '146.4339991', '118.6820658', '27.3186238', '23.1134104', '37.68399287', '50.55441025', '36.23128503'],
   ['65', '93.59726627', '38.86274382', '96.51110873', '117.8202026', '179.5957934', '207.7800466', '15.63996688', '235.9837735', '34.92806674', '37.7908272', '42.03968107', '58.59183697', '27.65040704', '112.167731', '63.17280855', '100.5521772', '168.2617936', '48.53468366', '28.80284397', '364.162826', '300.3129405', '61.98561077', '361.0293477', '31.7270572', '24.84957917', '21.29253514', '71.37314371', '198.1383745', '101.2617114', '149.2574295'],
   ['66', '81.19499866', '205.2401984', '28.29183066', '128.1573452', '49.87556591', '68.85562916', '1.673905603', '433.229029', '8.914360501', '5.005969776', '11.58650895', '13.6034183', '36.60553403', '9.254232402', '28.79306503', '10.33133444', '57.94772474', '11.73283328', '11.03939589', '192.4879152', '80.8659365', '17.23687263', '150.7758586', '39.209944', '70.63225267', '61.45969399', '40.29765823', '145.9760034', '62.51414712', '83.39281194'],
   ['67', '458.8863009', '252.9585905', '29.46179877', '1.778027959', '5.027276719', '14.61844817', '26.39538157', '27.43699608', '6.223341087', '0.485999339', '1.022503308', '20.49614836', '57.37528431', '51.1765776', '128.0321018', '18.77013811', '75.4998497', '4.691063906', '21.53509394', '230.4456308', '168.3515132', '37.86016042', '459.524282', '201.2008477', '296.0526596', '404.9339818', '377.9047488', '377.6766449', '467.0312264', '325.2544712'],
   ['68', '183.6745123', '355.6197537', '359.4970842', '15.33832525', '20.24094911', '164.827194', '6.395575625', '27.57298466', '18.43132484', '36.57647563', '1.104181626', '11.26629006', '8.235986871', '21.88839846', '13.55196544', '18.65440282', '179.4476587', '69.49939563', '9.70292505', '464.7946333', '467.552961', '21.48088267', '78.72907116', '97.13155709', '7.833313185', '68.87939463', '36.86379143', '258.2560162', '91.83725398', '140.2785146'],
   ['69', '22.83495977', '37.93121789', '2.802910137', '415.7530051', '177.9787893', '97.48618775', '328.3984763', '488.6588319', '365.165928', '17.69125339', '427.3331068', '210.5716843', '464.3183932', '91.62890458', '344.3352619', '179.6359773', '36.75821046', '85.23524657', '357.3562853', '4.280339484', '0.435037844', '248.28789', '18.88792347', '14.39758141', '308.2096216', '223.7950848', '230.7529055', '18.38923593', '360.840586', '147.1545776'],
   ['70', '1.457809228', '413.7110529', '2.654098012', '23.32038105', '58.72460634', '188.5477642', '2.707510178', '253.6361698', '152.8740728', '282.7749189', '239.292583', '25.24941687', '19.80904738', '122.1565294', '57.23265863', '70.90245091', '192.3116087', '32.44097936', '57.70840881', '422.8358123', '348.9403822', '8.531568109', '1.667863606', '0.35460031', '16.01745368', '436.0575704', '419.8760517', '0.360579735', '333.4253379', '0.058023408'],
   ['71', '10.60358273', '15.07508098', '14.94357059', '5.566525184', '357.9265463', '89.0405288', '4.15644282', '5.355623686', '15.94960731', '2.099332234', '10.01863258', '5.982082696', '12.52332794', '32.79059022', '6.401924577', '22.15645401', '53.65469353', '70.99707575', '17.20648222', '76.601984', '158.2590812', '24.13796032', '14.03322397', '13.2946997', '3.794578626', '45.9691314', '9.643364568', '12.25870714', '36.93422691', '2.511050683'],
   ['72', '180.25235', '1.112910207', '10.97171722', '182.172586', '267.4813592', '154.2017305', '1.145777519', '409.162554', '0.667660991', '4.236378677', '134.7660589', '3.23805955', '4.504561575', '10.48623933', '8.579832117', '1.081263663', '0.82714063', '0.035447759', '1.221274607', '34.68604408', '70.17894515', '5.687573033', '78.32404385', '148.5115731', '12.71522485', '7.164195579', '7.076047172', '46.27791299', '29.20318599', '24.66905673'],
   ['73', '0.570986737', '1.115580938', '1.377501804', '29.45865772', '10.35919868', '3.410464202', '21.92413217', '204.2118732', '19.44528802', '20.22305804', '414.7254448', '3.647079568', '50.02863284', '25.25830406', '9.190085439', '47.6334873', '13.94777593', '72.35948044', '7.196110697', '105.0913252', '16.77157435', '204.7739184', '76.83277523', '7.698368633', '10.82684505', '10.19345573', '7.806131222', '1.488814769', '0.489421128', '0.870936418'],
   ['74', '22.94284188', '4.570914633', '2.323819912', '354.1232894', '429.3712608', '207.7534984', '0.880262195', '343.1933567', '4.136551081', '0.248368659', '164.9608109', '21.87451182', '3.851639028', '4.87096352', '90.97893334', '15.81874909', '16.36978835', '0.516949253', '8.719459741', '31.8389097', '10.33805007', '15.79377458', '1.944692403', '112.4452349', '10.31979231', '52.78367481', '51.32552646', '9.663636328', '106.4193295', '2.821900829'],
   ['75', '20.01720857', '78.62565156', '1.483517805', '0.052570225', '179.8606167', '40.03293114', '0.951809869', '0.334150578', '2.586126619', '0.182862166', '0.164858357', '4.238666506', '27.84999543', '23.73281934', '30.92094513', '7.657452692', '214.0053983', '21.82873625', '13.54813334', '349.8225504', '252.7262008', '4.476220909', '8.320371566', '4.251488385', '4.022343352', '130.6816444', '20.3599524', '5.772557662', '27.84149178', '16.71509626'],
   ['76', '16.50661711', '2.19513348', '16.59327497', '14.81154455', '3.361418568', '1.532465041', '7.639759972', '4.071716099', '16.32912322', '2.549570244', '18.16191542', '1.811751376', '15.34036168', '8.239820383', '12.31272787', '37.51886859', '37.91714884', '37.85191582', '2.087510447', '10.14015476', '30.56362845', '9.619212337', '9.62750329', '27.08110687', '11.41999364', '10.49536873', '22.04468758', '9.165479406', '3.006079741', '3.371717441'],
   ['77', '132.2539812', '18.63483802', '50.31197109', '269.6656073', '7.277204838', '18.35121716', '29.5789084', '217.7751077', '10.72948151', '48.50258107', '382.4837166', '54.97050583', '2.058858897', '4.974811278', '6.139570641', '19.38457722', '9.142085777', '1.839674191', '18.23224964', '462.3710204', '432.5370958', '45.49992546', '105.1140997', '146.2237846', '12.53403955', '0.812058451', '0.921854769', '185.2707571', '8.160996561', '287.2340092'],
   ['78', '10.55493216', '226.6470462', '3.233058975', '20.92964487', '383.4000358', '345.5810335', '168.3806486', '26.83496986', '468.8707061', '252.1746639', '55.28962701', '470.7616443', '252.7470512', '493.3394185', '419.9423597', '473.6387489', '486.4003317', '475.28014', '459.5658515', '458.8381607', '477.5218917', '25.14219548', '5.000895514', '8.291128784', '19.80146073', '369.4746981', '388.3751412', '16.27869073', '189.4178683', '11.47921721'],
   ['79', '402.9349313', '216.9718075', '60.28374998', '10.75527928', '437.1692284', '128.1132323', '55.46203512', '17.30265887', '25.24522571', '4.630486518', '18.10208501', '45.86331679', '316.463471', '123.3448581', '50.7514027', '25.71263523', '167.1136964', '110.2892077', '47.59012792', '40.68113501', '73.94467794', '209.8185958', '411.4752767', '282.3217531', '249.5001331', '321.9878891', '204.5142451', '111.2378908', '444.7888284', '18.80676488'],
   ['80', '276.5296729', '175.1594555', '122.2312448', '24.07935523', '130.7970691', '74.39000119', '13.97285894', '77.13527049', '18.81494185', '11.03433482', '161.9484812', '44.8810761', '20.81555094', '3.416527364', '14.25637915', '29.94064421', '176.7260622', '82.91333588', '65.8346761', '24.48810565', '75.17396843', '67.02662865', '253.3106553', '35.28911697', '53.75407043', '139.3064708', '50.96316398', '153.6378906', '38.8027732', '203.7783223'],
   ['81', '4.167716081', '12.71931889', '0.558023798', '1.031175352', '1.768992096', '0.822585659', '68.77673412', '2.404660336', '27.36579326', '0.866867053', '0.982669244', '10.39268506', '41.9423782', '2.791289688', '47.26762704', '14.55400885', '23.30181275', '38.62685647', '83.5856238', '6.978204847', '16.94340773', '6.568134121', '3.745261322', '1.514717401', '7.413301766', '18.68760554', '36.28714971', '1.643079869', '8.097039465', '1.687984396'],
   ['82', '166.6957544', '54.30824914', '220.7905289', '39.67095005', '13.02225364', '10.75066873', '4.200939042', '166.4792507', '0.338375294', '1.522702434', '17.16464883', '1.632100467', '27.94125982', '0.905643142', '6.093075476', '1.390888596', '2.184009898', '0.260029165', '0.620819871', '0.286716054', '2.248305057', '18.52861166', '293.2789791', '105.8534574', '161.1589042', '3.259638439', '6.25551202', '86.15261416', '31.49850825', '234.6182423'],
   ['83', '33.54790154', '378.0146026', '23.60795849', '122.650752', '15.28323724', '55.95558422', '4.499888449', '433.6790466', '3.178566716', '6.941473968', '160.616772', '1.932387325', '6.128776764', '7.508105555', '5.812670344', '2.96291807', '2.378622104', '3.858494616', '0.575355466', '6.277052809', '26.2755608', '4.712862711', '152.6661162', '44.5118986', '19.64849881', '35.46594132', '41.69855699', '107.5820085', '194.2968271', '28.31509216'],
   ['84', '24.20360887', '410.2730077', '9.155031446', '435.1419003', '480.5417152', '341.0171951', '53.83103019', '482.282561', '133.9744625', '35.60983139', '339.000059', '183.9305727', '103.1460373', '11.65200753', '41.29826755', '281.9572901', '33.51531987', '35.34966442', '113.0416366', '181.2115517', '47.76805846', '174.2213613', '19.69509853', '108.2946544', '120.7295976', '234.4616164', '136.6272258', '17.37970376', '415.9785439', '12.12060363'],
   ['85', '13.41527645', '18.20899145', '21.51820701', '12.4070977', '9.551024123', '9.667222061', '403.7830169', '269.4412143', '231.5975085', '1.535908092', '97.46323428', '44.68723477', '488.7640344', '155.669176', '145.585526', '27.52780422', '64.246638', '249.7443532', '257.7622984', '45.28452877', '16.73309189', '467.4467443', '379.6227545', '30.56728763', '391.809205', '306.8073762', '195.7891436', '49.77067491', '58.48605914', '318.6564275'],
   ['86', '21.72134395', '23.77686674', '8.055445721', '61.78737784', '4.778193833', '13.85213165', '8.320883793', '193.346901', '4.76627796', '0.259777795', '230.4823204', '12.47409215', '4.297428131', '29.78687589', '28.73335641', '29.11444356', '21.79459969', '1.774318913', '1.508164679', '1.464643928', '2.258913385', '2.715434034', '5.371995956', '152.4992067', '16.86982612', '372.5808702', '415.2254756', '10.0740529', '219.3489293', '175.3249354'],
   ['87', '57.73476032', '48.46208174', '34.59979967', '8.735304457', '73.48377369', '76.11508207', '98.11276317', '44.62607899', '209.2920011', '43.78501977', '235.6598556', '323.0434107', '159.439565', '226.1423181', '202.5372628', '249.7597883', '116.2016053', '386.548785', '421.1697636', '449.5396199', '346.0818824', '38.56334265', '66.5788359', '41.57181697', '65.93985223', '223.3174165', '296.4636287', '62.5446098', '107.2288388', '154.1361988'],
   ['88', '2.889257396', '6.288735192', '3.804738618', '5.609451399', '39.06367062', '5.190901873', '2.574526579', '20.42213721', '6.777288613', '4.984220751', '0.724841564', '5.857398413', '52.35296973', '75.50299146', '2.508172857', '3.357939784', '40.62140543', '2.822555273', '67.30141976', '4.969998142', '13.10839275', '12.8147305', '14.36379963', '2.610249651', '4.78387337', '2.422990357', '5.119979529', '1.655019174', '4.313346773', '13.02574474'],
   ['89', '98.78179076', '70.12382178', '4.144446617', '60.44066135', '19.73307332', '21.41089139', '77.02204146', '105.7636432', '38.72372033', '1.43117952', '192.0328667', '14.99895158', '31.11904289', '169.1767178', '46.14014663', '14.48981533', '144.582573', '1.451940328', '218.1515827', '470.3793134', '407.9894055', '101.5833753', '56.52694032', '20.39263622', '32.30302866', '305.6696344', '157.7524823', '5.097943265', '310.8821226', '3.059930938'],
   ['90', '13.72087251', '366.9223529', '76.71075548', '421.8819482', '490.7344045', '482.6717355', '66.29880585', '422.0106451', '372.2316454', '348.9216948', '467.8502632', '151.9841924', '165.0073362', '106.29791', '425.5464221', '311.3074857', '273.6969744', '424.7721176', '155.2561871', '384.343155', '390.1340531', '63.37983834', '14.09058954', '15.228054', '46.40911894', '310.3766469', '245.2196419', '22.90117418', '187.6163814', '3.12402226'],
   ['91', '126.2219714', '29.4931173', '16.11856457', '335.1054514', '217.0936321', '126.5301119', '3.42187562', '407.090583', '171.1059779', '250.3809004', '429.9126678', '64.59821809', '86.5145673', '280.7303309', '91.0015565', '330.3051243', '6.459206556', '12.75653888', '9.88453573', '324.7844991', '34.69541383', '221.2441864', '197.7979684', '82.06866901', '220.7826734', '386.8091571', '449.6591636', '61.11995068', '340.785845', '112.4204572'],
   ['92', '163.3195479', '35.63896683', '186.4298637', '18.09047087', '370.1229426', '227.5378898', '441.0356572', '214.0702572', '312.2123264', '53.34267525', '132.6981838', '303.7864015', '460.5301838', '374.5539651', '418.0659565', '208.9440848', '431.3482146', '372.14085', '483.3641529', '498.1063652', '493.7251271', '346.4092457', '325.4202592', '315.6708549', '223.9907379', '350.3145857', '201.1441742', '210.2056413', '32.87548958', '377.8327406'],
   ['93', '4.240767772', '90.7720849', '14.97995607', '10.77604735', '28.68489416', '31.91727283', '115.7164697', '27.6159529', '386.9269676', '260.2361525', '76.71596467', '319.1345855', '312.3640737', '449.8815907', '355.2640985', '35.89909259', '121.4924994', '457.1915473', '438.6483508', '147.8118135', '77.90250998', '59.4723964', '9.139354954', '4.717503026', '62.44652008', '173.0364138', '182.3671016', '0.912316282', '168.0826569', '0.412164913'],
   ['94', '357.8979791', '12.94119247', '69.74665713', '8.123913373', '79.04624352', '12.29372793', '233.0690398', '14.02960072', '7.0762722', '0.811820408', '20.20345908', '41.34644387', '180.6197297', '146.4411935', '86.71056659', '32.29188957', '3.797710518', '3.714899896', '14.74710979', '194.6913716', '203.1357128', '175.6034111', '481.1650062', '384.9248318', '223.0503866', '345.830076', '334.6853993', '360.2590374', '153.5824888', '482.9918836'],
   ['95', '72.64616662', '16.26579333', '15.47649187', '20.63266831', '122.6724417', '45.05865582', '78.12670941', '38.47595486', '15.6482351', '43.6420314', '204.4205824', '104.3239922', '35.07421582', '45.98862949', '44.73757654', '22.84014296', '64.26981834', '12.92613389', '64.99207337', '395.4363592', '206.408256', '55.4783263', '127.0015292', '147.7619984', '26.42543946', '52.22288104', '36.63300115', '54.8810073', '192.1425929', '21.28179482'],
   ['96', '0.498322053', '341.1156363', '6.193104659', '454.9878039', '168.7231291', '110.1805077', '2.999535875', '454.8635688', '21.13421384', '5.607733826', '276.1962744', '10.32290369', '25.39425387', '17.06048324', '28.60022644', '58.89432409', '32.0108738', '101.7849832', '4.782537647', '186.5228327', '69.53855057', '20.21170276', '0.838014638', '7.640827805', '19.95219776', '431.8690661', '350.1707055', '0.446533511', '149.6654087', '0.130332902'],
   ['97', '459.2854202', '102.0175596', '256.53255', '156.7586839', '298.083042', '142.642878', '31.22588047', '137.3115404', '11.29662275', '4.260116951', '14.58024612', '22.95068424', '105.6742528', '7.060792571', '3.679364517', '29.28387482', '91.56685622', '0.710749686', '31.97529711', '318.3784684', '387.6314548', '354.0439441', '356.6861446', '445.9669201', '305.1725452', '151.3563688', '95.40036049', '350.0070871', '335.0723528', '99.01438007'],
   ['98', '305.1693848', '198.1340994', '100.0642629', '72.39200869', '349.2383572', '152.0135029', '208.2565861', '281.7036518', '182.62117', '78.29282726', '43.10348772', '92.06381568', '371.1683685', '185.7847714', '167.8928921', '84.44751655', '86.27564131', '62.87269615', '154.8288375', '318.0553023', '302.1596413', '438.5806237', '195.2278126', '216.323759', '297.0467884', '166.0115589', '97.78043608', '269.3014092', '171.962854', '297.7698181'],
   ['99', '5.125036827', '41.34975368', '2.364846961', '5.158597781', '49.48039308', '11.31831166', '10.38535269', '7.138656156', '110.7111285', '10.53323232', '2.728748394', '13.90045106', '166.4465253', '32.75012494', '28.45289473', '54.90770371', '133.7220341', '77.36699761', '53.70688087', '10.54153542', '0.635639154', '122.361929', '6.829310591', '6.130800471', '18.66194757', '350.4496438', '294.5991048', '0.920300335', '147.6064445', '0.323578034'],
   ['100', '480.6060346', '250.3835518', '218.1572327', '2.507322009', '482.6294748', '238.507402', '30.70968453', '1.634332978', '12.11637836', '9.905446555', '2.949221692', '18.46490331', '143.7016525', '32.67214305', '22.18502038', '46.17312678', '8.588674634', '0.763382412', '20.37264978', '470.3268251', '332.8797795', '306.0325929', '385.6426665', '426.166283', '374.5105303', '468.9288551', '452.5068011', '393.4678582', '493.0845231', '340.6550373'],
   ['101', '20.96075611', '186.4741398', '1.997167113', '24.51210606', '117.8483574', '124.8997897', '12.19188727', '239.9213399', '56.68590519', '79.44493325', '4.871909813', '7.054819217', '178.8754507', '36.75159623', '345.1001658', '117.3240421', '220.6721634', '354.4231289', '16.04820807', '6.574024235', '13.12471975', '6.395039597', '11.96044574', '2.819721957', '154.871494', '376.0820084', '374.5879795', '11.78139121', '181.4005562', '0.827600218'],
   ['102', '26.94166941', '19.85644993', '1.627882814', '14.54742493', '135.984137', '98.05101924', '200.877733', '19.99300639', '157.9234946', '39.32614225', '22.06338064', '323.2490692', '120.1680476', '408.0507199', '376.8510744', '90.85971429', '263.4868966', '348.1077541', '406.2173933', '451.3024065', '379.6637235', '67.75488324', '6.638834705', '113.8686378', '42.03566724', '192.3980383', '112.0940223', '46.87164015', '54.13594386', '32.29347089'],
   ['103', '294.4626639', '455.3248354', '448.0031614', '484.7050072', '496.9759409', '483.8492886', '476.9442598', '459.1221874', '462.7645011', '347.6761664', '496.0752538', '465.092769', '431.1455981', '482.0106704', '374.4222392', '490.1697151', '488.9248711', '276.4402649', '473.3769478', '499.5354629', '496.9579627', '443.6004134', '480.055444', '482.1875152', '459.2849155', '468.4075204', '434.6090508', '408.2689407', '457.0983188', '498.5328057'],
   ['104', '250.9977951', '496.9933421', '452.1877216', '386.3675057', '436.4813673', '471.7659486', '179.3260891', '123.9317476', '477.5211895', '495.3994802', '40.59300674', '445.6787216', '422.0934856', '477.9688746', '467.9995924', '484.0058458', '454.2878892', '499.0630009', '467.1765019', '494.416267', '470.2154784', '273.8204972', '87.39391994', '213.2321221', '422.141507', '466.5287067', '482.2792219', '234.8921235', '481.2895073', '103.4307356'],
   ['105', '21.25926155', '125.0178447', '8.806259589', '36.35444205', '15.13728973', '14.26467516', '124.2727122', '85.28856555', '196.4582306', '20.25410373', '22.80650944', '9.065513246', '19.36073667', '27.68411711', '92.44255864', '51.85116455', '11.26332867', '14.38770605', '78.84532718', '101.400991', '62.82494043', '19.10365253', '62.10231812', '4.962849229', '4.178216714', '85.32754206', '49.58652257', '54.98854072', '33.79965966', '58.17700422'],
   ['106', '6.760678734', '17.0882255', '0.453566893', '9.586258998', '113.3802184', '5.619890295', '0.748359583', '37.6226314', '11.67108494', '1.922722217', '26.35891727', '22.08805176', '10.34544784', '8.406884202', '26.54584681', '13.44998585', '17.42049682', '10.53970633', '9.927925688', '270.0478037', '15.47447299', '31.42147542', '0.770961977', '29.58155856', '107.8424266', '240.6319243', '129.8435224', '1.253912037', '209.6033659', '3.311971384'],
   ['107', '4.145293624', '51.64476845', '0.264413339', '5.973149765', '40.44870869', '15.1577804', '7.04142804', '12.55815164', '7.023456452', '62.68613645', '3.532017035', '5.777850192', '94.61656731', '6.502289007', '19.99157452', '16.27084872', '6.266542666', '3.206704865', '6.572783333', '40.80148065', '3.767545239', '123.9420362', '0.920851913', '2.077327086', '38.07914092', '71.660838', '149.2995277', '4.676954902', '86.78312166', '5.648481883'],
   ['108', '168.9134505', '394.7434032', '318.0814365', '496.2923416', '59.0653389', '356.0402447', '401.3510092', '497.7352129', '379.3101134', '473.0888302', '485.4493016', '148.1255646', '322.1943204', '266.4019198', '343.8118881', '71.55083541', '47.70955883', '32.63526693', '152.4850333', '397.5273268', '342.824606', '283.3863644', '185.5177577', '213.7192628', '198.4630968', '430.5455805', '448.2904705', '66.65118423', '416.2441637', '42.88264714'],
   ['109', '26.87821718', '57.393938', '135.4297799', '61.16838904', '93.02242912', '32.00188611', '43.08169925', '126.441408', '6.341055886', '55.29463603', '21.43539274', '23.65793848', '64.7337764', '5.735707266', '11.65203032', '15.83883222', '51.81265859', '11.50577131', '97.35775274', '6.891519743', '39.65018684', '37.62610073', '35.30399492', '10.95588434', '44.15880372', '20.46565102', '29.43928448', '6.944998887', '81.62782645', '5.840347758'],
   ['110', '2.055036884', '4.219143766', '0.251591315', '0.939832909', '236.7480797', '47.10609254', '50.56093485', '1.652197924', '52.99019097', '3.766803306', '2.226730686', '119.5096031', '69.03438967', '14.31786472', '52.78974645', '36.85301002', '10.11330005', '400.0131501', '213.9658795', '14.8001749', '13.86103729', '22.34958837', '6.724060067', '27.12560741', '1.538021639', '17.1636637', '14.04657604', '3.83657692', '14.67725579', '2.894167376'],
   ['111', '1.742186006', '332.9688323', '2.568157008', '7.894613998', '408.7046761', '313.7633499', '9.065371161', '16.14177486', '83.70544535', '14.3301189', '2.94110166', '16.02621447', '76.30734323', '7.63111073', '38.50697425', '116.0689029', '91.48768187', '60.48183834', '15.63574638', '3.862173811', '1.185179743', '26.02674436', '9.984705753', '8.842777052', '36.76599452', '348.419653', '267.5807123', '2.362472479', '204.3798898', '0.884300138'],
   ['112', '3.111077209', '184.7507492', '2.539352522', '2.675230032', '129.2165718', '13.08532965', '1.24106004', '4.261149176', '8.537552725', '1.061819026', '0.686752793', '11.89624966', '7.641918159', '3.261872738', '29.6440744', '7.936808558', '7.176876324', '100.3774458', '12.65158646', '0.102392043', '0.219820898', '2.389796237', '0.955608507', '1.763339039', '2.502790901', '63.71576814', '25.42906226', '0.250586712', '168.7550909', '0.085666044'],
   ['113', '28.15876352', '14.78700843', '9.252553009', '21.69227303', '5.402924636', '3.431429392', '43.10027269', '16.26619955', '63.20676183', '32.18847062', '1.172227715', '27.81217373', '39.99836757', '23.23767365', '53.08260928', '36.78454011', '68.94612852', '7.349692871', '13.8030418', '7.04174944', '0.955384213', '12.05056135', '9.195228478', '100.8103427', '184.830669', '302.7613915', '435.0926502', '14.2259032', '222.8951992', '10.54424075'],
   ['114', '20.89917115', '136.5444046', '31.63284362', '2.960055956', '246.0491189', '39.87066422', '5.027019716', '9.201006886', '5.764005611', '3.162966087', '7.179891599', '7.705683773', '96.71556815', '13.89140657', '8.237084125', '2.33734555', '8.783413278', '2.381290236', '14.1171898', '7.631346887', '14.49550825', '81.88537003', '329.989806', '247.3315032', '98.23553275', '27.72471022', '13.81687626', '20.42783715', '16.78357261', '30.72185143'],
   ['115', '78.97238481', '124.8362773', '87.58658163', '56.47847749', '138.5284608', '80.81366436', '43.43216994', '62.49700351', '87.44256498', '111.7925017', '168.8204532', '41.70441961', '166.9991232', '192.2400174', '73.45441755', '89.76988155', '263.2161227', '428.4541705', '49.1977421', '144.6974864', '217.8415818', '51.64832346', '22.55195149', '28.35668947', '56.41976453', '77.48915453', '36.31477976', '43.62835156', '64.16930238', '21.69156182'],
   ['116', '498.5610491', '468.0845912', '471.151372', '494.178223', '499.6022605', '498.4772771', '418.1520088', '497.1832266', '279.8950207', '446.3259101', '495.5858986', '245.9624548', '383.4661905', '484.712485', '374.2306221', '331.320095', '491.6725408', '351.3227254', '449.0966505', '494.5470357', '487.5799963', '461.6471143', '489.1720768', '484.9259999', '426.474855', '461.7926537', '405.3486906', '498.1777742', '485.7269157', '498.8085132'],
   ['117', '7.503066629', '45.54824274', '1.88219984', '118.6464372', '64.88207129', '48.74011372', '401.2691814', '131.907881', '196.8181633', '312.6731405', '79.04176481', '32.33852255', '301.1843536', '6.856115287', '77.91415556', '35.88048883', '17.68660502', '432.2479237', '241.2078573', '11.7162224', '1.03135183', '179.8130561', '14.94470062', '12.42633417', '79.95273865', '40.57603085', '55.61032134', '31.90581878', '199.1233295', '96.72452715'],
   ['118', '239.1624443', '258.3197279', '33.64553916', '3.640718838', '184.3404842', '30.50612071', '57.7266324', '49.21693619', '135.4010661', '13.10405114', '39.35021938', '37.03822352', '342.2605738', '21.02482192', '122.7869299', '88.45646874', '10.60380159', '60.30265653', '95.59876056', '329.8941099', '57.17813992', '238.2135032', '410.307651', '202.3629889', '320.6802246', '177.1817823', '76.54820768', '221.7509551', '429.8494486', '406.2438629'],
   ['119', '1.560888265', '21.59876319', '0.348657574', '29.5665576', '177.9595757', '158.2460917', '54.12676459', '82.98605303', '323.2322251', '7.119940873', '3.630637308', '30.42358311', '66.41898181', '125.972345', '349.7814545', '91.30389676', '419.1357099', '406.3927815', '237.3079059', '421.5599641', '91.4012835', '34.96477622', '1.959119507', '6.218945772', '11.35094588', '130.4014859', '59.85412522', '3.356895822', '12.89798555', '80.71253446'],
   ['120', '376.7807746', '340.0805655', '128.3381079', '498.1111972', '499.0504945', '491.9534177', '469.1953851', '498.4385635', '483.2913591', '287.0914996', '499.4923526', '489.0003336', '474.8500786', '414.6952698', '441.9009394', '477.6415013', '463.6009122', '474.7242466', '494.9850083', '489.1016195', '489.8913964', '459.5161265', '340.0944373', '384.9884957', '447.500487', '358.7519031', '310.4343473', '378.8571527', '274.4014739', '33.26264104'],
   ['121', '11.4862851', '35.16713583', '10.45704801', '15.65545241', '13.79826545', '13.43493915', '4.815482845', '44.22679059', '12.50422188', '25.4155662', '28.5391503', '6.62690395', '13.12205314', '6.516858563', '10.777921', '10.8824077', '45.07148552', '27.62091293', '27.22030374', '7.127155568', '43.32276225', '13.22972023', '2.211973781', '21.71647635', '7.405271324', '2.996501094', '1.956705328', '13.73035526', '25.9296746', '13.33868585'],
   ['122', '461.2406214', '426.8820162', '403.7001799', '428.6235287', '464.3895666', '422.9559096', '498.6019848', '478.3876958', '495.6190886', '308.065772', '498.0132143', '489.1497897', '476.2211988', '463.4648946', '493.8135893', '486.9214119', '471.9750826', '497.5235657', '472.2760467', '464.5446055', '468.3289963', '478.5684825', '384.3367501', '494.4158004', '495.6634235', '443.9095787', '333.3783857', '484.1314168', '488.6587713', '472.8160448'],
   ['123', '44.86309983', '3.133237876', '77.99605936', '23.94416873', '6.736102716', '12.26735674', '8.173797506', '39.11766613', '24.89810529', '16.36093929', '45.98755496', '17.50414379', '41.97046367', '21.03483706', '19.9230842', '33.10012785', '26.09094641', '14.60645268', '35.74054381', '48.22200462', '46.68682965', '38.7120066', '26.43852611', '14.48312923', '30.82684388', '24.31584096', '27.18521434', '7.909517924', '10.07525918', '19.91529325'],
   ['124', '0.890655625', '11.47616768', '2.455510195', '102.1742682', '113.5226291', '7.670276384', '7.132471323', '114.9606731', '1.598010349', '1.03940336', '8.120096045', '7.176120032', '8.767975939', '9.585209858', '52.61805039', '5.581992244', '0.729464733', '30.84791097', '15.05423045', '12.25069702', '5.246383759', '5.770039174', '1.600289759', '3.644508617', '0.908503708', '5.947024089', '3.680281192', '0.805280502', '5.646210336', '4.763383916'],
   ['125', '52.01993487', '8.125637588', '5.161519188', '9.42546092', '78.99426215', '19.29173152', '77.38043518', '54.07804612', '15.90719352', '8.398922676', '17.2830866', '24.14043742', '25.33153616', '103.739435', '80.94244073', '40.49192479', '61.57986371', '30.49147057', '132.3878236', '366.2910616', '260.4295764', '43.68370597', '313.0113394', '134.9401857', '10.75010684', '94.0280672', '16.7797509', '95.40555057', '24.4430945', '450.8580111'],
   ['126', '5.484420229', '1.021549964', '57.8880899', '216.1497267', '20.62544753', '33.3051197', '20.12215479', '344.7309463', '110.975775', '70.3486102', '204.5216068', '240.796842', '73.95915475', '9.435186955', '314.5322871', '46.91367751', '3.987779406', '24.41370277', '84.79201424', '23.25961255', '3.735472088', '14.1937408', '21.12578118', '36.6550643', '224.2300601', '5.875977875', '49.73234655', '17.36270982', '7.360187364', '14.65200945'],
   ['127', '189.5111179', '33.70784907', '6.328098971', '23.76048484', '198.2791393', '30.59429804', '346.6383503', '218.4110364', '12.86949755', '1.485955462', '1.051379417', '6.684576211', '341.2002602', '26.52570451', '60.68195149', '3.838403647', '13.67079771', '2.646243669', '68.15718668', '165.848313', '44.56111462', '160.8809789', '94.66087052', '71.85921334', '138.8359641', '263.3106307', '294.9413386', '199.0788293', '304.5388209', '329.8106401'],
   ['128', '15.22783825', '7.077870814', '103.2722166', '3.734098745', '111.5310344', '10.94203047', '5.263069176', '7.454858131', '0.317352266', '0.209570681', '192.4833808', '1.520678409', '7.933737216', '1.671385554', '2.487739458', '1.720618389', '0.914687602', '0.323820812', '3.098148032', '120.2818633', '346.0906381', '78.22017023', '25.84066', '39.17321012', '8.17174412', '6.063985457', '0.802932545', '10.43361146', '21.93149458', '92.535112'],
   ['129', '2.471940422', '2.755106635', '5.267170786', '0.32242661', '224.7737127', '11.69826143', '12.33663592', '1.9374361', '2.382473131', '2.064492478', '0.327011759', '34.78190478', '99.55867725', '5.490742977', '21.44712357', '9.42846374', '20.06485558', '14.88901847', '92.73796353', '32.11545039', '77.45752381', '78.04389705', '19.71241514', '64.79274231', '44.7342569', '55.2000361', '147.0745977', '3.353572778', '126.718067', '81.6709559'],
   ['130', '8.652229892', '93.39219929', '1.571566202', '8.046801896', '22.97498897', '25.7620426', '16.986793', '8.218287898', '22.41763543', '12.00787892', '13.53357806', '20.06228837', '34.25272964', '15.19530223', '7.370777677', '10.91412201', '8.043263877', '16.08489868', '55.77281645', '36.25813821', '11.40768393', '42.67698894', '77.58745533', '1.91735145', '23.65229049', '19.22889498', '13.79640156', '16.97565475', '50.46415796', '45.95931326'],
   ['131', '254.0792005', '122.6274337', '111.0096407', '235.4148917', '221.38402', '214.0263869', '24.92302632', '422.6304819', '84.85704817', '299.0237467', '315.4931978', '128.0195723', '17.57620921', '146.1122559', '38.78684681', '125.8071599', '143.8020514', '5.129418397', '34.56274131', '146.8108923', '118.42854', '32.0043273', '268.7974248', '255.3075408', '117.3450642', '87.59131429', '198.9919622', '266.4953104', '403.8350038', '20.00481612'],
   ['132', '3.332275964', '12.54590983', '1.497523545', '36.24926942', '29.72466283', '13.04262525', '1.563376381', '14.42769101', '35.20664737', '57.83602725', '13.16670875', '15.07586499', '11.82783781', '34.66569588', '15.19879445', '20.05467954', '32.86232248', '13.3308356', '48.36680428', '41.03271185', '5.224379821', '14.19128209', '0.733947595', '11.53351072', '11.06190693', '24.73208399', '50.62391103', '3.309347007', '18.30041047', '3.398228064'],
   ['133', '1.017516553', '74.46000296', '152.1919716', '415.631962', '234.0963283', '278.2097085', '2.052513611', '460.0922855', '125.5204074', '243.0643348', '4.18079556', '58.17396462', '11.33286266', '6.345501526', '57.5572018', '49.47086964', '26.52589025', '7.437111237', '40.72430043', '301.968791', '284.172981', '18.96419643', '15.10186835', '16.99125168', '16.25386577', '15.17048503', '83.86587705', '4.393178101', '13.82457245', '0.368547271'],
   ['134', '60.06552136', '71.93073229', '12.76925478', '3.027512778', '86.71557419', '140.271887', '10.2087898', '25.05384479', '113.5109013', '1.248499571', '0.85435235', '33.3307788', '70.70564743', '27.89072362', '88.15752597', '44.11312666', '454.924886', '364.4654774', '274.4922034', '48.18338908', '245.5674442', '28.53949276', '25.32085942', '2.338994736', '13.84726848', '53.89968518', '63.21779363', '19.73236992', '18.74978971', '6.057328586'],
   ['135', '10.23166263', '32.04548358', '10.42067913', '3.611975848', '179.4515836', '22.15064364', '9.203456226', '7.148332685', '14.33100393', '1.478925018', '6.141411915', '9.602620537', '413.6957452', '32.68100866', '30.78233305', '48.78258802', '30.98913534', '158.7946464', '10.07612187', '9.319749438', '17.87316723', '333.6456642', '231.3697118', '63.53062435', '224.6100407', '245.346511', '298.4083964', '9.296411522', '75.04582952', '26.43282389'],
   ['136', '84.61830227', '43.40470883', '18.24437398', '229.3651832', '66.6896954', '37.94112466', '267.6705273', '13.9961007', '103.1912512', '16.7190263', '91.9060115', '96.4608087', '166.9243299', '409.0942941', '255.0042217', '129.7523403', '203.2937701', '52.12290144', '298.5349396', '265.9187248', '176.1758277', '191.2682184', '164.9309218', '198.1775704', '67.97589619', '203.2790748', '95.4912885', '58.32110394', '179.7763403', '391.8756441'],
   ['137', '84.58876304', '21.74470618', '3.88728031', '2.335189797', '0.552047882', '3.152116864', '1.0320634', '5.686841064', '1.271042735', '1.401094511', '0.736869061', '1.385085198', '10.48177813', '2.12942032', '0.763810872', '6.255078388', '106.0718453', '1.08560358', '3.106788529', '0.736226987', '0.206565169', '15.55649292', '260.2704768', '22.405603', '21.05926673', '26.99572651', '16.94991195', '59.20119755', '8.610043579', '198.3765129'],
   ['138', '21.77939899', '57.31301472', '0.60145574', '13.68842455', '8.920266085', '23.67831685', '11.84384614', '46.22635921', '23.78874049', '5.28238628', '11.50271283', '12.83658033', '231.5405737', '35.23922808', '5.606551772', '26.82160783', '242.6674531', '424.7116104', '47.18114762', '9.217298732', '1.550750727', '105.5254541', '5.178557078', '0.770029064', '8.99696495', '16.65723578', '4.735115753', '15.4263226', '8.619576595', '5.801673063'],
   ['139', '27.39886082', '108.679215', '9.395723992', '85.12023894', '32.28840798', '65.30083755', '36.69564587', '206.3272177', '97.19678835', '50.82624396', '16.22228265', '192.0973744', '74.99986055', '40.94332583', '48.91014815', '17.39499318', '9.534185812', '3.694739156', '93.30675515', '37.14808574', '26.5262485', '15.03211797', '26.86574316', '23.11621033', '52.45261669', '16.67577515', '14.00967673', '33.03800605', '29.2591185', '203.939703'],
   ['140', '249.354857', '120.7897933', '186.3825594', '83.377265', '101.7976783', '56.65667857', '273.7071581', '403.4008101', '159.3933067', '234.2998334', '281.9976913', '112.4601314', '199.9069516', '264.1537856', '310.3945604', '73.12709095', '281.0565486', '11.95534309', '265.9459496', '496.8851046', '486.2064607', '146.5608837', '170.2012557', '101.6121882', '221.4722142', '416.549071', '466.3977166', '139.4752866', '425.9165587', '122.6739819'],
   ['141', '117.5054564', '28.29696901', '23.52938591', '57.75545356', '38.31957246', '75.27154878', '50.57546683', '7.971612272', '39.27325918', '127.5328394', '94.53964513', '26.2922778', '10.85521631', '7.756674516', '18.75728991', '41.17849419', '25.44051934', '3.481848558', '81.09887861', '10.6352694', '52.56795474', '52.9425622', '24.07948806', '37.48326291', '14.84128131', '5.730575794', '6.369189523', '41.79746393', '114.1279097', '52.91151073'],
   ['142', '8.815074602', '24.52522369', '3.923807219', '58.80319267', '5.538165195', '33.26456076', '53.10413422', '156.810355', '76.4318092', '64.90618207', '27.13959068', '11.60198509', '68.5921252', '36.60888827', '45.20459064', '9.391365979', '9.529848962', '7.179453084', '23.04029255', '12.720599', '5.35727724', '105.7350103', '4.35420247', '1.05650539', '3.225452243', '64.78097037', '16.79464178', '5.069272883', '34.57202279', '3.478421161'],
   ['143', '298.2561543', '210.3922876', '313.6031813', '193.4395845', '281.0670193', '207.5101891', '320.0851657', '207.837426', '334.5695435', '182.827733', '458.1002665', '308.3752554', '187.8645521', '146.2008207', '388.354485', '197.2094455', '190.233251', '299.4699645', '249.7738798', '390.5739884', '285.7704984', '234.7912853', '84.63817515', '426.8956845', '188.0192736', '218.8314688', '173.2331821', '211.3962798', '116.5461399', '316.819525'],
   ['144', '65.94152595', '462.4836826', '199.8778188', '77.37004095', '342.7258715', '267.0527424', '25.39938234', '220.8250974', '60.00347735', '23.68035769', '126.9124528', '407.311413', '366.1385601', '476.7827522', '341.977151', '103.2095078', '168.9444979', '8.226746884', '228.6722797', '232.2995703', '208.287703', '201.5665335', '298.785034', '314.966727', '379.2632963', '464.3451093', '398.3753754', '68.29719642', '467.0740357', '136.0458693'],
   ['145', '30.79308318', '28.22154854', '3.219357822', '1.207015228', '369.4005645', '29.00492852', '422.898333', '12.77873352', '298.7540153', '13.45398998', '138.1264956', '319.7646352', '442.5047127', '131.902521', '257.7000227', '244.7382676', '270.7610466', '489.6628489', '468.2602643', '192.6240227', '67.9511164', '154.4182949', '130.8846562', '49.94064876', '106.0790217', '308.4700554', '42.65776767', '19.98278997', '20.41849829', '175.2816775'],
   ['146', '19.0710628', '145.331883', '5.577566635', '459.0485991', '7.127160968', '202.0801615', '79.74299476', '491.5546102', '78.19495609', '395.6068908', '411.0382967', '15.5287665', '116.4074807', '7.235248334', '31.63406333', '32.88401372', '8.51179891', '10.54602863', '8.026339708', '179.366336', '20.78043007', '32.33625919', '30.92947244', '22.47417207', '164.3716262', '22.84678007', '54.51499256', '21.04916228', '69.48849528', '1.959605442'],
   ['147', '189.7301799', '413.6748953', '24.12935215', '392.6426562', '453.002859', '467.935559', '192.2085289', '389.620499', '490.9308584', '496.1752097', '257.5810431', '492.1146541', '475.7348365', '438.7174266', '477.9293868', '472.0626883', '348.7605883', '498.7297386', '453.7416911', '487.7744512', '418.8459045', '325.6433243', '11.47458727', '204.6451373', '215.3858215', '401.6526924', '393.3151153', '170.6801504', '198.1526506', '15.84287693'],
   ['148', '12.60980045', '2.880502456', '2.027069385', '19.36626861', '12.47281766', '6.651572681', '14.27542492', '359.3108109', '15.32910177', '0.098136757', '395.9569734', '61.27054377', '184.7535113', '10.5144847', '10.05876353', '35.83592626', '9.258223886', '3.67226855', '5.191214374', '0.69022921', '0.237097338', '41.38370409', '313.32893', '50.15864832', '96.24272611', '163.378714', '191.8126595', '5.329356073', '52.63577208', '43.51212465'],
   ['149', '247.2704477', '12.45901137', '295.9206719', '228.4992152', '130.745286', '20.69055617', '52.20128689', '203.1161202', '19.1621392', '1.680105166', '142.8828969', '7.169801753', '76.71540296', '59.08821934', '13.17699674', '56.2206845', '5.752153915', '7.934579135', '28.72265067', '53.60362451', '17.89136437', '390.926299', '466.0932184', '386.4614889', '97.38896483', '160.9555101', '210.9806662', '450.6200473', '20.48884742', '455.4743567'],
   ['150', '5.64212477', '14.44564696', '34.54271019', '2.896801528', '10.24699073', '6.762461788', '24.24582419', '55.17515592', '13.43012036', '1.118853475', '0.306495255', '13.72286055', '39.46479677', '6.153415545', '8.554428445', '1.919926357', '23.44542647', '3.982688967', '42.74724764', '6.235086383', '17.67114774', '39.24306566', '30.98703938', '10.07463909', '5.445813277', '27.51915056', '19.32319082', '4.086809936', '29.34861804', '1.640316687'],
   ['151', '162.4086454', '50.14609848', '214.5124957', '96.98253437', '203.7220058', '93.03439141', '14.31991402', '116.8923716', '59.18231777', '43.79189939', '7.761803498', '71.11695775', '166.3671786', '39.31189682', '114.4605605', '65.85022813', '47.59166985', '13.64952613', '84.26409893', '51.08789585', '16.30852507', '227.5955119', '267.4904012', '172.9459908', '97.8181151', '27.03611312', '66.69868434', '212.5911744', '72.2340069', '437.7059876'],
   ['152', '473.0302186', '23.23847804', '182.4987413', '5.633657071', '272.9455945', '83.90664933', '187.1341259', '95.18129472', '29.09052018', '25.25745109', '17.95253232', '183.4962735', '222.1300652', '375.7267053', '322.2303284', '46.28567255', '96.49869833', '148.7141308', '151.5257971', '481.817719', '489.8669774', '22.14355992', '411.4843268', '397.6632807', '259.9291858', '200.9865964', '224.7303184', '475.5507749', '315.2794368', '445.15378'],
   ['153', '38.54990749', '182.2113615', '4.547048101', '1.694720268', '245.6959114', '70.80961546', '13.07844147', '14.05887157', '43.26850579', '5.306940695', '0.41174789', '18.52843633', '316.4461713', '28.63408269', '341.7918614', '46.85365596', '28.9235157', '23.52675798', '100.7819858', '386.4167733', '11.83863286', '277.7714838', '345.0801888', '52.04392527', '131.9730088', '234.8091477', '103.2382391', '132.0294809', '41.44465349', '477.3366497'],
   ['154', '34.05148796', '21.95645886', '47.98746263', '29.35734732', '19.34988', '19.37987029', '24.76601037', '21.16045943', '25.04182969', '102.5838789', '7.864844953', '32.84578353', '24.58696212', '39.64176301', '47.48148709', '39.37519373', '25.32093602', '9.144467515', '46.82432442', '11.74945212', '16.7444413', '22.78774804', '31.46619627', '98.03223222', '25.43529926', '15.27719776', '46.33901652', '48.34319158', '47.34045443', '7.90966219'],
   ['155', '3.967233371', '302.2209741', '10.09757319', '17.74982465', '408.232289', '382.1322974', '24.18101233', '48.10719278', '112.3812246', '33.07258456', '2.387116793', '48.97869393', '64.67120876', '62.11745255', '202.4564035', '70.72178254', '175.2392113', '6.284031781', '221.5393284', '446.5560075', '468.9022785', '89.51115115', '7.988779264', '2.017579507', '48.72534082', '470.1422197', '427.0531306', '1.450267277', '351.2586698', '0.761853221'],
   ['156', '16.13717167', '23.99514441', '5.353658064', '11.65056143', '2.496073192', '4.567378802', '164.4700219', '191.8532366', '103.1379565', '12.40396171', '48.76522441', '18.51667516', '63.06181627', '120.1581451', '28.10846651', '5.960085553', '40.92975907', '113.6325366', '321.9749204', '256.4928297', '263.6966923', '72.91487963', '255.9515014', '17.97386013', '9.694478251', '45.42747972', '7.824476314', '25.24116885', '64.49024697', '35.30421178'],
   ['157', '5.94772646', '5.81762207', '10.16629444', '30.29322973', '10.90758807', '9.253588776', '97.18869325', '12.43658647', '84.65784821', '76.48898119', '14.45659819', '71.51826711', '8.16148252', '21.35692005', '168.0324513', '73.78563646', '87.69812674', '197.824492', '88.69889151', '29.07382848', '20.43304153', '15.286198', '3.161725286', '25.34837999', '6.801932532', '15.76105731', '21.06555698', '25.50139504', '6.615674604', '9.138020314'],
   ['158', '10.76089526', '146.7827466', '2.456707208', '2.87680973', '16.01443472', '16.86514139', '53.21052066', '12.74344197', '197.0495339', '19.06442483', '53.55497906', '18.65474815', '45.28479852', '95.37113249', '77.22270962', '220.6534986', '12.04409535', '3.160067481', '3.026268281', '0.906361137', '0.312670769', '23.94324469', '47.50916875', '16.89048335', '40.07564532', '114.3971434', '52.34378631', '8.388955128', '64.45814172', '290.3012511'],
   ['159', '165.0624208', '282.5823542', '328.9854392', '265.1085585', '286.9047712', '384.0956748', '126.919841', '323.0561625', '390.7091065', '389.2211718', '429.1361641', '445.2743697', '347.9777094', '485.2029557', '484.1977113', '377.1120285', '468.3814154', '323.4800227', '285.0658477', '487.0885236', '471.4331577', '184.684075', '296.8260461', '419.4992593', '466.2065765', '429.4655443', '478.2209207', '332.5748622', '454.7635167', '268.6895545'],
   ['160', '83.60376097', '250.0529645', '130.7896276', '9.013919147', '12.16928788', '8.517899537', '317.484619', '336.8275041', '7.779627159', '19.47767144', '1.469538783', '52.23489575', '300.2567654', '98.61595141', '369.9941', '20.3318927', '8.351611387', '30.27405913', '44.97524492', '21.49751309', '19.02635001', '9.854920048', '269.4711552', '122.4472616', '311.3428031', '49.71098583', '223.5695653', '68.83751552', '207.1289697', '131.7244641'],
   ['161', '6.353067535', '29.49022564', '6.267014211', '109.9353383', '22.38899633', '23.24237755', '25.08923722', '108.5813037', '110.5454028', '138.3196019', '22.98970389', '47.17185652', '80.48096956', '8.390733472', '25.23278697', '50.95903481', '8.875634465', '36.27523532', '56.64015246', '20.37778375', '3.689078859', '50.96056695', '18.90567476', '17.65501424', '24.97998271', '12.8693251', '8.277639805', '36.61474038', '15.7545188', '24.3903703'],
   ['162', '24.34914748', '88.04338266', '5.105567218', '12.75136116', '452.4223208', '318.140253', '423.3432024', '46.14568076', '397.6642784', '4.783609734', '173.3307342', '272.9955815', '283.2051138', '133.7719098', '362.435574', '151.1635341', '440.4501495', '312.3733555', '484.5426998', '357.7573379', '354.157858', '196.5142771', '21.76368661', '43.14923775', '108.1189834', '318.34778', '191.6686742', '9.014959683', '146.0315256', '49.54513052'],
   ['163', '30.66803398', '362.9306797', '123.4423936', '2.660896177', '62.22297503', '14.40744322', '203.7496936', '2.605958913', '31.33622386', '26.98339955', '2.522359604', '58.00387711', '107.2214821', '294.3632999', '388.9698485', '55.94811099', '38.34371307', '29.80562152', '56.1786509', '363.4311062', '31.07011367', '70.533588', '31.77744012', '199.6438917', '177.5466802', '306.3134846', '258.5037214', '11.55960514', '278.3153937', '2.047035993'],
   ['164', '13.49672171', '78.60587461', '59.04370362', '463.813812', '434.5652853', '348.3840565', '34.13238643', '488.334633', '201.2770863', '184.1718235', '186.6074341', '283.9059797', '78.39647635', '11.18794007', '310.9277299', '35.06716056', '321.6483245', '211.7967613', '390.072434', '449.7612645', '180.7738968', '254.7622049', '6.907380184', '198.930034', '105.5922899', '144.1646695', '318.7665065', '34.45465139', '181.088218', '110.7732596'],
   ['165', '22.2087737', '2.007958677', '3.537928701', '10.84743177', '361.5626566', '143.5438825', '1.744114603', '6.665094093', '5.763612165', '18.70499373', '0.459444967', '8.459114746', '6.258619081', '6.272632549', '4.235939851', '23.23012961', '16.1221387', '7.50006062', '13.0363547', '24.99570796', '184.9215341', '6.848713711', '1.682583289', '1.496711718', '2.807692961', '17.49247742', '22.41402853', '2.149542981', '11.73662378', '0.18042868'],
   ['166', '387.9433563', '45.02642015', '423.9179259', '42.80632474', '159.2149323', '51.07713131', '15.83067625', '138.2638468', '5.330298715', '0.400286976', '28.96872516', '146.4146028', '54.42445907', '10.37733685', '45.99974719', '33.06612227', '30.62952592', '0.621390335', '10.96262026', '3.637385261', '3.468862555', '374.3682862', '488.2676815', '379.2566838', '287.5316028', '19.49684934', '20.89536704', '353.8999606', '164.1662843', '359.3870241'],
   ['167', '26.91998286', '1.897122223', '1.58593444', '47.53170326', '38.16074561', '15.22336186', '30.08145331', '225.6186317', '123.845242', '2.685624074', '431.6392005', '88.43812801', '28.98233157', '20.79235887', '98.63971474', '32.08593217', '95.11592261', '79.31286067', '87.22118996', '391.2741654', '106.6319423', '5.645902574', '6.578277421', '340.5622128', '141.5664098', '30.19074725', '140.910532', '39.22779078', '45.35408049', '135.434061'],
   ['168', '6.930122284', '37.19191894', '6.641590251', '5.340897383', '2.225562575', '1.803183806', '5.064766042', '2.422306017', '6.58821991', '0.599610775', '2.058037838', '8.123347745', '27.94497469', '2.956782565', '2.961965186', '8.44595078', '1.026751321', '5.713266002', '8.260973544', '1.677546765', '2.336044428', '6.676533026', '3.498472665', '4.463210477', '9.207431653', '3.68836907', '2.153144666', '8.274810337', '14.15348447', '6.719977551'],
   ['169', '155.3843905', '0.887901739', '5.532604648', '12.24463534', '115.1415022', '20.51857628', '108.0900492', '104.1389476', '21.15288743', '2.656218403', '387.7756857', '9.023229277', '23.2007855', '5.444874588', '11.78870154', '4.342894001', '38.1916735', '15.76561992', '135.30986', '217.2618844', '240.4680106', '35.81808305', '41.59974631', '229.9162592', '14.20352908', '71.06375149', '23.62358179', '63.59408255', '10.27344043', '446.1261907'],
   ['170', '9.51653281', '33.84831627', '11.51225952', '1.861076365', '6.773596413', '4.090937261', '2.1947021', '30.24447376', '3.038919653', '4.899915667', '3.766550424', '5.041985942', '7.198499872', '2.413692034', '55.366368', '11.67569919', '6.800620715', '2.501656478', '1.914383349', '1.791098203', '1.749324601', '7.717545458', '34.57691488', '32.29078879', '6.378464192', '14.40191965', '16.86562617', '17.97498575', '5.015211141', '57.67784946'],
   ['171', '399.7821125', '24.96973872', '92.69671685', '371.1902959', '467.9067304', '363.5137213', '2.344644372', '341.1905664', '5.67952597', '23.46504541', '450.4853562', '17.2005229', '38.47432258', '84.94436444', '18.06685472', '65.6208482', '85.073339', '0.487271396', '6.599455733', '299.7450552', '279.3687851', '388.2760253', '421.8276161', '415.6312898', '194.714828', '207.0939067', '180.8239566', '381.542298', '382.2509771', '422.654662'],
   ['172', '31.40385994', '90.59521735', '399.4674152', '102.9961395', '128.9003052', '15.37756429', '275.0923616', '45.32005148', '124.1849548', '14.46731453', '5.536941011', '55.13810533', '336.8935759', '52.16969073', '12.52381771', '22.95282711', '172.0951296', '259.9414231', '430.0589646', '486.6414221', '455.8027468', '416.8996886', '251.0414451', '215.0111754', '35.79733413', '18.88500294', '7.561575898', '76.14130554', '3.926171458', '208.2940474'],
   ['173', '5.404963724', '5.1720038', '8.076608515', '15.00755588', '46.28716628', '5.260464325', '7.118473452', '115.4536747', '4.232118377', '2.480467762', '7.270428785', '0.455253003', '22.83864387', '5.665297287', '13.67366417', '1.913630822', '1.092727766', '0.766896615', '5.067490359', '23.35980612', '17.16096425', '9.020648275', '235.1897316', '8.584943482', '11.97150586', '17.62325863', '39.75697291', '17.67738351', '34.24742725', '48.44243555'],
   ['174', '16.31987361', '18.07079463', '1.668346978', '4.123436209', '1.978470674', '8.818266504', '8.343042566', '3.090826641', '8.474169844', '6.957837053', '4.114620383', '3.205561895', '7.43580681', '2.90239763', '12.73285764', '12.9356128', '11.47024215', '6.642176521', '1.26628603', '4.022221498', '1.88608429', '12.5008504', '15.4643404', '3.095402231', '1.598068288', '27.23937947', '24.59136148', '12.20290138', '2.264450573', '8.314049911'],
   ['175', '10.0077694', '230.8531553', '28.69923825', '424.5137046', '8.115648852', '47.35517857', '17.99743485', '264.5090187', '98.51933804', '431.2965843', '123.2009373', '31.51052593', '26.98954445', '25.87073907', '87.92000274', '126.4709384', '1.006154848', '3.530245264', '3.510401945', '409.2169464', '281.279867', '47.15401523', '18.58785125', '8.543385268', '24.10698943', '2.918923794', '5.472309533', '8.744521828', '17.30507156', '12.26892285'],
   ['176', '14.90441988', '85.98524079', '18.72161271', '162.6862872', '475.3824174', '283.4233948', '170.8939556', '290.112008', '187.8093917', '97.8148891', '3.833402619', '33.64483186', '445.1632198', '298.7997897', '426.580125', '276.1075912', '31.5363391', '323.0917416', '232.4944979', '445.8812646', '241.288161', '176.9980972', '124.024508', '23.04076184', '164.4816373', '246.1204599', '273.7923563', '31.6598087', '204.075852', '2.841158334'],
   ['177', '0.901582426', '9.045511328', '5.038504605', '0.730854473', '61.49758386', '5.35615206', '13.59687366', '2.50771978', '111.2271487', '12.40784403', '1.961568928', '19.15891711', '225.8012109', '13.55933983', '89.33911268', '23.42185344', '5.348158989', '384.7935961', '63.86542559', '25.77964342', '5.091100097', '3.97264576', '8.551999566', '0.839518711', '16.97205932', '11.34681084', '9.633241841', '2.186936608', '10.77317186', '20.960805'],
   ['178', '331.2791712', '335.6571629', '31.46314689', '119.7945122', '241.8596484', '323.5696136', '98.13050966', '430.3587392', '254.6854986', '17.32265065', '85.76798414', '140.7704481', '350.5431629', '112.4231855', '325.243557', '186.5420135', '343.2840465', '429.9105048', '241.0358413', '8.535654559', '14.53454096', '44.19655307', '321.5780034', '9.639428901', '324.2566281', '52.22356028', '88.57525561', '214.1020427', '477.6951854', '123.3326167'],
   ['179', '11.58719861', '13.57609557', '40.85934629', '6.285548908', '34.08796295', '11.59711371', '29.76444853', '9.534876849', '36.36952905', '24.73778631', '120.8631399', '9.405651586', '40.03122806', '1.075497461', '3.690463902', '7.388394169', '7.860351374', '165.8201085', '55.6793677', '13.93792662', '35.09897307', '6.558930236', '41.84671309', '56.90017792', '68.78655183', '21.45601089', '42.00527498', '11.64212445', '21.62693766', '12.82373654'],
   ['180', '2.22206409', '2.867058149', '3.134985901', '49.13392026', '27.61655102', '2.60424022', '68.66464417', '56.37034548', '9.287903521', '0.243597147', '121.152127', '5.12850618', '12.1219775', '1.249722545', '11.87175121', '2.243030607', '7.050790326', '27.29745877', '133.161903', '119.1745681', '9.555063981', '58.57642163', '83.94511578', '172.0752266', '5.736903908', '6.574180874', '7.20281412', '8.182159849', '79.51451961', '14.58883742'],
   ['181', '1.491641865', '254.9495064', '49.60858742', '39.3636556', '232.0815671', '21.11630139', '4.28103299', '133.9700878', '13.26738898', '1.843645203', '9.207183513', '11.13709318', '9.542367987', '0.25105745', '3.604722003', '13.20011743', '4.342990039', '135.8857259', '10.5747796', '1.241422871', '0.642488508', '9.007024187', '15.27243694', '89.96876852', '6.730113519', '103.2949077', '41.11103385', '4.651314377', '28.82528155', '0.771369981'],
   ['182', '445.4178882', '52.52472861', '369.669367', '265.9013525', '385.6896598', '120.6005716', '256.1761469', '187.4577689', '42.93305322', '3.259686862', '295.556154', '161.2748887', '357.9960166', '7.437349676', '9.657238067', '46.20723876', '37.76224701', '4.16940331', '298.8752722', '14.43967021', '8.313866476', '455.9798877', '477.9440057', '471.6962152', '388.7156021', '108.1462924', '52.85002652', '449.7914818', '307.5416921', '380.6768598'],
   ['183', '114.6171644', '146.7915842', '138.0072613', '230.874041', '77.66497445', '147.1241298', '280.8500142', '342.0560405', '116.2448277', '95.36305165', '315.4842176', '73.6464756', '131.3282722', '105.0219782', '201.6769947', '97.8068793', '85.02436147', '150.8479522', '171.7989622', '233.5855245', '181.3896704', '183.4754706', '62.97405384', '58.54029587', '162.2983783', '313.0527957', '247.793171', '134.442216', '422.2416053', '182.650333'],
   ['184', '51.19129937', '108.5762684', '15.92049091', '244.8280351', '108.7730289', '66.98795715', '100.4202322', '265.8101971', '96.3100297', '2.004977415', '384.7544628', '129.7677923', '76.44819401', '147.7677892', '47.71900487', '127.4602392', '26.01405939', '19.0951296', '47.87827871', '8.847193317', '1.506582169', '49.62052319', '193.3198093', '239.3097193', '124.0551046', '398.1757199', '356.6087963', '30.1696801', '199.5704696', '17.339744'],
   ['185', '5.104848961', '25.56019725', '5.331249644', '142.5390884', '305.3241868', '137.9121679', '2.084569907', '320.6601007', '59.05964409', '303.945345', '95.62078874', '38.13469219', '6.699402422', '131.0431015', '102.2915194', '131.1623652', '6.695311888', '2.092937437', '8.663251833', '443.7211299', '141.227035', '9.684722867', '7.758935578', '1.847049892', '1.863500495', '17.60938238', '27.68848031', '1.596693245', '17.59445188', '1.60614764'],
   ['186', '49.52535558', '330.6003894', '76.29149802', '91.25861732', '401.3890508', '257.0007703', '59.85480705', '34.12333207', '338.7474296', '391.0596711', '7.201055088', '65.58595786', '347.2844035', '227.4286943', '169.1593687', '195.6339867', '229.1977791', '358.909718', '117.2041854', '474.5184498', '356.5009682', '242.3768023', '22.59294295', '79.94641059', '391.3681861', '350.4232803', '420.3665294', '10.68134348', '413.5863988', '2.771336399'],
   ['187', '8.481506958', '49.37585201', '7.92034378', '20.30401062', '16.62238503', '17.86147117', '85.42571691', '13.15733994', '100.6162449', '29.45451545', '3.086534718', '22.05729566', '88.79868424', '8.362589929', '166.5270997', '150.803044', '19.41044521', '16.46026506', '249.7027909', '386.0620322', '146.4276', '168.0930244', '13.89881258', '85.18194224', '66.71884187', '264.6929011', '238.4164094', '21.59908372', '100.5578661', '365.7140754'],
   ['188', '33.50249145', '286.6516074', '46.07155491', '492.4737184', '392.4924362', '388.4360246', '245.600208', '499.1189786', '447.4886089', '474.0052282', '493.032175', '414.2161931', '364.1820734', '377.2753629', '476.0432531', '464.7162307', '405.7080857', '495.3369846', '412.2855291', '484.9352314', '67.0987232', '284.7337372', '27.53787591', '157.4918833', '398.3609162', '398.085255', '469.5475822', '236.2917867', '235.5246485', '332.7145486'],
   ['189', '90.28019419', '42.8062383', '238.7480516', '482.1029932', '46.14155487', '37.72962104', '7.557891767', '493.6722237', '12.63220161', '146.9311841', '464.836168', '16.44820167', '117.3583105', '1.608916642', '7.27912654', '17.46421023', '9.531904198', '13.52758725', '8.302738857', '5.316586803', '0.746324367', '385.0559275', '339.2739713', '170.4886649', '235.1762393', '1.858821273', '6.260476302', '274.049685', '117.9917392', '383.5748782'],
   ['190', '295.8526855', '286.2678047', '6.088705871', '352.8573343', '186.7416917', '175.8357644', '31.70649438', '477.1479126', '134.1570898', '24.885214', '4.050026848', '61.62874845', '71.30056925', '17.94529677', '114.9290988', '31.41042491', '18.16557347', '43.6867778', '84.58676298', '12.52441095', '19.86745932', '38.12722421', '375.5584758', '5.542998427', '104.8007391', '259.2791971', '396.1562925', '268.3471215', '471.8089198', '37.10873918'],
   ['191', '45.74991233', '32.27591848', '50.6636379', '5.317177549', '467.983496', '160.772773', '183.8500723', '32.84419414', '76.86488134', '7.823790064', '14.23286931', '38.53306633', '346.6912999', '12.30093415', '145.2689593', '125.8903861', '440.9922823', '469.2529496', '346.6713068', '62.23112024', '66.41137923', '264.5347126', '376.7941112', '139.8953175', '79.45868879', '168.4322406', '82.62349328', '162.1779489', '11.69654238', '299.2511407'],
   ['192', '16.6241078', '28.64315836', '2.661910305', '163.7815796', '346.1438929', '94.43148037', '49.456883', '387.9017196', '37.1589121', '10.49266907', '4.30548025', '31.4867056', '315.848886', '3.082415334', '16.46638845', '55.36761776', '15.44931884', '37.21743377', '105.5279386', '0.769210972', '0.238043623', '148.8345471', '71.68514106', '27.97463872', '71.71695144', '15.29789654', '97.04772102', '27.50088362', '220.0473511', '10.18620492'],
   ['193', '182.926512', '50.72844733', '14.0381339', '336.4772836', '477.984025', '301.6173783', '230.6021989', '462.8109145', '147.9536571', '40.6876819', '482.1327961', '67.70279168', '349.7914566', '228.7815708', '125.4277924', '35.62064182', '168.0661045', '387.4519424', '361.0096596', '484.9688821', '482.4406458', '388.9378526', '235.9915966', '301.8607082', '219.5797217', '130.7062809', '83.94481994', '86.5815648', '313.2463801', '51.51963605'],
   ['194', '16.64283448', '90.50442787', '8.305531392', '4.146728739', '23.02804244', '37.8118609', '1.007683445', '5.848793458', '7.187112034', '10.12847603', '0.28186179', '4.675486904', '21.15530797', '82.97368252', '12.06817023', '7.189865851', '54.3564882', '11.76863812', '24.63053119', '34.89810731', '1.723534062', '20.4313237', '250.3525393', '15.22192423', '39.46996699', '39.84984994', '55.82916407', '13.38162751', '77.37663077', '76.20483093'],
   ['195', '11.49791177', '174.5818376', '68.00659619', '329.747263', '19.55418722', '36.40546044', '75.29304618', '351.7000414', '129.387992', '244.9027989', '3.792051362', '11.87775088', '22.3233105', '5.12105461', '134.6914095', '32.77962956', '8.902961262', '29.29133766', '24.32336702', '47.62617489', '7.322081697', '44.04516475', '1.996855702', '9.471048187', '16.0943589', '54.76697723', '171.8445709', '11.66502732', '22.03483796', '0.58767698'],
   ['196', '271.8803475', '59.55935725', '40.25153554', '2.44124026', '284.6074739', '30.88814832', '0.53559184', '25.94351545', '1.585504422', '0.181465267', '0.568223504', '7.360100031', '5.020876552', '6.714973931', '25.05381283', '4.066637771', '19.34770152', '1.891485959', '16.71628119', '342.0214885', '169.9663754', '23.83897381', '353.011602', '306.0278357', '6.593553988', '1.421842893', '0.712014571', '184.5211715', '38.79226177', '466.945156'],
   ['197', '13.33975449', '3.821674158', '7.365149699', '6.626836716', '3.644411901', '9.323624072', '27.71633102', '56.72810318', '19.03990973', '1.871081789', '65.23435421', '11.80931938', '40.71084939', '37.11845921', '35.94457936', '10.13190666', '16.92404012', '1.767435619', '19.853309', '15.99166424', '23.33619135', '61.37791015', '25.21082708', '20.19874064', '11.95039114', '24.32715687', '6.830353537', '13.32144998', '11.47208522', '119.922333'],
   ['198', '144.7848072', '448.1742501', '4.016753948', '365.3763258', '291.3346176', '266.3472928', '9.989239352', '424.9522532', '158.942467', '381.5086041', '23.63352381', '7.438965561', '35.17605589', '19.97035893', '6.806090331', '29.56211718', '127.3334997', '251.7205125', '42.32444832', '415.1249915', '167.5895858', '20.30779008', '66.4582403', '4.520985672', '29.82787993', '137.0899738', '87.35399474', '77.25217915', '256.4880154', '14.31979431'],
   ['199', '54.71774945', '4.04032171', '4.757185038', '250.0909426', '146.4976468', '48.02482992', '7.663089673', '220.6420588', '27.60425499', '27.91929061', '86.56970112', '83.40870771', '40.74056319', '14.19246004', '36.6858326', '105.4558319', '8.12514174', '2.450039774', '6.296030156', '10.98559314', '8.712153937', '32.00424983', '19.08315103', '26.81576407', '19.30725755', '36.45985448', '79.09224536', '59.81078953', '29.34262593', '5.903281624'],
   ['200', '230.7217017', '16.30714149', '3.978470503', '37.70547142', '201.1198049', '60.401794', '3.967648004', '388.8774523', '42.31525686', '46.24456876', '283.6197202', '2.778635376', '161.4869138', '20.33894036', '13.68455252', '16.54326516', '19.35214125', '3.924837918', '15.73157603', '78.97001719', '79.4776033', '125.4554845', '185.6394694', '12.30740969', '47.35540618', '2.422819525', '1.223855393', '232.7281478', '132.5307748', '391.867767'],
   ['201', '198.3742623', '453.223799', '181.1496775', '3.262398651', '311.0560609', '193.5366553', '253.1582615', '10.73810111', '350.7074152', '15.79744434', '22.54107771', '368.7527288', '63.77849998', '69.26380586', '264.5205238', '123.2358975', '86.48563345', '211.0557778', '427.0686147', '280.2699976', '93.86781554', '102.4186126', '94.89556906', '205.9404195', '104.3572485', '443.2368407', '224.9534679', '120.6756602', '441.357598', '339.7778816'],
   ['202', '75.88024896', '17.78144978', '14.41053311', '10.22991135', '7.962356364', '14.39737052', '121.6714892', '10.38827054', '282.2020097', '105.4825866', '63.37124344', '59.11035462', '273.8374136', '215.9653', '277.7261856', '90.25805783', '326.8813045', '471.2605275', '399.6205464', '0.401915306', '0.954674713', '113.87797', '34.24761695', '55.92570743', '116.6602533', '13.42357165', '7.834400833', '25.30124251', '54.12292008', '8.189717856'],
   ['203', '12.11944717', '4.166521275', '12.82440712', '4.890447792', '15.02681458', '5.865443671', '29.3665584', '88.89807375', '9.646957867', '1.161356806', '56.67581477', '14.88476977', '32.1691428', '5.214284296', '88.04676919', '2.661770757', '5.677379389', '2.245000819', '115.6147642', '7.865477531', '13.56005904', '29.96568168', '263.8150713', '22.01018018', '12.26412832', '4.556389145', '13.23920897', '13.62997659', '20.36691356', '302.6521854'],
   ['204', '6.123997995', '7.837375052', '0.233185417', '2.746554108', '0.335952994', '0.876351028', '21.00964466', '21.16871684', '44.88593401', '1.314331725', '1.954377431', '3.877753119', '4.89660817', '1.601809441', '30.90391781', '4.55431829', '5.550905695', '10.7958393', '21.09350116', '0.958221851', '0.052731536', '8.035048492', '63.38230247', '9.008697075', '5.561094115', '30.29506445', '53.42151289', '6.273764633', '18.6438974', '31.79798344'],
   ['205', '4.212315749', '30.13277217', '16.54577976', '7.501960082', '5.58588654', '8.375357815', '37.91343806', '6.578611819', '228.4306602', '386.8730553', '0.548859306', '74.6141304', '208.7645748', '23.9432296', '308.0796294', '59.42312099', '193.187195', '267.2827163', '230.3529679', '250.2590778', '225.012563', '14.66170981', '6.564491951', '15.37341078', '27.11853611', '8.935345506', '22.40250126', '7.490852183', '7.998703268', '7.310625548'],
   ['206', '5.51100028', '31.79083107', '16.79413942', '74.67137537', '341.4087535', '153.1730839', '15.84119799', '348.4003795', '74.81058458', '84.16435262', '292.0311428', '10.16440882', '114.1471232', '13.31193902', '39.61171784', '169.3151792', '57.33432638', '16.23447469', '11.632033', '43.70345059', '14.00103896', '74.40731759', '70.71510702', '18.9021503', '164.5784683', '361.5678951', '430.6784574', '4.247980878', '174.585251', '0.754437784'],
   ['207', '5.858334658', '6.968712454', '0.595674831', '108.4237328', '1.630145744', '2.91369642', '2.297716846', '25.56489727', '9.84784354', '0.509958074', '0.469313025', '24.18204867', '3.581982189', '4.286407924', '24.61051917', '43.02243059', '4.878578544', '5.164084265', '28.02116328', '0.251757717', '0.035756774', '5.448385172', '1.97067322', '11.60410797', '3.508054574', '4.959629491', '10.61845417', '8.86373117', '17.51884252', '181.5299775'],
   ['208', '7.238564986', '6.747469568', '78.67589653', '18.18101125', '48.16701741', '5.551678945', '409.615546', '65.19734417', '271.7893357', '4.73805634', '14.8530341', '221.7856435', '388.3162037', '220.5976622', '342.2710456', '39.67272511', '182.7583868', '408.19491', '481.7175366', '447.4116583', '432.8182364', '179.0087141', '160.5638522', '83.10807391', '42.66259361', '7.806123261', '11.27330005', '31.43514859', '7.423969255', '8.712770821'],
   ['209', '149.7462448', '24.39765424', '23.01090004', '470.3106161', '191.4152074', '156.2351897', '55.71759046', '486.1822666', '278.9655561', '299.7691962', '216.458472', '56.03002966', '77.06247114', '1.954635589', '43.31860559', '31.16020585', '11.73380393', '14.78383079', '117.9091408', '39.89457175', '6.874130085', '48.93875177', '30.38235317', '38.91876978', '170.704827', '17.78670277', '90.34244816', '139.2007751', '368.092775', '3.000879235'],
   ['210', '160.8028319', '227.2972015', '169.56572', '214.3021798', '435.5156621', '259.6369976', '238.3909316', '219.055509', '156.8406979', '291.0164455', '120.3783421', '267.3856099', '328.8647007', '218.4355401', '243.6255876', '314.0544032', '211.6979317', '259.4493768', '276.6694074', '165.2513504', '292.6958756', '84.22150214', '39.63727976', '127.2310132', '135.8145215', '103.1132656', '148.8281758', '104.5189844', '140.854025', '279.4550735'],
   ['211', '104.7240707', '444.7653527', '333.6358687', '199.814785', '150.2269125', '122.6333105', '35.69729377', '354.6556034', '130.8189964', '129.2277706', '91.88232806', '49.72552249', '124.5877879', '31.69399176', '76.27602756', '32.14105771', '138.7487619', '188.2533906', '139.9849859', '245.0220456', '182.0127133', '92.75473693', '201.4581548', '64.30443854', '92.62053006', '332.9251963', '355.9652386', '55.47352925', '412.6366344', '21.95639483'],
   ['212', '16.72465272', '211.7582222', '7.541811848', '8.873132303', '86.82837644', '41.51299067', '16.17815953', '9.210354657', '16.17660836', '94.68200545', '81.94475366', '24.87721044', '14.28172818', '4.463415905', '185.5187585', '81.1307332', '8.06072413', '17.87745762', '3.003962183', '416.1833098', '96.86641548', '27.83957525', '1.412401896', '194.71821', '69.15270638', '291.4115678', '242.0808402', '8.939271501', '42.83643911', '145.9646428'],
   ['213', '32.38578831', '44.14119055', '6.009351656', '0.579842011', '416.7732593', '143.0137098', '19.56079649', '9.433170243', '129.4864041', '1.198687911', '4.575382067', '46.85885201', '126.1972712', '27.07549904', '295.9528759', '83.21059767', '21.68148525', '172.8686742', '247.1200964', '68.56683972', '12.72825227', '25.78414264', '83.45546792', '3.444279434', '20.72987526', '372.6429969', '357.5338356', '22.97361411', '201.8117812', '347.0553821'],
   ['214', '0.921798551', '159.0672815', '38.19570013', '164.3251791', '135.3729334', '219.0216611', '111.2683158', '438.3223417', '144.5598446', '291.1976524', '464.1186753', '338.2334932', '61.03389791', '218.3656078', '43.0958066', '165.2989218', '442.3051401', '102.2375638', '443.6368889', '223.563769', '369.1764394', '24.4521714', '4.716359998', '2.993644114', '13.13996075', '40.19261704', '34.5400796', '0.592744226', '18.071506', '1.240881396'],
   ['215', '5.146716445', '11.40177942', '1.865092069', '20.37177314', '1.601531581', '4.806289255', '14.64765234', '51.8738291', '64.57104696', '301.2199953', '299.2567888', '11.67636363', '18.41040084', '169.4719579', '44.2811017', '54.31795718', '22.54500312', '142.4304396', '12.5101859', '9.421026407', '2.324952658', '56.91509814', '27.0649889', '34.90080065', '13.13041216', '18.95936296', '11.45066714', '6.304870253', '0.805344367', '75.97281526'],
   ['216', '9.163569061', '20.30446062', '12.57276165', '44.10683845', '34.1482385', '36.3529195', '26.69686999', '10.06071283', '87.96774794', '21.10225639', '270.8783898', '13.28555801', '12.56025511', '20.37184557', '17.50050839', '53.60278506', '55.15391179', '39.45207644', '19.19997934', '145.2633027', '138.4411732', '25.57952362', '4.989095683', '24.53236992', '34.18801939', '65.51012138', '47.87884987', '9.088429554', '6.750662351', '2.861284038'],
   ['217', '1.322880176', '8.625595886', '2.197052089', '2.196138571', '15.74450636', '7.791050175', '0.772148532', '8.924321088', '4.67918148', '1.230012421', '0.456224561', '1.654306635', '0.259719462', '0.424777536', '3.358220803', '0.691410186', '23.78942676', '1.154102287', '26.03174519', '7.772353222', '14.05142848', '0.637396438', '0.599412078', '0.673484689', '0.123715642', '3.716308091', '5.506533563', '0.426705195', '5.076075037', '0.064314594'],
   ['218', '81.95248453', '36.33288001', '13.44651184', '14.65675335', '471.6862755', '202.4554907', '64.54682053', '207.6808347', '19.53786008', '7.044227731', '294.5801308', '16.02260923', '152.8931435', '8.759727803', '12.80147847', '2.610802607', '7.136853074', '0.482044195', '75.57374416', '362.9569226', '113.0523012', '325.1540262', '410.6168969', '298.8643753', '54.13118458', '19.76191331', '4.574545609', '86.78717993', '247.9880141', '477.9093047'],
   ['219', '9.344999051', '13.91914761', '9.921799778', '7.592551869', '6.922299116', '8.800780118', '125.8769343', '66.91698102', '44.47013425', '2.694939658', '15.64656663', '250.8029652', '2.153935784', '0.914634922', '111.11114', '17.94568797', '19.86593504', '109.0592564', '209.3521168', '185.345171', '27.02470873', '2.689864928', '7.029757887', '260.023281', '12.62694427', '9.199036652', '3.815827971', '14.36360561', '69.41478566', '2.198340493'],
   ['220', '5.5399546', '319.8589359', '0.906717744', '0.431384795', '283.194123', '38.73480957', '1.264287167', '8.906477879', '6.17504197', '0.125224401', '0.165587847', '0.722744231', '31.6399958', '11.05365145', '14.87589422', '3.007755378', '4.355251581', '3.390566751', '3.407618813', '137.2612692', '17.63942653', '21.84419471', '153.4094757', '9.724672042', '9.302439768', '437.2067496', '230.284461', '2.755712598', '334.131028', '14.69877276'],
   ['221', '458.4311522', '468.1870828', '491.7749788', '484.8374322', '395.6239167', '484.7858911', '491.7548606', '490.8934283', '483.2651338', '216.4963062', '495.640606', '339.2210019', '485.5351488', '479.6063462', '436.5764974', '447.4551912', '332.6353148', '450.7404688', '478.305154', '436.8618591', '403.5305037', '434.5327387', '479.286217', '137.8663815', '384.493387', '431.7812871', '327.6089751', '450.4623661', '465.9640307', '432.0538762'],
   ['222', '4.560584947', '5.973671699', '12.65025969', '18.5475775', '1.645745126', '1.452209173', '0.055384006', '39.95481876', '0.193103583', '0.399380731', '1.756735472', '0.2396478', '0.442486611', '0.349196639', '2.694903196', '0.096319', '0.207988976', '0.107548903', '0.453859828', '26.66534089', '13.91328373', '0.296401296', '2.059171926', '6.255975663', '2.36754499', '0.644428687', '2.151922469', '2.030312675', '92.79330855', '2.568167632'],
   ['223', '14.01255681', '122.5936225', '23.52488282', '85.4309753', '284.9129269', '153.4735418', '134.8681163', '252.020734', '352.4836874', '42.61835471', '457.2923707', '116.7087486', '458.7412755', '41.3329691', '23.10772146', '198.1733157', '217.2225815', '462.1065945', '136.536261', '264.7745146', '96.90307954', '319.7155879', '90.57098667', '164.5202314', '217.0392254', '440.4858105', '381.913491', '33.77139688', '21.6189818', '103.4757757'],
   ['224', '390.8329653', '375.7801209', '301.5886667', '122.1166555', '457.6031359', '434.5191018', '443.7922191', '451.4818987', '416.5505497', '389.0068678', '273.3449934', '462.6393645', '480.3347864', '496.8862235', '476.1725575', '315.6438678', '237.1487209', '438.3225168', '468.9653047', '498.2567827', '495.5273874', '258.4824043', '489.8696613', '329.9071074', '424.2044654', '459.3315569', '473.9481774', '460.6249101', '495.4425046', '321.1432899'],
   ['225', '460.6509654', '170.0650383', '461.3749685', '288.8532248', '463.0050019', '300.5289362', '488.0984286', '483.3283327', '458.5023078', '462.448615', '376.0427768', '493.3376031', '457.9648566', '260.1502611', '407.2347087', '427.5415314', '399.0139452', '454.05667', '490.8378911', '499.4208786', '498.3137633', '441.7442609', '381.1847737', '449.4291063', '487.3597174', '246.7279449', '323.7702583', '464.4002215', '464.4520568', '184.0953947'],
   ['226', '306.9158018', '262.687977', '3.867090566', '454.3166299', '193.1741828', '320.2227179', '14.86149577', '494.6690076', '36.31287096', '28.10064504', '458.380256', '25.95129546', '27.46178048', '24.33122581', '61.40595689', '29.21425499', '16.20942539', '2.223354385', '18.69055237', '2.524967155', '0.482156158', '23.76913017', '49.98691912', '6.422427674', '27.97998934', '245.9962281', '289.5818015', '146.3513097', '374.7876833', '176.6557733'],
   ['227', '3.099677966', '21.8198792', '4.777288612', '10.25463553', '267.9507746', '80.94808654', '17.08828254', '15.33549214', '21.04882143', '76.51911282', '71.44931617', '3.582776902', '13.54807098', '24.51017318', '9.742863142', '15.29041521', '230.8592144', '24.65749059', '100.7350766', '108.0131757', '383.9268918', '16.47174087', '6.669516321', '13.85653583', '7.322944904', '13.06730853', '5.14772371', '7.344805093', '9.041461863', '327.9533363'],
   ['228', '26.30231555', '120.9968126', '5.025486968', '38.73444788', '439.2874257', '191.420763', '6.632726894', '350.9192119', '3.185841911', '0.41393749', '174.2645421', '1.252399354', '22.51964235', '9.327512475', '91.77775004', '2.210489808', '54.06442623', '6.392218702', '73.69557521', '84.73583924', '41.68032699', '253.0548777', '15.24070216', '34.30697231', '15.48986482', '180.16377', '19.85576358', '16.57369946', '341.6285208', '269.0399309'],
   ['229', '1.260875398', '23.63362118', '1.585148988', '15.43364439', '45.79436981', '48.2996978', '20.39651129', '277.5665724', '30.480532', '1.33779935', '0.469197167', '31.86727508', '23.99485042', '10.13530854', '265.0428823', '8.100009242', '10.00935453', '283.3787219', '150.651041', '86.51452728', '14.61270549', '3.738329783', '5.41664781', '8.869029248', '11.67330306', '93.78147146', '300.2675237', '9.146788897', '273.4177866', '2.961466093'],
   ['230', '385.0701442', '388.8974539', '412.925195', '160.8835227', '430.685608', '221.1042748', '478.0429856', '362.6868677', '260.9947947', '370.4951317', '225.6069503', '282.0087061', '447.5794376', '227.931294', '408.9791495', '350.5132976', '181.277884', '482.1794824', '321.5494639', '462.6947254', '317.589827', '454.5117178', '374.7180688', '428.2732534', '485.1373504', '476.1388994', '482.8679082', '448.1111233', '456.3079578', '408.928138'],
   ['231', '102.2587918', '27.78412166', '7.442265743', '0.91162355', '31.40927623', '7.606730603', '287.8271303', '0.554623921', '108.1526934', '4.92625771', '0.665529657', '41.51865581', '33.44560304', '29.54113545', '101.192363', '38.4157283', '31.69036777', '42.78699633', '92.64671373', '401.7126634', '254.1991993', '28.06830056', '21.33814325', '228.7542227', '46.9297201', '187.2287787', '327.0035979', '139.2390415', '135.3276621', '12.23873576'],
   ['232', '75.74653228', '363.4313239', '39.31877308', '17.50075055', '263.3553771', '250.4465426', '167.5528981', '86.15117545', '313.6990818', '87.29423025', '388.3810084', '152.077611', '25.59691807', '123.7497359', '252.5014468', '319.7096937', '310.2790802', '424.759108', '54.76820124', '449.0940219', '382.5983383', '203.2913814', '88.90813865', '229.7749512', '80.60524912', '486.0876167', '466.5903472', '49.93442214', '329.8295636', '37.68699495'],
   ['233', '14.91441526', '8.190973703', '7.774207614', '14.8395771', '5.385877342', '13.93030635', '1.039697541', '13.63954402', '36.88657736', '9.944426837', '24.01319284', '9.23316926', '9.269844365', '2.877665461', '16.42722955', '11.35295399', '2.635984818', '18.40286496', '4.400464145', '6.952455957', '7.321953933', '10.04818297', '19.86433973', '25.18117623', '17.60959617', '11.49821721', '3.040502394', '15.69708475', '39.16713491', '3.281624781'],
   ['234', '5.872125452', '13.78709915', '4.762823282', '40.75928577', '18.60964632', '23.80228289', '268.44153', '6.395795886', '93.89424377', '40.52553399', '28.69235383', '17.0388427', '159.7923714', '6.792586524', '94.51952323', '12.94861035', '10.72268151', '25.93224884', '37.41490673', '1.075342554', '7.173849309', '42.49011069', '7.07698226', '33.26085426', '11.1934418', '13.1200915', '15.24088474', '9.166534395', '5.261683583', '14.17612267'],
   ['235', '26.6462834', '33.89024882', '8.767545523', '111.0101797', '141.1723859', '96.92946041', '57.80562797', '80.84807842', '171.0171293', '22.6295555', '216.9035874', '217.8873828', '186.251541', '247.8461921', '272.9478227', '149.6437734', '158.3670071', '401.9702282', '104.3684936', '72.31013474', '17.79676862', '78.40012028', '51.05729393', '175.4669336', '108.766483', '18.59023291', '22.0635655', '50.08587099', '56.73702039', '64.86575443'],
   ['236', '1.022500421', '32.89387208', '22.09873431', '6.177076871', '8.33559828', '64.87782182', '9.216786537', '14.10823039', '134.9239847', '12.02864124', '3.829310019', '3.757179466', '4.378054596', '28.20736176', '9.53114254', '15.73845573', '156.6095718', '45.42233055', '43.56100334', '75.2351734', '317.829525', '0.741479836', '4.274998405', '0.285837575', '2.479183808', '56.03200013', '26.57015149', '1.228727603', '65.08060114', '1.622760559'],
   ['237', '4.469745777', '8.222003227', '108.7033318', '14.6444899', '33.36849543', '7.621934803', '257.0528629', '7.561820164', '16.40053563', '88.4990861', '2.675197807', '44.78668867', '47.88082709', '10.87965647', '12.05675378', '15.98499561', '2.166168674', '5.422021129', '88.73387374', '337.4199109', '226.3452098', '57.37379648', '89.32652085', '31.94034268', '25.97136679', '3.497687749', '12.41081495', '20.73613022', '23.87734263', '1.890333699'],
   ['238', '4.17236142', '107.035107', '13.77160598', '43.53994117', '442.5905523', '135.376619', '30.62054134', '224.6002436', '113.7861941', '2.318201261', '36.33884335', '248.2569812', '124.0256063', '5.867034139', '18.0639613', '30.04296368', '7.767962273', '35.28621001', '44.13858825', '91.13157484', '212.7100021', '39.32066158', '8.962717702', '145.1849238', '69.57136112', '16.93891945', '19.09326663', '3.064319674', '81.87522107', '0.79943762'],
   ['239', '28.34659447', '352.4459183', '4.657818826', '78.07105508', '458.3337119', '413.0048128', '243.8021033', '60.12444717', '415.2412812', '75.73818154', '112.2523168', '342.2885571', '297.6317364', '397.2780013', '461.8984406', '455.1189953', '495.5004508', '489.9175735', '464.3400992', '455.9889149', '454.1582043', '181.420629', '11.97851011', '43.70211641', '78.14525339', '496.7181341', '493.737737', '22.33353479', '237.1798118', '1.644330052'],
   ['240', '49.5513912', '41.85523455', '382.1445249', '50.87898245', '188.4709639', '36.31666311', '165.0602058', '175.0572135', '176.3574205', '7.955377371', '7.944916754', '16.3224848', '147.4092758', '3.197171643', '71.80156367', '129.4740137', '9.86811589', '203.8624269', '25.74229155', '151.1434922', '90.79025921', '33.69789436', '149.4390302', '91.7441304', '149.6850711', '10.33792954', '12.75751705', '162.5392674', '31.02059078', '37.04533258'],
   ['241', '335.5615706', '226.3850355', '98.02355196', '54.23451965', '80.09579782', '22.84407694', '21.46092993', '197.5128233', '9.155479766', '1.545910735', '187.3501422', '19.21632018', '4.659514628', '5.450688897', '6.311463727', '7.487834876', '32.93848319', '4.997707108', '11.55464307', '14.85390428', '9.012553754', '17.51614693', '164.5238504', '350.2987415', '48.11794148', '2.188831205', '1.630035144', '423.6745732', '86.12720699', '476.9569206'],
   ['242', '9.784807192', '44.57064636', '2.881769551', '0.664983568', '370.4100752', '123.100615', '0.124359709', '2.206559638', '1.347291881', '1.975893109', '0.855074465', '1.386955238', '3.34543238', '9.957299877', '14.12885146', '4.538254348', '39.56297321', '0.499162988', '0.797361099', '459.8827719', '423.2474631', '7.043828798', '11.19042477', '5.56206841', '2.690394328', '182.2243102', '45.51160666', '3.79303374', '75.28503038', '1.344320072'],
   ['243', '98.44336215', '135.6207866', '39.92351562', '2.719592747', '33.13632292', '40.16591696', '59.21947476', '21.4539509', '39.18095558', '13.51793557', '9.199417602', '84.20714153', '337.4060747', '45.67000013', '72.29540627', '59.35467823', '322.0686918', '190.4429616', '278.5529564', '13.13782276', '87.28109882', '52.02217608', '301.4282391', '51.71818212', '329.033893', '351.3319304', '295.2641301', '13.38728254', '248.1152465', '53.16992401'],
   ['244', '1.116453432', '20.90360984', '4.796967711', '68.7937494', '195.482194', '58.97574226', '130.647972', '429.0821448', '271.9234411', '4.562416597', '475.3423271', '371.5207516', '179.8108806', '109.6517326', '421.5790334', '214.7114663', '59.23647156', '90.72222465', '373.811582', '399.487397', '297.2923991', '26.50187814', '9.042409533', '5.495327716', '55.12493297', '319.7903702', '237.6543796', '2.321559907', '170.2797387', '3.114200829'],
   ['245', '157.6169441', '3.11643983', '0.858868491', '91.94372842', '90.19720294', '113.0138806', '13.9858472', '220.7256497', '11.68025669', '12.33522498', '409.8505893', '3.396208804', '5.23312433', '232.3499043', '34.8236957', '13.12639763', '369.0673742', '2.264504379', '38.21518297', '484.6031951', '462.3637379', '25.63622946', '11.6419906', '54.86657022', '16.27919907', '140.8910809', '40.11282897', '48.27473113', '282.5135685', '296.4707704'],
   ['246', '492.1322922', '21.80291323', '452.6085399', '361.7130021', '473.8351201', '355.8368082', '10.74003362', '420.5423024', '25.80903406', '191.0177153', '287.0273453', '210.8974185', '97.63702704', '260.8270777', '295.9461763', '152.0923472', '413.9476368', '38.03141829', '172.4996867', '490.5479442', '451.1482401', '230.2383611', '274.6445855', '465.6111172', '182.6068904', '20.94163534', '16.8573072', '495.3400529', '298.8327757', '488.9717408'],
   ['247', '170.7870153', '107.285602', '6.970130902', '161.1905211', '48.37496224', '195.6228061', '32.1507239', '397.5235958', '243.6213527', '9.567661157', '136.696039', '36.78420637', '164.2889819', '10.53884629', '70.35959025', '66.28010127', '157.3557409', '13.97105406', '119.0595737', '35.90819049', '10.65234832', '6.363267931', '13.03782503', '14.92922779', '37.03581754', '190.4711147', '226.983428', '55.47220446', '281.0048044', '270.8698263'],
   ['248', '3.178688209', '12.04242038', '36.50404463', '1.621202671', '8.539598058', '4.761912105', '53.62958502', '2.988334535', '4.40554324', '1.39175873', '15.13236942', '6.364168448', '21.28229787', '13.4376322', '3.36823019', '3.448035644', '8.355417746', '3.17580281', '12.75169136', '10.25868658', '31.46952881', '16.10111355', '29.84874713', '22.10225971', '9.31743888', '30.06989329', '11.33038972', '3.505711815', '17.18994513', '10.33524647'],
   ['249', '47.81153956', '0.850219394', '2.242043682', '0.814017348', '2.962997149', '0.695005556', '2.430983362', '11.18829045', '0.783133258', '0.025663891', '2.300965275', '0.980686041', '11.05178871', '2.684487065', '6.194661437', '1.029318663', '8.052633387', '0.304804807', '3.020858444', '62.55445797', '0.481900394', '9.190201344', '31.19081194', '65.42239932', '11.71490449', '117.1411624', '51.1131726', '12.84849415', '44.16109872', '60.00458144'],
   ['250', '51.0097714', '56.47213923', '232.5902924', '63.8557756', '126.1820496', '28.16829482', '270.2236808', '141.8103385', '183.0545929', '87.21663077', '73.27372908', '8.281106441', '105.6836195', '15.29645981', '66.41583401', '19.33224257', '37.80375629', '33.09602473', '341.5439609', '412.4581047', '164.2725994', '374.4366801', '171.4506346', '130.2687591', '57.5795559', '83.24699883', '45.70820305', '192.7158072', '135.9650704', '91.85145159'],
   ['251', '441.9797851', '87.55008752', '198.8989435', '238.9802258', '227.1029359', '67.68655536', '353.7096738', '292.8834443', '183.3781683', '4.205102335', '214.0759003', '28.04946067', '141.6235149', '20.08500765', '112.7698772', '27.53528494', '5.067509779', '2.081183964', '62.21317316', '181.1866649', '14.37858929', '294.6179234', '465.6041043', '477.9633802', '191.7822554', '195.4039743', '156.4348801', '421.0080981', '468.4345255', '496.9197257'],
   ['252', '82.82171345', '97.83310965', '72.88860201', '160.1367388', '205.6717635', '136.4833362', '102.295433', '299.6154708', '219.0212882', '70.24198617', '32.92211216', '83.59437213', '182.6853068', '94.0070263', '79.51960178', '195.2446882', '175.6186263', '310.9270155', '316.6040568', '52.818873', '38.5866453', '144.8335762', '417.0543947', '68.65553851', '91.21273599', '63.12224728', '48.56009817', '115.6959855', '141.736714', '84.01114674'],
   ['253', '0.434670871', '25.37573414', '0.977124292', '29.70927982', '377.1625236', '91.13912165', '2.565122097', '213.1473507', '12.61435055', '5.130942218', '188.1557132', '8.401961654', '17.90095705', '153.7270813', '51.33980631', '24.18124966', '60.81803604', '7.384230286', '28.97154812', '470.080785', '322.5990457', '28.83124343', '0.233638594', '0.291134066', '4.410522284', '262.476628', '75.22705699', '0.275478852', '164.7185775', '0.252359659'],
   ['254', '11.34258647', '217.6242699', '5.952527043', '16.50952475', '182.4180963', '305.9092911', '77.69974902', '111.2535554', '429.5295848', '137.1606217', '45.56870346', '461.4204532', '278.7636542', '268.9275392', '486.6466389', '434.4017709', '335.6504232', '427.6849982', '404.8730127', '184.9514229', '78.43471902', '19.24400736', '1.825571754', '7.849216657', '131.1466021', '324.6985064', '336.8464307', '4.759920039', '164.639103', '2.901137485'],
   ['255', '77.01241017', '62.44351999', '2.768930225', '50.8321715', '37.27943121', '50.06702783', '457.6520951', '170.392907', '321.1356445', '161.056084', '179.8014444', '371.892959', '205.6487356', '465.8327919', '471.262981', '104.1749087', '284.1006516', '282.93303', '449.6588486', '477.8609099', '456.4275591', '30.54689859', '11.98608668', '131.8103565', '90.74580678', '168.7945388', '168.8961548', '94.77053421', '84.20577287', '150.6818833'],
   ['256', '485.3072747', '473.0875741', '257.7041606', '71.54164645', '408.1878657', '466.2183179', '101.6307527', '450.8999337', '206.745817', '254.2265267', '420.2787544', '29.7269044', '88.50243468', '98.06464779', '193.9396768', '135.1061756', '132.3918811', '156.4215379', '97.15777131', '470.9859961', '413.5111676', '187.4188043', '395.8015779', '113.691057', '247.1140612', '429.366015', '302.8990241', '471.1912888', '486.1662768', '486.722611'],
   ['257', '31.06571665', '7.577774307', '11.13272696', '97.8078935', '497.7286865', '435.9009197', '23.04623349', '109.6931233', '84.77883217', '24.08278616', '212.1544094', '228.5912999', '122.5238244', '246.1280921', '261.3817187', '419.6321013', '357.0923789', '18.58733514', '221.4742701', '489.4722033', '433.835862', '252.0622518', '9.386154959', '145.0679657', '39.0538883', '437.9978844', '425.2698369', '25.11340169', '236.4863788', '286.1240189'],
   ['258', '62.59044016', '19.55596329', '140.5697892', '90.81707633', '79.70158369', '43.40448755', '457.5483493', '318.4759462', '143.8820443', '245.5651472', '83.29929014', '28.92336675', '369.2959235', '48.87574571', '376.7355005', '139.2473735', '43.86402486', '45.77403034', '364.1752425', '113.8374848', '130.4775583', '201.3007337', '191.5464692', '18.22736186', '135.1545186', '132.6415973', '312.8704124', '80.31843631', '280.4463932', '88.0118794'],
   ['259', '92.70743999', '18.19152829', '7.406331587', '3.495400175', '57.28267868', '109.2016839', '38.11286224', '15.74848886', '102.1285415', '8.27945408', '204.2196564', '11.89683376', '124.9719192', '234.8449969', '225.4771567', '15.9884345', '45.87992918', '15.94931953', '83.2295361', '236.4874299', '199.7108982', '40.11441831', '209.9721996', '26.02295004', '32.87700619', '176.9576817', '23.55488625', '64.93382642', '65.12865016', '425.3706607'],
   ['260', '22.93578406', '236.9512833', '179.8944226', '483.0808015', '25.08040247', '70.70565268', '462.8503519', '453.4321634', '424.4746441', '169.8969216', '472.1753205', '62.73195632', '453.8102032', '240.4482122', '35.16840446', '88.37076187', '210.36103', '314.0747774', '247.3826433', '6.714718499', '17.98883064', '388.3875065', '192.4607616', '85.82671286', '280.6730096', '227.1756911', '252.7739274', '40.41989015', '99.61888533', '94.03781281'],
   ['261', '16.06268466', '4.320796001', '1.714547914', '38.89661011', '209.9109785', '25.58789701', '34.17560599', '238.4114833', '29.26074636', '0.396948617', '11.81215232', '51.35048704', '363.6839322', '70.04214771', '16.68058941', '53.41892553', '63.67382177', '235.0523166', '62.2562263', '1.410935466', '0.768086612', '20.12970365', '30.42090986', '3.381894855', '78.84847268', '10.49016985', '21.67128938', '15.38043427', '20.71149729', '199.2537252'],
   ['262', '375.3496064', '455.5450448', '16.15677363', '305.186221', '489.6253165', '480.081068', '309.5703453', '473.4685191', '443.8452085', '66.93955658', '493.8800802', '386.6791835', '442.3871501', '496.056157', '443.8241514', '356.0860305', '398.5531922', '352.1978284', '206.2382663', '431.3399364', '310.9683356', '313.6784097', '485.2552746', '58.71305116', '372.265645', '489.4672651', '453.2300767', '195.0018153', '463.5936882', '249.7473985'],
   ['263', '275.3740652', '55.38681206', '103.1028067', '86.6369832', '37.82425586', '74.1097019', '59.06226096', '55.13616633', '34.19475691', '69.35461745', '176.7312995', '114.0405113', '175.4820906', '68.49837269', '19.18199281', '79.02270362', '90.79732718', '17.5426526', '101.4148714', '29.73059072', '123.106428', '212.3267301', '434.9648041', '182.6829049', '184.1014223', '134.067547', '178.8816973', '139.389983', '37.69793074', '206.0018875'],
   ['264', '474.1387414', '98.96377005', '84.74102936', '490.2563251', '370.3228519', '227.3400573', '391.0596929', '498.2999774', '287.4150864', '108.8037383', '459.1954297', '130.0572714', '458.787471', '365.6444723', '448.20716', '217.6111306', '165.5864702', '329.4291324', '267.6292718', '475.5945774', '264.7067967', '317.8487038', '421.8925113', '398.0726335', '446.213441', '323.4651429', '453.3214021', '467.8041242', '490.2729535', '463.0126384'],
   ['265', '1.632086149', '6.029798529', '1.20862787', '31.59833495', '164.1365083', '18.9263947', '8.691232828', '22.41687382', '11.13296928', '8.070867348', '0.221951058', '28.54441006', '18.8991362', '19.50409677', '235.5838118', '9.783951145', '15.16901114', '255.6722213', '23.51501642', '262.5535139', '20.54136074', '11.88437557', '4.634886268', '5.071472918', '4.619981426', '35.48394882', '96.21006137', '2.283115549', '20.71191271', '1.382105999'],
   ['266', '39.89673993', '99.20665275', '193.7194786', '258.3202656', '40.96649984', '97.12769598', '64.95463467', '242.0266795', '144.4023917', '73.93406028', '178.7669397', '27.24674513', '179.0448281', '151.6554888', '17.94652729', '30.69142933', '201.1166096', '153.7425791', '109.6124398', '254.5622036', '119.1057872', '171.344056', '299.1725266', '132.8059825', '82.98651946', '91.78661775', '114.8663177', '115.3966358', '107.8356833', '105.7941267'],
   ['267', '6.519915522', '17.70540805', '10.75299637', '11.87230185', '6.931037753', '3.563981303', '6.92296079', '7.072133874', '23.06461438', '108.0012909', '2.457596899', '6.864070215', '105.8990726', '54.65250482', '19.73820123', '6.329174598', '42.7498667', '41.83166768', '29.60256669', '22.67025956', '22.04667471', '144.4667549', '22.1412193', '16.13367599', '39.07782547', '4.626228932', '12.34545463', '4.889118812', '53.98796609', '93.35656526'],
   ['268', '339.2996928', '423.1468366', '32.78917156', '12.34491186', '409.5891128', '348.8361809', '18.30726558', '25.26721177', '81.55668642', '6.413033796', '3.400011599', '142.7165324', '341.150024', '282.3849104', '201.9533714', '201.7417228', '394.7519524', '338.816426', '94.17861517', '393.1663128', '451.3442428', '331.6730931', '140.4061943', '11.23316702', '353.1882188', '492.3484821', '476.7088361', '89.73711646', '465.1594995', '8.238000206'],
   ['269', '215.7310611', '43.73320793', '162.4194852', '3.877220202', '400.3912571', '101.8735063', '8.580212396', '7.605479684', '5.858505082', '14.45656974', '0.992653441', '118.6948744', '214.3012908', '62.58800166', '17.41462544', '45.12221813', '180.1243187', '3.515386781', '116.8280172', '169.6445327', '347.1403236', '82.71997276', '448.9313112', '80.51664335', '133.3240458', '55.66258617', '118.2092026', '118.1238079', '83.66758441', '429.9750042'],
   ['270', '1.025321315', '458.4453315', '7.393521648', '22.63424587', '434.9579412', '284.9734526', '18.39951855', '8.877621422', '173.4710099', '66.49345946', '2.305088589', '41.12804648', '35.21036806', '3.688268333', '242.115496', '102.3719725', '10.21527365', '33.82628508', '36.84720144', '282.4528494', '42.79671056', '94.57627411', '4.100495294', '37.35570162', '43.59721403', '421.3409853', '340.2440487', '1.382630271', '384.8028578', '1.601645887'],
   ['271', '366.2354456', '100.0993587', '239.7967748', '20.49137608', '54.98675542', '76.86898082', '42.09782831', '87.27102158', '185.4590195', '76.20445672', '195.9082646', '20.05001663', '362.62919', '55.7527841', '233.0142421', '246.2655398', '191.8053202', '61.57214114', '31.67528905', '6.398712019', '10.32642822', '419.0398468', '472.3907243', '108.7384308', '403.0154713', '107.2896418', '177.433586', '219.823032', '325.3839051', '416.8360405'],
   ['272', '23.02720636', '48.020965', '56.76476959', '7.788571568', '80.44524136', '71.73240062', '24.1360778', '13.3086765', '24.77774932', '7.66028547', '11.51840773', '26.94925528', '39.52943987', '6.958343316', '32.33412673', '34.7958283', '182.779546', '39.6500335', '93.64353914', '23.93966679', '24.28972948', '42.60656176', '28.26450311', '51.2516913', '25.56050757', '45.71744476', '16.46525088', '26.03783275', '19.34050542', '2.309467375'],
   ['273', '32.0764236', '2.234091365', '34.77003786', '5.725767572', '4.339095376', '0.682020223', '1.634226777', '36.29047039', '0.698750365', '0.077470118', '1.943727579', '1.314874817', '174.4965568', '2.836992773', '2.275299472', '0.62421746', '4.147563724', '0.073687672', '4.460506203', '2.15262544', '1.273539533', '166.2282539', '243.6688064', '18.49817106', '55.84008566', '2.413195725', '3.408796692', '23.97744904', '11.42103128', '133.151043'],
   ['274', '9.813860731', '143.9733447', '5.920154219', '214.4017155', '50.19266466', '73.45958369', '399.6909134', '135.7606616', '489.3937668', '469.2622562', '91.68487888', '449.38155', '337.0966331', '232.2623273', '428.3039281', '404.7838088', '339.0562267', '498.4360237', '478.8741169', '2.152505242', '0.471129342', '159.9683268', '4.227710925', '13.79523134', '120.1933577', '382.4795437', '459.0652142', '10.4381472', '279.7892677', '1.948639234'],
   ['275', '119.006479', '455.0405467', '29.94755272', '5.117834614', '46.82884347', '58.53574904', '173.913441', '86.53926734', '122.3911814', '290.7393358', '7.331124909', '23.82677165', '287.360691', '18.53531548', '224.7878065', '6.594081368', '6.470650995', '299.2223578', '93.76221659', '2.135366314', '4.12214294', '85.45812312', '47.03754623', '13.17185726', '104.8003476', '277.1863066', '217.9713229', '54.96678298', '387.8133592', '9.885986282'],
   ['276', '413.3318769', '378.5151368', '255.7890462', '354.8752936', '333.2867449', '194.596286', '150.785281', '367.9583576', '105.7978201', '36.87461723', '334.2165913', '361.9752261', '212.3997874', '204.5773787', '247.7904943', '141.3867804', '202.3953802', '111.642075', '404.2271986', '457.3262566', '357.2224875', '411.7060159', '368.5997627', '467.3625794', '288.8462388', '258.0448694', '91.75203259', '432.813023', '336.5106098', '389.2357666'],
   ['277', '5.752073333', '207.6348957', '6.179429363', '13.12821335', '8.113003738', '11.18737167', '5.416148824', '12.76577306', '30.06678475', '3.100523361', '1.581342355', '8.439192444', '14.34430621', '3.615524874', '4.267033089', '18.7581219', '180.7542228', '159.7760634', '6.718463283', '2.555459626', '2.077241027', '5.189873404', '1.31310065', '6.003664964', '16.65627324', '117.262848', '64.06474065', '2.092109079', '38.563643', '4.012611738'],
   ['278', '376.3900852', '249.3628776', '53.67087467', '19.45998347', '24.66028907', '28.48915558', '64.97879945', '113.4109845', '20.15772746', '1.961092254', '2.455826926', '44.41820999', '197.2151726', '56.25454915', '30.69410095', '10.60199069', '4.329286514', '0.774567481', '22.72184334', '433.8298681', '74.34116777', '330.5012247', '477.9763607', '194.5204648', '244.9003558', '431.3562108', '433.3255645', '294.0376377', '473.3864184', '306.0604653'],
   ['279', '12.18461588', '225.1090397', '0.389199421', '8.445229617', '52.0605778', '43.88159301', '24.32202032', '86.2165193', '157.5260702', '90.62696435', '6.968642018', '37.02780404', '290.7991463', '152.7682016', '289.0126755', '119.0900963', '259.438586', '467.7085475', '42.34975382', '152.3961746', '9.157536708', '48.69838451', '7.24894914', '7.776019245', '51.78848963', '205.8535224', '217.0943541', '6.301834191', '97.17572921', '2.126546127'],
   ['280', '1.24508342', '75.81826672', '7.455060045', '372.5211137', '477.133055', '369.5478677', '95.69462746', '449.7564923', '449.5137738', '282.7951802', '186.9490308', '461.5110809', '215.4468189', '225.6957581', '452.7678554', '320.3359893', '318.0559701', '494.8269745', '480.2257321', '484.474579', '328.5222831', '164.9135501', '2.786683876', '9.716030878', '39.0679109', '380.1291602', '369.137058', '1.224951677', '278.8172081', '0.209280928'],
   ['281', '8.289027315', '148.4120651', '4.429456481', '341.9824113', '486.8465644', '479.1693083', '13.49640814', '454.7241991', '326.554351', '430.9926191', '227.6771581', '352.9134961', '16.14876576', '63.6451685', '423.5444043', '319.2145357', '463.2917368', '413.049357', '389.9486641', '496.0659185', '441.9751623', '6.813122599', '0.201481485', '5.817481909', '18.10721841', '229.701389', '295.0409534', '4.482069138', '240.5169532', '0.409792139'],
   ['282', '447.6825797', '9.767946318', '19.16081148', '22.55018044', '19.79801614', '17.2357121', '66.75227316', '105.8101376', '37.38926526', '1.475077084', '57.34469242', '22.04441164', '262.5180463', '98.56177245', '149.5840725', '99.27682241', '59.7148615', '8.708483102', '32.80009665', '9.435576686', '1.174639354', '398.0463398', '347.870678', '264.2309229', '437.9909611', '455.0093438', '446.7265632', '384.6353033', '452.1453382', '425.8590533'],
   ['283', '0.378968157', '52.38314955', '0.411502761', '337.9002067', '206.2472936', '143.4404197', '2.93879443', '441.3087686', '49.36216401', '126.7200655', '30.42115976', '5.444358672', '8.94800753', '11.8746613', '169.6758354', '21.14400186', '14.63334714', '25.0535985', '10.0512288', '276.9849253', '19.79471661', '35.08283417', '0.109283941', '0.48121069', '5.015438896', '189.6321674', '112.1870814', '0.332710914', '83.23983492', '0.954847064'],
   ['284', '0.349537939', '1.340019736', '3.81395631', '0.72674865', '4.571752625', '1.873333841', '24.79601211', '1.750943157', '13.13960553', '0.39851428', '0.089877485', '11.61048145', '81.43630066', '11.96992898', '183.0309019', '53.6625455', '1.355293989', '23.44020448', '4.842310039', '9.216128104', '1.488725378', '62.03098297', '10.03560134', '4.190106943', '9.523931821', '3.665383082', '5.929445758', '3.406619208', '4.025414086', '5.573794937'],
   ['285', '6.577902019', '83.58612383', '92.71911726', '237.7901294', '453.3914647', '95.41746321', '241.2151777', '355.8140996', '72.79260743', '66.5904006', '307.1846471', '21.28676603', '185.7252115', '35.07003257', '300.8354719', '52.07230001', '177.1961961', '158.5982092', '270.4246527', '479.7936135', '485.2601291', '371.9858625', '15.80560358', '79.63537338', '132.0479011', '177.0231491', '106.3940573', '12.49853463', '138.274588', '2.160094527'],
   ['286', '41.74219034', '8.941016391', '28.54513588', '64.13659134', '70.82338707', '16.44235832', '9.103697043', '380.2829898', '6.237734717', '1.215623365', '375.8657723', '11.41709335', '102.0993731', '161.4414915', '21.74835349', '4.813833764', '17.08108769', '0.285952651', '5.748941053', '114.3752439', '45.00555911', '130.6717469', '455.6157453', '79.51292858', '103.4036644', '30.80476526', '84.63696807', '173.1024311', '20.80816317', '480.0917973'],
   ['287', '1.784604914', '1.680849193', '14.96356199', '0.81376588', '6.582502547', '1.524459427', '18.39259193', '0.27063262', '3.525051589', '2.110022896', '0.374675126', '5.24419547', '19.87144182', '5.06697917', '6.032311016', '4.766863064', '57.46948536', '0.625665025', '19.45237264', '83.10967916', '60.33769863', '111.3251619', '23.6737461', '57.73351603', '10.89971769', '3.693049631', '1.483557289', '2.013426443', '0.412233654', '2.222494963'],
   ['288', '273.3572086', '326.0154294', '364.0479418', '425.0788134', '498.9791406', '488.7482664', '426.0762282', '488.8594583', '307.8562282', '19.42571833', '449.6009894', '453.165108', '313.1575069', '289.7174748', '479.057966', '263.1972352', '48.20975805', '37.31311949', '205.1300387', '498.6536079', '481.4240763', '324.51246', '424.9722112', '489.5357403', '400.4331101', '450.8682128', '443.6774387', '406.0931979', '463.62183', '483.2194077'],
   ['289', '18.44888856', '43.96180359', '1.605293243', '0.147044352', '135.426915', '2.565856505', '5.487656008', '2.278049013', '3.8397512', '0.105485217', '1.995269961', '2.734577649', '18.01713006', '5.385033858', '9.308785693', '1.074903558', '0.364044504', '1.455157162', '12.1541405', '340.879923', '156.8779478', '3.983440519', '156.8100749', '4.444086174', '9.389830363', '58.65176886', '17.76526903', '10.52277333', '277.7404422', '19.03391313'],
   ['290', '1.117862021', '279.2668503', '0.428604426', '11.29770917', '48.99012588', '106.8932125', '5.039973403', '68.60182616', '25.81736731', '1.759431336', '257.6761327', '8.254601399', '5.69503507', '19.05215756', '38.25647019', '17.53181279', '14.09865385', '114.7627787', '9.900822525', '10.14581532', '2.667400334', '0.994878051', '2.367980704', '0.20018344', '1.563046196', '376.0978957', '176.0440968', '0.420729115', '282.5149624', '1.426396022'],
   ['291', '127.5458143', '103.7077092', '351.4488075', '117.3862558', '101.0601772', '146.5836798', '157.5363806', '327.4023354', '145.8729399', '81.5100141', '23.47623354', '91.46561072', '180.4356284', '138.7722345', '70.47648658', '85.72999628', '376.4661049', '51.61201618', '124.0782195', '112.4708455', '103.2453568', '119.7656694', '139.176153', '301.1622507', '277.2527624', '184.8983048', '329.4787051', '103.4350579', '232.2998468', '79.80752546'],
   ['292', '79.36843773', '11.76970313', '4.205614284', '21.21284068', '44.32316953', '22.20189167', '167.1161477', '349.4569997', '173.575989', '1.183469876', '369.9351496', '26.48359392', '339.506486', '16.35211884', '29.38228886', '40.06126555', '68.82594051', '450.6437361', '51.76541376', '21.10553299', '35.70142254', '292.6606418', '105.966793', '150.3862035', '216.0865498', '272.45872', '114.1938346', '63.83813168', '109.6799307', '13.37936677'],
   ['293', '147.4463473', '3.131199054', '37.19226503', '75.84777689', '66.32473164', '10.13880262', '4.447032583', '102.8372263', '0.342906978', '1.366022176', '3.921957389', '1.830776407', '3.357121174', '6.077227245', '5.202188293', '0.59540103', '29.15255753', '0.05033293', '5.214970275', '13.21047479', '11.70761528', '17.55801684', '296.40027', '271.4567053', '12.98562163', '3.744976607', '6.866536298', '11.18111909', '36.89158187', '91.90508464'],
   ['294', '2.715154843', '45.07140259', '1.372378218', '199.0793254', '154.1001744', '58.06463921', '27.30378069', '104.8602082', '64.9441017', '7.340806786', '3.394378396', '5.552213145', '44.3914549', '11.27249589', '15.86151688', '27.54820591', '1.630419542', '10.36492455', '22.23477015', '297.4135514', '20.91656327', '45.35147483', '9.677935915', '0.806727915', '12.93369696', '9.283773007', '13.842124', '1.551841471', '52.68621793', '2.103812364'],
   ['295', '75.95448301', '27.35660995', '27.8329667', '52.40358222', '170.3742312', '40.68909186', '9.282358182', '118.8781621', '10.90203419', '16.14545141', '65.76378888', '23.9136239', '18.35331326', '8.0646129', '13.45826074', '19.23773181', '31.81178526', '19.80654875', '50.31215411', '87.786124', '119.7115986', '16.79021402', '44.91655822', '50.99208316', '26.8673173', '56.98757826', '42.42483383', '12.02232562', '43.48912738', '9.72580773'],
   ['296', '0.927476296', '48.17395303', '2.077118974', '1.80264266', '57.5592584', '26.24630904', '0.269284544', '0.994700445', '3.578289906', '3.077634429', '2.09769125', '2.215768119', '0.653842434', '8.498125841', '0.28118579', '8.075450016', '153.7011625', '6.344638221', '5.807216208', '287.0601005', '177.617202', '12.33348941', '1.150305869', '0.235493402', '0.123862277', '4.057897254', '0.843777421', '0.738529469', '0.742693375', '2.466296261'],
   ['297', '11.81887668', '105.7529856', '11.09977865', '27.87512335', '36.08636608', '103.7391925', '57.61947394', '38.70753117', '63.22514892', '25.08330982', '123.4442668', '13.42179015', '52.96244649', '59.80318017', '15.60159693', '16.29409709', '24.52671423', '21.87710294', '27.94477596', '31.20385752', '32.4596381', '41.99537665', '254.0140362', '21.24811392', '34.13216409', '17.16112194', '10.65987442', '15.43073927', '25.53835218', '132.003332'],
   ['298', '212.5538435', '149.8364063', '20.12510638', '44.06294892', '493.6894274', '403.9879445', '50.3745602', '264.1268488', '101.5048062', '5.580649977', '167.7293314', '148.3208248', '87.38922409', '55.70314971', '168.9127118', '183.4787535', '90.62758931', '202.0431604', '250.2115171', '496.7639905', '487.8199387', '199.1295035', '390.6570503', '122.813388', '96.51122372', '444.7163435', '291.0500275', '183.0632797', '435.6565039', '13.18971453'],
   ['299', '38.01689501', '36.4332256', '240.9548747', '425.9080541', '12.65688432', '18.3720285', '464.4725502', '487.2266828', '205.9875679', '38.29186177', '396.7233292', '315.4974868', '480.6109752', '154.1017875', '329.7658289', '114.2265357', '298.2550916', '493.9428', '477.6337401', '242.4485802', '16.31595146', '474.985365', '348.6962764', '309.8453952', '316.6096408', '252.6390409', '266.529621', '255.1142992', '13.67211936', '359.9299897'],
   ['300', '0.582880128', '91.61509496', '1.531095586', '62.92602988', '220.3528384', '85.5996394', '5.426412249', '50.57649345', '103.1516727', '77.16184296', '27.00422052', '13.53206811', '156.9618486', '45.06388108', '69.21743258', '44.42759687', '32.59678729', '228.3175952', '15.20725462', '158.7745724', '30.798338', '11.32066694', '1.558663323', '1.837104777', '7.104092968', '197.0094504', '140.5030368', '0.770663455', '32.31403968', '0.673618734'],
   ['301', '13.02371396', '133.968598', '18.35816391', '18.67007444', '0.915601055', '2.62417842', '369.4669895', '15.17802552', '190.6774575', '4.991519373', '19.77388132', '16.81987897', '348.4597967', '40.60004493', '90.0821974', '75.84057593', '218.7294012', '162.7918538', '148.3666395', '0.583675444', '0.2484572', '423.8095353', '152.6456356', '27.89360582', '138.7800884', '142.1336579', '105.9429173', '17.7873448', '13.41962491', '284.1052309'],
   ['302', '359.4265504', '102.7450494', '309.1985296', '2.788127546', '20.61052146', '14.71019519', '89.1626091', '56.69152794', '11.73411988', '2.5038883', '1.785150387', '29.7038748', '214.9273465', '1.719550361', '23.33346034', '5.5372898', '4.157965288', '46.68779603', '9.704141848', '0.08788829', '0.279306176', '25.24164079', '456.6589668', '300.7704915', '177.2832758', '30.09751385', '28.63721179', '419.3267903', '238.9030615', '400.2280386'],
   ['303', '497.5324218', '418.3348703', '125.9988785', '269.5017455', '491.041997', '434.7994166', '464.8293336', '355.4404089', '399.6439757', '187.2480015', '285.3419426', '475.3539729', '456.7883447', '478.0067942', '477.9381319', '442.1612274', '422.6382339', '156.0719861', '469.2203856', '499.7231858', '494.159622', '492.8587257', '498.2884736', '495.255977', '476.8519436', '484.478021', '460.9823069', '499.2566676', '483.6899214', '499.6704153'],
   ['304', '21.40835464', '62.34959813', '51.56411841', '147.9132313', '301.5356919', '67.41591385', '71.24554377', '87.4957817', '34.97085445', '96.98250757', '16.01531931', '39.34801523', '81.04929619', '91.75301278', '28.40112643', '103.6196602', '22.55977209', '19.49635977', '20.87521426', '274.1586022', '222.3049119', '116.6702807', '51.31264849', '120.1001075', '96.73817955', '270.0053015', '221.2029408', '37.27135665', '55.21761562', '50.62237657'],
   ['305', '107.6895366', '78.6989915', '30.63211455', '295.0302956', '484.0743138', '303.841503', '455.7596795', '408.8361043', '322.5027898', '209.0780764', '322.012849', '362.0015109', '220.6430373', '99.8268401', '317.3466841', '51.58279842', '39.04102252', '310.5658854', '446.6953686', '345.2082041', '254.5539405', '140.3667573', '111.8893585', '442.6242545', '114.9627788', '46.25572828', '29.44104019', '106.4353831', '322.806721', '393.9530783'],
   ['306', '68.06541967', '4.461759732', '3.040555718', '12.46382143', '286.473951', '20.61623125', '9.533011413', '47.99420275', '6.761399517', '9.586750158', '61.1901453', '2.498944002', '41.15013405', '0.90731237', '4.56111981', '5.312904379', '3.164114098', '8.726458703', '3.951883062', '382.7239882', '46.03774779', '195.1968833', '237.3696838', '105.0180246', '69.85135592', '9.447841866', '10.3162673', '107.330645', '21.71064539', '368.7697455'],
   ['307', '139.3385876', '260.4108955', '414.4348645', '254.0314878', '283.4350071', '162.6765255', '301.1853921', '161.3850116', '19.16979122', '58.55812461', '62.70107896', '218.2359067', '14.15126855', '84.33411986', '45.70199388', '117.6927993', '44.92501848', '2.017345556', '46.8708216', '416.2734358', '349.6110705', '135.5995746', '36.35048843', '454.5491381', '38.60939748', '45.87951054', '45.89916783', '156.5978935', '89.26731683', '116.6345513'],
   ['308', '378.4444032', '2.789715564', '10.52425075', '0.888426707', '287.4133547', '37.85781881', '158.7894752', '0.785044323', '27.29054251', '5.738049658', '0.942837232', '89.55160924', '27.54871054', '54.461826', '175.0429417', '41.44102517', '152.0444415', '15.96128909', '268.4616264', '301.1962103', '424.1256064', '9.682489561', '190.1525037', '453.4343968', '34.01920114', '156.0937268', '194.2066829', '438.63549', '57.09275151', '445.1132717'],
   ['309', '437.6895117', '498.3589283', '446.9658817', '398.0016468', '498.221835', '489.6226934', '443.0884686', '267.5909719', '434.893731', '454.2334858', '251.4942604', '470.4263109', '481.9251671', '477.7477022', '443.5119038', '488.4116083', '433.1139243', '446.5785346', '458.9667702', '492.7382171', '478.0976741', '494.614093', '484.2920695', '495.6575283', '488.6500976', '495.8734491', '481.0925795', '494.4118568', '445.0967733', '484.6359096'],
   ['310', '304.6034297', '408.943343', '29.14265036', '27.03987702', '466.623901', '380.7124058', '318.4163819', '79.69892894', '145.7072139', '34.50640893', '45.1562675', '38.00922196', '367.1500129', '342.2207576', '486.5223537', '344.8829117', '270.3048821', '36.54408601', '247.8040837', '480.545828', '286.2411419', '359.6279512', '339.7600278', '408.7015251', '438.9613678', '466.9154357', '439.8269012', '332.6818097', '491.7272301', '412.6492937'],
   ['311', '30.67508612', '58.4806688', '18.19233197', '3.139773796', '14.54567909', '15.28916719', '467.6823777', '32.37067929', '283.474424', '20.0560202', '200.6876114', '322.1045996', '455.4461501', '443.9227994', '360.7788586', '129.5710207', '370.2829431', '495.6215746', '488.3413814', '487.3638755', '469.7575479', '335.7858263', '265.8788537', '53.71920163', '63.53816178', '344.9745237', '232.3090879', '153.3929282', '48.40203589', '337.5229787'],
   ['312', '23.4425505', '3.002731903', '4.363403679', '4.907743642', '178.5506109', '34.32482413', '91.46871755', '29.65265078', '26.35864271', '14.80619213', '68.42757038', '35.32819539', '50.12467496', '77.13205809', '158.0339496', '16.6990786', '26.16629535', '10.57168673', '78.11534678', '263.6802244', '243.9665409', '40.30326503', '44.64383124', '95.29561402', '23.99317981', '301.7246403', '132.5211986', '21.3356089', '66.08337534', '15.8911548'],
   ['313', '2.924615568', '230.2765104', '10.18954367', '277.031113', '163.3649011', '141.5276299', '4.423057115', '461.0718463', '27.39728654', '0.825832152', '94.79869375', '21.71595725', '106.9389705', '43.01988127', '82.88408314', '14.49221935', '428.4849547', '262.7782295', '172.486909', '396.3314285', '313.4761059', '84.05799443', '10.60511047', '8.161984056', '13.08664032', '129.4374138', '38.99682354', '1.948811579', '152.5957923', '1.724938717'],
   ['314', '65.70091582', '147.7638306', '12.28977127', '160.1643499', '58.82627271', '77.34022322', '24.90647069', '31.7875728', '179.008233', '21.46029882', '183.9966104', '57.96870503', '93.33142958', '219.6569722', '91.13302694', '100.0003539', '71.12945754', '74.79599089', '110.0419156', '138.2230832', '121.6498376', '196.572433', '100.9086716', '19.85780345', '46.81890591', '188.6617361', '72.67928496', '22.56872346', '78.78548606', '11.95958469'],
   ['315', '283.2753921', '59.88240131', '354.7320453', '65.91132139', '352.3063154', '64.32182272', '132.2880921', '270.1328247', '44.67655805', '26.66379041', '468.8065399', '18.41141349', '381.0706082', '15.15462959', '66.00371437', '8.664115071', '4.18409198', '3.442976693', '30.35017892', '370.3313913', '279.0248959', '477.277545', '377.0427222', '483.9773078', '382.8912772', '307.1105748', '164.8296367', '305.2488296', '192.8967015', '468.5773991'],
   ['316', '104.5741526', '12.10559251', '4.424118298', '269.5219029', '318.0707605', '94.38793001', '79.62762526', '67.7883554', '159.0858985', '19.36252259', '18.28870496', '68.04892524', '41.33430436', '51.76306823', '69.10140101', '267.9751232', '228.4763066', '387.4641401', '144.3406213', '17.21515004', '28.64474455', '7.730068706', '1.979259548', '43.82496368', '61.45027781', '93.45171241', '248.6547442', '47.227806', '222.4256502', '122.1809203'],
   ['317', '11.78810562', '60.1828981', '1.389788364', '487.0108294', '2.186756178', '54.48861402', '158.0726151', '485.1049558', '337.3819574', '384.7919396', '475.2714841', '93.95940998', '245.7096533', '326.6202409', '211.4627845', '71.96533668', '13.75441108', '49.85046332', '35.36961052', '24.80038368', '1.336150542', '228.3172556', '14.04711201', '21.65041657', '157.7100742', '15.78664258', '48.77692803', '9.385823372', '144.6362295', '8.815682153'],
   ['318', '194.5229199', '138.9823735', '190.915474', '117.3247024', '89.47723322', '162.5139368', '27.36597503', '254.4490338', '146.4926248', '21.91057183', '360.1514694', '199.6329212', '165.8894626', '77.36422974', '105.3394301', '174.5837992', '270.6068609', '82.67525381', '53.28005691', '66.24219071', '33.45511166', '154.2939092', '205.8712167', '149.9566825', '243.3524391', '160.7911767', '41.9742641', '82.91601225', '212.2388598', '69.20208216'],
   ['319', '31.0506903', '53.44706944', '427.8542622', '435.9307475', '78.41879045', '108.7647952', '5.419367447', '451.4902599', '98.06169699', '18.82676483', '226.868175', '60.17004751', '66.79741105', '61.43911204', '91.07094002', '158.9384109', '333.3635654', '42.76467352', '164.5791602', '471.0501689', '360.9111561', '287.6696313', '189.3487277', '24.45855264', '52.32743799', '143.2709462', '248.0245933', '48.49013946', '44.10335397', '146.2767192'],
   ['320', '24.47869994', '12.53941', '10.41606369', '117.9100662', '39.93765833', '59.43128945', '170.1337826', '213.4620824', '283.4136906', '54.01307265', '52.94148365', '374.424277', '392.4866912', '371.2628138', '462.0510592', '222.8958359', '63.58510177', '355.4430551', '395.8938743', '469.1540122', '147.4548852', '96.78798438', '51.18710562', '13.79797088', '40.20253282', '294.9645371', '249.5083676', '32.22794425', '76.72691614', '144.2456966'],
   ['321', '350.9771801', '293.226521', '466.8701314', '488.4659414', '35.2774255', '97.10588193', '462.4566942', '498.1113742', '387.4972878', '247.5861365', '496.2359152', '265.5643985', '449.7688262', '323.7762155', '227.4024777', '47.04552077', '30.79786721', '8.190271394', '235.7331107', '440.7727984', '81.51358895', '468.3778213', '494.956808', '414.8127481', '457.3926878', '394.7413574', '430.3527541', '400.6258044', '421.8326895', '447.6858356'],
   ['322', '194.9203767', '341.1788289', '42.07032922', '44.54116486', '38.20434546', '91.92158527', '148.5801779', '269.6718179', '383.3792759', '188.7493181', '182.2455668', '30.69620251', '175.380655', '58.24288507', '25.40963065', '35.92424545', '37.92556672', '72.03772549', '230.6101642', '366.3777737', '193.5882524', '66.39590556', '8.137981515', '10.37398741', '225.8354771', '439.2972606', '374.9016283', '87.94783919', '468.952656', '21.58936935'],
   ['323', '188.4420233', '14.13133832', '190.4982059', '13.7344397', '165.349031', '12.60316482', '426.2281063', '69.66023201', '425.4451939', '10.51183857', '37.49238587', '144.6893716', '462.6698699', '191.2757672', '271.8374985', '155.0107332', '6.80480041', '166.2204792', '355.3042513', '431.7509003', '244.1001059', '296.3285969', '443.3362689', '283.0164878', '330.3023843', '57.97793372', '188.1787032', '405.9903577', '341.6234874', '371.7324309'],
   ['324', '107.0954182', '12.46036808', '19.98627095', '102.3377791', '332.0398001', '51.58665088', '58.41005378', '66.76005612', '11.53903952', '3.348235785', '85.44046854', '2.511244092', '83.42802198', '13.78201707', '66.21043898', '15.70967177', '33.40317938', '3.438275251', '102.0043301', '422.5304941', '19.97366422', '360.9399681', '67.58618963', '236.7983718', '70.95352992', '149.2333832', '95.29334096', '25.6227298', '99.78305773', '342.1399737'],
   ['325', '442.783859', '87.6301906', '9.651130395', '35.00827278', '321.9371211', '209.0042694', '11.22603643', '138.576717', '126.2415816', '64.37839735', '4.598932271', '68.82406299', '166.362097', '228.1953055', '185.7871302', '284.8195884', '67.10072751', '29.32589207', '9.192057491', '342.0329676', '196.2329616', '50.93110906', '29.04060079', '49.37470114', '222.1607346', '386.8504887', '371.5931407', '419.4575942', '462.3934622', '473.8415862'],
   ['326', '52.14379498', '198.862464', '31.54626277', '2.907155471', '169.3217613', '30.99462591', '446.5699248', '15.42207923', '33.83401175', '66.62632945', '12.69779059', '53.29435798', '345.8778275', '97.20299692', '62.37830651', '52.93228714', '59.82994732', '11.4379543', '192.1036695', '266.7316753', '91.50720461', '388.5802519', '403.6097503', '416.7753808', '239.2114167', '391.7925523', '260.2864421', '271.2059509', '210.843418', '477.3887209'],
   ['327', '12.37562881', '27.18280117', '0.490971363', '1.473023196', '283.9016656', '83.5083033', '2.827360084', '18.64226086', '2.659616274', '0.240934859', '7.229224542', '0.430366071', '109.3852711', '9.836814969', '14.213007', '2.666556661', '12.60011657', '2.085323148', '1.896122034', '270.7230569', '189.8244001', '19.75691512', '28.69256756', '4.542328734', '110.9718967', '374.701975', '138.962338', '7.507510969', '49.96335284', '16.79485714'],
   ['328', '446.2458533', '353.1533526', '42.39236739', '358.6467126', '477.5796037', '448.4537962', '291.1969799', '439.1863916', '424.2066871', '450.1089659', '490.1252686', '89.63412377', '455.0286903', '322.9860173', '438.722518', '333.831783', '36.40532486', '43.97794218', '133.0856817', '440.5527874', '313.1585766', '409.5253295', '460.0079794', '308.5364511', '363.5703239', '485.187958', '456.4786929', '428.4483851', '482.9610302', '475.1869583'],
   ['329', '4.217484063', '164.520829', '1.707947264', '85.41310001', '27.43946593', '227.443846', '24.34449987', '257.6855406', '444.003202', '331.9937261', '2.769424888', '47.5969581', '170.2810389', '200.6017954', '245.3800578', '307.1016299', '164.7816285', '157.8105787', '153.087627', '28.26116126', '19.80802987', '5.68671163', '1.815405402', '0.252613902', '20.19431945', '46.67553134', '47.97303636', '3.701285711', '132.5677795', '6.127353449'],
   ['330', '5.825425314', '1.820698733', '4.056308096', '101.3195103', '292.0352317', '52.98513559', '0.638022385', '38.387419', '2.929399735', '16.7944887', '3.434656676', '5.302841346', '2.82322348', '11.4504389', '8.835772496', '32.21877305', '12.04026529', '1.9811957', '23.40322041', '449.5003421', '404.5674681', '3.799735894', '1.435825298', '5.648954658', '0.975360484', '10.47256438', '6.415640158', '13.01096377', '3.397229164', '7.151921016'],
   ['331', '219.9731524', '430.2511886', '133.5686016', '400.6510185', '476.9401705', '385.7778569', '301.2561533', '421.9473791', '108.3782912', '40.27921656', '72.70223265', '65.1646076', '297.7684375', '175.1096035', '87.38916685', '94.82120889', '74.44544209', '326.4712023', '248.2555099', '168.6314313', '176.8445669', '351.1497869', '389.442811', '234.7100806', '207.5993124', '356.5244013', '386.3406096', '272.2595239', '353.0021418', '276.4566065'],
   ['332', '316.5774155', '359.8324592', '89.94359876', '3.782376543', '25.36009817', '28.75155454', '11.42458345', '14.15243645', '11.29529633', '7.900947464', '0.384662742', '10.05371998', '78.80055056', '31.74152732', '180.0273368', '13.28426076', '13.04986862', '26.04277123', '8.393788927', '49.91321619', '17.55328982', '127.6410669', '436.6081695', '188.4827651', '219.5601748', '93.56977814', '86.83513298', '317.8596481', '415.2026961', '36.11808367'],
   ['333', '136.8974403', '38.11689021', '12.20158755', '192.1792701', '473.4189744', '340.1984462', '275.1923278', '282.2659088', '347.5171425', '261.1382755', '115.9272337', '328.7973125', '263.6072028', '34.25363309', '239.3439618', '345.9890711', '47.95226776', '411.4987868', '182.2141184', '10.68049323', '32.50261393', '88.03739259', '99.0426363', '25.3064643', '121.0902396', '77.33637996', '241.2281338', '134.8740296', '36.89132527', '5.880515373'],
   ['334', '414.0049845', '352.9544398', '154.4340635', '163.9221114', '252.7627602', '166.2391395', '67.28551332', '188.0720831', '320.6980657', '61.16919909', '129.7344957', '263.5979168', '311.6545652', '298.2618962', '161.4678022', '254.2348008', '379.9221205', '62.60673479', '175.1582372', '468.7129107', '407.9529535', '429.30076', '246.0220973', '376.6301919', '374.62159', '323.231085', '274.3815948', '374.7398739', '301.7631511', '232.9534719'],
   ['335', '2.973992485', '29.5027778', '0.574305787', '0.454030132', '1.560293271', '4.050117581', '29.23726723', '0.496114979', '23.31599001', '1.577971298', '0.140485653', '41.45714069', '92.92794161', '113.8521053', '153.8736277', '17.3491771', '15.35246546', '12.12301735', '10.44889954', '17.47978256', '4.990900735', '73.4896448', '2.804706356', '7.513071315', '47.42684313', '295.3141875', '204.2938525', '2.461209344', '88.63151053', '6.776853659'],
   ['336', '48.79102402', '159.4562325', '98.16958932', '5.197217991', '6.65528436', '4.598343801', '20.42141348', '36.62403395', '24.69127494', '0.42467865', '12.68743317', '3.299742861', '61.4651472', '3.830952316', '118.5707294', '2.912073642', '4.645039014', '11.37280459', '10.2787042', '31.85964232', '12.47569724', '248.6122708', '398.2508021', '302.2526984', '140.844184', '447.5280369', '413.7367712', '60.5501783', '374.0260221', '121.9054976'],
   ['337', '29.3713982', '50.97599739', '13.80170039', '6.029618161', '24.50164086', '21.01661807', '33.87094748', '6.137540366', '28.12974188', '80.23582535', '4.365273955', '25.90288002', '2.241547688', '16.10129966', '49.85673189', '48.08649732', '6.478983037', '7.097687707', '17.2247144', '196.0753719', '89.14836709', '27.16834403', '1.513939661', '8.776518883', '4.21921997', '45.54648978', '6.323717016', '21.87802567', '37.63090504', '47.07533427'],
   ['338', '8.152262907', '17.71743163', '11.53950975', '3.481599587', '1.857170453', '5.58886162', '3.004296597', '3.382424287', '13.17210499', '17.86794534', '6.400587261', '9.572088221', '5.466512525', '7.988979775', '24.43449686', '19.83604568', '11.27064291', '6.144713347', '7.777657912', '21.39102871', '3.930244445', '3.896423473', '3.571206243', '8.694736567', '33.87489436', '69.29684936', '44.74152112', '3.17085035', '28.17405392', '16.45427999'],
   ['339', '7.624854848', '270.9418894', '30.35255977', '2.034923747', '38.51972354', '31.07408211', '41.47574407', '4.237685232', '84.41464592', '23.71325068', '13.27224742', '382.5504433', '320.2758402', '147.4060415', '154.3227934', '195.9960405', '24.4893451', '219.3604654', '177.2232798', '366.683104', '304.7342759', '115.0123983', '23.78861924', '7.021771766', '194.2993011', '45.07610709', '56.85093678', '4.527095937', '343.5681889', '0.808335242'],
   ['340', '105.1536728', '25.75187142', '55.67467721', '11.96413007', '177.3285033', '59.24763773', '23.54659187', '58.73436147', '36.8924269', '93.75148468', '197.6739038', '41.5040962', '126.0899577', '164.9599482', '74.35345625', '72.09710774', '56.56834702', '166.7483221', '47.5910903', '403.6346462', '224.0487858', '57.42314912', '121.0884123', '49.45725103', '43.90827709', '43.68628495', '13.32610184', '118.2939008', '59.01221408', '243.5021784'],
   ['341', '83.12530989', '7.012697818', '245.6652829', '40.42933735', '15.19420199', '22.55371232', '32.98092071', '39.27513048', '26.24290024', '115.6491309', '6.84894155', '19.23405363', '189.6437653', '143.7205539', '103.9173681', '58.48194473', '26.95953595', '149.5483455', '116.7016186', '324.1563804', '232.353439', '46.00331898', '12.74252561', '5.728040251', '30.12614343', '124.7541559', '196.4318632', '74.02390158', '47.29431725', '186.9957749'],
   ['342', '9.558532696', '22.80794967', '22.11396577', '347.5443573', '454.8167259', '333.7170963', '2.555617554', '454.7237267', '7.328446039', '0.487770576', '490.4129352', '127.2201624', '13.13614932', '17.31590074', '21.00801835', '18.25768572', '123.5596018', '0.433314739', '6.469570189', '374.1097906', '123.9576605', '47.78129596', '25.37220707', '166.0690761', '65.22252142', '277.1163513', '123.21642', '2.548563144', '156.2325582', '7.022211158'],
   ['343', '108.3866939', '3.183538818', '14.62128631', '104.0643205', '9.704772201', '23.61349346', '21.9954764', '177.9343448', '109.1575775', '8.599799748', '452.9075082', '17.94055091', '7.34464128', '6.593662201', '3.828085682', '13.33017108', '4.688651065', '1.565844085', '7.805659558', '35.70855151', '63.83275517', '28.03281478', '86.68389576', '280.4048871', '13.93585713', '30.52583574', '10.73362056', '73.07050817', '77.11138325', '164.659996'],
   ['344', '145.7967035', '43.97348803', '71.96318533', '66.24914025', '109.0363458', '41.46207929', '89.43354234', '141.5583518', '70.73454731', '25.17584494', '59.29421717', '62.01827795', '59.80683271', '93.60721612', '67.60012511', '72.54102838', '255.1598872', '13.66104945', '69.89554287', '155.8628651', '55.42198891', '56.95720528', '223.3524913', '236.8468842', '48.51864115', '172.0946749', '163.1175292', '199.7566252', '67.79087656', '68.95295698'],
   ['345', '44.93680838', '56.41523616', '58.88230337', '53.6870515', '72.10814555', '25.77767038', '64.9443146', '19.00377668', '38.78735638', '162.4689668', '22.37665902', '13.73831842', '81.42153335', '10.68200579', '28.83040322', '26.19548412', '2.806333315', '38.32164002', '48.67828818', '175.7761807', '47.06691357', '35.2840181', '15.77836331', '27.691662', '27.23065858', '16.7337637', '23.02506187', '38.2374177', '11.75086419', '65.0257946'],
   ['346', '18.18529989', '86.40313677', '16.04663388', '8.145012933', '42.79679103', '11.42487407', '7.680794622', '6.933070745', '20.0260776', '2.519929241', '2.110110159', '45.01438222', '16.0393702', '32.95091537', '9.308657191', '32.53567884', '47.0956015', '37.03659646', '39.96926836', '7.588632587', '11.04949398', '12.53597411', '38.86221139', '14.77548077', '6.675394821', '12.26625189', '4.431560808', '31.16256698', '40.69422656', '13.15668629'],
   ['347', '131.6310143', '91.42968545', '70.03045764', '69.21907194', '50.55873003', '96.20936306', '152.5803443', '99.98433341', '78.8947907', '98.5501134', '136.0177973', '124.1003714', '154.8849836', '278.6143568', '133.8225382', '76.6563984', '181.8226953', '26.19199547', '51.5795939', '248.7078904', '102.8698104', '44.90842985', '202.9763528', '28.34574179', '85.11711589', '162.1350148', '170.3233803', '61.16281602', '235.0751185', '35.61938407'],
   ['348', '461.3538634', '175.8203969', '427.6488323', '17.93942676', '45.1131636', '35.75921348', '469.9277854', '30.17123767', '117.6593879', '3.946592493', '221.0421795', '147.7709938', '422.935017', '123.6714992', '119.7386707', '189.642952', '212.8758728', '126.5465195', '282.062297', '8.250749571', '90.4752059', '362.8158522', '493.5382545', '385.7155149', '236.8488921', '70.67716408', '11.38608988', '470.4095298', '74.92153837', '494.4331206'],
   ['349', '14.74212794', '3.844555548', '135.9804225', '50.57711843', '11.56828679', '6.160904985', '149.5567977', '277.4702713', '45.52178669', '71.86475687', '229.134542', '196.9635572', '254.3560014', '64.89218502', '72.68701399', '36.77176209', '16.36570392', '40.17864008', '230.3594216', '35.8046115', '2.533618757', '284.0521789', '22.33907355', '406.8174412', '208.7212785', '385.0398473', '412.8027111', '10.33665492', '44.43897713', '10.19728332'],
   ['350', '153.0153437', '32.98362907', '75.66925666', '187.8548538', '45.66894601', '55.35703829', '21.77006804', '136.7657846', '21.0609661', '157.0340518', '34.3256848', '13.62986964', '54.84148462', '22.64634751', '36.21861098', '29.93658236', '8.569082132', '26.50430306', '31.78176207', '24.99686642', '7.911150454', '22.33724507', '47.15955805', '30.80623173', '66.08082462', '19.02760295', '70.41599592', '114.0780143', '21.89818676', '79.18604494'],
   ['351', '39.3051215', '40.68596902', '21.90393661', '30.20443449', '100.9334298', '47.68337344', '1.349336245', '17.65858827', '5.45745437', '0.86683704', '5.535694747', '13.07938931', '50.05436936', '320.4678723', '142.2287692', '26.54647997', '183.1173864', '113.8374316', '3.67199869', '144.8733901', '228.6771975', '59.90873026', '167.2631675', '28.49627484', '25.69566408', '229.3137283', '221.0504004', '17.16265029', '153.5093152', '7.327018945'],
   ['352', '51.64689949', '145.8942695', '5.811146809', '95.32811661', '165.1308499', '117.5921619', '8.999781643', '266.1969514', '10.8968659', '24.50322844', '20.27916714', '26.85329148', '100.9943376', '142.7930549', '30.78832822', '96.35994624', '152.9088717', '2.216746855', '6.547384144', '3.148122299', '13.0983368', '83.66696856', '151.3499343', '10.36151498', '98.43898511', '84.27339946', '95.74357912', '20.04672569', '176.4868733', '24.11825277'],
   ['353', '2.271955879', '356.4800574', '21.22581867', '168.7363092', '100.415224', '34.72762863', '14.94175519', '172.0021121', '43.86551335', '362.7930946', '1.436943622', '58.43436503', '15.73987104', '12.36256964', '50.79844699', '17.14092516', '2.116339861', '0.796549377', '26.48139756', '366.0247407', '23.73267979', '32.43820239', '2.555390554', '54.85467783', '34.69709786', '170.642945', '165.8103131', '6.145794134', '294.2780566', '8.116844892'],
   ['354', '4.037059488', '64.57823045', '52.30090651', '66.70540709', '68.97028047', '34.12308851', '39.76170338', '84.23155405', '32.98393576', '3.677219836', '34.7141825', '21.8214862', '60.72019735', '76.54713968', '9.516021211', '9.448139244', '21.35493054', '55.68979566', '32.40114926', '138.0591938', '17.99689046', '115.5654564', '87.91316769', '25.50223285', '13.78129773', '66.21246909', '17.40931338', '4.846225233', '13.88096333', '21.38117588'],
   ['355', '123.2586719', '50.43893458', '58.73350645', '226.3514241', '59.10255943', '93.77166828', '417.2967785', '335.2065802', '357.2346684', '90.04389611', '361.9571562', '108.7010941', '474.0667043', '40.95946706', '148.7297792', '62.65750922', '12.70873073', '141.5056648', '325.601609', '83.50894226', '5.650581133', '439.705648', '356.9828241', '214.8130982', '295.1908828', '421.1526615', '431.9675579', '231.6181173', '76.22299822', '331.9575128'],
   ['356', '41.78669428', '78.69402864', '59.83054184', '184.7241618', '147.3718917', '31.92400888', '158.9504213', '80.09569589', '29.76860875', '165.9887381', '132.8048141', '23.07398248', '88.6034353', '23.23350363', '65.48442955', '19.43821217', '1.410903549', '18.23915438', '14.250731', '17.92381543', '19.55502181', '160.3209626', '45.27844468', '26.68269137', '52.23381167', '16.43491255', '27.23823909', '29.88295099', '157.7152168', '33.46259868'],
   ['357', '2.605293141', '3.561500105', '0.27721612', '0.01796257', '2.484021601', '1.602484694', '1.241031614', '0.028605429', '6.835990037', '0.372674218', '0.036279782', '0.727455602', '12.27009008', '4.487038281', '5.58475853', '12.29302372', '125.1047696', '220.5510028', '2.558550048', '0.305367838', '1.894540113', '3.090024664', '5.232785358', '0.59209714', '1.009685593', '23.6905362', '7.900164623', '2.04586709', '5.080777474', '13.58967056'],
   ['358', '2.83561407', '142.598766', '0.919531126', '214.1137364', '1.370147074', '9.42411407', '411.0911626', '95.24596046', '418.7268715', '71.14109973', '69.64978764', '337.0554637', '41.18647311', '19.86595447', '329.2197462', '105.6483146', '30.79356267', '458.0752501', '255.709239', '289.2569269', '93.70904913', '11.48888798', '0.661007018', '10.31984853', '29.19698455', '88.69662394', '165.9284643', '3.339140794', '40.14886889', '0.84265017'],
   ['359', '136.9643195', '105.6788523', '3.074966552', '75.45705509', '163.4357615', '44.20818324', '77.14913146', '81.77519159', '19.73446682', '1.20508524', '130.9997574', '159.7520885', '7.827739135', '33.92422692', '259.8301359', '61.82588306', '104.0619492', '25.08678001', '68.27807981', '247.3723157', '232.1106077', '12.03612352', '5.121595808', '98.85324208', '22.92555295', '403.020933', '414.4346405', '19.09943822', '435.9968437', '0.994815676'],
   ['360', '21.80090588', '3.989397757', '1.562794205', '14.54615448', '46.85438087', '10.99811567', '288.9320444', '11.82539935', '105.4541323', '12.56605249', '5.679844589', '9.514100696', '15.72398304', '27.87997205', '157.6985093', '14.42162516', '16.01653236', '0.5107782', '211.9477612', '2.322091211', '0.516718116', '15.25255328', '5.10043681', '105.4421842', '17.09309235', '11.26125171', '18.44248714', '15.2236183', '179.178449', '330.5263737'],
   ['361', '18.65415707', '9.709433479', '5.135423733', '8.874040375', '143.0803107', '92.08968932', '33.42252739', '28.05253018', '4.737948495', '3.248819245', '1.374720952', '254.6042879', '7.384904832', '9.933901107', '336.664148', '53.15546796', '66.91016052', '3.941591653', '67.88981852', '200.5745846', '95.75428341', '4.373527031', '3.667614111', '66.95859216', '9.271980307', '84.15740958', '83.35122043', '11.60549804', '80.80322207', '1.846212973'],
   ['362', '290.3854329', '78.28052344', '39.68332528', '1.519165139', '488.8548532', '187.2368481', '435.2537849', '3.554293978', '177.8890804', '24.16472807', '12.19297279', '246.2313683', '481.6259461', '150.9938248', '57.1990416', '214.0101432', '126.1688762', '451.7688224', '433.1231804', '14.93765151', '5.823948907', '458.9446211', '328.948565', '345.2647337', '236.6635456', '386.9564657', '274.5705552', '199.1349531', '226.3477655', '356.7989687'],
   ['363', '114.1530814', '233.470056', '27.99807043', '104.5798576', '454.0619125', '306.0558389', '246.717509', '467.8603269', '195.6448453', '9.601581027', '444.9140184', '381.9986939', '11.29547973', '190.9224931', '202.6306724', '113.2982513', '170.5538876', '30.54027889', '329.101617', '285.6898901', '259.9574742', '5.276438535', '31.54574489', '29.9735693', '23.94199707', '233.7051361', '162.7753848', '91.36260786', '278.8681738', '6.448646716'],
   ['364', '351.3715958', '216.5214605', '433.6450051', '11.97656072', '125.4940589', '50.03518285', '126.8455025', '18.59095144', '101.8122164', '45.36639764', '1.075901908', '60.56076477', '427.7630988', '247.7523357', '337.824711', '17.83771977', '67.91380777', '79.67387416', '67.64800122', '323.3674979', '230.7851206', '286.2973986', '450.0640779', '360.7882159', '465.7758164', '366.3164183', '437.9797036', '292.9979205', '439.9081269', '46.46122414'],
   ['365', '86.12571642', '16.64737143', '36.64685923', '5.077264843', '25.4856646', '24.82579299', '125.4066784', '32.35757602', '166.3126415', '90.31906495', '11.20005854', '26.94252254', '222.9861631', '184.7190307', '311.8939793', '160.7500515', '95.6976732', '426.5438906', '301.8385626', '473.4037403', '413.8817625', '27.14271899', '251.131524', '16.4245654', '18.46587043', '64.78362811', '59.24597477', '289.3817182', '19.19669947', '462.8540578'],
   ['366', '372.8293998', '435.8163957', '432.6164451', '448.542306', '431.2691244', '326.2761674', '461.4855881', '468.7070034', '478.2175973', '460.4509405', '448.2187116', '459.623017', '483.0381705', '477.0792771', '458.2110228', '486.2396702', '210.931304', '450.6056018', '427.8955925', '455.4270527', '418.5122456', '432.905745', '473.7262682', '430.2721007', '467.5699069', '413.2401058', '417.7723612', '443.7404125', '379.364964', '359.3871904'],
   ['367', '201.947305', '429.3750971', '299.9213807', '421.8546152', '311.9163681', '319.2001901', '133.7338286', '424.0615599', '320.9873096', '438.3076741', '83.10960303', '461.5824508', '340.5816744', '467.3101821', '361.4925926', '364.6631979', '8.73589137', '20.03244319', '30.53838507', '140.2491866', '66.95470582', '103.489757', '307.0653476', '445.8715449', '463.1355728', '426.748358', '483.9808987', '138.5745805', '379.2716806', '10.34277995'],
   ['368', '132.441429', '250.7824826', '10.288516', '491.1281998', '32.55757066', '307.6554696', '404.6638223', '498.7874141', '482.3636608', '476.523407', '498.2225176', '356.8636198', '470.8531324', '400.8309669', '440.8249229', '352.4330023', '192.7956571', '448.3901709', '301.0548872', '38.60319061', '39.78994027', '374.6069213', '380.0670465', '52.656726', '420.074312', '393.1773367', '442.6107127', '92.19945097', '385.5782489', '15.17432521'],
   ['369', '109.8304742', '451.1795271', '324.2771701', '240.9322334', '466.5924553', '383.6412199', '163.7411108', '171.3644543', '307.1109745', '378.5459755', '269.9538939', '97.02272649', '485.7377046', '305.0614503', '239.1569383', '368.3229685', '280.4333363', '202.3054122', '165.1365616', '456.559231', '361.9823554', '487.7717336', '466.4859399', '49.09338782', '372.7107915', '453.2086684', '382.6597013', '75.80770298', '402.5412907', '16.55516005'],
   ['370', '44.38205549', '0.452894546', '4.756337725', '292.2478925', '0.760121886', '5.69508497', '11.95704239', '391.8067202', '13.21315494', '7.777576353', '388.2431873', '10.58985947', '106.280222', '18.37171778', '12.37646077', '8.901286846', '1.143893614', '8.708965388', '5.139284975', '0.655302418', '0.212275709', '4.541282399', '71.18042753', '67.25935813', '24.10773313', '5.254646295', '22.08626065', '107.6183', '3.922762844', '120.6109139'],
   ['371', '31.64327521', '9.548026493', '15.01776451', '42.60598161', '256.5261512', '33.01323471', '196.3231882', '164.3326139', '32.95776984', '11.86189828', '193.3573957', '74.30047606', '126.1324786', '5.704802441', '159.2647495', '38.49196915', '95.8996471', '45.99400337', '372.8574527', '157.0137165', '20.79615643', '168.2949453', '34.37471468', '66.42721436', '31.37688808', '62.3882185', '119.2851333', '20.03505373', '265.9830774', '336.3213615'],
   ['372', '5.561036502', '4.620995861', '6.141726767', '5.174359753', '43.21638985', '15.8947556', '12.52624302', '38.08655903', '25.37151102', '2.718003299', '37.69319456', '43.9308541', '31.4845555', '7.284620829', '38.6185396', '23.44507911', '156.4267209', '54.01706697', '20.08526762', '15.22562527', '4.620526776', '45.51918546', '10.21029913', '10.97691877', '8.698685418', '123.7073008', '129.5186954', '3.393181624', '39.95570399', '4.416205377'],
   ['373', '79.0464508', '130.748232', '27.92013549', '57.21613594', '10.61564788', '11.08576982', '33.78639639', '108.4357286', '10.37100304', '44.82923943', '121.9635353', '6.740875173', '102.4071281', '13.23374571', '12.79490671', '9.401253971', '27.09791214', '82.85986965', '26.95834558', '7.798533805', '30.44477111', '39.77777408', '42.78654556', '27.6396686', '40.37366464', '99.4193222', '88.94655903', '38.95084183', '73.34369384', '82.86198691'],
   ['374', '17.86160424', '77.80475103', '8.695008684', '3.002245936', '78.18881034', '42.97120026', '24.57599891', '52.30826781', '36.87978094', '13.984862', '55.08533641', '7.500439074', '89.42797534', '12.73976845', '34.52829733', '26.89735061', '79.4923399', '221.3382745', '67.09218484', '60.77634103', '26.12373489', '19.95536094', '130.3976634', '13.67378549', '28.56969424', '148.5910427', '62.49940152', '11.20259262', '50.75903039', '77.63247577'],
   ['375', '1.058228292', '215.0617466', '0.841207081', '16.9972303', '352.9163627', '80.2598549', '3.116062992', '43.69682422', '74.58026203', '92.3878875', '0.263457732', '14.86973947', '9.750791441', '17.78807959', '149.4446903', '52.32312334', '267.6077815', '190.614776', '31.0298529', '302.8923416', '53.54594064', '7.365152229', '8.508418005', '7.987179696', '11.46387579', '125.2248131', '184.9995959', '1.587031239', '83.89064529', '1.128344173'],
   ['376', '4.497744335', '37.92886663', '13.70153647', '3.335126971', '148.6605321', '4.985520018', '116.3933388', '46.87589531', '265.1462248', '2.651456972', '2.380159055', '227.5816833', '157.5767228', '1.061784499', '43.9340874', '42.35775314', '19.00101662', '389.2259476', '242.2534458', '73.49317032', '15.98739434', '81.11572225', '21.41204824', '51.28836586', '135.1440459', '161.5957482', '114.2045485', '18.57535611', '171.626063', '24.82643525'],
   ['377', '0.589464321', '5.814689471', '1.396145768', '4.54354771', '0.536412307', '1.794840222', '2.405800697', '4.503257435', '5.719896523', '57.0921899', '8.699356457', '17.96937836', '84.56727798', '23.48624053', '10.85210524', '5.280794846', '43.83548686', '41.45727729', '13.37133986', '0.447446348', '4.350286837', '18.30308989', '0.533946377', '0.670456519', '2.091194102', '3.302078', '1.076155975', '0.617858188', '0.325645606', '0.09170654'],
   ['378', '5.514453847', '66.03130121', '26.22124587', '108.548654', '9.987570236', '6.785612264', '12.39794224', '145.0437896', '11.52570555', '12.1029429', '384.6269318', '6.927661488', '13.52785041', '0.73865913', '30.12028585', '9.552448112', '2.223295211', '3.402759757', '2.116919675', '0.456323679', '0.085915946', '173.952865', '26.90241394', '199.1155402', '114.9557092', '22.79676844', '17.18878129', '9.965351728', '226.0290269', '211.801462'],
   ['379', '19.04481492', '190.0044943', '160.144644', '10.74377217', '43.15402015', '36.23491516', '38.13086444', '54.98794629', '33.98397331', '22.60652246', '24.20208756', '71.9310657', '67.20660233', '66.23294738', '47.31559969', '32.10742348', '68.22123532', '7.18009603', '51.55507396', '239.8102477', '203.5814474', '15.93687408', '18.28902818', '42.61677965', '19.15188848', '85.2927204', '54.61890785', '10.48295793', '124.9517202', '31.64049706'],
   ['380', '402.6793819', '167.8636508', '346.3911482', '329.2319498', '446.7400569', '319.5653854', '3.941907275', '426.4725046', '2.647241501', '9.340165497', '60.59773943', '2.763640766', '3.94036999', '60.8091591', '37.70307618', '10.14113185', '128.0948598', '0.218324576', '8.167848981', '483.066114', '213.4744307', '40.05270204', '236.4598285', '448.082348', '39.62757932', '39.60969534', '24.33115473', '425.2828062', '287.7559072', '372.6209203'],
   ['381', '451.694697', '391.5628576', '356.1510892', '498.1218946', '484.4857709', '474.7351155', '488.1291164', '491.7820444', '495.3182679', '382.8405319', '443.1546194', '498.6213348', '484.3657503', '499.2947853', '495.8876759', '491.6087867', '470.8231178', '487.3986237', '497.9290643', '498.0419408', '481.3906616', '457.1117285', '442.6646714', '431.3178178', '425.8257938', '475.6611933', '484.4026577', '363.5977172', '491.431945', '144.8633476'],
   ['382', '486.7193492', '12.16678668', '251.6947059', '439.2069847', '403.5973032', '389.7994594', '312.5597675', '490.7480848', '272.0632617', '220.6518126', '496.6118693', '312.6435258', '364.7311929', '140.6999287', '374.3235906', '126.4433084', '281.1513338', '34.84196443', '348.675328', '325.7923517', '92.88619732', '429.2404047', '480.699082', '478.5577783', '412.7498285', '22.00777557', '29.81238436', '489.0456682', '289.0813501', '336.7617123'],
   ['383', '186.4177485', '65.29469682', '31.57480067', '36.91612134', '44.6794774', '26.61642272', '59.31976989', '52.58668373', '33.41674453', '20.55443234', '70.52562132', '14.0935476', '97.23041619', '92.99331516', '112.2391854', '40.26056345', '32.97678137', '57.29748739', '19.36299477', '186.3872663', '305.8614347', '43.35627518', '282.4412849', '203.241155', '209.4294205', '364.7619482', '396.2177834', '199.2286287', '134.253252', '120.6846842'],
   ['384', '431.2694902', '310.868739', '442.4768067', '82.50116391', '466.3760275', '284.4677826', '468.1925044', '304.6084283', '329.2347691', '18.07903056', '120.0899496', '239.5270021', '374.0568138', '170.2022242', '331.582759', '217.1674578', '255.9983813', '375.4861957', '466.7540316', '453.0366852', '485.5232542', '299.8022311', '188.6505809', '211.3500293', '156.6635431', '380.2427016', '315.4242127', '424.5829161', '441.0579611', '454.0371063'],
   ['385', '14.12738933', '23.69949257', '4.851078597', '15.23648357', '11.60193637', '12.4414966', '40.56927854', '15.4500744', '101.0088544', '28.06364044', '62.12118119', '176.0127564', '333.6877445', '222.730782', '232.3049694', '39.82757159', '7.972858136', '409.1676258', '151.0224204', '77.47253106', '244.033584', '27.06417692', '14.77462747', '9.114144295', '61.01738936', '226.1594431', '221.0455674', '8.684983868', '124.5469403', '0.554672075'],
   ['386', '442.8898043', '476.82665', '463.6372404', '468.0455141', '295.585166', '435.9167923', '459.5205471', '491.0998394', '485.5236237', '497.6759191', '488.5150442', '411.6475467', '495.1832511', '264.7531721', '448.2582282', '451.2531116', '425.3604278', '498.3545183', '457.6657722', '325.33132', '360.9070633', '478.5036557', '372.3806682', '186.3494517', '494.2081064', '349.7720999', '352.3064668', '295.8235694', '488.0050728', '16.35008022'],
   ['387', '0.527544445', '4.024700899', '0.243352846', '134.4422585', '93.2040708', '41.74274538', '18.75621947', '228.6766226', '74.96650724', '55.15242556', '318.1328092', '13.19415778', '8.850032345', '14.65759848', '15.40530072', '35.53648981', '50.95242035', '0.728333964', '36.5542085', '349.9638348', '379.8270883', '14.96449434', '2.439657492', '0.770731413', '4.490114309', '4.972389417', '5.962925533', '0.89069475', '1.868859064', '3.485217629'],
   ['388', '49.05224865', '23.03511737', '49.87463688', '43.36138474', '238.5769857', '81.22180549', '37.32947625', '56.77977156', '14.56119776', '25.87469074', '13.68751894', '63.13277129', '212.2070103', '20.71650565', '44.13655016', '24.94624522', '45.63505854', '68.72069632', '68.15156043', '188.7825025', '84.97367357', '319.1900834', '147.7021406', '123.8450476', '272.921627', '21.73216012', '21.66623226', '47.94686078', '43.78187181', '284.1593919'],
   ['389', '3.989605831', '28.2798531', '2.675357133', '20.69197566', '191.0473069', '80.44265259', '4.378720022', '51.65226626', '5.187652046', '12.71500547', '4.036908927', '26.52728377', '2.706763308', '28.32741935', '7.444110433', '37.15893181', '10.41707495', '5.16025551', '3.344775152', '240.0845779', '147.3350075', '2.284968697', '3.048180883', '10.44154999', '2.276131526', '97.59784329', '149.026685', '3.800978305', '22.11468145', '6.629846038'],
   ['390', '3.524941105', '13.29030876', '9.667179491', '4.262018845', '8.532632276', '21.40412818', '10.56676983', '12.0341201', '17.69318664', '45.29375652', '33.87195841', '13.5943752', '15.30227505', '24.52775335', '16.24800735', '15.44300853', '16.6161847', '14.16765329', '32.89362475', '43.96409086', '29.92358739', '39.84923321', '9.984329449', '9.639171871', '14.22558973', '17.78238974', '15.95937398', '3.092520286', '10.81247809', '3.627418289'],
   ['391', '17.27892732', '8.217759538', '2.535997002', '1.105277608', '5.702973194', '2.374661284', '73.23983326', '1.247853612', '64.53228818', '4.738130901', '8.861445574', '27.446593', '28.87631146', '18.347374', '138.4952016', '10.65192378', '8.552496737', '15.26711613', '13.17109489', '128.099027', '91.19344196', '10.57864437', '18.20021063', '23.34168816', '21.98497026', '65.2371609', '185.3222949', '14.1840244', '43.17306816', '16.34318376'],
   ['392', '398.4240485', '468.1399621', '427.7886574', '456.4382756', '442.4553549', '430.5268025', '463.0437278', '488.0172992', '467.1749521', '309.1552313', '374.6782427', '443.6844649', '490.8858691', '354.590734', '486.4602145', '477.1342764', '380.643105', '370.0760306', '414.6392787', '495.9153617', '328.1690453', '480.9868803', '492.6443021', '489.5389355', '492.2190265', '499.1652994', '498.6504817', '428.8770436', '479.8237232', '466.9732905'],
   ['393', '35.74479735', '131.2809396', '7.908342419', '167.8420429', '190.8554339', '80.36142722', '3.034289535', '146.7897244', '13.1531403', '24.82997184', '77.3810461', '4.081271786', '85.20282655', '24.75443956', '37.69908801', '58.77726545', '15.92073692', '2.871928647', '1.415457079', '442.9092102', '154.0491954', '228.0242053', '11.0884385', '19.27357369', '210.2140048', '425.5855104', '400.5866607', '20.95172107', '372.2978368', '23.26543198'],
   ['394', '2.551057845', '6.508180336', '6.27283502', '3.641024419', '14.96604314', '0.985910163', '4.120232304', '32.92064013', '6.495981711', '4.091540421', '0.445966071', '10.84704857', '22.7735339', '0.234535604', '5.629058749', '26.08187339', '4.615194216', '263.9431818', '2.49491155', '0.904604175', '1.655466462', '26.96706656', '2.014729297', '2.836516671', '9.300902451', '46.38825989', '45.79044272', '3.205028331', '3.3129763', '1.725492529'],
   ['395', '64.68498657', '16.19472113', '5.853679829', '0.16717771', '132.0458214', '8.983910097', '2.01589004', '1.742219005', '0.485256361', '0.028515714', '0.257127712', '0.346157654', '6.966330792', '1.284865965', '3.552864701', '1.597011932', '7.58767172', '0.054448442', '1.332480073', '188.8394384', '177.1295125', '53.13535372', '176.7319156', '34.82688354', '7.60438551', '309.234999', '113.7527374', '70.43477188', '36.02183084', '446.0595298'],
   ['396', '61.2992144', '177.8132993', '91.75465889', '301.81519', '350.7608349', '305.2321533', '320.9014405', '468.5374647', '287.0523344', '15.25190396', '424.1013271', '205.2370534', '362.4805318', '134.3558003', '190.3355282', '94.83091094', '287.6194572', '276.5477379', '429.8530258', '145.489646', '321.5006407', '296.7658032', '260.3767717', '139.3983904', '322.8307976', '420.3148971', '348.091399', '162.5457412', '417.7894972', '70.28307586'],
   ['397', '50.78505363', '313.060004', '4.970932492', '484.9133673', '204.7575149', '404.3010639', '40.46175229', '495.7547997', '455.133797', '256.2545722', '413.4159027', '473.1403047', '190.2056293', '470.2271795', '359.9422377', '410.8698868', '451.4320296', '442.397122', '337.7136682', '403.1198835', '385.0205674', '30.0059484', '16.04667617', '13.8504814', '255.301648', '200.2753878', '308.9935254', '11.33203765', '309.9521423', '4.294414958'],
   ['398', '4.622756112', '371.8880365', '26.7763233', '375.1973433', '423.620088', '396.0807554', '441.5019947', '456.3517886', '479.7419951', '298.2612909', '302.1956069', '482.175592', '489.7139245', '490.1635595', '497.0418776', '459.9154743', '399.9891579', '494.1533728', '493.403163', '499.0311493', '478.9415392', '381.4831375', '29.98916218', '55.79657513', '465.6859468', '377.516567', '409.8726225', '9.880873226', '297.8333231', '8.559268513'],
   ['399', '433.0594597', '302.8117659', '449.0152476', '389.8524783', '439.1721038', '348.156585', '478.3664095', '487.8856487', '346.8062174', '22.73427049', '492.1265502', '490.4668366', '301.7078428', '432.0509505', '460.0953272', '413.0581206', '387.8442029', '61.94513801', '489.9120454', '497.451196', '301.8652892', '290.0758431', '440.3233275', '469.1855765', '419.5022971', '460.4104453', '475.4921701', '464.4850257', '467.2196329', '372.9466611'],
   ['400', '97.6663336', '244.594384', '35.84667652', '6.198621147', '438.697074', '100.7280334', '17.51794624', '26.19607515', '29.90205538', '1.906040875', '62.06628385', '8.142870095', '228.6579105', '46.30468981', '56.24823498', '34.75506357', '24.84012103', '10.72876577', '15.74569414', '434.8529005', '449.9543896', '155.2866786', '271.3527401', '6.867937431', '150.7777627', '347.5342781', '231.4681454', '29.10773031', '341.7043784', '2.647940792'],
   ['401', '9.725477748', '30.47350889', '29.30202326', '43.30802467', '40.6542573', '17.96496637', '54.70037723', '72.8733461', '31.39265318', '52.31540458', '5.242318103', '14.43378422', '122.3749034', '15.93903041', '43.40744633', '16.19925411', '8.577303308', '18.10975894', '68.39326579', '218.9745546', '77.13178691', '36.82868083', '31.23564879', '23.12914661', '47.6041325', '22.7220298', '30.60942633', '14.40451492', '27.90328511', '171.1261421'],
   ['402', '109.6069293', '48.42378893', '13.87611312', '324.905257', '322.2431807', '152.9106209', '413.1414485', '182.9227914', '352.1230171', '211.6774694', '50.62576834', '144.6163114', '187.2695881', '124.6824629', '140.6566693', '67.57596146', '54.97911215', '108.0561756', '403.7929213', '478.0405294', '259.093127', '137.149157', '39.69029928', '361.3803358', '148.8039959', '218.5379146', '288.6067469', '177.1750143', '72.86006393', '458.57654'],
   ['403', '176.4393404', '117.5892957', '39.07139605', '19.13584413', '400.4343122', '173.4746961', '15.21979144', '177.2538234', '6.780806683', '8.000193647', '207.7051405', '10.70864024', '235.1292696', '366.4328503', '196.6953965', '27.40350411', '447.1316735', '6.999302316', '69.2710551', '256.8425493', '201.8861769', '349.5799957', '343.4086852', '243.4561591', '133.5986192', '397.7476932', '268.1195005', '74.90053974', '307.6485534', '265.2148336'],
   ['404', '6.078393861', '167.592518', '6.971988964', '123.8284313', '9.998916831', '45.95201206', '143.6247089', '330.5562637', '122.0478982', '13.63209656', '1.707843838', '21.29284422', '33.13900889', '14.64963157', '88.72670512', '4.705549842', '27.254435', '61.89077541', '35.02437521', '172.4638105', '322.3402769', '4.538934806', '10.87298392', '8.340746526', '8.951039309', '16.46945801', '10.77886866', '13.7125339', '10.66602785', '11.65785351'],
   ['405', '7.500054523', '232.1778833', '82.17519093', '112.0145167', '199.0349818', '217.1294771', '14.87390214', '75.59726973', '63.35310583', '143.2651695', '5.8718382', '21.7989524', '56.39937295', '226.3754508', '74.90182132', '161.2614205', '152.1833007', '7.179627631', '269.0159268', '204.6313696', '148.780775', '198.0543102', '117.1084067', '9.662156621', '55.69637181', '215.6620267', '375.4549505', '17.54688723', '135.4381569', '84.32036848'],
   ['406', '110.5609961', '136.6742889', '42.09503999', '289.2798814', '20.14851247', '60.45607651', '126.1274969', '478.130395', '71.27747294', '17.12478691', '404.2674541', '272.2643176', '38.28601704', '11.03788786', '389.7831889', '48.41383418', '1.398397486', '2.363251057', '31.47173375', '393.4097511', '73.68119519', '9.941252611', '53.91986761', '26.85041788', '164.5626184', '64.9898626', '92.37725876', '191.4468049', '321.4541314', '143.3309614'],
   ['407', '92.82605157', '14.51969521', '104.2767946', '45.17298782', '131.6489872', '35.25181', '43.37405056', '99.43127456', '42.1962842', '120.4568945', '120.3613695', '8.037443243', '64.14562808', '16.7485376', '35.1316848', '73.00647384', '78.95746844', '50.28831375', '57.15963463', '40.54501491', '95.45019488', '92.8891589', '237.4140853', '137.9951818', '33.81977867', '22.6669123', '13.28387732', '199.48968', '5.691122868', '72.9410366'],
   ['408', '3.831505064', '2.399500481', '0.377635953', '6.534252522', '224.4835279', '15.81514991', '17.39248768', '65.59287309', '10.33185205', '0.576357255', '103.4538881', '9.348315751', '6.255953369', '28.3427731', '38.23161007', '5.647505669', '244.0866608', '16.32441948', '60.7828462', '250.8819797', '83.47934265', '6.641518641', '0.182922403', '1.707088952', '2.555722711', '35.55665971', '9.03145263', '0.399748168', '156.0478611', '4.190166935'],
   ['409', '42.55719448', '278.317239', '144.0816497', '489.518469', '477.0785118', '469.3845361', '143.4987343', '490.0860128', '374.2100388', '130.474317', '463.2398757', '406.5948742', '465.7061714', '482.4632049', '389.7837277', '410.7887613', '472.4534019', '445.3118844', '436.4678398', '482.3504018', '416.7475747', '440.6774404', '23.09506819', '43.26276508', '265.3964891', '490.9006269', '459.814675', '9.626718078', '314.1813398', '16.95112503'],
   ['410', '57.49836145', '29.04668046', '8.742369788', '11.34315617', '244.3207743', '35.78455383', '17.49643312', '159.2753007', '4.099510459', '0.503794764', '17.58698401', '3.176987557', '40.49420257', '5.759802748', '37.23560604', '7.569694211', '33.32573701', '4.776003627', '15.53873355', '214.7255998', '358.8492837', '255.558386', '160.9767507', '46.61203508', '29.60757668', '23.57912272', '5.123406014', '98.44842472', '180.4213012', '415.5117035'],
   ['411', '343.4494363', '418.2646239', '297.8855919', '31.82037571', '476.8644267', '246.0064889', '359.4661229', '105.9991917', '260.8637228', '233.4373437', '31.20991134', '449.0267858', '103.4004284', '72.68491417', '428.6349119', '323.921867', '316.7627928', '395.7822419', '398.5492903', '472.7207183', '413.4100185', '53.26435873', '171.3101872', '466.8093833', '178.9992596', '482.6122462', '467.3252924', '286.7457141', '398.2130387', '312.7629911'],
   ['412', '438.7674537', '291.9819486', '219.7650318', '64.18327309', '493.443029', '421.9363731', '378.3511945', '354.9767789', '451.4533139', '25.59625405', '358.6931082', '445.986343', '383.9471858', '323.9388375', '440.8150351', '348.4669559', '293.527812', '324.2932832', '489.651363', '499.3822478', '482.2135307', '410.54251', '238.0089535', '452.2155369', '396.9481168', '494.8489739', '490.3596218', '232.779049', '494.858218', '34.55256466'],
   ['413', '57.32374202', '111.9670932', '440.7238567', '363.6716841', '336.8234916', '132.0005982', '9.988983283', '453.2889223', '15.2739822', '7.168999428', '408.0776921', '26.12931922', '137.5926355', '61.92272798', '18.63178475', '45.86676415', '65.58802635', '4.638427474', '75.57055345', '456.8842111', '240.9980965', '480.0214911', '380.2061288', '451.3636924', '375.9591268', '202.0457468', '213.1135493', '113.8628165', '129.4786151', '418.1428755'],
   ['414', '446.1263559', '414.8475864', '256.2004024', '390.5766241', '434.6610227', '438.4619053', '476.6434705', '437.2893823', '424.7889414', '391.3868487', '315.9748501', '460.6424343', '365.8428593', '268.657316', '443.2121848', '344.6543928', '361.5841294', '318.7919246', '395.3289659', '462.3211638', '188.5420913', '391.9138181', '441.0451623', '449.8082745', '421.125526', '441.7678754', '399.9274676', '390.5779973', '473.2344585', '340.6568611'],
   ['415', '454.1465889', '131.9427364', '119.0695863', '84.04978477', '58.27149476', '32.55466801', '361.6541388', '421.7407302', '263.2985345', '8.254193152', '477.6612101', '380.0635677', '436.4767275', '415.9096127', '282.8762947', '194.0125318', '135.1820665', '273.1951953', '300.9504332', '413.139141', '251.2097069', '407.0163182', '490.6516769', '152.3535233', '355.8421386', '96.38412504', '30.61803498', '472.8757632', '240.5051772', '497.304514'],
   ['416', '64.12312874', '177.5753146', '6.392005462', '23.79450561', '60.61262218', '26.33071059', '0.842739598', '331.7248977', '2.618988487', '11.55626659', '57.60333411', '0.974990304', '16.01082152', '13.33429092', '39.72609515', '7.95846674', '17.05527699', '1.012223798', '1.436986823', '15.41988673', '4.223756113', '83.33584026', '188.9118091', '15.36089741', '133.8014764', '303.6238441', '232.3929475', '27.7347605', '174.4515178', '38.46625754'],
   ['417', '6.126808697', '4.645954968', '3.361548612', '0.815477614', '85.81175177', '12.19140239', '8.943936842', '6.988680657', '18.72237895', '9.119974555', '67.92669148', '4.221360521', '33.78641161', '8.939243816', '15.12147031', '10.79283376', '48.23629203', '22.23198054', '12.18980895', '66.72785518', '301.4922139', '52.01624163', '16.61798729', '29.70060431', '11.20925622', '24.96644137', '4.85338454', '22.23521254', '4.234941088', '9.347418106'],
   ['418', '102.3096772', '30.84119187', '22.91970246', '53.49600774', '386.4928034', '42.49014724', '4.195473266', '381.9755263', '3.481878105', '0.216633313', '39.20614835', '15.86786863', '3.094624545', '3.704879725', '59.82013858', '7.430017442', '5.855061115', '0.260547699', '16.19381645', '442.1260964', '67.81267909', '119.9787643', '15.16396735', '387.2736504', '16.83297656', '213.2468837', '92.00965983', '143.8212768', '242.9724963', '265.1086114'],
   ['419', '41.66300831', '39.33389404', '45.61241746', '88.12540933', '87.98085552', '59.16791506', '56.75289621', '230.5671492', '111.3211737', '185.227103', '70.36703248', '30.70336374', '97.14935324', '72.5491111', '58.3616639', '105.8726108', '20.64756695', '26.12227257', '15.25190952', '30.5989502', '10.25826239', '82.08164888', '63.72490124', '58.34527219', '109.7177397', '163.4596112', '326.5498903', '87.39000475', '16.68584945', '112.6696899'],
   ['420', '32.38349701', '53.84411362', '1.43928795', '4.713351612', '25.70055005', '26.00763233', '46.41303809', '9.80282948', '358.5556033', '126.4430128', '4.450287571', '93.97816241', '317.9273971', '377.6915086', '131.8230844', '176.9480594', '179.3196613', '482.3970134', '305.190098', '114.0346098', '19.15420628', '60.25073797', '87.04771292', '1.500896825', '44.55119745', '182.6737108', '273.3215164', '63.83645743', '119.6641239', '4.747411184'],
   ['421', '207.850207', '353.7161825', '195.2055565', '404.2705408', '308.9763502', '287.016331', '330.5558371', '442.5010502', '220.9177867', '403.7177128', '385.9814175', '283.4327338', '371.2293043', '319.9867023', '142.3957495', '131.7928458', '122.959715', '319.6622539', '279.4742903', '398.9905602', '412.0135019', '200.6040474', '195.5798397', '256.7501875', '239.9979943', '344.0799396', '385.9628881', '274.4762354', '249.8175883', '90.73272683'],
   ['422', '9.727192491', '17.53217491', '0.649412056', '8.070018652', '140.2209882', '57.36607637', '9.659305525', '6.695759343', '45.66615138', '12.64124739', '1.11305528', '75.84090494', '7.006680523', '147.9372541', '163.6902896', '47.64487548', '145.5455863', '361.7862997', '259.2030426', '391.2335819', '54.0257337', '2.175946698', '0.15443027', '0.55862545', '7.995022333', '34.42067924', '50.36912426', '1.570354337', '90.01337255', '0.180778447'],
   ['423', '4.784100899', '0.743228059', '0.886409278', '0.120925883', '1.350601885', '0.283947165', '15.13011165', '2.002533333', '15.98879399', '0.125683028', '0.11300502', '4.532359367', '359.3642628', '14.15881248', '12.41308379', '3.491455574', '8.200671601', '274.9792891', '16.51540493', '1.58936719', '0.288874627', '113.0057511', '70.56754711', '8.197948377', '44.48712249', '10.94361804', '9.259723467', '8.359931773', '1.985528613', '134.5020527'],
   ['424', '63.63344558', '333.132916', '44.09789424', '449.833074', '490.7841492', '463.6292249', '497.1273473', '487.6243006', '494.0416224', '451.7903227', '499.2486103', '459.5831843', '468.2024765', '327.0201621', '487.3605521', '437.6638702', '305.9364872', '449.3235816', '498.323475', '488.2832529', '474.3648826', '476.7106008', '244.4487052', '208.998967', '317.7676216', '388.4209125', '288.777064', '55.90632013', '401.7392949', '405.063907'],
   ['425', '2.93494233', '7.846831682', '0.522061904', '0.863746568', '190.2811697', '5.845163636', '0.205859455', '3.327055969', '0.040517994', '0.012492144', '0.198213175', '0.288469696', '1.554549816', '2.388513602', '1.010316308', '0.237850687', '5.458943644', '0.013733578', '0.428580788', '395.4542908', '240.0358034', '20.9072448', '7.396534848', '6.203890326', '1.808281188', '28.42066839', '7.02592762', '1.340783396', '30.97213638', '10.13863789'],
   ['426', '2.443183021', '291.8011261', '0.778702666', '45.12729516', '168.8579602', '72.91798238', '36.24888393', '397.0878089', '360.342067', '32.89122576', '212.8360622', '11.57933124', '155.0506461', '29.68485684', '39.77631619', '39.10399939', '300.729043', '455.8962179', '150.6988073', '14.01270807', '6.77982052', '20.18156975', '24.41327323', '4.720614134', '12.61248415', '92.99652156', '20.9807437', '8.742227603', '184.2797906', '102.6477087'],
   ['427', '39.9647108', '20.25432768', '88.47384384', '5.050562998', '30.95085369', '24.0071174', '14.44261848', '3.867587303', '11.65630966', '19.91640387', '6.536219799', '3.596055403', '8.877833912', '19.54220272', '14.85794389', '24.18766485', '1.76652599', '10.54933027', '7.128197481', '52.28232735', '45.45102841', '35.35900389', '79.04057857', '16.55115103', '17.36593998', '69.64775822', '109.8338882', '20.64259114', '122.8280177', '25.33828532'],
   ['428', '15.74379314', '447.6480502', '20.57314766', '478.8150739', '461.5496977', '475.3768409', '49.51658996', '495.3251159', '469.2332677', '458.6764611', '467.6268267', '207.3175222', '370.6167529', '383.9359436', '313.7796724', '374.7454662', '291.6946735', '463.2443624', '338.6003405', '486.6702245', '348.7618308', '264.1633016', '27.98759479', '10.50190272', '117.6915795', '427.8856063', '342.9020359', '14.62361909', '441.349356', '85.01451336'],
   ['429', '22.24815365', '75.2835514', '29.18145002', '111.9571308', '9.721186376', '10.20102546', '12.38933016', '321.7129887', '22.9892524', '18.06121877', '5.709159459', '5.106725091', '288.133397', '24.19047919', '13.82237977', '15.33898868', '19.90085268', '11.07489884', '16.74009274', '15.33496954', '3.708234909', '340.2994722', '312.7727276', '33.94660185', '141.0670937', '54.53545024', '69.84589676', '87.40194401', '33.20230458', '36.29166156'],
   ['430', '67.88136164', '5.600979624', '22.87035932', '6.267613914', '30.26009631', '10.51804829', '128.7937113', '24.28605384', '27.42896199', '1.648844601', '24.98377314', '24.33667034', '118.2054533', '36.58699235', '35.04018625', '28.20308707', '92.21224448', '95.27096549', '172.0393978', '177.5109759', '254.3987156', '74.37871848', '43.34557452', '21.64369526', '38.55680861', '22.8491368', '27.67040833', '48.70589985', '14.59519883', '66.2830357'],
   ['431', '196.7586706', '106.2714295', '16.01708282', '11.39912718', '259.1311042', '186.9114017', '17.65585782', '79.46684821', '12.53413917', '181.6071773', '32.80863818', '7.913290043', '13.55622599', '16.33647207', '52.3995604', '21.81055207', '2.208181047', '4.785624579', '7.535646796', '453.2034982', '319.0886921', '12.27706307', '133.1129755', '39.36920797', '15.64717417', '34.51361359', '19.11917869', '275.1299178', '307.9769239', '249.2995434'],
   ['432', '24.66118914', '10.35247353', '64.69441587', '17.46843552', '79.31530147', '53.1784955', '125.8124517', '24.51124361', '292.898854', '171.3362645', '13.46742229', '32.19111001', '36.73857577', '17.80064692', '137.3588231', '45.54466196', '18.04744167', '76.6703474', '129.3734581', '49.35380682', '15.74733494', '116.5792791', '65.64825883', '66.56123764', '26.53220755', '19.47461553', '28.25628775', '31.5536638', '87.49511351', '31.83187976'],
   ['433', '15.26985548', '181.6470901', '19.245084', '3.640144524', '5.473701654', '10.3738397', '3.529408312', '20.36516822', '3.162523244', '1.314011417', '1.319418145', '0.984290207', '18.95073671', '3.356668747', '26.82521831', '3.056613223', '32.6354718', '8.215554866', '7.937217427', '62.12514613', '41.52144269', '17.30349706', '124.7313993', '23.9621838', '6.543883874', '86.60078948', '30.83517872', '17.46358378', '101.0356207', '122.9234032'],
   ['434', '102.8221133', '42.36554678', '96.38498649', '452.4841178', '270.9453852', '150.7514609', '3.224355595', '477.8323161', '3.319091707', '0.341433058', '203.0396513', '5.941052682', '2.929168275', '0.840718018', '14.14838125', '6.936625569', '22.08603019', '0.068446239', '6.180787662', '115.3526534', '2.157815768', '27.56718132', '20.17302568', '152.2946624', '24.77941651', '144.5038166', '47.8476212', '38.39304613', '396.8867685', '19.06923868'],
   ['435', '19.53037078', '56.63177448', '3.877669624', '7.218006894', '338.761343', '75.12547592', '78.35137219', '7.269008111', '119.9140629', '14.52269506', '7.721656465', '313.9738994', '140.7739201', '51.49549373', '246.2661876', '78.14103862', '291.1138935', '331.4679326', '421.5672085', '461.457432', '118.1561063', '90.97307061', '1.914531863', '16.47127542', '73.16020662', '390.4060325', '437.6683781', '15.47435033', '420.6722756', '1.369371981'],
   ['436', '98.43922362', '7.812925459', '20.50856128', '14.4042923', '6.02157809', '22.15004155', '33.32618215', '118.6789362', '4.477610176', '3.485636466', '8.894202873', '5.475320524', '13.71021269', '7.473707426', '92.89406946', '5.258828743', '11.37681771', '1.333678628', '28.77029505', '215.2054626', '257.9986561', '17.55782771', '63.63542645', '28.55314894', '12.36105736', '9.410734751', '3.155843976', '58.35922682', '132.2928963', '70.05636086'],
   ['437', '234.4572157', '64.10464974', '8.930748962', '23.15721756', '332.7329326', '163.7055276', '90.66014244', '384.81684', '108.2461111', '99.62375461', '2.767519386', '49.3238858', '60.29408774', '5.528130682', '214.5968758', '23.96045158', '14.14461044', '47.56513707', '285.7535926', '7.328179617', '0.985028802', '36.88375955', '15.67420237', '48.10707401', '40.30739728', '99.62900471', '135.1515808', '234.5362155', '423.2215365', '257.423678'],
   ['438', '78.10705935', '130.6833074', '1.391525134', '6.693439115', '490.2566965', '324.5677944', '7.495346662', '6.152434909', '208.3946034', '2.847375406', '0.934563432', '72.03636922', '93.68060552', '50.61362049', '248.5816128', '261.4522962', '386.8044957', '366.3942522', '120.0792389', '476.7461529', '331.1580407', '41.85324387', '5.930067423', '27.67885905', '24.20177371', '39.42951602', '16.60297359', '41.51713324', '55.9641425', '97.45663151'],
   ['439', '6.660269799', '5.177376156', '1.88785504', '9.939548294', '0.82454855', '2.662244658', '0.798949182', '4.722998038', '4.801519151', '4.78464847', '0.08361953', '11.12926089', '0.898505106', '0.149256905', '5.962184638', '3.377462708', '0.895726679', '0.616992023', '6.440884943', '2.220317614', '0.250932849', '0.441154331', '1.95301813', '3.664575484', '1.179521559', '5.680297483', '9.604329514', '2.112173846', '76.38985823', '5.645956109'],
   ['440', '7.760634684', '8.156980137', '39.79683096', '2.229530845', '5.592243373', '4.068402236', '4.189519766', '4.458176554', '5.619743957', '12.32169934', '3.880325329', '8.61115321', '3.224999176', '4.61255507', '5.407320194', '4.191552227', '13.38388632', '2.003745146', '15.72064143', '2.036327316', '13.12749943', '12.06063845', '7.269567403', '7.698833387', '2.313752619', '1.072612429', '0.950575493', '7.083257861', '33.70651919', '5.931547211'],
   ['441', '21.81538157', '87.28767622', '157.9145381', '373.5663735', '79.38394424', '97.64843615', '237.4043721', '466.8160534', '260.7136571', '26.78953122', '24.17939089', '145.5305069', '310.6319881', '17.19538458', '408.5857244', '310.5143724', '384.2567534', '281.1765521', '278.1401992', '340.0867929', '158.3922839', '378.6929882', '93.07029645', '117.9375291', '272.1107378', '467.6973274', '484.8459345', '91.54018354', '126.0961566', '35.75843459'],
   ['442', '2.427947801', '37.09330642', '62.65595755', '124.4000731', '63.59411211', '39.62331243', '5.106850536', '271.5031268', '86.95126835', '34.37267382', '61.34401537', '31.61880811', '303.1305904', '151.8943282', '22.11972598', '21.77772093', '31.05047948', '54.8844015', '44.33792678', '260.4191234', '190.5562955', '74.09889104', '38.94467637', '28.34731827', '167.8196661', '165.8917283', '227.8215762', '3.258960312', '286.1012637', '3.856881633'],
   ['443', '100.3978378', '30.4370071', '40.67422313', '37.1973725', '80.09288501', '54.15418943', '213.1619626', '354.3521278', '399.7043473', '455.4999923', '253.1250264', '122.9402184', '125.9688907', '90.19205069', '221.6023924', '158.8050815', '25.79508772', '183.4243743', '211.9311497', '435.4202273', '413.8512996', '34.89063267', '71.03104545', '58.67290679', '129.9069005', '131.2870573', '268.1995706', '115.0981518', '46.02128344', '86.32048021'],
   ['444', '47.86185525', '100.8477517', '49.91398972', '11.70376509', '71.05660763', '28.08943285', '205.7234731', '31.73498955', '32.31583987', '28.99739372', '118.8156476', '38.72092291', '47.40951084', '20.38700265', '26.59691967', '21.65476532', '7.423599011', '45.85339302', '113.9688267', '151.4825015', '56.26445576', '82.90055972', '168.8838751', '70.55393262', '14.84131552', '140.0606352', '121.4093183', '39.25808629', '149.2385457', '365.6617527'],
   ['445', '64.41641841', '200.5069323', '17.2376072', '39.29145598', '195.7872352', '36.1116994', '449.5214005', '185.112184', '376.6279128', '32.85784951', '24.24999395', '416.6948955', '358.6616287', '164.7535477', '466.0085998', '255.2661122', '165.3679303', '470.1960535', '483.4670564', '442.2436801', '106.7344898', '304.5117207', '60.71868198', '207.602804', '181.8588259', '443.9654196', '448.2273337', '76.97335893', '296.98429', '25.12834072'],
   ['446', '107.7745615', '12.75017279', '7.788924634', '0.933000173', '36.08691896', '34.94103785', '113.1251882', '5.522468634', '67.184256', '4.687475163', '5.650643838', '55.18292278', '190.8648851', '36.9668651', '133.8046128', '29.55041569', '223.0776128', '235.7351863', '177.087204', '8.479922143', '4.29306678', '104.9195849', '171.7617225', '161.6391093', '55.11824722', '121.640754', '52.36225293', '32.42082079', '98.05444553', '126.1137196'],
   ['447', '77.03580334', '15.33475802', '147.0032069', '453.8435234', '444.9648219', '375.3830313', '137.1688528', '484.9191569', '129.2798216', '309.4963603', '494.418534', '123.1572068', '11.22857094', '30.49925162', '134.753956', '61.3217986', '41.50228348', '13.30871735', '87.35055757', '468.6182489', '487.9730631', '32.45434571', '58.31770232', '276.1951533', '14.52978148', '13.38443833', '16.26837823', '87.59664288', '33.82249612', '3.535669947'],
   ['448', '8.681479938', '190.5014206', '6.36240921', '4.451033813', '58.89172895', '39.14339205', '43.82115683', '17.67943984', '58.36394489', '25.55714085', '0.3219488', '18.54586882', '10.73717063', '1.896406566', '97.26868165', '20.88339487', '10.27769503', '377.0656732', '136.3315318', '61.72077343', '5.464748236', '6.539638643', '0.771644406', '1.008227385', '12.89945334', '129.3058965', '96.82300026', '6.582773111', '118.9536377', '1.455423616'],
   ['449', '31.29824399', '18.87056167', '1.608025486', '8.598575579', '61.53849584', '20.73353135', '6.754795334', '8.783553876', '23.44336642', '3.304407382', '10.31423897', '44.82694744', '13.75601735', '11.68091929', '149.8010578', '34.01968228', '141.0985995', '22.492924', '32.57855893', '40.5746232', '11.10286619', '21.04472141', '29.03928303', '75.36097717', '16.70070658', '14.5467682', '10.12868166', '13.43425242', '9.015148229', '43.03683777'],
   ['450', '3.37674287', '1.470119779', '62.09959581', '135.3299817', '13.83996523', '6.183418518', '5.105261209', '365.6620453', '2.571284416', '0.513968819', '54.47468696', '4.817600051', '175.9054959', '3.84717928', '20.09591074', '3.446400016', '13.81638509', '45.77687948', '15.48281431', '10.26393905', '4.133244548', '24.64579826', '102.4911293', '32.56685389', '25.18265335', '9.989647461', '53.42408627', '10.36697681', '3.718928323', '59.11349147'],
   ['451', '151.8244967', '49.24623407', '11.37660622', '77.78566299', '249.2183716', '43.3532917', '5.451017955', '240.7970104', '6.995560374', '9.326755546', '32.33718368', '98.00075487', '48.81902331', '4.19011291', '18.92586432', '17.18479701', '6.135602224', '0.410414643', '5.405370359', '197.7867556', '1.69712998', '175.2720461', '430.4214874', '337.9667148', '190.1344544', '18.08222961', '23.47784078', '89.56160699', '71.37519928', '451.3080892'],
   ['452', '53.54385067', '126.4910182', '53.53454159', '459.6600668', '360.9440053', '271.8457023', '91.30732881', '419.069854', '394.8188362', '487.9418773', '209.8586844', '214.2067554', '376.5389384', '319.7486192', '156.3936517', '99.12853844', '289.5867655', '483.9664877', '401.3183012', '445.7555025', '378.7111601', '390.1649902', '355.2237179', '125.8389495', '214.069689', '55.98222428', '116.2050223', '151.2621538', '16.89626528', '308.199859'],
   ['453', '197.0771094', '295.29873', '280.7888469', '50.59931548', '291.2451844', '85.57306811', '174.3518196', '135.2892841', '189.9492874', '5.79515767', '88.3720994', '29.1639264', '146.7618804', '51.01097849', '68.89947379', '30.73080237', '109.8357704', '79.12215947', '193.768101', '100.8699824', '146.592625', '137.2897493', '69.45388595', '377.7951826', '143.6887053', '98.17348042', '32.28180123', '296.5606658', '171.3145308', '477.1152678'],
   ['454', '394.8410376', '467.6408382', '321.9631064', '441.3514209', '482.8213656', '471.014473', '402.7647115', '262.6380726', '495.497312', '498.6672756', '488.3164331', '494.0929999', '437.6886053', '499.4653836', '483.0173292', '498.0847237', '481.7407064', '487.349963', '482.8721762', '498.8300669', '495.5711153', '442.2562825', '423.8277894', '470.7721951', '447.4159775', '492.5192979', '490.1659558', '427.0371809', '430.653007', '402.5780317'],
   ['455', '34.87261182', '41.78519159', '18.13345717', '11.56039402', '55.27650717', '65.13337851', '17.76244465', '99.96878009', '8.888876238', '10.87441265', '89.36768776', '14.15327936', '42.76868075', '51.94677152', '145.727186', '15.01824054', '83.60395649', '34.45825358', '59.52749333', '96.58895295', '126.3056672', '47.0258834', '47.04537743', '190.4802459', '42.88257171', '170.2198818', '102.7759626', '102.8240821', '300.0368901', '39.02141847'],
   ['456', '437.1739265', '64.99834541', '244.1124522', '10.35193237', '146.8667447', '26.11955224', '15.58482352', '64.82148185', '1.650113231', '3.09955841', '28.84153233', '2.563942367', '170.9790236', '21.57635662', '21.20942311', '16.43393675', '11.68077234', '0.399171264', '4.081927016', '132.8487984', '185.7528684', '343.2196074', '482.9725225', '296.8634087', '184.5364', '467.0139138', '449.2628402', '398.2306569', '271.6916211', '464.4557872'],
   ['457', '96.06094427', '5.283521146', '5.985812521', '39.78814641', '351.9961597', '82.16170525', '19.73740337', '47.59749916', '26.43883916', '32.41803727', '151.1105405', '43.87396365', '189.9277211', '157.7577003', '49.61117297', '79.69847842', '41.90561751', '17.37685572', '21.50410283', '484.3037215', '448.6604525', '103.4216445', '14.39826971', '223.242632', '13.47159448', '13.49614168', '13.32535295', '166.1100829', '8.537517159', '426.460917'],
   ['458', '496.1068426', '469.1472512', '492.9766274', '472.2787633', '491.1544023', '463.7496196', '463.852707', '431.5278826', '414.5756583', '481.0128387', '422.456653', '425.4556106', '489.9189976', '458.8788638', '337.2922799', '414.8788517', '396.4399628', '378.3998609', '434.9782054', '470.2734431', '419.1245845', '493.0719975', '494.2333354', '492.175554', '490.4711915', '471.4543249', '379.9963163', '493.4867563', '473.3185418', '499.1722666'],
   ['459', '6.684823304', '31.2873899', '2.285755413', '2.540016834', '8.807877024', '15.62279473', '22.79613475', '12.26594982', '59.05026521', '7.113729497', '33.81893893', '56.51076299', '214.061177', '141.4338512', '136.6941294', '15.61100513', '71.43010553', '269.5176571', '375.394262', '137.4496976', '135.4797648', '194.6551336', '166.544732', '14.98431845', '21.18595493', '252.9484487', '112.9921171', '6.013357006', '100.3987423', '356.5764323'],
   ['460', '49.14887167', '188.6168009', '20.41199577', '5.650391838', '399.2220633', '19.89867807', '144.7187599', '6.229854426', '105.7294676', '59.20226681', '1.019564402', '19.13725288', '103.2202996', '18.74326565', '72.52952149', '48.24450281', '2.8859169', '19.73140333', '326.2274681', '386.3245868', '6.946848831', '213.4317967', '226.9465425', '176.0211918', '180.466082', '373.8220187', '268.570591', '47.50917427', '411.481846', '253.0023755'],
   ['461', '94.59342679', '192.2721963', '9.70745473', '5.896686434', '152.5609468', '103.3814453', '21.73293484', '20.93272788', '99.84545346', '219.4248933', '158.0801955', '182.9074832', '4.100438008', '76.82595439', '276.1320164', '45.02952494', '348.2103606', '469.7498867', '328.7686148', '480.4279754', '447.6531865', '5.604883373', '1.269584812', '28.73867779', '7.485736227', '190.8201635', '53.3813364', '23.96816526', '322.3317071', '1.709957124'],
   ['462', '403.5223899', '427.9580382', '429.4348465', '416.3609136', '478.2615779', '439.9562849', '117.9565875', '435.8322231', '104.8511151', '203.2324028', '472.3495224', '289.1090721', '86.4346979', '88.45918704', '17.5262671', '216.8836041', '31.28414978', '22.58728806', '53.19244337', '97.33235761', '51.32393261', '269.146973', '408.7930513', '456.2842907', '266.2894716', '394.0628669', '343.8513496', '477.1625354', '289.9015999', '486.5917945'],
   ['463', '27.69453567', '34.61233409', '4.978507203', '16.010881', '28.49947337', '12.10570718', '91.00345061', '97.54526654', '7.679323897', '12.13009702', '22.80523219', '7.143499676', '153.5026619', '4.690816927', '108.2958268', '4.306162196', '6.235469929', '26.6430496', '175.4510919', '182.6250541', '109.4909136', '132.3222935', '176.6896102', '12.49058229', '16.48166722', '5.348459632', '4.890106309', '99.07351189', '26.9688903', '428.4044314'],
   ['464', '2.252493833', '191.5531507', '6.850691211', '6.041347768', '127.8609734', '52.42872016', '23.54391673', '14.15016983', '66.68168257', '1.168749558', '67.02820621', '79.02381651', '250.3870931', '117.7545475', '185.844921', '118.7086775', '353.11249', '448.8111594', '109.7001927', '463.8490232', '482.8530575', '197.8056837', '25.76145434', '31.52534625', '64.30457052', '358.2819561', '218.4066494', '4.794631185', '16.6227275', '3.357831854'],
   ['465', '1.727247759', '42.68606525', '21.27133094', '1.270543998', '119.7969072', '11.44537639', '2.32142125', '1.275376877', '1.67481002', '0.54643034', '0.645184205', '0.68931163', '6.735098055', '1.021900396', '0.552493727', '4.358582441', '7.751604867', '0.083305692', '2.334118067', '235.3142479', '90.06204187', '239.3085915', '28.08386329', '45.69310943', '6.598203961', '197.0264789', '19.97063129', '4.004153661', '39.13165902', '302.8359372'],
   ['466', '147.9388201', '141.8577922', '29.80264198', '73.34699281', '25.56723642', '10.05169849', '16.96052592', '24.08340672', '246.2080971', '324.9434597', '0.872834214', '135.7924391', '15.32031864', '25.79281522', '96.68833967', '12.9140996', '15.84718515', '7.966601226', '84.0945567', '27.23909239', '21.12941912', '10.2663538', '6.721758948', '39.92346174', '154.3322489', '7.29662416', '12.35431069', '12.1668588', '252.3463909', '6.054598933'],
   ['467', '394.4183384', '236.0976935', '297.7067625', '487.4028782', '63.97378509', '73.2090377', '57.04583343', '492.7104298', '31.3550961', '4.534744681', '235.6566744', '99.75720787', '163.1033718', '52.95848771', '14.63008637', '60.94831573', '171.6064441', '1.949119693', '78.32241684', '455.4064432', '109.778366', '334.9026802', '364.1961312', '418.7558106', '266.4720316', '422.7181731', '459.4388701', '386.871916', '409.3615491', '464.6055298'],
   ['468', '446.0165455', '478.8107477', '475.6831475', '467.9250022', '429.0059379', '444.8561287', '486.813266', '458.2916407', '490.1067218', '404.3842787', '472.3650281', '470.5872944', '489.5560752', '477.9550079', '391.7937449', '481.6675877', '333.9310023', '487.672769', '470.6596345', '477.0074502', '462.6924069', '466.8794842', '426.6909189', '451.1449148', '454.5172506', '464.539568', '459.796452', '465.7732045', '422.733948', '458.948783'],
   ['469', '495.9014604', '464.6869031', '390.0475266', '490.0861595', '480.6154742', '492.6806332', '497.4798845', '499.0060814', '498.344853', '498.2499092', '492.8540728', '488.6448525', '471.2448015', '497.3605338', '492.3833505', '481.4095166', '401.4197464', '484.3384733', '494.5120619', '491.0813817', '484.2623799', '371.1500988', '466.2074758', '309.0788611', '467.9331287', '423.3148286', '402.2604169', '490.2207616', '453.4463668', '444.2550351'],
   ['470', '291.2490451', '119.288608', '33.40847543', '459.4423424', '399.1925151', '415.9858845', '118.7054744', '479.1827062', '73.28996113', '66.25473361', '260.9121099', '43.356226', '73.57147948', '10.22029638', '79.67975986', '30.70089277', '40.64850534', '3.122600483', '209.4516651', '325.0085951', '22.04635278', '53.53076329', '87.00931537', '86.99769273', '255.6528645', '204.5093822', '204.1411719', '126.2164672', '480.8364812', '8.699898377'],
   ['471', '40.90910632', '67.59150498', '30.84975347', '13.19593085', '61.13753231', '76.20240251', '61.37290723', '23.74311887', '211.7920305', '86.78831125', '133.1824508', '45.77304285', '6.622375288', '82.57284361', '45.85590313', '93.73060902', '87.13831883', '33.86445607', '127.7907661', '292.3450476', '297.2881773', '14.99216008', '54.34917259', '6.709963123', '19.44044312', '45.46822564', '109.3034021', '11.00338934', '332.5652044', '9.581617792'],
   ['472', '269.0164544', '130.6162822', '34.1778069', '388.6385654', '40.03847593', '163.0963985', '298.8325539', '272.6076594', '104.2766297', '330.1503679', '403.4265335', '161.3362012', '249.9726055', '368.329418', '79.77603613', '377.5061937', '10.20385053', '8.923933339', '19.051472', '3.271774892', '1.771677474', '129.5957118', '404.2647291', '198.3308657', '356.034343', '102.3764003', '318.9885911', '347.0560975', '193.3710209', '353.7584742'],
   ['473', '2.014746138', '4.081533831', '1.056531476', '1.186928273', '1.751707222', '3.793227864', '0.851221556', '3.933109306', '8.45054061', '7.455776584', '19.4138329', '4.125830614', '1.534876272', '5.009055042', '2.249213905', '3.955379145', '12.1891805', '15.35031072', '3.454519484', '4.362614173', '33.37458564', '1.39500809', '5.211135939', '1.659863635', '1.6961988', '3.302925266', '0.636916615', '1.177439956', '10.84077903', '2.51351083'],
   ['474', '4.718937176', '135.6425716', '0.451067849', '2.712642716', '3.423673615', '7.863619484', '0.445676274', '10.40130005', '0.625925395', '2.087231527', '0.349498315', '1.145631835', '0.14559675', '1.369038781', '14.65170147', '1.458090186', '3.637395359', '0.452964061', '1.249987513', '2.607971625', '0.605473136', '0.487329964', '2.389935866', '8.088921242', '0.700256343', '61.13848051', '19.44504409', '3.176475972', '82.38192981', '5.74569544'],
   ['475', '477.5623014', '406.3458243', '103.4831505', '294.3640637', '366.1358801', '351.115775', '3.784992569', '432.0682088', '31.64017485', '41.92263632', '28.6950591', '185.496319', '96.36566543', '387.2668466', '282.2448917', '88.30316931', '379.9391124', '8.854241467', '45.85486104', '499.0728118', '490.6295365', '329.6621126', '290.4516406', '339.1404121', '309.3449723', '452.8746243', '412.1115445', '424.8552142', '490.7161151', '340.5883537'],
   ['476', '27.05839837', '230.5506523', '98.57034701', '188.7981057', '51.47757652', '86.06082614', '159.4638337', '459.1085686', '122.5855685', '116.5971216', '298.7178399', '56.00367496', '394.9127746', '109.9221829', '126.3101379', '268.9573461', '47.51959713', '202.8899736', '45.1892199', '40.71716068', '79.86729616', '104.3686659', '189.301296', '27.93585327', '234.8929669', '44.31795244', '48.0855529', '112.1506856', '107.1144005', '108.9836258'],
   ['477', '52.14675052', '45.07646515', '374.65823', '407.0287361', '198.1169025', '89.18284735', '71.61217168', '374.6324606', '5.369895107', '13.55790713', '279.918164', '21.70492819', '5.49895649', '6.520680696', '7.646682247', '6.323070109', '24.64518967', '0.592787762', '65.46222798', '477.8602146', '392.4431231', '72.59278471', '36.34200363', '281.925487', '76.19094841', '50.83933132', '71.24816977', '194.3670651', '256.4655998', '104.3804762'],
   ['478', '349.6466737', '401.2766596', '32.75511539', '184.8591021', '234.2510974', '276.8158583', '316.1356247', '450.5786741', '197.4047511', '32.13433265', '441.9579105', '52.39552842', '420.8857977', '379.0795813', '279.4144595', '48.09663877', '321.4211116', '15.74737652', '234.8446259', '293.2012895', '48.23092141', '382.9598074', '460.8278204', '355.7881817', '389.8513493', '492.7522413', '488.9701699', '202.9696508', '493.8850537', '332.9339208'],
   ['479', '53.54414061', '426.1846928', '207.0211134', '78.15005907', '381.0515408', '323.766002', '98.35063534', '263.8722418', '469.1277513', '361.7155769', '316.3015286', '245.9201978', '318.2585528', '35.88800981', '389.0826511', '333.5573711', '194.4310468', '497.2312298', '459.42564', '489.8185183', '472.6406749', '240.1814611', '59.83676699', '67.44229394', '193.8287954', '473.2008774', '441.3312442', '102.3921025', '311.7989276', '55.2886557'],
   ['480', '78.94425637', '75.74462775', '73.17977523', '92.3184752', '45.17772048', '98.8553055', '33.8587495', '146.5017131', '241.4043677', '33.94094996', '112.0505751', '65.26576818', '84.75008131', '96.97577199', '70.8733726', '141.6912282', '135.1806414', '211.8446712', '51.76259695', '40.05168178', '22.22423463', '103.4737109', '83.47804895', '51.01575282', '74.61069783', '143.142104', '312.1444907', '70.39290696', '70.62477234', '142.5415004'],
   ['481', '20.01733038', '359.2925893', '147.9220831', '107.2144032', '29.72456548', '11.39610779', '257.4392607', '151.5982756', '62.60213014', '8.79967691', '243.9875927', '10.53443064', '13.1427216', '7.326800323', '30.66728034', '17.57066024', '5.599176186', '0.9312149', '42.75492672', '337.4109819', '356.1887139', '29.6482487', '72.10689044', '40.75332342', '15.07133816', '203.996114', '39.7261575', '19.44345064', '323.4620066', '131.7868802'],
   ['482', '125.9019986', '32.78530823', '35.25065219', '4.305681084', '84.66486516', '13.77252098', '262.3533877', '13.42030862', '96.03191996', '0.93390434', '16.73597', '443.3832991', '215.5065982', '246.7923943', '408.1994673', '208.9486778', '274.7877128', '479.127116', '451.5451313', '122.1719293', '7.289313431', '18.77026895', '43.80632601', '65.04869257', '97.18174122', '369.0754808', '377.5247632', '129.7174476', '110.9922055', '22.98957384'],
   ['483', '283.3234632', '229.1154597', '205.4170661', '433.3755657', '287.1006578', '86.12058195', '186.3976802', '406.5710197', '178.8553081', '16.17919668', '371.7511476', '117.4324317', '119.566651', '12.60296362', '27.73889616', '72.99242179', '24.64832216', '78.63183351', '43.70574376', '2.73847627', '1.493621397', '134.9019695', '445.392375', '296.8409761', '261.4117363', '401.8217829', '462.2537459', '316.3786077', '395.9811247', '45.36135952'],
   ['484', '290.3556332', '16.10092256', '54.28211553', '7.26414364', '20.70688975', '9.038388512', '2.821080288', '15.03059353', '3.909740539', '1.804821222', '5.789238723', '17.58152466', '4.923767409', '12.96468476', '82.43449667', '4.566166974', '7.100724019', '1.274414413', '12.48931353', '378.6123565', '61.42954076', '26.96411449', '55.71110658', '158.2953707', '31.36600432', '30.16337808', '11.13321347', '151.9904147', '91.2927088', '437.8181025'],
   ['485', '9.047981172', '295.6336868', '4.150374296', '11.62781556', '52.30162582', '10.6416351', '45.01004678', '11.64680869', '109.4671914', '22.43174191', '0.243278383', '103.2648024', '42.42180236', '2.589585674', '74.06996455', '88.77969195', '13.31790177', '366.555479', '315.6578159', '147.2704957', '1.722617871', '9.996702012', '6.598747675', '104.1331561', '60.99680099', '54.69238769', '155.0489935', '22.76278544', '344.8607107', '11.73544814'],
   ['486', '4.964770702', '318.2680631', '23.45215557', '142.085793', '20.08770924', '38.14755985', '7.027601907', '450.0198309', '29.70129912', '250.9673181', '439.2096694', '1.374631774', '127.3171936', '7.342162826', '3.16910161', '16.15765167', '7.460789322', '18.74792271', '0.919317311', '314.9851655', '173.8766667', '200.7687078', '35.43104287', '7.514590339', '134.0547107', '216.2057604', '170.1260965', '7.169114935', '14.81361245', '0.957856085'],
   ['487', '446.5286592', '147.3888117', '316.9751454', '100.8866734', '46.4713805', '31.84459145', '22.71659586', '385.5769657', '51.60244049', '1.444770334', '427.5456553', '42.60371382', '358.0146616', '10.30137853', '11.03265581', '36.96280094', '46.27614918', '72.4897531', '59.1744104', '101.0449251', '21.12162978', '127.4106946', '460.212408', '344.8993501', '307.5228336', '268.2197056', '248.2020254', '477.7556275', '387.7928682', '493.3113447'],
   ['488', '2.636869312', '52.07824647', '17.76206447', '36.79023782', '68.66369569', '94.56398333', '115.6001443', '61.99478282', '263.7758299', '217.5626672', '110.8352812', '365.3393659', '303.1028582', '75.17385662', '268.9602843', '326.076146', '66.87456668', '477.9616754', '22.81971507', '262.4016938', '162.0982272', '130.8461741', '4.439918127', '9.398775026', '375.4257887', '412.1572983', '466.6613003', '4.580072194', '51.81133128', '0.572215852'],
   ['489', '50.84313151', '86.94231373', '19.04412345', '74.23963569', '16.96944518', '34.05431451', '34.21598094', '72.97886866', '70.11601492', '6.520714056', '73.55209936', '48.79031277', '44.02624511', '147.0628903', '174.8134656', '62.54767806', '278.5049883', '28.36998386', '52.4415517', '37.03826915', '22.11875593', '35.77646651', '16.69820254', '13.34967381', '92.5855428', '192.9199924', '212.5231972', '62.64269403', '122.0698482', '40.76375298'],
   ['490', '29.48469792', '6.807076483', '150.4393834', '33.67868829', '5.778548063', '2.663361793', '34.04387027', '15.32728824', '23.62618931', '8.428056826', '46.68104398', '3.632987093', '111.432377', '1.437592483', '11.36738397', '25.55387835', '3.801456987', '44.55760186', '20.13445636', '7.735152824', '0.660141604', '136.2116159', '233.9960015', '44.0321407', '42.65848559', '75.21817575', '89.4483561', '160.6622946', '20.72498972', '386.4994428'],
   ['491', '16.49710858', '41.06788672', '11.31594396', '133.6268617', '410.4356834', '297.8167697', '41.87287993', '255.9948509', '157.4158705', '38.14023683', '402.8253385', '333.770229', '53.43462737', '442.0053938', '301.6444141', '101.0297018', '267.9893028', '90.17858591', '188.7214291', '268.1113168', '339.4073967', '340.0146749', '200.0787386', '79.51019842', '26.44506033', '38.2242481', '24.73277143', '63.38701143', '21.64163789', '145.3077692'],
   ['492', '1.074319404', '3.957128238', '8.426117071', '187.5167341', '0.727605436', '2.608829317', '1.093506432', '173.4232675', '6.009565529', '1.533674641', '62.41765985', '3.287250071', '1.387435153', '1.916840751', '1.183367589', '4.095530791', '15.00182645', '0.752499793', '3.719137076', '54.7088194', '84.98503702', '8.235103386', '6.87051114', '6.936547119', '3.037291991', '3.240714187', '7.330108754', '3.213981996', '1.663496713', '11.64411962'],
   ['493', '219.1399606', '466.9635517', '141.6223978', '253.3244032', '282.5701667', '285.836895', '247.5680575', '303.0846371', '478.0763363', '192.2813742', '21.0834156', '264.9919472', '414.1241378', '118.7575436', '306.137818', '402.1686407', '325.1595655', '477.7592798', '423.506349', '97.35212499', '33.32892889', '361.7659074', '118.4417012', '419.0114799', '399.484916', '494.1649428', '494.068131', '209.4379939', '388.8380358', '255.3250077'],
   ['494', '459.0839456', '484.0897993', '403.2355127', '347.4979357', '411.7035866', '443.8977029', '489.8365286', '475.0345669', '479.7807993', '469.6291808', '488.8706969', '472.1889273', '491.4592496', '478.9041571', '461.6596141', '469.7104623', '442.6498397', '490.6368869', '441.4413039', '484.8490114', '380.3418012', '467.4627475', '427.6236854', '467.1174127', '491.9531797', '456.3393627', '479.8929789', '465.9050721', '468.3018158', '485.4870711'],
   ['495', '245.9053098', '18.3694289', '50.2168481', '115.7081624', '206.7041754', '75.29811584', '60.8235661', '360.575472', '23.88448901', '0.7657085', '51.90683298', '52.3685976', '200.0776611', '36.03926308', '9.908923409', '20.19367626', '424.5341374', '214.0536539', '212.4746048', '342.7651761', '406.9900089', '237.1518771', '470.1706737', '338.1175293', '182.1811866', '208.1882878', '173.2157212', '427.8500817', '150.6467102', '455.7796743'],
   ['496', '21.40670372', '10.42815833', '17.4631115', '0.714083936', '15.80112095', '9.263453154', '27.22376134', '3.315258864', '15.70348731', '39.95099812', '0.391560266', '31.77199285', '120.9922314', '176.9794835', '182.3013023', '7.988850719', '28.49976188', '89.5811679', '220.5209868', '413.8077368', '420.7976094', '32.3364178', '15.0261611', '5.203486598', '25.67661552', '14.29045909', '20.56505661', '8.547147059', '41.81995567', '14.12326095'],
   ['497', '261.09422', '11.68271243', '4.804276174', '188.3381054', '488.072805', '396.4858667', '250.510626', '406.7675553', '146.4389354', '2.255165141', '325.6719665', '357.0701971', '316.9227386', '418.3298665', '475.7063039', '243.7062357', '174.3828937', '10.68758668', '386.6902873', '332.8437271', '65.90800105', '68.82137121', '53.40717724', '35.29268775', '138.9583586', '401.2462886', '362.6821051', '48.33954454', '487.0044832', '37.47698459'],
   ['498', '0.988045025', '10.04232812', '0.498495887', '197.5582195', '187.8888802', '31.25522118', '32.42495262', '216.3743173', '52.30763401', '2.733018949', '387.9417285', '104.6992786', '10.44311648', '3.506658077', '22.27173951', '28.22850864', '344.1218834', '313.739973', '344.3891691', '38.27874466', '9.36928922', '18.22953486', '1.807891987', '7.095812031', '4.403736295', '27.50605164', '30.93107652', '0.962200189', '19.19263365', '37.91803102'],
   ['499', '7.624990809', '24.40078415', '10.15214371', '13.60659916', '18.4968094', '13.56615437', '83.97935308', '35.97506158', '29.57259507', '4.407552947', '17.41661891', '15.65217393', '12.54369089', '6.47881344', '8.589035472', '10.3908404', '4.294733171', '23.83363095', '11.65307908', '47.49224386', '34.22661515', '27.60533256', '37.36310327', '13.82046975', '4.035457955', '88.56335684', '46.11255713', '5.265751279', '36.63728599', '5.500517029'],
   ['500', '36.28546726', '2.549858238', '35.55233063', '353.379331', '281.0524572', '279.3645601', '21.30135911', '439.0399436', '10.79896294', '6.286662007', '479.6609672', '34.91246255', '9.651945717', '84.90245799', '7.298616183', '7.519221021', '275.243934', '0.69005325', '25.93398958', '496.2297502', '490.5771483', '114.8437835', '26.54954958', '266.2440051', '15.69241708', '6.713057987', '1.932826375', '68.07675609', '6.436639974', '221.2195789'],
   ['501', '103.6942074', '323.6720293', '205.6364655', '477.133503', '477.0662414', '466.3038953', '10.79410845', '496.9197351', '70.54566252', '40.0827753', '496.0536756', '128.0344899', '386.0381289', '342.1933209', '20.29137699', '88.2665742', '201.2408346', '199.2042993', '151.1465934', '448.4437149', '374.2457802', '300.6314215', '224.0533359', '114.5517405', '275.9761758', '130.2304519', '93.55097591', '71.34680626', '346.5767343', '344.842327'],
   ['502', '236.7573137', '270.4233992', '6.464970281', '58.27365239', '306.8675891', '346.0395427', '4.133714817', '7.367432661', '246.4794085', '104.9086673', '3.155580962', '114.8018004', '6.367818497', '15.68045842', '169.9275259', '132.0511887', '23.65253452', '31.07380863', '122.0377531', '370.6187656', '165.9910788', '10.08577202', '13.6412682', '47.18115372', '21.88726977', '328.3992817', '313.9042155', '102.6249039', '458.9447859', '29.33544178'],
   ['503', '89.07224279', '356.4829051', '26.81745379', '142.069411', '54.63054451', '67.60052403', '98.54808706', '116.4358273', '352.0112948', '31.70822282', '2.926793277', '295.394084', '144.6818121', '167.9103553', '459.0703148', '249.6707555', '207.9209445', '43.63045016', '361.618432', '7.399034612', '0.87510764', '12.67759948', '19.95748103', '199.3438718', '240.0784604', '144.0130192', '368.5532133', '12.57748892', '414.2264264', '28.37872806'],
   ['504', '123.8391135', '24.20046986', '1.114960157', '62.71476732', '326.1475673', '125.7878647', '6.385870127', '118.4857042', '144.661052', '24.97809138', '364.9255488', '43.09016283', '4.883649166', '15.07515016', '10.08678257', '52.0737281', '201.3761319', '344.5544291', '33.5138114', '23.55731493', '25.80344282', '11.80482863', '1.955212188', '62.64278149', '40.17007372', '8.078662894', '16.95350161', '95.07976256', '196.2419914', '3.974434288'],
   ['505', '0.906070937', '29.20703632', '3.267763508', '64.07709618', '187.9650195', '291.8738817', '0.584133962', '202.7405864', '7.812167732', '36.88233099', '286.7049349', '11.04915862', '1.126718003', '55.80611561', '3.82103503', '11.78053708', '201.0830512', '1.039077835', '10.30746691', '458.0409495', '386.9428746', '6.649679934', '1.037759792', '3.290834546', '2.878000914', '88.72151583', '26.01166421', '0.183822804', '45.5969784', '1.870465432'],
   ['506', '33.43266175', '53.28403888', '160.3540999', '20.35795903', '12.37568449', '19.50568091', '1.944593993', '332.3820095', '0.815085166', '0.105419875', '12.1145346', '1.257231562', '2.041063322', '0.195816062', '5.184555835', '1.198793882', '2.541022699', '0.033704405', '1.700875401', '0.827620012', '0.236754602', '8.757610187', '124.6698005', '23.92631304', '11.21582988', '67.05781822', '45.00278954', '28.95397068', '322.9675525', '150.2853904'],
   ['507', '66.9188475', '22.43161047', '72.05276449', '96.56297582', '21.56503965', '53.59393514', '20.69197477', '388.9308073', '17.35001579', '6.272590502', '39.22163334', '51.30571879', '122.4668734', '94.4786113', '10.84834778', '12.14580757', '56.25971624', '52.22109912', '37.33214155', '243.3233618', '224.8896459', '51.72784724', '252.2834062', '132.3282097', '58.94575476', '40.22411488', '35.92086761', '98.14111034', '136.4314837', '305.7980734'],
   ['508', '15.45094172', '202.2885791', '7.052326152', '10.24537049', '285.1753411', '63.0777531', '103.5908531', '5.509393075', '202.7082556', '237.1781194', '174.0452663', '33.4308098', '47.75057018', '10.27868579', '52.15150734', '179.6073847', '56.60245121', '242.679442', '133.2947433', '494.4886669', '465.1782263', '244.7697135', '2.201159686', '18.30913444', '40.15749371', '449.3914669', '368.0898036', '30.97339111', '359.8011652', '120.4200745'],
   ['509', '9.527242102', '14.93446955', '5.353016773', '141.878227', '338.389318', '288.0623658', '274.5117303', '346.383238', '353.9993423', '380.5447756', '340.9499238', '260.6315991', '182.2779306', '116.7744521', '325.11385', '222.502824', '328.4964344', '392.9679248', '451.9009511', '488.5444226', '462.135694', '190.51321', '16.95212615', '49.53932262', '16.30042566', '125.8186201', '62.77698375', '38.88268788', '20.46005082', '459.055298'],
   ['510', '33.87280763', '26.82233752', '16.32850197', '287.8519867', '55.64216993', '11.77712377', '4.916026211', '303.726822', '20.66943937', '6.828012004', '23.77952811', '3.256584042', '63.57844321', '1.387497792', '8.820390301', '47.75439799', '21.53807291', '132.4464503', '5.032103015', '13.32606221', '0.952848725', '287.1702783', '100.3281812', '17.51910499', '94.58253904', '55.51898437', '32.05769855', '187.3280958', '4.25639798', '395.6563527'],
   ['511', '154.0902003', '66.43132913', '97.18488453', '3.267522813', '103.6149371', '13.93101704', '5.320162926', '11.42916882', '1.776410323', '3.75817744', '10.39918463', '3.281239762', '113.1399083', '1.351108002', '8.683980109', '2.215348273', '3.135938461', '4.824372708', '1.644281399', '95.99326765', '214.5645167', '177.6248394', '128.0449956', '361.1626548', '171.8273755', '68.1821258', '62.59257086', '92.90596731', '152.8091196', '327.01723'],
   ['512', '35.89605368', '132.7872395', '63.25395908', '14.27382358', '477.3456265', '317.619239', '4.424619597', '14.65186077', '30.95724012', '0.862984184', '1.119542152', '174.2278851', '121.1345791', '42.6853666', '9.314910103', '96.77067875', '341.6677862', '192.9581274', '313.7507015', '359.5897415', '143.4066784', '232.0380123', '26.48475906', '23.67295873', '22.70855213', '224.6911375', '61.51348948', '11.04489916', '104.3658826', '6.925019363'],
   ['513', '491.1142995', '16.89883642', '376.8677834', '167.1762294', '406.6436062', '181.6966247', '173.2433934', '359.2376174', '21.92954149', '22.28796545', '386.3130102', '14.02015266', '24.07717345', '33.34491888', '129.8544837', '7.957776279', '3.943604838', '0.187439285', '49.83357675', '373.7293789', '366.5583034', '327.5428112', '455.2881783', '457.7112446', '81.29618926', '19.56362026', '17.91169032', '486.4413146', '302.6988558', '497.3559532'],
   ['514', '433.3310194', '455.8781416', '340.3230375', '496.42341', '372.4579348', '452.4662362', '412.6182039', '496.035588', '432.141231', '342.0975201', '466.7182322', '409.1036574', '498.0967348', '498.3604263', '477.0050811', '456.3657617', '469.8260143', '372.6899379', '481.7609103', '498.9206458', '492.3849825', '491.7098391', '450.8938164', '446.7490985', '493.6556463', '493.8146834', '488.5762639', '432.8363612', '478.3099502', '468.5471728'],
   ['515', '26.19457082', '40.01225578', '1.215765319', '37.73188339', '372.8314085', '159.2382387', '130.6759143', '142.6410577', '291.6121644', '3.08562665', '101.7115907', '59.19395896', '119.4127687', '15.23522271', '43.38891026', '58.78877933', '349.1889018', '424.2111436', '247.0144895', '243.1231923', '65.85468002', '25.55338662', '13.44504048', '81.97456202', '11.31983579', '102.1905664', '84.87222196', '17.28922356', '162.3792849', '13.93890737'],
   ['516', '10.72365635', '31.66627992', '2.284923103', '11.36342987', '5.7716546', '6.941500954', '9.050543695', '19.58587705', '29.59151882', '1.66496081', '0.7701193', '1.279258061', '10.40991336', '18.04827988', '77.35765465', '32.7002754', '101.9912391', '15.77832824', '14.18282948', '238.2936276', '51.40095911', '74.43031345', '14.84653302', '5.514904896', '15.25598869', '335.0129067', '294.789231', '10.83646361', '38.09763734', '20.34491899'],
   ['517', '6.760982105', '168.7315582', '1.653047047', '1.866193834', '473.8291395', '270.649206', '6.804117312', '3.615522457', '57.24617637', '10.21128835', '1.461624739', '157.8535726', '40.1275067', '318.799361', '433.0017209', '222.6843706', '447.8595504', '384.1606986', '283.5703516', '411.8913987', '462.2940351', '8.404169727', '7.551101898', '1.507580411', '13.55251308', '347.638513', '322.1476004', '6.333923219', '90.85501055', '3.110734395'],
   ['518', '488.6867641', '297.8357055', '404.4282789', '160.4887322', '432.9309275', '418.9308182', '470.9582479', '296.255256', '452.8015828', '403.8980492', '177.8562922', '375.4937167', '485.5524952', '432.5337782', '423.624671', '453.6597827', '228.5365721', '474.3147259', '456.2003235', '494.3900762', '463.5197401', '144.4132524', '492.7819772', '130.5080067', '312.4646403', '60.45288472', '36.24231633', '496.9446743', '355.9689732', '498.3313573'],
   ['519', '0.507758524', '40.14954127', '0.320639091', '5.679843492', '452.0702274', '115.5820507', '1.39812015', '22.6794475', '51.59317062', '11.25515834', '12.79647627', '25.42512836', '19.79823462', '159.5054308', '129.423329', '30.91668574', '365.8608635', '443.5989458', '315.724981', '381.2334365', '299.7532', '6.242482075', '0.839085657', '0.416548438', '1.90751294', '254.0271542', '130.2568143', '0.356372936', '205.8434728', '3.12307168'],
   ['520', '11.59921872', '199.3652402', '3.605612967', '64.71809948', '481.2487007', '442.6503642', '416.1462261', '271.4266045', '400.8339248', '293.3440359', '388.4584192', '294.1063257', '256.6871937', '456.9175892', '429.6668458', '257.7659628', '408.3967344', '406.9635722', '450.9218193', '493.7015588', '429.5195513', '52.42577969', '3.546481115', '3.427398095', '49.10962236', '382.6525273', '348.1097043', '4.4728611', '292.3761973', '16.17997027'],
   ['521', '39.39787512', '50.21052325', '23.47229669', '26.68440854', '47.98883092', '30.71325948', '2.562614991', '99.06999244', '9.557292128', '16.76765348', '7.716142286', '47.81636184', '272.9170756', '290.6741185', '85.07492367', '24.34660815', '8.729522555', '0.783767255', '22.1333992', '111.18968', '61.43672419', '197.178151', '392.6914304', '28.11720424', '116.8438815', '164.1692405', '130.4698189', '26.05370547', '162.631951', '42.21988915'],
   ['522', '41.01543945', '306.0279325', '67.62651108', '32.87978723', '166.1158158', '152.8114316', '318.7793617', '277.8324845', '394.644126', '265.011284', '354.3078427', '208.6212734', '497.4885144', '284.8482736', '126.1919921', '76.55827719', '265.2110395', '490.154745', '420.6710083', '2.030435801', '3.377236615', '448.9158474', '474.4134143', '23.35197163', '447.042037', '208.6993914', '116.8337307', '27.71498223', '90.35220253', '34.13638945'],
   ['523', '27.81905585', '95.13896983', '8.716280469', '74.40402366', '386.3711769', '241.5073552', '0.82421094', '163.789935', '10.94172026', '1.261696207', '12.49305963', '2.363147624', '4.51022969', '14.83668412', '16.45996677', '34.99664754', '239.839857', '8.461962132', '6.00208739', '418.2586434', '173.1947607', '5.485284424', '15.14031808', '35.11129222', '9.243698965', '161.2763878', '197.0303686', '22.20594377', '23.10632536', '1.263818412'],
   ['524', '6.390141148', '79.07521546', '29.89011876', '38.59401968', '450.3197663', '201.6179968', '33.88917942', '194.4628754', '206.1612385', '5.672978723', '322.9382796', '431.758297', '280.4414384', '105.2250526', '276.4840615', '176.2169611', '46.9218224', '210.2694107', '377.589649', '351.3760328', '285.3468995', '400.755757', '325.1615881', '141.2723754', '54.06066076', '201.1467436', '256.3103122', '12.78644847', '115.9808698', '21.57374522'],
   ['525', '11.85752813', '287.0939145', '23.24861776', '16.49678635', '145.4490161', '23.9191086', '2.584445874', '183.5950075', '13.80605995', '1.976320595', '25.81610178', '21.31223742', '114.7211962', '32.29030313', '29.92703088', '10.29757589', '98.41239229', '205.8840776', '76.01707311', '393.6097255', '110.2821343', '93.44063319', '86.97022257', '7.651267647', '64.79859927', '35.98289198', '20.2994611', '12.36380976', '281.0207545', '260.6377728'],
   ['526', '49.0647526', '62.76525634', '4.049730201', '17.29006633', '2.703995843', '9.387938121', '244.1171603', '27.08520072', '109.6691213', '12.18749932', '9.352390882', '69.97179457', '180.1497591', '18.25716377', '181.0186527', '9.680123392', '144.8446443', '154.86686', '148.2417149', '8.267769757', '0.613189967', '75.43761064', '61.58784278', '37.8027604', '43.38507704', '98.04091827', '106.9565792', '53.0889961', '87.14859842', '426.7187156'],
   ['527', '90.41275551', '90.4111699', '17.69103943', '27.59159339', '106.2480678', '118.3721623', '100.7959594', '198.1479132', '218.79752', '28.55301128', '118.4131281', '42.49531183', '342.4839679', '12.46840566', '159.9837934', '189.5806105', '367.1287305', '448.79726', '80.09870636', '46.40171554', '65.71546301', '43.74535629', '227.418786', '28.63502723', '150.8200036', '54.0838578', '64.4943658', '149.1808983', '249.2126256', '383.2634168'],
   ['528', '99.91248968', '109.9813272', '14.55582956', '18.86383488', '487.8195448', '366.5930926', '92.5060349', '363.4242041', '417.8887206', '26.38002773', '289.0734399', '212.2652033', '467.6229614', '345.3220959', '307.4869183', '51.4624026', '78.14916325', '465.8136186', '381.027586', '338.5482889', '252.049085', '319.7196523', '295.2516769', '46.15338954', '339.8727129', '422.0157873', '303.2310671', '55.98440706', '455.284384', '214.7874663'],
   ['529', '374.2640183', '23.15565138', '346.7083768', '71.75053061', '451.3963852', '180.7992061', '321.6598537', '370.674128', '82.43288551', '48.60387701', '450.498142', '353.7518295', '494.1802374', '195.0202885', '445.4807485', '206.3538581', '292.7521873', '490.3217191', '455.7928085', '359.3984319', '325.247255', '463.2847627', '476.5749559', '458.9053723', '449.3785009', '285.9241154', '213.2131328', '358.0721798', '346.3557761', '477.6743196'],
   ['530', '286.9076694', '365.4448894', '57.33266095', '140.5763781', '13.48301501', '29.93320109', '450.2201185', '71.86682749', '399.6931402', '18.45367533', '24.84137902', '338.4909555', '445.9416288', '452.4208722', '132.2447278', '37.89293584', '471.0623029', '490.8616848', '488.2431525', '347.2366762', '153.6717355', '313.061205', '299.1772022', '263.4252241', '294.3131612', '229.6072494', '217.2571338', '333.0712976', '314.8625712', '287.079024'],
   ['531', '16.67610704', '3.5242279', '2.675603705', '12.59451563', '4.869943462', '11.46212751', '2.729871034', '44.90733654', '13.41512492', '0.310314085', '2.640859108', '19.67241309', '7.706073225', '205.7164956', '44.66165401', '14.03444344', '258.3755249', '5.080396496', '107.1968936', '193.2326022', '21.80158908', '5.783457014', '9.416045936', '6.701250558', '2.783895638', '28.86947375', '9.968526223', '1.376580967', '20.96023796', '3.04099886'],
   ['532', '1.966811794', '121.1831983', '13.90430862', '6.47120893', '286.2970973', '88.97529045', '15.51670312', '0.607803637', '315.9916553', '110.1100701', '0.704234261', '40.46427714', '332.4781895', '31.95938622', '92.69905545', '283.0901625', '78.27976608', '476.8171365', '187.3501397', '320.1372914', '26.24092361', '111.8851967', '1.568481153', '2.224677776', '16.68289878', '82.26076305', '165.5791112', '1.583828986', '16.02793768', '1.69868497'],
   ['533', '199.1713235', '330.2894143', '12.15345794', '54.60022426', '470.928804', '403.4243747', '19.82529619', '224.1600881', '455.1032805', '204.8156623', '154.5118867', '435.7625433', '384.4124535', '341.8800863', '327.5598491', '407.3947326', '456.6815405', '463.6721011', '399.272858', '44.5043643', '16.79391235', '241.3010529', '351.8485254', '198.5220873', '315.0147204', '283.6807436', '137.2807011', '211.6221416', '394.5505899', '61.33922445'],
   ['534', '2.740939174', '206.9491643', '14.32553873', '6.799935228', '226.4606579', '83.66710348', '88.34409447', '73.39993423', '100.4111051', '25.37647091', '200.2890279', '12.13614068', '454.8348866', '28.59863603', '11.15506408', '49.78955859', '87.5240771', '427.4007619', '27.62313164', '9.064847777', '27.22652106', '328.9704225', '112.4231059', '2.752324359', '102.0804502', '34.3033237', '5.717175612', '2.463608831', '8.429325222', '137.5587202'],
   ['535', '53.3001607', '189.7113384', '351.2473702', '481.7440471', '37.83700814', '189.7054483', '6.040556365', '491.3214772', '18.98190835', '92.78158197', '429.7657914', '17.63179696', '17.39467896', '59.93673728', '22.56469457', '9.795135168', '103.3389874', '0.472928232', '5.103623198', '109.8703753', '123.9259913', '35.98021945', '335.8774883', '298.8208162', '41.54847423', '196.7625346', '156.8421357', '44.045973', '276.5914448', '143.2586849'],
   ['536', '327.7178843', '437.5538419', '112.7386782', '11.02244724', '423.5573913', '175.4306504', '3.758175272', '74.21647779', '28.63138856', '5.022540015', '43.73681171', '20.04779632', '187.2477449', '92.83364822', '209.591314', '112.4878635', '250.2613186', '199.8253244', '14.58314285', '481.1384433', '432.3402091', '102.8776575', '212.485792', '187.2187252', '185.2744892', '441.1725322', '164.1336468', '323.8842437', '158.899113', '405.1187326'],
   ['537', '10.0649982', '49.00388633', '69.76885725', '8.78331903', '3.241765553', '8.447757435', '278.394577', '28.78110098', '144.039196', '15.28663348', '31.31222305', '23.30486115', '183.0107182', '27.92859555', '106.6001475', '8.453949707', '13.64198645', '12.16362594', '30.68618657', '108.6510644', '62.79848956', '98.84526647', '79.01227416', '104.9546694', '75.64039579', '269.7035859', '370.4603939', '18.52136476', '111.4359397', '218.9376656'],
   ['538', '1.339782425', '0.559594385', '0.814715497', '0.811825646', '23.89962641', '1.850238871', '0.637743389', '5.537173011', '4.728751672', '1.300532541', '1.218139455', '1.304289735', '14.67935423', '1.377723447', '11.99494445', '3.122895509', '16.12680673', '1.170688364', '4.508483095', '1.452315909', '2.65353093', '2.034203274', '3.547565701', '0.225982144', '4.993529483', '3.721253854', '4.350358001', '1.82277673', '40.0500544', '2.558100762'],
   ['539', '365.3292794', '82.57564122', '5.250658635', '35.94251546', '15.67925235', '34.35301408', '3.524820659', '162.5956886', '13.69602108', '17.25435642', '58.6057891', '5.493001593', '42.90551211', '29.57321012', '13.27071126', '3.639939286', '28.11687447', '15.16586579', '11.61696602', '2.541210232', '2.944559703', '69.63244479', '367.9211477', '15.34749065', '25.71479594', '4.316540572', '2.798762955', '347.7755302', '173.5865359', '478.3578183'],
   ['540', '101.5039751', '314.7186701', '23.86881857', '105.3473104', '471.4216735', '433.5529945', '196.5634586', '287.5569459', '168.3770439', '14.07984394', '96.49401792', '247.9558024', '215.0883213', '51.70067591', '326.010902', '295.3729136', '34.3412899', '49.07880693', '197.0833109', '493.9302471', '448.957145', '256.2201069', '30.81935064', '62.31441296', '195.5471148', '494.1415579', '481.8984848', '16.10042476', '379.4623505', '3.226250045'],
   ['541', '471.927088', '450.00349', '485.4289902', '346.8095918', '488.1705992', '442.179546', '441.0466119', '447.6893553', '453.1118933', '383.1260919', '457.7286377', '420.7469645', '472.7264312', '407.1124431', '467.1110414', '490.8962619', '364.3600792', '491.1234571', '489.1541754', '471.4793025', '374.8399615', '462.9643417', '441.3460739', '468.0442022', '471.7179554', '483.9913478', '486.7323818', '490.7637372', '485.7787226', '491.896876'],
   ['542', '489.2889502', '47.36563532', '375.0090624', '38.2380373', '313.0858369', '303.4099214', '20.52470291', '17.47460922', '92.37183744', '202.8094221', '93.86715901', '448.5127844', '235.1577466', '472.9303419', '87.19110584', '402.7187679', '477.4039519', '424.5890867', '276.8526214', '11.60544439', '143.5696627', '257.5277144', '406.9039043', '431.4612915', '345.6580653', '202.9938351', '300.4456651', '465.1628175', '318.6961839', '438.4626'],
   ['543', '90.81915789', '162.5581754', '25.72826621', '438.3492495', '469.0427436', '362.6672137', '2.223181525', '310.0079222', '18.18714571', '131.106878', '411.5734018', '2.32567609', '66.03998587', '27.01558866', '4.969484833', '28.08069613', '100.5957401', '6.098404006', '16.26386485', '341.443548', '332.1259799', '140.2161193', '16.13425957', '8.849437581', '54.85515765', '55.75064852', '24.67430324', '67.00058244', '17.41382414', '278.8705421'],
   ['544', '1.844361181', '52.24873162', '98.26358821', '19.22372869', '8.224434614', '4.317111126', '114.9379512', '145.9519229', '1.918943022', '0.154061546', '15.7152397', '3.659642607', '3.961877051', '0.486162788', '4.091655342', '6.683241072', '1.287221689', '3.530740799', '5.085764218', '6.838011505', '5.241742277', '16.72716323', '40.07127021', '19.86553718', '9.753444406', '30.89424768', '9.088470216', '6.714281016', '5.49961408', '89.59632653'],
   ['545', '404.4930002', '12.40814845', '29.14229823', '425.7065298', '414.9264532', '381.328212', '28.33514346', '485.4637318', '29.12146474', '3.931549945', '346.3724707', '211.9134055', '14.03765761', '254.1537941', '300.7043206', '137.1498684', '45.73785603', '1.107235506', '48.97533769', '496.2573157', '492.4341434', '42.67140613', '43.58564048', '271.0086305', '166.7239767', '289.5753779', '347.137278', '322.438564', '479.7497246', '63.10970209'],
   ['546', '83.41584885', '229.1738442', '54.96878535', '232.5610498', '162.1763061', '66.4866803', '201.6739448', '402.3280493', '65.99741876', '12.16105248', '88.45252628', '11.47825036', '379.2152467', '21.05112072', '58.54553217', '31.71751979', '16.08472576', '23.24226064', '36.59673637', '6.279666642', '59.89451039', '89.68878502', '205.1854145', '31.91781172', '287.9039441', '69.40144984', '98.57585904', '120.1846954', '354.2950809', '110.548805'],
   ['547', '297.9039039', '315.0772672', '213.24429', '1.484950996', '484.847728', '397.7794277', '166.2868429', '8.413264805', '132.3116555', '53.617431', '8.981094123', '32.62832032', '188.0168147', '130.2435192', '239.5944643', '117.9365156', '114.6547713', '465.2313825', '182.2962091', '370.7127843', '428.2790788', '72.01740938', '467.838303', '312.1264536', '51.17867909', '304.2213461', '103.3911068', '364.9130093', '248.5603442', '491.1293411'],
   ['548', '2.847692632', '160.5194523', '0.854186365', '5.411766143', '345.2124777', '153.0936754', '21.91097695', '278.9883611', '57.37658443', '2.119837783', '401.9190735', '9.841264216', '363.1355982', '28.7415909', '34.15535982', '12.37622141', '30.13589118', '286.8204299', '13.17562282', '2.231537724', '9.894895606', '48.96304627', '32.76251736', '1.062784021', '23.0746203', '268.1563146', '32.77247841', '2.815871948', '89.78212911', '141.9182891'],
   ['549', '78.41637665', '2.282287371', '0.862727892', '2.174278074', '65.10659282', '35.36862727', '109.5918549', '4.245635296', '16.9017833', '2.177987192', '0.714529644', '17.98257618', '26.80870173', '239.1208747', '31.64806377', '32.14352992', '56.31106431', '7.036617954', '38.87154693', '41.73623448', '121.2185592', '6.528499054', '31.71482366', '19.30700377', '8.437009748', '33.96051722', '48.35112898', '64.22263311', '48.64416074', '140.2787371'],
   ['550', '164.6795153', '43.6117881', '11.83032148', '6.183810837', '343.0835576', '26.10350263', '461.5397589', '12.02452125', '255.274903', '18.79995729', '2.204932675', '43.69928113', '469.5681811', '110.0411454', '250.0437987', '44.69121509', '47.53167535', '439.5778469', '440.7594572', '349.2607789', '242.9671056', '164.7510107', '340.9207137', '232.4915774', '115.3543109', '15.51556007', '5.653004277', '241.376204', '111.1136601', '338.2210425'],
   ['551', '477.1669806', '475.1525886', '498.3469352', '499.0931677', '472.5302841', '465.0605921', '488.479755', '496.5633474', '484.5423744', '415.3948758', '388.8251252', '393.0708322', '498.8730315', '479.5399117', '438.2009527', '490.5819742', '465.0445547', '498.3326829', '483.4241213', '462.2689042', '306.1035876', '492.3984245', '496.3746364', '485.566869', '496.662993', '284.3414371', '364.6455061', '489.5940872', '456.976109', '481.5654231'],
   ['552', '218.6220363', '248.5830068', '213.3368995', '373.7948227', '484.4508291', '467.4571841', '32.69454389', '322.3896628', '156.8243096', '465.4646923', '290.3544526', '359.1976629', '316.6228448', '437.0639238', '366.7515889', '415.2615696', '445.189141', '466.3531215', '444.0874982', '454.1136973', '213.3772868', '314.515403', '256.4182227', '21.21351121', '77.92045699', '73.57960881', '51.06778665', '177.2205004', '112.6466011', '311.5684478'],
   ['553', '2.859771628', '118.6025448', '0.318480836', '2.019782471', '69.17104174', '18.28577006', '60.19258174', '43.63500623', '295.1582536', '0.870428922', '15.84210617', '264.9815534', '88.39973133', '44.32946217', '286.2249009', '56.45837355', '348.878214', '475.2636282', '433.6285721', '259.1924981', '4.63333113', '43.17930896', '10.03710653', '15.23569014', '18.51760223', '316.1951976', '181.8643379', '2.407752505', '133.9251489', '4.713383664'],
   ['554', '95.44980948', '4.421748075', '45.14346503', '134.9008813', '451.1323271', '223.9920713', '35.56907343', '358.3081713', '29.5982679', '3.238947245', '401.4872747', '9.34885787', '68.81464379', '110.7265139', '4.944496401', '38.45228625', '15.75558754', '3.539056059', '18.52451401', '465.3015742', '430.1293249', '65.61689236', '325.0280269', '51.97492285', '22.14518562', '269.5857476', '128.5104728', '116.1629938', '125.7895271', '262.9191251'],
   ['555', '13.50811557', '32.48437528', '1.502174075', '1.353444734', '326.4537823', '183.8245296', '6.403256112', '11.3470167', '88.35358439', '3.004364706', '0.329472075', '15.0690553', '74.7180068', '51.24998182', '38.80620676', '44.05355729', '26.17582714', '8.497545508', '52.75961185', '409.1128374', '91.72338565', '3.613161125', '13.36221399', '0.53351315', '7.598246217', '273.6451679', '163.8719219', '3.000500203', '185.710096', '0.198281791'],
   ['556', '1.222325763', '37.4940804', '19.01669739', '0.711321543', '197.5212555', '23.7966804', '18.38460683', '3.966234194', '12.45365307', '4.679453074', '1.59800819', '6.553860982', '14.16628943', '2.514135602', '60.49059097', '12.34342616', '20.06161947', '5.285300427', '14.87204738', '0.568210741', '2.328432485', '8.55984312', '10.09882316', '67.73306153', '13.90159768', '108.5348334', '46.70399369', '6.526387039', '85.67175087', '0.798420115'],
   ['557', '23.71735246', '9.125840747', '5.181993704', '1.972463604', '2.028451576', '10.75893441', '5.180102257', '14.01366272', '88.24042445', '14.11309051', '117.4801143', '5.649704978', '87.60244109', '33.84095653', '38.24801522', '55.33073208', '80.8352516', '274.5825286', '3.706842655', '1.22532938', '0.558195005', '16.55208009', '150.8733871', '10.17982636', '16.91716184', '24.45711526', '19.72712574', '31.14150436', '3.325355314', '336.3176007'],
   ['558', '7.396119058', '55.03233524', '51.85379915', '280.8318861', '232.5549162', '175.658613', '52.71212648', '397.7268877', '67.49797462', '107.1822433', '169.470967', '35.82885458', '369.4010054', '41.93253368', '41.3848322', '27.71287289', '17.79449235', '185.5498493', '37.5120958', '55.85392471', '82.04803213', '68.18502963', '163.9747264', '13.41460042', '42.03572605', '48.14999217', '20.79090856', '12.17447479', '10.61355142', '8.201985747'],
   ['559', '158.1540654', '384.4012383', '116.7846366', '141.2582323', '290.2803596', '283.6097806', '22.21509619', '174.3166194', '94.77299085', '197.1982771', '12.5616199', '7.501958049', '160.0654703', '5.356505565', '14.28634367', '24.28423054', '1.883382329', '1.226670192', '5.49092301', '337.184123', '254.1406772', '165.097369', '344.2694268', '37.80554368', '103.7791493', '88.31782987', '43.62112648', '232.8644871', '102.474276', '213.7810081'],
   ['560', '61.7360265', '1.940358093', '9.659299228', '6.301472481', '23.34499377', '2.932476151', '19.54314726', '183.4217712', '8.725027577', '0.11521515', '203.5861791', '1.67250342', '113.0592034', '1.988281754', '11.39421453', '2.777248557', '17.18529291', '12.94628971', '27.61637393', '2.729735033', '4.231560784', '68.39342822', '112.7032361', '87.18599652', '15.97224642', '19.1683291', '1.395406935', '125.1257878', '19.74441972', '453.0642606'],
   ['561', '260.4082981', '13.74242738', '3.471061772', '0.184492506', '95.64599015', '7.015053821', '106.4131112', '0.518368179', '8.919016315', '0.04674186', '0.209486256', '4.120906104', '21.44663274', '2.730569982', '33.35319', '4.322470148', '4.597686959', '4.041936298', '24.66452745', '66.04429377', '18.76164467', '6.038059185', '192.9531662', '271.4809971', '10.66127095', '62.61217038', '9.913464595', '284.591591', '271.9955732', '381.7433879'],
   ['562', '497.7301969', '457.5153749', '465.899881', '491.5932714', '497.202679', '479.8820709', '494.798277', '495.4823704', '368.1497179', '375.3982331', '496.5051296', '457.9130636', '498.7243173', '454.6826039', '401.3116808', '277.0035707', '426.8044934', '172.3183045', '480.832102', '488.3728406', '476.446373', '499.5343626', '497.935087', '491.5825748', '497.1497599', '443.3990801', '309.5286072', '488.2618731', '489.6437756', '491.9913037'],
   ['563', '10.7416266', '18.0666272', '91.39399709', '83.95906114', '74.58961108', '52.19787927', '29.83876997', '58.46346378', '54.01354485', '64.64116192', '6.399156307', '13.77302679', '57.51666705', '14.29603317', '69.7157254', '127.4649457', '60.96886206', '39.13978713', '49.7095394', '40.45209517', '5.154996226', '129.7205663', '15.6344089', '41.96584792', '18.04566519', '164.8052731', '207.6871542', '45.10650737', '7.089482514', '186.0199697'],
   ['564', '329.2714407', '41.38806881', '270.7797153', '439.7786417', '430.9024619', '153.3457771', '460.4965112', '476.5081705', '353.9757808', '9.998819848', '494.146807', '477.6004125', '470.966633', '304.8150926', '188.1395537', '178.9084378', '54.22140867', '154.3793277', '484.7069532', '116.4670413', '181.5586189', '376.5940285', '347.8719815', '373.3629833', '386.957361', '58.0307014', '71.39375629', '220.2999856', '359.1129683', '49.03476345'],
   ['565', '94.30393588', '28.84780689', '30.83440192', '8.453017792', '489.4706727', '201.5593465', '2.673116525', '21.91253056', '5.687398476', '0.340866829', '6.280019', '16.45151163', '82.19821616', '5.63228838', '12.31580213', '27.77437553', '308.5646668', '4.70271266', '37.3469858', '470.8206873', '443.281308', '280.7289688', '296.7024318', '310.0028881', '106.2549256', '386.6717515', '196.5782709', '145.272185', '104.3132941', '300.9634181'],
   ['566', '6.5808795', '63.34393483', '3.484084199', '403.4246535', '389.7563861', '267.1463767', '11.41272191', '368.6445374', '156.1201035', '278.0599408', '66.55825964', '45.17555724', '9.336776879', '10.46666427', '131.397255', '84.11471721', '28.8259446', '42.82557959', '195.3992255', '78.3065436', '36.92274395', '20.64963952', '4.460453399', '5.634958024', '8.092442465', '92.1946353', '123.6587965', '15.64625818', '131.4298665', '11.76674081'],
   ['567', '460.1145398', '378.0267672', '481.3871071', '341.450605', '293.4063778', '346.7636994', '15.91149091', '473.7872237', '28.05068434', '286.1460717', '189.0650661', '44.8994993', '263.5121592', '199.053903', '28.25177915', '69.89811815', '128.0007468', '9.431733603', '19.79004316', '271.0154568', '336.3556484', '389.4570074', '495.3052976', '163.7545159', '291.7572383', '45.44330388', '88.59994665', '478.2315255', '423.8596988', '492.0461332'],
   ['568', '362.4532729', '19.60700861', '234.3775335', '124.5971383', '214.6921576', '133.8623137', '7.896292446', '268.0501415', '1.971487295', '0.717487787', '309.1417129', '8.678012115', '48.15228134', '18.93775488', '14.13917918', '25.93311955', '35.04633262', '12.72666626', '6.511965474', '440.6649838', '31.27721377', '329.0081352', '479.97036', '390.3236393', '79.55676561', '364.7168576', '356.2454772', '439.946576', '319.8133185', '493.1240738'],
   ['569', '58.01927723', '8.467770387', '183.603751', '137.0866695', '14.37399155', '38.34534486', '434.3473819', '85.94496357', '158.3857737', '48.46917005', '42.95210368', '20.77021269', '293.2413872', '18.21729372', '177.0530915', '31.82780872', '4.535430828', '10.97285828', '225.8793039', '21.69387569', '1.26398611', '288.0182818', '320.848586', '182.4955259', '169.1971761', '67.04994184', '150.7398003', '142.3894331', '154.113525', '314.8712792'],
   ['570', '368.5676322', '12.5057975', '68.78571471', '15.39981846', '209.473547', '21.63623659', '85.66029347', '57.36264458', '33.15310688', '0.814027543', '98.64131981', '85.00819973', '275.640309', '2.214296737', '8.609397162', '11.38167678', '11.13438859', '18.75793643', '184.3202851', '177.6011878', '29.41902363', '333.6160944', '454.2034872', '373.4077729', '423.4550309', '62.47590491', '31.09081929', '378.3379115', '416.6877579', '402.962921'],
   ['571', '77.10702203', '100.6272569', '93.87781708', '23.05190427', '191.1575127', '60.48936739', '395.6443537', '17.14389664', '53.63296221', '73.57562762', '56.85376127', '116.7429259', '147.6608778', '69.11353279', '37.86826382', '144.1559406', '101.1577454', '151.070014', '129.9521517', '188.4177554', '67.14067992', '243.3315023', '354.0775185', '240.5109709', '40.0344196', '77.64896441', '33.76548595', '59.39747081', '22.32777117', '327.6103523'],
   ['572', '491.2427586', '473.1952318', '439.7034029', '441.9182713', '491.3155926', '482.4955815', '490.4805909', '482.8835051', '452.1345857', '485.7207092', '495.6518472', '476.154963', '452.8671211', '474.1756195', '419.5292311', '473.0497325', '449.8769337', '496.1043755', '474.7575199', '494.5470912', '460.4032966', '444.8887229', '459.9492262', '491.7956072', '473.2257652', '484.1846308', '460.2762824', '497.9135968', '352.8137306', '480.1197947'],
   ['573', '266.5073295', '100.5191661', '94.83809885', '8.659182209', '17.33925345', '16.09223445', '47.19666894', '210.8123206', '22.14641706', '0.32659631', '358.6101602', '35.18900974', '27.5714535', '37.99746877', '21.98098158', '10.99838314', '26.6305475', '0.905050493', '14.70688397', '4.741668459', '0.988939699', '89.4474619', '469.4644811', '424.7104992', '121.1456879', '89.64126036', '43.79059162', '298.1046954', '204.7665911', '489.8229251'],
   ['574', '23.18186761', '38.31060608', '238.856637', '297.2695316', '181.6314925', '31.90934967', '1.511114124', '372.7526246', '8.947380532', '0.922482171', '2.413287605', '27.14628196', '44.0532357', '14.00553748', '14.74030625', '144.1813218', '90.57658279', '14.56369224', '7.398281357', '430.1529774', '233.4338338', '14.05354508', '97.53778712', '105.795425', '30.56443539', '27.60920087', '56.91878521', '49.57906439', '9.137477676', '175.9236391'],
   ['575', '10.92151225', '3.157134917', '44.29196905', '407.706436', '354.5499539', '177.2266745', '13.65996256', '470.5355173', '14.2647224', '6.522793608', '424.3534258', '4.957278818', '7.375458447', '1.578949421', '10.77451022', '4.510633003', '80.33532416', '61.70153021', '80.63720945', '77.57836723', '92.55404446', '16.06654193', '4.482653456', '22.56592296', '8.160619937', '58.37713664', '62.56194412', '1.714191234', '39.19784821', '0.538556132'],
   ['576', '291.3844848', '487.6575754', '206.0398186', '425.134753', '450.08911', '461.5968685', '167.7956615', '495.7372762', '481.3114067', '439.1606938', '496.4792311', '335.4100324', '483.5939165', '483.4903543', '333.4051682', '412.6866381', '452.6478299', '488.359738', '412.2934207', '493.1866415', '475.5630852', '390.0516387', '436.8447591', '49.11838665', '477.6966349', '481.4652896', '491.5581348', '301.3695328', '480.8243908', '405.5589657'],
   ['577', '398.8474056', '408.5519921', '260.620767', '482.1803988', '463.3501777', '470.5489804', '462.3241326', '494.1625505', '481.7871865', '494.0610848', '498.4582746', '416.9196866', '422.1678606', '456.8090473', '391.8130618', '267.5015201', '452.0520814', '483.5751604', '488.0836518', '468.3765337', '435.157432', '425.9923321', '161.109048', '350.7846061', '309.3523943', '496.0862539', '490.061985', '320.0653727', '467.3323788', '471.8292207'],
   ['578', '25.11812574', '119.86332', '7.476838707', '0.349560332', '77.66366035', '20.70270356', '4.399880415', '2.002879772', '7.016798133', '2.231220594', '0.699418084', '20.62323258', '0.630577324', '77.6376857', '48.49481981', '48.43552485', '77.26696716', '0.704812444', '35.68337916', '420.1954358', '429.5351692', '1.292808667', '5.797984079', '11.00793039', '2.620669079', '23.3858756', '12.40506974', '23.59738927', '43.75562345', '258.7601869'],
   ['579', '440.4369468', '92.50468141', '5.817695732', '143.3278673', '496.2847628', '457.7943595', '10.80274602', '453.1102107', '163.3868722', '2.388048455', '225.5344963', '29.94290557', '70.42119175', '11.89913529', '92.40517394', '66.52285212', '44.805924', '22.93915571', '56.9926636', '383.8598238', '121.0916328', '199.1162545', '410.7795576', '123.5188385', '105.8674944', '355.4602565', '291.0742093', '364.6067183', '488.3800571', '409.8467983'],
   ['580', '17.29642752', '6.143857013', '4.489536621', '0.788490333', '9.386397642', '6.02073363', '0.582220977', '0.161016042', '1.205963016', '0.178128719', '0.2870457', '4.548959751', '0.582859351', '3.723789713', '5.349477291', '4.90924414', '9.060230971', '0.090021407', '13.73025397', '22.28548359', '35.75077171', '3.331251333', '5.537329401', '21.41952931', '6.11986717', '68.01202405', '45.66965633', '2.682776338', '211.5550736', '15.51462761'],
   ['581', '486.4530983', '26.77927722', '421.5093611', '308.2906087', '393.7914037', '99.61455678', '461.5809189', '305.2831008', '396.7548276', '17.64209851', '404.9032334', '446.9507758', '408.7746509', '217.9231615', '115.2502797', '401.6408933', '359.2813934', '317.6835423', '461.8949355', '341.9506744', '93.94160304', '393.0140775', '445.0322073', '450.1712248', '461.5002859', '252.6324834', '283.6938858', '404.140048', '440.5852991', '467.2996978'],
   ['582', '7.94143674', '77.39347309', '24.29773257', '73.02901965', '16.62582383', '22.53632952', '218.3893738', '115.53386', '119.2979615', '43.86653241', '97.3907949', '60.04114249', '154.095984', '259.0539113', '340.0286082', '19.5997341', '21.9847541', '85.02122142', '109.4714066', '46.76166172', '27.59423348', '45.78310338', '23.41211156', '48.2929592', '59.44243601', '23.30769483', '17.64279548', '12.27890847', '84.24771204', '53.1190652'],
   ['583', '196.7635695', '339.0028058', '188.0701602', '480.1534948', '249.6172945', '444.7049075', '96.54826807', '491.9313457', '60.25299128', '28.65628592', '447.9837742', '138.900814', '403.4683449', '163.7335108', '116.8651932', '102.9615305', '267.712953', '53.32380423', '24.81489818', '414.591307', '450.4616193', '242.7627499', '90.59025968', '272.9589541', '330.8413322', '286.1679328', '105.8165584', '121.6800574', '254.8562576', '261.6362085'],
   ['584', '389.7597982', '402.8724323', '15.24818777', '78.15385486', '449.7112188', '354.4934818', '38.16031399', '285.7216741', '164.589685', '14.49643413', '76.36854706', '168.004575', '357.9235303', '462.1478191', '317.6671864', '223.051075', '215.3490461', '234.2600239', '170.8110054', '289.1816593', '56.42545289', '406.5935029', '488.8464065', '334.3555511', '391.4584171', '477.6188765', '432.9605836', '374.3173438', '481.277145', '492.4883912'],
   ['585', '172.1501526', '93.1867584', '28.06264329', '306.7040071', '291.4673434', '191.6027695', '304.1928214', '443.8782558', '213.6845388', '20.51567233', '487.1497213', '319.1843718', '271.5410389', '404.7707966', '395.2898856', '333.9342012', '110.650091', '93.93330377', '236.7934573', '259.9427169', '360.5190571', '51.78977499', '120.411182', '24.1645758', '282.17019', '182.2426954', '67.73767895', '137.3399227', '205.3013422', '81.64837776'],
   ['586', '20.91557159', '10.85969559', '23.02710776', '28.60906696', '9.359359274', '26.25398951', '46.41218526', '301.7480206', '31.53737339', '1.012776628', '115.593784', '35.35338633', '27.19106052', '21.9310858', '56.22478615', '25.59183558', '14.90254296', '180.3977979', '12.56749904', '11.31779169', '13.94466044', '18.02170097', '44.88031429', '44.28870734', '16.32368009', '84.43878537', '88.70167671', '73.05756932', '28.687028', '30.91598876'],
   ['587', '75.48635347', '391.8596189', '75.57830689', '30.22897721', '3.106783389', '7.23285065', '56.55970484', '262.0412751', '8.652208753', '0.657636954', '0.82687592', '6.211758389', '301.0466509', '11.32637693', '211.0570942', '4.992836015', '3.247397241', '4.307674736', '7.379403051', '33.90874636', '11.83462337', '261.8607406', '327.4495934', '18.21250345', '187.7560992', '184.3870374', '65.45099439', '54.62154149', '387.5634211', '27.02229847'],
   ['588', '49.80675972', '261.7499999', '9.342933154', '34.15199564', '482.089628', '407.6305731', '1.863224126', '133.6180246', '148.842766', '28.74851192', '7.014480709', '7.364485566', '71.89455408', '91.5588778', '78.44185687', '122.3797745', '113.0848846', '5.427340019', '34.76475288', '169.6720353', '32.13154949', '26.56146188', '39.29664787', '12.63931886', '6.64126893', '60.52151159', '5.962939784', '35.26680484', '315.9724374', '284.5776295'],
   ['589', '27.53494297', '356.9851345', '22.82734156', '6.827401641', '85.72380241', '13.15386746', '36.45174079', '10.75316233', '147.7764397', '3.860097423', '23.65082365', '27.02816968', '215.3033684', '17.76347047', '52.650107', '117.6407307', '18.75122393', '169.6212536', '36.65483979', '17.83445083', '55.45559143', '37.04906925', '35.17446934', '23.38992897', '94.78096508', '366.7082226', '170.4650367', '45.57741456', '236.647576', '12.87926993'],
   ['590', '43.81448165', '26.81669771', '24.7634831', '66.42152163', '106.9342608', '36.75752456', '55.52641496', '52.49525618', '34.9860102', '12.60918653', '168.0455943', '42.67714646', '62.92221189', '12.77726264', '57.37142088', '120.559057', '23.22210269', '10.9769048', '19.24684838', '2.889789268', '4.977944591', '56.30001679', '48.08321439', '34.73714927', '21.84969811', '22.55299957', '39.92940032', '120.3828404', '115.3491328', '97.24903652'],
   ['591', '30.44008454', '75.92433122', '26.92742179', '74.65562454', '8.632608715', '20.33731168', '102.4691647', '66.58734624', '116.1649353', '37.71539388', '363.5210408', '65.54612787', '285.6594624', '33.16791142', '305.2237447', '62.29748263', '45.02713726', '429.3261421', '105.4371749', '0.804075947', '0.427216439', '14.130915', '168.1764869', '99.88017', '133.5121215', '25.57035039', '32.88876439', '58.58368538', '140.9888463', '8.409034065'],
   ['592', '124.1838215', '93.26215352', '5.590510189', '34.1819885', '9.840712203', '32.39974164', '76.73755701', '57.72022449', '159.8304596', '16.73494853', '40.00189036', '19.07059977', '357.5500993', '199.050572', '196.3472906', '38.99940359', '57.92313184', '215.6259075', '44.89897596', '2.250454639', '11.03164347', '48.20215564', '255.5732352', '29.82102125', '85.82270456', '93.5873544', '48.86213045', '132.6195248', '141.8887863', '16.97520314'],
   ['593', '72.85102421', '78.75939522', '164.9262869', '98.8994212', '180.4491703', '170.5641321', '27.88675037', '205.8873144', '84.63997243', '261.5681397', '297.7034667', '25.21555063', '317.4832326', '169.0226505', '145.0255267', '26.43846577', '84.83215991', '93.95626211', '137.7053188', '178.7447703', '133.845309', '239.8896292', '122.7013144', '57.66214213', '242.4550813', '99.54123397', '66.85284555', '87.32349044', '202.9736352', '157.569479'],
   ['594', '77.03712467', '21.16008754', '48.61053713', '103.3594423', '21.47787982', '12.49195915', '28.32160067', '66.91677936', '36.94428079', '58.23179704', '19.92595271', '18.06983057', '15.75449432', '14.32168302', '29.81201031', '13.42060934', '28.51249207', '20.66682551', '80.23028602', '72.69641779', '30.75464771', '27.35676053', '7.382975831', '89.31309643', '41.1304242', '31.65596939', '47.3619198', '83.00945984', '65.4577329', '58.77370176'],
   ['595', '47.42522986', '10.61245522', '3.150740294', '0.108656352', '2.418938856', '3.006418437', '16.78653503', '0.481594904', '3.218735442', '0.28510881', '0.180990783', '2.809148064', '7.3257354', '2.143351275', '8.219140614', '3.754112611', '6.97459956', '2.902106993', '9.37115029', '0.034097668', '0.033856016', '1.519851306', '94.93043228', '29.06447363', '10.51945322', '236.3830601', '279.5964522', '28.50936916', '209.1787451', '352.1086293'],
   ['596', '74.8502556', '31.93521207', '5.6775262', '10.75478178', '113.7194252', '88.91400571', '2.525097985', '34.92090603', '2.292682472', '5.458778492', '12.63845055', '1.962823812', '6.804812533', '1.618238181', '1.749305665', '4.265353703', '14.1471669', '4.037289732', '6.513514216', '406.9211885', '320.5029502', '54.96115933', '27.4028663', '26.42588782', '3.544692699', '374.5447755', '304.3394761', '39.23693878', '179.1200164', '259.450041'],
   ['597', '489.0431318', '464.3414953', '379.9800583', '414.8058709', '491.9910141', '434.3706541', '399.8537358', '468.5609556', '272.5618992', '76.54246423', '281.1729259', '159.558351', '449.9257301', '428.4372889', '436.1749271', '309.5055131', '446.0446708', '462.0192683', '457.5646178', '490.257995', '373.6492345', '460.1504245', '479.3349323', '418.7563821', '268.6379205', '457.5296957', '188.9988985', '484.61802', '466.7442207', '497.688083'],
   ['598', '6.759673174', '139.2125626', '136.6232548', '45.51505665', '29.09371578', '35.89927415', '9.610328345', '52.06128812', '67.88624075', '148.6755646', '23.30867813', '20.77248595', '215.2208922', '55.03229555', '43.94121006', '57.05097213', '180.1652755', '3.583290031', '255.477372', '106.1975986', '159.3631539', '242.5202118', '44.62953197', '14.79732027', '134.0410673', '37.11403409', '93.69904549', '2.949703796', '340.1453865', '0.703613892'],
   ['599', '19.6478151', '102.5558225', '407.9948887', '418.9663235', '326.82312', '71.42342266', '67.84432526', '487.3069521', '69.51274484', '8.034147354', '477.0842116', '28.19490284', '85.07253979', '4.614741675', '27.35112576', '93.98674404', '36.20724947', '128.3266831', '34.64943318', '403.9265027', '330.6865417', '224.0981823', '320.8698919', '241.8020103', '205.8616073', '107.1079567', '143.5449245', '19.52214622', '141.0489741', '2.286658724'],
   ['600', '274.4121593', '7.240039622', '4.44361184', '160.9539225', '50.65799718', '34.3721927', '27.57483832', '372.7416387', '8.53818035', '18.86086858', '255.7804168', '76.86790805', '87.21341264', '40.63446799', '65.34260746', '49.4026592', '4.466175529', '5.529877896', '9.334179677', '409.260444', '79.00613556', '176.939836', '64.57968937', '56.35545483', '36.70892665', '243.2437418', '300.7735978', '319.9888964', '64.46531437', '417.7750225'],
   ['601', '44.67124014', '51.06118387', '36.12376388', '27.70687753', '195.3880005', '38.4600484', '180.0686967', '290.439531', '13.52592266', '13.16979587', '21.2810527', '3.410191255', '51.53739519', '0.605747347', '13.45493098', '11.19353505', '3.535452378', '1.747967551', '12.31454493', '11.57960452', '0.955065959', '42.33187589', '67.41964225', '72.04780426', '19.57550449', '2.406670401', '5.787296258', '202.1357868', '25.29773923', '447.1305529'],
   ['602', '18.09777601', '32.06450305', '6.400928308', '6.499694064', '45.65001549', '39.60822815', '260.4125018', '58.22072552', '301.1220136', '19.02013684', '30.52631438', '235.3364285', '253.935288', '180.7787681', '201.0650256', '64.56415286', '323.5767509', '425.8054872', '455.4358279', '228.9057827', '30.9786242', '41.09192971', '30.6015143', '3.883898522', '3.530786047', '48.41478849', '4.492398527', '6.765034185', '82.29785175', '8.441888673'],
   ['603', '34.00177593', '68.05567551', '233.8633099', '438.1887802', '107.3253063', '187.9566731', '451.8339809', '494.8313548', '352.2954516', '17.54248266', '481.1531817', '142.7395676', '351.7994633', '151.2756315', '155.3468983', '147.7731003', '248.5765221', '221.7550946', '329.1219876', '400.0889418', '309.0119539', '106.8451933', '344.4207202', '84.47743883', '61.18105278', '210.7329312', '92.62517144', '133.9811158', '11.1785575', '416.7257402'],
   ['604', '340.5010172', '71.28431003', '455.9297668', '11.48980203', '181.8512284', '42.78047255', '95.52895347', '135.5678755', '11.37484182', '2.177219624', '6.512701327', '249.0362227', '146.7586387', '202.6472181', '220.1570075', '51.23098079', '417.2190666', '276.1448018', '314.6384257', '457.4312217', '458.5720375', '258.0042521', '453.071832', '488.6499226', '251.8866419', '242.7783094', '108.9370855', '423.832635', '326.7519614', '356.9826425'],
   ['605', '54.19924919', '133.4423911', '214.211145', '37.2732502', '170.1032503', '78.18700535', '13.13683152', '52.13502627', '21.14941798', '60.56830025', '139.7564731', '33.70217943', '108.7507596', '54.38919993', '65.34684895', '41.05449201', '45.7870639', '76.68022967', '12.35863592', '413.6955164', '454.6192677', '244.6976579', '181.6956878', '321.3193815', '408.2555622', '416.3730101', '408.2544012', '119.1255555', '259.4054519', '69.7634269'],
   ['606', '17.04655633', '17.62446687', '7.434542734', '238.1032123', '476.5344912', '232.6730544', '49.34697029', '400.1686821', '26.22766889', '3.781894036', '303.8710181', '438.0859876', '209.6772734', '248.9934463', '384.5503342', '110.2922685', '26.81129772', '34.07839153', '120.3772304', '392.5787278', '192.7177217', '166.6620463', '142.9384366', '396.798256', '214.1490216', '116.5659886', '322.6666193', '31.95793082', '241.0545232', '3.547035261'],
   ['607', '11.86172355', '132.694205', '28.06488689', '19.35505385', '381.4127437', '246.3716721', '123.1742263', '22.94323338', '422.1730141', '367.5873845', '4.829033452', '353.5110146', '468.70148', '294.2970539', '344.0323927', '308.3516318', '142.2780305', '491.6631867', '397.2927307', '449.0075474', '483.3046772', '349.8893881', '8.822087895', '13.65511719', '313.7548252', '438.557949', '462.6028023', '5.083079359', '228.2058929', '0.564721987'],
   ['608', '14.64113789', '77.52120594', '2.454745059', '367.194899', '6.016601458', '13.3559074', '54.17343507', '475.663926', '47.58948795', '28.32085914', '321.8476109', '156.998765', '89.46772968', '54.63304232', '263.5909743', '10.98653163', '4.54562417', '20.26774942', '32.38027732', '288.0864316', '5.503992002', '116.8768483', '21.0994364', '117.4656173', '28.82217381', '10.27355166', '25.91439864', '18.93969886', '41.15995043', '4.602636989'],
   ['609', '1.842629284', '101.1217855', '1.818459684', '40.24502284', '21.39694249', '25.00236479', '11.4489579', '210.7561397', '42.62887401', '41.4616012', '7.253171739', '9.111634062', '37.39921551', '26.84106166', '71.9938274', '46.16780092', '30.40519854', '14.71754232', '29.67255194', '79.59970055', '176.9567515', '17.17369572', '13.05794183', '1.335997956', '19.99261988', '342.0863406', '420.4596317', '2.910233813', '300.8825869', '0.821487367'],
   ['610', '376.6047072', '98.49823889', '66.50306685', '164.298066', '364.6397253', '83.05788496', '395.6475054', '417.717315', '270.9936994', '11.68413686', '368.1262088', '309.7643738', '450.8622387', '377.257774', '228.8266847', '312.4947872', '372.1289276', '25.65997406', '378.3652657', '493.3090477', '445.9784464', '464.5092815', '390.2479075', '191.8823637', '465.2076395', '451.5191779', '380.152959', '254.5833529', '378.5281346', '366.671769'],
   ['611', '391.1255659', '186.671085', '128.5440683', '82.51537094', '41.63217147', '57.90860707', '98.44752645', '228.7934052', '83.54347239', '3.570527374', '16.5681203', '62.27151772', '81.5575139', '50.93058182', '29.08870484', '15.77481608', '262.7043437', '389.5201839', '328.4750852', '146.2363103', '74.67159179', '239.1806743', '396.1007602', '361.6753682', '32.97049622', '17.96865623', '6.916334604', '429.7124442', '94.71614661', '490.2508149'],
   ['612', '8.624176977', '39.77038124', '8.742842593', '43.65928111', '50.10915518', '40.84183803', '53.62546402', '16.26961467', '14.26398169', '44.71803979', '20.59015277', '26.75512624', '35.45364461', '23.00966312', '35.57948554', '38.99779458', '17.58704192', '36.81311522', '6.785960191', '2.183169397', '0.87482947', '35.87388184', '19.48687238', '159.0418838', '83.11752917', '66.18046834', '149.3690612', '24.22748714', '36.29629119', '18.72819312'],
   ['613', '105.2321283', '244.6224358', '418.4940996', '366.6925787', '456.6008635', '252.3903895', '430.1921657', '369.4319134', '317.3874522', '209.7692355', '194.4019734', '416.0175417', '469.2140117', '179.35408', '410.6150904', '477.718909', '223.5103567', '409.0067505', '429.4087704', '433.7950801', '350.1742791', '490.8183847', '334.3188526', '469.6964114', '386.0213236', '456.8303695', '478.582407', '364.5324713', '246.9556156', '392.114941'],
   ['614', '78.07122287', '80.86366818', '34.09652324', '7.158838478', '38.74284544', '24.1283781', '75.34020335', '12.31452362', '11.73596089', '3.167259631', '1.17928465', '19.26509637', '28.9411387', '13.57432447', '41.04510405', '13.27222691', '95.15799632', '118.8175509', '190.3239053', '106.7670629', '92.88420605', '81.74274947', '246.5020944', '91.18373236', '33.77465036', '141.997109', '53.45732822', '106.258504', '172.3810257', '194.4183931'],
   ['615', '25.20120714', '242.88464', '143.1545054', '53.1860216', '70.58218731', '38.10815373', '97.59975078', '366.2676723', '157.9331801', '156.6365426', '207.5386553', '34.2797358', '329.1290527', '29.97284491', '22.79510198', '50.33507238', '12.63351864', '297.096924', '34.68960361', '207.5588116', '70.43460263', '124.5404771', '76.55819602', '51.142919', '92.27784188', '54.90584418', '13.16099434', '63.95899178', '34.55533681', '444.8368913'],
   ['616', '67.16131597', '88.43144275', '214.2931184', '19.80441865', '31.89161148', '49.36326259', '29.0550209', '47.96409225', '98.89075628', '83.17980468', '39.65554531', '56.61356635', '93.47658822', '11.99160861', '65.78980076', '54.21978861', '97.32224425', '159.4238921', '63.76769328', '85.26319492', '20.89517172', '107.0775564', '188.5886663', '338.3973838', '229.8400519', '102.3763966', '55.45931223', '80.32083261', '67.72894972', '110.4525534'],
   ['617', '77.32894556', '60.72041731', '96.23085085', '72.41473255', '45.28484071', '44.01681648', '64.46948271', '36.73112893', '28.56472786', '30.97392891', '57.2705174', '39.75129109', '113.3095254', '96.17301276', '62.24757205', '32.87290082', '19.65082175', '36.53088586', '64.0006681', '188.338775', '142.2658815', '38.37666295', '6.786114944', '22.42435712', '30.82405075', '20.37096767', '8.87646695', '20.38052027', '15.9762497', '29.26880306'],
   ['618', '7.870651904', '195.0527457', '2.711158465', '0.268173441', '1.662323128', '6.950880643', '2.76039516', '1.071722334', '6.175374256', '3.991560419', '0.034275628', '3.108352159', '14.76080419', '8.313454299', '10.6681244', '2.583078995', '2.83819776', '1.44201805', '6.797115079', '12.30550329', '16.49820072', '2.866792089', '72.05157621', '4.601336686', '8.868948148', '77.63404723', '90.53331451', '7.834849661', '117.9246979', '64.62245439'],
   ['619', '39.27133746', '36.94339076', '11.1236199', '8.372870302', '14.42133355', '9.754052977', '15.13406932', '18.05709456', '8.243002722', '19.75933282', '17.24535499', '6.932287605', '34.61986606', '2.515806799', '4.505576186', '8.094828207', '276.3672758', '5.826478075', '184.2412922', '0.187750992', '0.375959272', '166.0319018', '170.5444747', '41.28201951', '17.77690259', '1.161470329', '0.537826255', '79.03872332', '11.87463832', '431.8846745'],
   ['620', '83.82782689', '415.5587737', '51.95212875', '448.4022341', '351.7555935', '322.0948731', '305.3472035', '383.6363751', '480.1339037', '471.6093853', '5.06875061', '121.6084689', '393.9225075', '23.68149725', '337.8728924', '159.8916999', '150.694101', '394.723427', '378.1828086', '17.3015498', '10.44046847', '148.7260033', '27.59714288', '133.5214013', '164.5486362', '358.1447356', '379.6143208', '54.10916646', '313.8699135', '23.15158419'],
   ['621', '16.31553622', '29.50289664', '2.245428133', '73.97549801', '378.2061392', '210.1138268', '0.904741556', '406.0676379', '5.016645106', '9.282459936', '448.992632', '2.996255869', '33.40968841', '16.83296945', '4.250073081', '9.681658548', '324.9553998', '0.678858004', '6.707365119', '117.0123555', '164.1094648', '266.9769911', '74.68599419', '34.08257226', '33.66037491', '349.4373187', '149.7767133', '17.47260356', '125.2079616', '131.1301073'],
   ['622', '13.14913233', '21.14152486', '3.611384476', '40.44040756', '45.14216369', '35.92436744', '10.72269397', '17.53748154', '135.2953095', '28.56591866', '5.32168383', '55.31189041', '9.896332254', '22.47274053', '18.86220163', '117.7847949', '65.51286055', '49.94871592', '29.45338695', '17.86290859', '33.91888682', '6.227374508', '21.47538787', '9.779663998', '7.131648462', '10.66427769', '17.40158584', '11.92951122', '20.15961915', '5.111167031'],
   ['623', '223.3954102', '44.67194816', '189.7482093', '154.6413472', '263.3606134', '220.6212309', '464.7835052', '471.0234275', '373.3913188', '440.5111517', '433.9828409', '344.2683551', '245.7115777', '11.48233261', '71.31699427', '51.29290589', '130.0509649', '468.4181507', '484.6222692', '96.86731004', '109.0231604', '34.14914223', '199.8352632', '29.34359655', '77.2644248', '19.24327415', '72.42890034', '264.9699884', '220.1349094', '234.0895014'],
   ['624', '33.15686285', '267.1167448', '10.793258', '72.30192588', '486.3760532', '391.6405607', '78.4160298', '289.1824949', '250.858847', '191.0505281', '276.4564351', '74.6519944', '474.9046702', '463.7561294', '387.4138267', '360.4182434', '421.1073968', '430.2710355', '36.66236705', '155.0533302', '172.7365774', '444.7406185', '395.5889314', '83.05334859', '405.546456', '412.4375297', '439.5143554', '87.69299591', '77.143179', '370.9906389'],
   ['625', '100.8840558', '162.041069', '33.85483889', '329.0098962', '74.41434188', '21.94902831', '288.4007284', '428.5114039', '35.75363183', '1.57399961', '486.4636984', '11.17094055', '419.0701496', '158.126734', '34.55908564', '37.12808972', '9.537655042', '16.55963421', '16.1789533', '280.6456211', '119.7203631', '442.754592', '435.9858473', '255.6868111', '460.4367421', '422.8128028', '230.7464735', '37.48649819', '261.2958752', '351.8052811'],
   ['626', '336.2153235', '114.5202928', '42.59350977', '130.868253', '214.3003675', '68.8727934', '175.471013', '50.75050054', '90.80877759', '56.68804665', '24.96963667', '30.41296179', '272.6531167', '253.8839175', '59.32909556', '179.8091651', '108.2465506', '101.8939746', '101.1701613', '489.2353883', '476.1801939', '280.9074313', '304.9947344', '43.74169825', '154.6467177', '190.2344555', '121.2962867', '429.8394843', '75.66890178', '423.9252543'],
   ['627', '0.192063753', '28.90155286', '0.067437518', '2.497601597', '5.403306768', '5.246983529', '3.762536363', '1.368423152', '139.1720226', '27.59154815', '0.09674763', '6.86422122', '3.815268912', '3.521221742', '124.4987045', '29.66527125', '6.695595981', '297.9622128', '6.323784099', '0.309892312', '0.061293255', '3.001392791', '0.233120474', '0.982636821', '1.021103175', '6.005628751', '12.42858646', '0.839343369', '10.85129239', '1.369444158'],
   ['628', '2.060486262', '13.87155382', '1.899857975', '3.98351405', '418.172975', '64.02223736', '1.17794106', '3.368861626', '97.7575398', '15.30609923', '7.907043711', '17.72369916', '100.8491283', '16.36583494', '18.85867773', '98.42307596', '58.44149499', '38.32167774', '121.0493307', '21.18935138', '0.88321279', '69.9789956', '86.14969415', '85.64685193', '15.51519103', '11.81747855', '16.91932774', '1.101090072', '14.03708939', '9.775705982'],
   ['629', '482.4314102', '317.017553', '330.5267921', '46.51250608', '442.4082491', '386.1025932', '496.4691184', '212.3486576', '478.3960535', '423.7796648', '456.165555', '381.6160447', '496.1083545', '481.8151328', '475.9729584', '311.786072', '460.8984069', '495.6839547', '494.9695258', '498.7649876', '493.6271209', '480.4005718', '498.6443219', '491.0904541', '481.6988094', '481.4938187', '469.8642913', '492.7691058', '474.2571967', '499.4934622'],
   ['630', '59.58873962', '8.286658393', '30.0060913', '17.90215371', '31.6632438', '13.45862367', '54.63838483', '378.6620223', '13.77457521', '12.37504841', '196.3459897', '28.22350138', '14.93982322', '43.38993481', '41.3667887', '3.352438171', '8.652556873', '232.65866', '194.3526171', '94.00292822', '16.57713815', '12.04445991', '366.1778469', '105.3913983', '5.345977061', '22.03123215', '14.37491631', '238.4772636', '37.86404296', '306.6970244'],
   ['631', '73.18081789', '4.947162422', '42.73380662', '9.086095678', '455.0124731', '43.90398731', '36.92998605', '113.4131363', '34.54832219', '13.41904043', '302.7960676', '51.56407669', '149.413797', '11.63584158', '177.2442037', '14.82966222', '16.20802424', '26.74399645', '222.1579154', '323.3927446', '72.40218065', '311.0995077', '282.5800414', '285.1444139', '62.08844219', '87.97768821', '18.1785115', '65.42587922', '212.3452052', '307.2354611'],
   ['632', '1.830122207', '21.96948639', '21.31186421', '46.98726217', '8.531104082', '9.008335194', '33.01589622', '86.46532293', '139.9758147', '22.74245812', '20.77854032', '18.3888016', '262.637786', '3.92671481', '21.31458828', '8.302363725', '12.68655313', '136.2529288', '58.08686301', '224.0593281', '91.64067752', '231.2900715', '203.7077777', '7.905941312', '42.33538821', '2.106670816', '4.951522095', '10.76558634', '23.59960419', '2.675107318'],
   ['633', '401.42351', '3.545471763', '21.9808304', '6.857078911', '30.84824769', '45.71577092', '361.1907743', '201.5161862', '5.44500014', '5.780110145', '177.7770812', '7.975387555', '203.5523964', '43.90416105', '242.8091907', '2.108660362', '29.93085571', '2.662279463', '110.2573562', '326.7587487', '297.4038372', '97.93227841', '415.736174', '63.37783014', '52.56995032', '31.02829304', '9.120527604', '314.8069618', '85.24322938', '484.9868438'],
   ['634', '66.98509083', '7.885755977', '14.61821515', '159.6805248', '0.373520937', '0.66006612', '145.5716943', '157.6877646', '20.00278373', '1.881353566', '78.26880198', '11.32735776', '68.62635143', '14.03507954', '13.06645466', '1.803891786', '1.538785611', '11.63985318', '31.55047195', '39.55735037', '3.963140863', '34.70945324', '70.87555573', '86.62200996', '122.9000026', '10.24924041', '13.93985495', '86.69729746', '9.089062548', '121.8549941'],
   ['635', '498.9181871', '456.5173373', '226.554012', '487.3540318', '491.7209512', '493.5703192', '490.6615552', '490.1319754', '494.5734153', '361.7681201', '499.3939767', '496.9539091', '468.9150437', '495.1380371', '476.7628543', '489.490589', '469.7662849', '424.338612', '495.549643', '495.5595465', '444.5509843', '385.515145', '447.035639', '484.9868393', '488.3799629', '445.9396836', '457.3896788', '496.236488', '499.0619162', '490.3216172'],
   ['636', '23.49352463', '52.98631191', '28.33452226', '33.47382564', '42.57621631', '34.68071389', '437.780666', '126.6585304', '274.2559974', '4.600523083', '41.9704154', '350.1094417', '402.8802107', '142.6125814', '459.4692245', '66.60390922', '18.97378333', '74.41113316', '399.475903', '278.8697217', '18.94179637', '212.543168', '347.5767962', '182.0974926', '168.0655285', '31.91971884', '39.33981808', '64.37807034', '315.880242', '282.7678457'],
   ['637', '143.4704349', '203.3467684', '123.7027632', '76.42239334', '141.8717211', '76.25965469', '85.19292758', '67.9860887', '119.8392498', '54.09610533', '151.7783739', '258.8900162', '88.24787253', '121.3375399', '270.2695847', '263.8303995', '55.92909341', '121.7241729', '129.4614841', '243.8636027', '202.3836119', '101.4222417', '60.11622284', '154.9326388', '76.09818232', '76.21378306', '102.6275537', '209.0373244', '118.6038464', '290.6569268'],
   ['638', '12.29655877', '53.69489702', '38.08273647', '317.4767593', '446.2351123', '335.3746263', '196.9822734', '352.5483266', '209.3575919', '271.5959736', '428.8830947', '427.7802073', '425.9586973', '479.170434', '270.571068', '288.4689751', '431.4249715', '168.758419', '403.395309', '496.3471094', '495.3835747', '279.2303396', '38.06821419', '18.27673406', '177.1383739', '22.93115389', '31.78460753', '9.791136696', '13.17814198', '4.132993779'],
   ['639', '285.9244323', '280.0373012', '203.0142072', '55.54498568', '291.5950878', '265.2169846', '124.1061848', '163.1794401', '472.7827016', '407.6619042', '53.73670111', '323.3229592', '79.31066886', '283.0042912', '413.4057849', '250.7486185', '413.900449', '263.6157593', '428.078859', '483.9301828', '463.2461951', '101.4802983', '102.9762914', '139.2865546', '256.3654979', '374.7748984', '312.9008033', '270.4048803', '366.8653978', '112.1233924'],
   ['640', '80.344806', '158.0561565', '7.544194015', '10.9111881', '295.1977232', '147.4309519', '9.974665033', '142.0307559', '198.4052773', '313.3933154', '102.9219704', '68.77113133', '33.27781455', '27.90205034', '117.6079062', '94.64773168', '74.79504871', '219.0235239', '91.60548632', '224.8251681', '264.0334228', '9.781282083', '26.18810445', '40.29325361', '168.9774088', '162.0302483', '161.6691471', '43.0509558', '338.3218586', '1.664346273'],
   ['641', '441.355873', '382.2951141', '366.8712487', '443.2973623', '9.840931322', '88.19787076', '3.202876476', '476.4151843', '22.15988988', '6.299207523', '45.74264886', '74.62328239', '47.9807694', '20.8860579', '29.98038097', '31.24460786', '26.85562749', '0.365481007', '4.548746785', '108.0169473', '169.9384178', '81.51014905', '298.8420105', '216.5296082', '251.697779', '358.1530715', '397.6214845', '237.8414448', '419.0489882', '183.7700189'],
   ['642', '273.4583987', '306.5317492', '21.38136527', '427.6688304', '183.347765', '227.9706563', '176.6431208', '269.8211275', '311.0760222', '210.0748713', '37.55605954', '102.7124094', '112.4788326', '42.79235555', '240.473523', '255.4231744', '402.5096215', '83.04106124', '284.8100259', '16.72824923', '5.972959431', '66.89031672', '19.45716308', '13.87820592', '45.59540175', '23.98168699', '49.13075329', '23.42863673', '426.8950288', '4.004223521'],
   ['643', '467.1606107', '343.4186959', '247.8569168', '295.1106459', '308.746079', '102.3126554', '327.4260743', '324.9607172', '48.20819587', '7.797299012', '121.8428098', '109.3042582', '84.41067751', '24.13772256', '100.5178865', '54.67224357', '37.14152448', '1.258849038', '145.6078701', '386.4928456', '217.4557524', '182.1635771', '377.1490152', '465.8509579', '362.0058416', '28.15135506', '20.30398208', '450.836905', '487.4095885', '485.9788426'],
   ['644', '26.28974058', '226.6315388', '2.305302004', '284.9245134', '137.8850846', '148.8606066', '7.900966129', '440.5288195', '66.96818868', '19.37992468', '221.733862', '9.377052032', '11.09975534', '9.28756364', '7.512747653', '35.60336786', '99.66527932', '15.16443273', '13.104889', '241.5550452', '8.037233644', '220.3489919', '10.46492588', '36.74269973', '40.47647334', '392.0142191', '395.5365035', '48.22811725', '303.1417029', '447.8866425'],
   ['645', '287.3368057', '6.623980343', '94.10330032', '52.93224696', '296.3676593', '38.37685267', '276.3459237', '159.7658271', '20.89897284', '2.480444244', '59.4277023', '39.96903381', '264.4261534', '258.2008141', '37.02763202', '7.615668193', '5.40586586', '0.65542714', '231.0666685', '326.5316001', '38.22592721', '438.2344171', '450.2349113', '319.3889022', '97.66709541', '164.394958', '65.5993332', '89.98526608', '376.083936', '229.9743418'],
   ['646', '14.23108065', '27.93678184', '24.01042149', '21.46434258', '249.7509314', '29.28215283', '10.88873762', '74.0958889', '196.1428351', '30.89505744', '324.9005497', '287.1400677', '25.55206913', '2.967089235', '15.97536207', '151.1518385', '160.9730537', '469.8715033', '203.5128376', '52.22758051', '69.47615815', '28.71593107', '2.520575207', '207.0207709', '15.32703197', '17.98649762', '18.24325969', '47.00337427', '24.93936521', '22.76378992'],
   ['647', '387.5802549', '28.13783132', '14.76584273', '9.073176469', '21.59423371', '78.55706981', '10.54265719', '397.4032408', '4.172958113', '4.649247518', '252.0733562', '9.035510838', '14.84032011', '13.94192216', '29.20738783', '6.416635455', '221.7554331', '0.473600151', '4.114314525', '84.59616334', '175.9590212', '44.83562688', '360.3124367', '117.8230776', '51.14368454', '228.5595317', '122.3483678', '272.0546477', '201.5193751', '110.5167534'],
   ['648', '41.78627294', '58.62880203', '34.09343541', '22.90696624', '29.85471791', '12.05431255', '34.67483193', '52.24332904', '63.2929411', '23.01255751', '11.97717056', '88.37608653', '23.76864641', '44.33304411', '18.6030197', '46.27646673', '15.72053508', '69.96467256', '88.3502226', '30.0839867', '55.97874614', '8.098790474', '51.9272678', '28.86023932', '15.48424487', '35.54890401', '87.79811717', '19.79369335', '15.79782816', '51.32161692'],
   ['649', '264.6607945', '33.11244738', '1.800305345', '2.80145657', '52.21204508', '7.602272756', '72.22203494', '6.31103591', '75.54260948', '3.747298999', '0.428848403', '11.21163805', '69.92333626', '9.187430756', '54.70518452', '10.48662806', '88.91393732', '83.26392345', '57.38393742', '287.8798916', '17.14939394', '33.98829438', '38.22201866', '195.6479934', '122.3851436', '74.21414722', '118.2792597', '100.3817245', '378.9788807', '30.60740762'],
   ['650', '11.22710945', '62.82670685', '6.847751339', '292.8028877', '0.30477264', '2.793410678', '3.998689386', '319.1967091', '1.751187726', '1.05655332', '17.99669051', '1.111971359', '3.441195484', '37.44123853', '1.616098267', '3.296709861', '39.1404636', '1.93726223', '3.456548998', '5.679573307', '2.188126535', '84.55389409', '74.77925291', '9.484601956', '8.860581963', '12.71345156', '11.10691988', '13.38818608', '31.67274318', '33.32445988'],
   ['651', '1.297867147', '27.44435271', '1.745525453', '22.07335154', '19.39807648', '13.97472045', '4.112075769', '357.0545367', '12.22215723', '6.790194294', '26.36907515', '2.012222298', '192.2069598', '2.369294727', '5.445823135', '14.8457721', '19.1704105', '350.177404', '4.760941976', '83.45293504', '20.94579836', '30.53540391', '60.81566122', '1.232151572', '47.1034173', '140.4198433', '109.9112985', '2.852868091', '5.04780795', '144.6072369'],
   ['652', '98.80876482', '144.3015435', '112.0160199', '4.199018817', '147.1214745', '175.9027421', '20.16156598', '43.4132253', '73.74751856', '15.06496143', '6.303085026', '38.62206817', '43.51012414', '2.755120877', '45.42741453', '20.42802065', '326.810529', '44.23136044', '189.730039', '71.20873188', '11.68821774', '28.89440109', '220.1861187', '96.74043796', '68.82279054', '279.8121421', '180.8738597', '12.24207714', '231.1823442', '11.496899'],
   ['653', '1.99334923', '8.153153052', '1.16660305', '6.833382382', '122.9447245', '103.8925871', '3.398366134', '12.75165721', '33.71714414', '31.36902658', '0.970459722', '14.77602056', '136.3333843', '22.14139564', '27.36344306', '6.625678578', '84.0613288', '392.0518393', '66.97697286', '385.7100017', '324.8453105', '25.60169173', '8.508702119', '12.07044126', '5.137601405', '22.64953058', '18.13748789', '2.748504676', '4.623389773', '0.263117119'],
   ['654', '57.77929459', '14.1941973', '260.8411856', '21.26000813', '39.47605907', '10.92502134', '13.23214246', '35.67619066', '1.39137126', '1.090007366', '21.81600485', '5.828765253', '187.6178942', '7.344436099', '22.34060803', '3.568258374', '2.155787495', '1.821123476', '3.838731219', '0.394022615', '0.513635965', '69.08625507', '402.6939931', '258.5616873', '155.0680805', '18.33556082', '18.85247899', '51.52030464', '69.16330153', '299.3457142'],
   ['655', '32.58972144', '65.89038217', '33.10681352', '23.51534081', '84.21976621', '21.00536291', '5.924464863', '11.43702917', '6.515967725', '77.08824391', '64.27474608', '6.556998848', '44.41343539', '16.62422061', '3.237154743', '34.86442879', '127.9906541', '1.32553756', '5.680461571', '3.364717343', '2.417318256', '28.39125392', '87.71996971', '78.58597127', '128.0217061', '58.33748205', '62.4240918', '15.16047368', '125.2716605', '117.4779845'],
   ['656', '4.064577082', '21.93309085', '3.5631992', '230.6761339', '467.4541146', '303.7219659', '7.118713947', '441.6579414', '105.9105396', '14.80022652', '436.1962511', '118.0690616', '21.57277943', '106.7952571', '159.5396634', '154.1897978', '6.198897894', '26.28487443', '23.49610515', '433.8972099', '84.4722824', '2.450623159', '1.088773463', '12.36259716', '24.61908071', '137.9325496', '177.6472252', '3.384826899', '253.6756463', '8.504377536'],
   ['657', '16.59785357', '174.2455962', '111.7297896', '390.8192484', '486.7826601', '394.3035428', '290.1078678', '481.0449653', '130.7270104', '5.088532056', '424.3172123', '387.3950631', '61.905561', '302.2041842', '335.7874109', '181.9222666', '446.3063754', '59.57605066', '465.9888614', '499.7121568', '497.1294056', '209.3677066', '26.0197566', '134.0079437', '24.20252662', '343.12411', '257.0144201', '56.10702314', '70.91714216', '387.0856016'],
   ['658', '1.630030637', '62.93866575', '2.490540854', '126.3586769', '263.5042883', '172.9676241', '89.14117282', '187.0034021', '70.0791064', '337.6050391', '171.4396515', '47.93706736', '106.062359', '29.58121386', '40.79677466', '47.17967654', '29.736516', '15.20152248', '122.8812555', '364.1053648', '306.5787243', '114.4383263', '3.299075511', '2.64201348', '53.75748864', '47.59282092', '48.78223224', '1.783553011', '100.0881233', '20.24449921'],
   ['659', '214.1679839', '336.9324736', '97.70834093', '90.36604109', '241.3247041', '162.7887927', '311.8951368', '110.9271118', '422.7636641', '335.3059351', '361.5037346', '439.8308033', '283.9482774', '491.9971544', '488.7909877', '450.9578232', '461.1086417', '468.9165769', '326.5164334', '489.4527785', '440.4494549', '305.4596082', '192.2236255', '474.3739358', '314.8463869', '471.6458677', '455.110551', '378.1055224', '271.8273902', '453.5336969'],
   ['660', '101.5930293', '5.637488468', '232.2144272', '5.186123538', '51.86964255', '11.4215747', '29.08467121', '278.0414151', '4.291741323', '12.92550686', '101.7694769', '42.30292881', '337.5715992', '38.04054006', '70.68357664', '16.84747713', '43.8636732', '11.03189605', '107.5113826', '16.36296655', '29.757178', '137.5580869', '403.4918443', '173.2828912', '217.3721752', '17.77068146', '16.89627613', '202.3860035', '30.53446884', '476.6477339'],
   ['661', '4.506721714', '296.6297511', '0.360675684', '2.590605838', '220.1843839', '42.90544841', '59.38103531', '8.253254961', '210.7125868', '158.547298', '3.052335', '57.3027785', '77.58628147', '2.626229494', '35.72370734', '82.55739099', '139.731241', '475.4480369', '278.9750975', '0.602699898', '2.133282468', '16.23859159', '1.157410418', '1.572699409', '12.25976474', '25.95086606', '20.44421066', '3.365175628', '58.63651946', '6.115068834'],
   ['662', '58.37177035', '7.835232303', '4.726542054', '11.05917485', '2.526228869', '2.338130679', '4.566940806', '197.8457663', '1.92720267', '0.845319909', '5.733422351', '3.429644171', '1.408366799', '0.4335641', '93.22440613', '3.124515767', '4.717263309', '1.590141872', '2.079767711', '39.8176015', '2.981847345', '1.351911878', '7.91189442', '25.46675851', '6.063114315', '25.79225506', '21.67356922', '36.73080929', '8.995374011', '5.120632808'],
   ['663', '82.46198205', '54.46029378', '142.1150906', '104.8616115', '437.0339393', '134.2495737', '18.13323992', '133.0318035', '38.95203501', '3.206897771', '54.98452025', '11.48281764', '48.594868', '23.27010054', '15.20974676', '59.23189958', '45.36142829', '73.06996694', '51.70594654', '74.76181072', '49.86260294', '223.1338125', '178.7395526', '97.55086416', '34.73959722', '137.4587247', '122.8313663', '164.343332', '100.3007259', '180.4241239'],
   ['664', '456.6062138', '122.0120007', '444.0269264', '264.7876199', '342.9488831', '302.4751097', '459.5880527', '247.2598749', '398.2290793', '23.51972616', '494.8772626', '451.7980215', '464.2843016', '495.4763532', '384.4635653', '455.3226464', '430.1139514', '56.22571382', '476.8168395', '411.5847117', '318.0684206', '487.2752133', '498.0058312', '447.5680856', '436.4301299', '481.7092229', '455.2811991', '462.2137357', '432.4207479', '440.4635978'],
   ['665', '261.0351041', '487.8567083', '387.348038', '491.9414371', '497.8348345', '497.5335134', '470.44166', '479.5831872', '499.2600164', '496.9546355', '493.0220751', '495.6428495', '481.1780647', '498.1353183', '495.5584655', '496.7931151', '472.8968758', '499.3488546', '490.696436', '499.9078065', '499.3768736', '476.3368517', '460.9734014', '432.4462182', '483.090102', '471.3808045', '494.3821273', '339.2830725', '434.9667081', '185.4638464'],
   ['666', '128.1536466', '8.227342793', '5.925445515', '10.78965689', '224.971199', '45.08469737', '191.5750713', '10.58208233', '140.121706', '10.18038984', '20.63663565', '14.34676043', '105.1807805', '121.649836', '306.2270894', '41.58448501', '32.16604251', '59.28081932', '117.9477353', '404.983881', '274.4648426', '10.00659316', '327.6902606', '21.58574971', '31.53914354', '58.70857342', '45.84866036', '66.48455623', '48.664005', '181.9008727'],
   ['667', '58.62740056', '367.0655395', '10.28243051', '460.4192294', '180.3190286', '113.7083397', '2.906971491', '482.3992202', '142.9002206', '207.6588936', '394.3349413', '147.9180921', '5.100204049', '125.4837357', '46.69035575', '259.402535', '182.5572791', '255.6230211', '40.40184299', '320.1608968', '161.1381205', '5.108306005', '8.559982795', '6.910540127', '55.16378944', '29.29508258', '43.84391555', '24.98366847', '165.8658389', '0.965719279'],
   ['668', '3.319752327', '8.251250964', '0.413810855', '0.213884444', '6.656943419', '0.598284514', '312.5412741', '0.613400054', '26.73969022', '1.333250736', '0.746464637', '19.45647005', '347.7542835', '5.253011231', '121.7851898', '9.943670488', '50.18083821', '311.1111511', '243.1507139', '0.123140894', '0.094298327', '135.1126104', '15.45511776', '14.35508328', '20.24271072', '5.908983729', '4.754821741', '4.584589641', '1.686669411', '15.23510127'],
   ['669', '9.057293086', '368.8106606', '180.5225222', '295.7452654', '91.73688441', '211.5454251', '134.7567255', '458.996622', '327.8621273', '230.4812596', '484.2326701', '210.1852642', '236.5791667', '37.5306386', '318.5131079', '67.72357525', '193.294107', '412.3349482', '303.758535', '248.3749136', '216.2539722', '361.9990105', '9.448948313', '27.07122964', '55.44980351', '207.2150504', '69.70387722', '7.115580666', '281.2983504', '19.80081259'],
   ['670', '10.31597929', '9.674389165', '18.2900366', '187.1456668', '65.18486515', '46.29219233', '18.62360394', '62.52732733', '40.03239556', '57.40442715', '20.7394166', '21.66689914', '69.88564879', '8.541087769', '30.87695223', '18.61633219', '75.13576542', '22.38834409', '35.96991629', '35.97650965', '139.2063202', '24.58920526', '12.61126883', '4.527768943', '16.82588375', '4.994726735', '19.11574423', '2.794759065', '17.10592854', '11.99812438'],
   ['671', '1.245550822', '10.46802101', '1.058325485', '2.369885567', '16.8666717', '7.195417392', '270.765228', '2.166429927', '163.2290141', '16.27191318', '5.624078565', '30.98433232', '122.1144334', '25.43333102', '234.9871886', '38.68840729', '169.3593265', '247.5964458', '364.3934002', '16.58557422', '7.019481327', '30.20406698', '0.512257339', '9.580624275', '9.230938326', '32.76907565', '7.59902829', '0.916878212', '6.845929654', '0.679289407'],
   ['672', '340.8977088', '51.76762935', '29.62549118', '216.4474409', '428.6048819', '338.4199536', '485.8951468', '448.6660195', '473.2733015', '302.1595836', '497.720432', '462.9444218', '480.0913777', '441.4257883', '482.4038198', '408.5563001', '113.3317463', '159.0760687', '319.8884144', '361.5307086', '131.7036044', '422.5616209', '403.4552391', '462.7601369', '465.0802098', '474.8340616', '476.089072', '389.2623087', '481.680565', '471.5784419'],
   ['673', '146.4785326', '50.09399884', '214.8516392', '55.4003921', '89.90567281', '69.1899534', '99.12393723', '168.928923', '27.70519092', '22.84499492', '164.0033563', '65.6477714', '186.044157', '105.151119', '63.08269521', '28.77156165', '63.32471317', '116.2810523', '45.67282795', '214.5792252', '370.902437', '80.65050405', '280.367269', '121.6541195', '110.9568183', '163.9236377', '116.9996225', '80.98954249', '347.2029767', '6.493014719'],
   ['674', '178.1415921', '233.3562189', '142.9963293', '340.0992858', '415.4040256', '254.4400467', '114.8621202', '478.709805', '26.73116344', '22.85033327', '426.4515444', '25.21130941', '169.0296263', '155.2644118', '33.5054073', '30.1512975', '317.1212374', '134.7630719', '78.38295929', '495.9985387', '489.7208967', '320.3793906', '59.03916212', '77.83133567', '267.9010482', '179.1929486', '33.52057326', '60.19898589', '408.6788726', '5.056440431'],
   ['675', '0.734836733', '8.733057808', '0.231737739', '29.39146492', '0.483163438', '1.762724769', '10.85907873', '150.8548945', '9.676550595', '1.207714448', '34.70723862', '1.213387062', '6.658880672', '4.301129295', '3.644799378', '8.015105702', '12.57823053', '13.13588044', '2.5489467', '0.138636339', '0.143299995', '10.41353951', '0.910349821', '1.671905505', '7.500999942', '146.1798828', '138.6465816', '0.448064197', '21.77001789', '3.397708286'],
   ['676', '40.84107157', '40.45902461', '26.9521841', '28.75612642', '8.516943232', '14.47534605', '422.6301198', '12.22721866', '254.8389116', '97.14121482', '144.5966441', '394.9286199', '465.5744185', '97.99568821', '155.1608544', '142.9705607', '102.3070999', '396.3578761', '415.8836799', '6.094556774', '26.85554341', '410.4178451', '56.81414209', '220.093287', '200.9095454', '11.85638834', '20.32598745', '95.97174865', '14.6132627', '359.6492867'],
   ['677', '288.0406407', '337.9345317', '29.23582346', '115.3854877', '495.3942397', '470.6512113', '413.6683929', '370.8042964', '361.5774505', '59.6774604', '372.4170793', '451.4991912', '144.5488672', '486.6051638', '468.8672851', '375.1881606', '452.5766931', '49.68143287', '347.8774711', '496.1620488', '493.4421707', '30.89199551', '179.2135551', '230.2915563', '102.7271149', '422.5393495', '362.9407086', '258.2324121', '461.4333472', '354.0575431'],
   ['678', '161.2914977', '321.3577835', '260.1194089', '126.5138165', '301.8094076', '160.452704', '389.6710761', '45.42144215', '482.0865353', '372.4805865', '103.6512624', '466.0544466', '472.2902118', '464.7358436', '383.5329574', '467.181986', '252.7520467', '498.7926857', '449.8891786', '214.5865326', '310.047618', '408.6684978', '133.4728608', '228.4767397', '433.2964707', '60.27212653', '43.90642695', '220.7984295', '28.9120006', '11.34681282'],
   ['679', '69.78682425', '20.31147102', '7.737097911', '414.3524762', '43.5466186', '184.5535577', '35.98191147', '334.6542693', '114.4151202', '6.717742592', '326.7075289', '32.58022456', '76.45344492', '352.9891024', '22.51528347', '37.83199588', '23.97207208', '0.783767054', '23.83675685', '239.9374457', '5.708264605', '30.09612471', '169.496994', '112.0653758', '9.580414947', '86.28548016', '48.60891121', '11.6846172', '58.53473577', '46.52272749'],
   ['680', '0.943929277', '111.0797789', '7.458468282', '212.5389971', '210.2566144', '70.03524126', '5.999111684', '314.5623328', '11.20126236', '1.746922842', '398.2774741', '6.022231513', '4.330044446', '1.296156134', '0.979812371', '10.1427781', '0.989744072', '0.41106933', '3.774926554', '21.44995773', '27.89496467', '9.457386295', '8.362205874', '13.10341936', '7.857805878', '326.5875163', '226.0880702', '0.931312241', '39.39708267', '2.534614366'],
   ['681', '0.912043053', '58.22234818', '1.809241065', '54.76529413', '143.2645641', '72.78607654', '8.11905395', '318.4045853', '111.9351903', '26.74762545', '405.3763101', '14.958163', '1.335801302', '19.0688196', '123.1288796', '60.75950405', '27.11744698', '17.51785307', '24.56832979', '465.2128428', '386.1143805', '4.075897149', '2.007779136', '7.734794139', '5.97653575', '75.24860868', '48.33806827', '4.817039081', '17.16326898', '4.508686859'],
   ['682', '118.5938262', '15.87495093', '11.86067809', '9.196568957', '481.9169459', '327.9164855', '231.753755', '81.95905093', '154.9076733', '51.12563873', '286.1367645', '306.2861641', '338.439052', '197.2359928', '314.7296721', '290.3761421', '443.3746231', '122.2855681', '364.0738495', '138.2284488', '76.05525324', '343.540128', '34.94320022', '271.0285497', '179.4624539', '391.3435633', '275.7826595', '135.483394', '268.4653371', '441.8513841'],
   ['683', '466.1068935', '488.1864878', '420.2590542', '475.5233429', '499.3158065', '493.9339189', '390.1780144', '498.7331091', '495.2614107', '467.6935457', '492.82691', '479.1478579', '496.0436835', '455.9236294', '399.6013625', '494.3931915', '460.2776539', '497.2234974', '475.1306069', '190.7615345', '221.8450583', '466.391979', '486.1247907', '374.1999042', '481.870174', '478.5536267', '477.407747', '451.6785881', '486.9840232', '354.7593848'],
   ['684', '3.371431978', '21.79376029', '0.239387808', '0.107752784', '277.8242813', '28.05453327', '2.922970585', '2.758717534', '1.082396104', '0.402949416', '3.325601852', '0.342555945', '9.015808284', '2.703383226', '6.870508604', '1.148284291', '12.13090489', '1.414944633', '4.758688375', '427.7068655', '380.9502377', '32.62296254', '0.786890026', '1.296508305', '1.099471759', '143.8532329', '10.51814145', '1.484703703', '15.5668243', '4.022050774'],
   ['685', '119.8026036', '37.36974735', '24.17396154', '2.746134512', '389.0793783', '79.8493323', '6.434243497', '15.56623485', '1.122892369', '0.158100157', '5.819608554', '7.482066929', '11.90670692', '178.6124729', '91.82375712', '11.36186274', '410.0695955', '1.923415311', '26.76166864', '495.4474059', '479.2399438', '173.2373429', '189.397681', '317.5027763', '26.64543816', '341.3061003', '98.72823152', '70.46109401', '78.75926866', '378.8947278'],
   ['686', '16.44831047', '198.729606', '4.869420394', '25.32326537', '228.4305433', '67.18178018', '6.533928939', '156.7028756', '16.44850215', '22.11396198', '0.991402875', '5.876466133', '70.92317388', '20.19183348', '16.92462413', '13.52521797', '3.059309883', '7.31067946', '11.28586552', '368.3907893', '98.76847362', '203.4820532', '170.6574707', '3.117334379', '120.7390099', '60.38391253', '101.6082858', '5.591272392', '348.7510842', '121.6433384'],
   ['687', '6.824262395', '327.9679005', '12.31434314', '3.223988066', '449.9170617', '308.2734738', '65.29411979', '29.88956359', '416.1213211', '159.7266499', '14.08184573', '311.9754614', '82.18952386', '273.810826', '306.503104', '252.2413506', '36.53993852', '82.57407876', '135.4023289', '491.7556407', '472.4247232', '15.95371274', '29.3474342', '5.70093834', '97.42078958', '179.5819633', '122.2962384', '3.581507177', '285.8891417', '1.285636161'],
   ['688', '378.0868604', '102.1475923', '205.0000808', '142.596777', '21.65472658', '16.4958979', '471.8816181', '120.0054874', '378.8511605', '19.47128348', '15.78842446', '160.6769195', '481.2143494', '336.8270666', '182.0843288', '305.2618241', '386.5221074', '495.7917362', '304.9066087', '3.236943345', '2.614599', '421.2816676', '401.7019899', '380.7551143', '428.1172172', '276.9706762', '400.6879356', '456.435493', '202.0503204', '316.3017029'],
   ['689', '176.0609221', '325.2681123', '15.6494301', '6.91990583', '15.87220875', '25.67392455', '16.5381173', '202.1745634', '101.363147', '1.857185995', '1.283638665', '49.86338413', '114.4640169', '31.60493902', '134.9221412', '22.58911588', '374.9690935', '465.303278', '314.7953677', '6.127563216', '1.77203609', '58.28420241', '62.78495578', '87.44604279', '92.58045059', '166.7669307', '129.4885257', '121.7391294', '321.6300782', '40.36293831'],
   ['690', '146.7186423', '82.05773238', '25.22753202', '18.17600736', '276.4641939', '31.56149224', '3.499949334', '122.1450018', '12.12899604', '13.45218258', '12.39355628', '2.736550393', '6.7973286', '2.728731237', '4.556579141', '5.994379187', '2.448760749', '13.28170381', '9.50477463', '442.0623075', '423.699904', '12.76555581', '249.4971864', '11.06392516', '16.51030706', '70.41128094', '125.1490642', '221.8017567', '57.63655393', '23.82228733'],
   ['691', '250.4363928', '435.5315253', '6.811908505', '202.9787149', '429.1519932', '436.9899287', '165.2401718', '147.8708085', '431.4687699', '349.0815781', '245.7552339', '137.9148044', '160.9574531', '360.0141067', '90.04213396', '419.4940558', '381.5496112', '480.5155818', '141.0479832', '465.3580668', '121.4433221', '270.3454807', '27.81712604', '41.8891438', '232.636733', '428.5365755', '395.2540008', '307.6450399', '324.5445035', '279.5596803'],
   ['692', '9.428220893', '26.34132407', '4.643310501', '1.571928912', '2.266759516', '2.78232715', '4.026392622', '8.408963361', '12.4001871', '9.744960509', '14.01539148', '13.9213556', '136.4063238', '3.237275567', '19.43163998', '14.36819739', '3.169715273', '13.30174582', '7.443208952', '6.787819892', '0.303416613', '69.85548283', '17.68374705', '1.585913412', '19.50290694', '23.04272747', '3.785119737', '3.338785462', '9.153833105', '8.681144149'],
   ['693', '17.53132506', '359.8232527', '20.43992753', '461.4630711', '324.8955583', '397.7911695', '25.04585063', '488.6032224', '214.8188193', '76.29540281', '391.7759333', '65.25446753', '9.655951616', '310.7309865', '242.5704659', '246.3782653', '472.6500243', '217.270933', '217.2987797', '492.2528459', '413.1297839', '16.06634019', '1.263506296', '21.55572727', '9.95976704', '452.8146847', '466.4539899', '9.642717542', '288.7901957', '0.900142017'],
   ['694', '269.144139', '10.17034432', '3.296463746', '401.4038429', '158.7178138', '187.3955913', '36.90600261', '275.2604975', '57.08164783', '27.8977976', '387.325611', '17.89701899', '4.406671741', '3.059835364', '30.19433106', '31.70402781', '79.48872258', '11.55262581', '23.13972405', '336.6347812', '129.4083668', '44.36311252', '8.209638378', '146.6498135', '16.00962779', '170.7001524', '68.05731895', '114.6727927', '70.22558209', '58.08744784'],
   ['695', '92.86364132', '216.2599903', '33.03088341', '3.275928408', '107.7215816', '10.98916385', '3.025989694', '11.64971', '1.166729006', '0.94140828', '4.472817121', '1.400056779', '23.91417933', '1.231682488', '0.473283875', '8.635498732', '2.568584005', '0.637293776', '4.314097031', '17.83620649', '8.656726421', '205.8336839', '215.9776222', '36.53424856', '50.48204222', '394.2384604', '289.2756964', '192.9837485', '240.4182279', '306.1901329'],
   ['696', '32.17034313', '95.19936657', '1.144239945', '7.023358196', '88.18339459', '37.18798351', '1.745114834', '41.18174637', '3.201011286', '0.098034046', '11.08720937', '2.905445699', '9.560832682', '20.04578471', '16.89853041', '5.562561187', '196.6539336', '1.025111791', '13.44925619', '301.833247', '41.08098906', '9.618695626', '211.0253085', '17.71563233', '9.895999525', '377.0668093', '247.3585385', '15.23264098', '335.1543565', '143.7638886'],
   ['697', '9.921466615', '327.8604067', '8.487275241', '99.87908203', '2.900673995', '63.40945658', '6.760435958', '415.1449767', '6.771697193', '2.728867329', '19.68340641', '3.434101663', '34.69470166', '1.190505289', '8.636015533', '4.054161532', '29.86741648', '186.5114728', '14.58369791', '251.4452119', '10.22895588', '28.36394661', '48.93936348', '2.076860329', '15.35174166', '311.1812468', '263.8522703', '14.69637771', '127.7358766', '38.05658662'],
   ['698', '3.78734174', '304.0142217', '24.17391509', '95.60245447', '434.4853272', '248.507489', '15.37808957', '8.991958708', '237.3354975', '329.8348162', '93.33718712', '79.62866089', '44.78252082', '2.338940705', '7.256986852', '252.0253623', '36.33494199', '176.0054203', '152.7039865', '25.65163721', '2.188059938', '333.2283711', '10.73506191', '21.50991404', '20.93021665', '38.75406372', '20.79617985', '2.067781818', '15.22453657', '2.479612256'],
   ['699', '78.74853612', '2.865089741', '3.576657389', '23.14098773', '3.225746039', '2.798097032', '0.619523221', '55.23241477', '0.178964167', '0.640276685', '3.361968078', '0.216518292', '1.6244024', '0.45547741', '3.223956503', '0.390969178', '0.638985891', '0.014218824', '0.636228199', '1.068951137', '0.220268963', '5.033475112', '251.3708873', '85.35525859', '2.313201418', '1.827239011', '6.938722037', '53.97438821', '36.23624869', '35.86727911'],
   ['700', '216.7243318', '424.6138941', '458.7414122', '313.1074208', '47.53118116', '32.01430122', '464.8353272', '416.2293827', '348.2277938', '24.24643106', '156.4705075', '213.0833401', '384.8064178', '11.28407502', '89.90774326', '123.3427343', '177.3179792', '103.280417', '329.200777', '263.4748766', '70.07566974', '449.7421773', '486.0733686', '488.5039345', '468.2184561', '384.8484598', '425.7931312', '176.3683768', '392.6176984', '28.30966709'],
   ['701', '66.71309961', '14.10951558', '74.89845555', '6.646243719', '400.506832', '37.73739057', '333.9604439', '71.63317292', '155.5597612', '18.0535428', '38.11755162', '108.552449', '237.8349764', '48.63897351', '217.9780039', '231.0209105', '16.62870211', '195.2933977', '391.767863', '334.0572028', '137.1844433', '444.7695472', '482.559575', '434.9474549', '149.406492', '148.6576185', '112.5372491', '410.5667173', '98.51642621', '465.0935701'],
   ['702', '69.30838242', '362.9514836', '353.7096364', '484.5274845', '333.5061275', '239.4241757', '454.5063554', '472.0817018', '145.9945366', '250.8120547', '487.8269222', '387.9493492', '317.2029349', '483.3892818', '33.5407056', '251.8250728', '267.7110165', '316.5665085', '394.0522959', '467.3077795', '410.509889', '439.6984998', '94.5426953', '320.6281007', '298.7980671', '455.2153049', '431.9279674', '119.4319762', '251.3469841', '413.2225857'],
   ['703', '192.6856737', '23.72720982', '5.839393762', '396.4370028', '27.39798216', '51.84366934', '156.3828282', '479.053454', '18.49374958', '6.102570847', '467.5816102', '4.241793697', '8.110915721', '5.560239303', '25.82240073', '2.052589305', '12.69354543', '0.523508607', '8.486487371', '46.74299006', '60.82011318', '4.187796518', '3.92687945', '58.36054666', '27.01706559', '71.7426781', '78.99614359', '66.01242605', '278.3863387', '311.0720738'],
   ['704', '354.6635189', '443.8822146', '307.5299732', '354.4851195', '398.7113189', '347.6594132', '485.7444784', '454.6362157', '470.3011451', '88.23433947', '214.6398095', '496.7116769', '485.8231451', '487.0332765', '497.8579435', '465.1858', '494.2622544', '491.4382698', '497.6273328', '472.0824428', '213.2490234', '486.1312053', '316.4420588', '487.7194288', '464.2975472', '482.4268483', '485.8214633', '400.7583552', '471.5705135', '484.0063787'],
   ['705', '121.5117339', '209.7743841', '320.0349528', '480.5004614', '203.0174917', '284.8594012', '483.4882208', '475.7861148', '475.3347039', '492.1289199', '97.26641373', '354.1597513', '395.7612513', '73.89595836', '400.3606341', '357.4795595', '20.29994082', '369.8752096', '438.3744887', '432.0201237', '187.1371567', '213.8440065', '275.1712691', '70.42611103', '398.3034476', '202.6103692', '388.2479586', '229.3789613', '257.6351612', '10.42655506'],
   ['706', '1.522429462', '31.78834015', '3.738587291', '10.22001697', '12.82517372', '6.552012725', '20.38325049', '11.02473279', '57.44216803', '5.272109349', '265.4291739', '1.954552553', '169.6844098', '80.32044028', '6.834885173', '14.44980906', '19.42919168', '10.42898369', '11.99656689', '30.22107693', '215.8182296', '276.1416721', '236.6539477', '12.07733843', '57.7108013', '17.74848844', '10.61398504', '0.862148283', '15.5330359', '0.461571618'],
   ['707', '140.8989995', '15.47632769', '227.7880887', '365.3297773', '471.3395933', '242.7430504', '40.59897905', '480.2468913', '229.4331937', '4.768992061', '440.0782461', '75.20780666', '272.6726386', '107.8215635', '105.9624667', '171.7892198', '60.90460542', '22.00936683', '98.74233332', '10.09145289', '3.37147948', '276.4136802', '460.6417676', '211.9350472', '183.141771', '10.72739752', '36.39517464', '194.9891478', '76.13266643', '415.7106962'],
   ['708', '56.85040986', '49.60427408', '27.04353755', '116.1378624', '221.2430005', '164.8047726', '92.91179422', '397.6050856', '21.09551323', '2.019955902', '381.5048532', '5.722154445', '78.85850777', '126.1765934', '30.21719059', '20.01921517', '248.8057663', '8.869472165', '49.5231392', '226.2827576', '240.6378465', '221.952215', '403.4608196', '330.8740304', '24.72663162', '86.52280914', '37.46583176', '111.2604935', '24.64140963', '479.6964862'],
   ['709', '33.01999318', '1.374798832', '10.70238982', '1.32594343', '5.945605885', '3.086946873', '0.112431138', '2.741548893', '0.199288662', '0.029267627', '0.086628043', '0.414284065', '0.39134013', '2.47856712', '0.832157592', '0.514728402', '106.1871118', '0.073109738', '1.647628015', '23.66913307', '37.62441055', '3.704933057', '52.18634885', '41.50510397', '1.069924385', '7.539913432', '9.928475483', '29.99918464', '4.571708777', '336.0385863'],
   ['710', '4.863144107', '314.4554873', '67.51325007', '376.6866603', '87.35050369', '89.72051067', '56.76598584', '479.2845167', '35.24766019', '109.3051109', '478.4603757', '27.551225', '188.4163814', '64.09207732', '19.78056089', '67.21826415', '254.8175693', '7.111708741', '84.08281357', '171.3550714', '51.43882511', '406.2925072', '122.8434681', '145.1570398', '277.7921653', '237.9107809', '128.7986593', '6.781030557', '300.265022', '5.006919996'],
   ['711', '379.6127692', '339.9965226', '404.8725801', '254.1697282', '60.28065628', '214.0691673', '493.4417376', '420.3315567', '481.0441321', '439.2238977', '481.9806251', '497.7029713', '492.5898522', '357.7695822', '484.3871782', '475.6357564', '344.1585345', '471.5987708', '492.6949741', '348.3587976', '120.4608244', '484.3531539', '455.8494951', '420.9573459', '487.9600333', '119.3595315', '153.8973058', '419.9787941', '428.1323187', '432.6093408'],
   ['712', '55.60364463', '14.13094772', '312.1943643', '14.55227336', '19.17292145', '6.563877702', '12.80715252', '13.74441255', '5.127290054', '1.969639353', '109.2662627', '2.431613904', '21.22798703', '1.238245852', '0.657377727', '5.47581493', '16.18374122', '8.844285742', '20.02702975', '0.499381574', '2.715987959', '265.0516109', '264.9235429', '157.7898193', '22.47774484', '1.399383504', '0.559751802', '109.9923228', '6.727591185', '310.9354313'],
   ['713', '453.8197694', '2.753723263', '112.2268131', '358.3890088', '96.15627801', '16.5224988', '392.149795', '422.4166341', '149.6880442', '4.780331237', '242.2637681', '111.137843', '59.73681183', '7.928202359', '89.79382436', '48.732928', '17.90107476', '1.116817174', '178.1736632', '211.1632914', '7.812475148', '113.9204695', '374.1850355', '491.5212223', '207.5306304', '37.62227395', '139.0689279', '466.9637825', '76.54196411', '491.6941714'],
   ['714', '297.653361', '73.18936195', '115.7866563', '32.34571632', '282.3295618', '118.4432951', '290.7341234', '474.2916074', '81.77811075', '42.1724004', '68.1598889', '140.7206604', '293.2508563', '75.60592995', '386.3225938', '92.36682546', '232.9967741', '120.0560927', '389.1717357', '494.770227', '432.9828999', '114.6166682', '476.6462793', '336.8667998', '244.4905425', '384.149954', '436.7288352', '449.4296226', '186.2332311', '377.2073514'],
   ['715', '98.78020962', '351.5003985', '14.5088131', '200.6089438', '408.710316', '238.0671009', '320.9027103', '434.5042126', '403.9088976', '22.45025274', '178.7507662', '201.4577244', '250.9988109', '40.06950108', '436.6701802', '320.9941919', '7.036799848', '343.362846', '87.42148906', '446.2431782', '14.8472991', '193.1331756', '216.171057', '119.3770062', '304.3950785', '477.2455068', '487.3624122', '74.08147147', '448.8802716', '13.65160436'],
   ['716', '1.488763396', '12.840763', '0.370017706', '24.74828344', '252.6675049', '33.32663532', '3.550326481', '82.29321608', '14.05417104', '0.481648898', '15.77658698', '10.23410904', '17.61665545', '39.4269683', '31.18440524', '19.15083211', '375.8956666', '83.25887739', '84.97881072', '310.9108026', '331.9744483', '7.368476651', '0.434787764', '6.554594278', '20.97068623', '341.6964991', '367.3519704', '0.77914534', '40.6456557', '3.340090122'],
   ['717', '348.6050035', '424.3549611', '125.6214122', '341.0891927', '327.5871636', '369.0332741', '322.1783133', '436.8605685', '388.7019854', '417.9819601', '403.0151584', '402.1401124', '336.3448566', '434.3142742', '380.8184653', '307.6756', '435.4800402', '455.158772', '189.232335', '285.0906053', '271.4511293', '354.2066092', '128.4987117', '219.6186989', '448.5532512', '286.8347854', '189.1373691', '246.2188173', '363.1068749', '398.1702748'],
   ['718', '97.13500386', '0.685517291', '8.744876848', '0.490009971', '240.8672611', '25.71611899', '1.347805448', '3.87791352', '0.576104912', '0.867090409', '8.766793013', '6.532767633', '10.45575997', '184.7360113', '52.89151511', '8.164785169', '32.48004864', '0.173768044', '10.73859862', '419.9094713', '249.4532299', '22.8492292', '184.2932038', '22.84306629', '8.166626255', '125.6902016', '26.00914325', '37.31151837', '35.84660508', '415.9540503'],
   ['719', '26.32229628', '188.038357', '3.932315432', '6.570561889', '1.640440944', '19.55922493', '1.334857937', '43.7721277', '3.58168595', '3.213037757', '5.199871266', '0.505069221', '51.86722941', '5.177901562', '6.671883922', '4.068843157', '21.48518996', '9.134303563', '0.198376575', '2.170151258', '1.845890971', '11.51325378', '15.94418863', '3.792795179', '11.73856316', '348.0134453', '256.409427', '1.420970357', '48.45757494', '4.369291939'],
   ['720', '0.879005031', '61.11554234', '1.359885402', '7.583523912', '319.034294', '87.21290859', '29.9407085', '21.23733139', '10.06355609', '4.784067225', '8.570411847', '11.69641358', '48.20557022', '93.54320533', '78.03902573', '15.82656303', '8.607768758', '7.786706488', '151.4429944', '469.9957684', '279.8644677', '60.52240193', '12.24693531', '2.017147921', '7.605256175', '307.6676115', '135.7052155', '1.216877928', '235.8958288', '7.766295349'],
   ['721', '72.15865214', '95.6900029', '79.41228172', '314.0004939', '270.6635631', '264.9926633', '485.6065636', '491.7716902', '389.8377797', '473.9986399', '449.1658077', '340.2588239', '464.2014205', '446.6493079', '428.2943073', '60.14462133', '129.8769077', '416.9944189', '330.2585706', '469.2735435', '391.3172353', '349.243813', '231.3907149', '405.7735261', '394.1515469', '124.8060879', '271.4641172', '264.5137117', '128.9725601', '411.2694295'],
   ['722', '11.22710475', '1.795075489', '12.5044434', '5.659366223', '19.02828497', '2.050219167', '19.75735068', '270.8846167', '9.247050832', '0.302481066', '188.1285477', '56.35943642', '30.26422742', '5.476652331', '13.0936044', '2.742611738', '49.17024204', '97.31187453', '207.1938345', '3.794769781', '9.30091998', '19.71270627', '231.8953004', '18.29732926', '18.08301081', '0.501979209', '0.557033972', '8.180319805', '9.118270391', '70.74488757'],
   ['723', '59.65804035', '32.33202079', '7.31396298', '186.6710441', '131.6257011', '29.2131535', '12.45774585', '71.60073514', '6.920185472', '2.485693141', '20.20438081', '12.24943024', '28.07485606', '1.165686875', '1.966193758', '16.78851997', '127.3505218', '0.623253288', '103.8409041', '17.71569807', '2.015839182', '333.6556541', '12.8132605', '65.13149562', '125.9578889', '75.02672207', '110.8596177', '4.225750184', '362.3421377', '15.15487106'],
   ['724', '6.336073417', '147.5320362', '9.086781581', '5.71008569', '331.3575244', '22.51620762', '1.468993793', '76.2180174', '0.564136726', '0.042598879', '0.275527235', '0.261564584', '12.82321689', '0.255766461', '2.22357281', '1.337471485', '3.364328523', '0.086596648', '1.288060528', '202.8589082', '9.82733723', '165.1540922', '329.4347605', '49.06059412', '8.618651128', '38.92603846', '10.52226412', '12.90952113', '30.53072163', '15.276292'],
   ['725', '461.7953929', '20.75928098', '394.1939441', '8.85285001', '450.7961011', '255.0973517', '175.3551645', '17.72550479', '43.633278', '2.691000793', '175.4823406', '84.70506068', '120.7512224', '143.6286353', '118.2584748', '64.82001791', '45.78270427', '0.908102736', '209.6411874', '307.6443304', '59.65341016', '302.6515896', '430.9557289', '441.271175', '272.0076975', '464.562037', '445.5258508', '393.2046571', '486.0032929', '495.9470156'],
   ['726', '8.37483486', '307.4507078', '4.129059238', '75.54741258', '156.9800862', '71.45804495', '59.44714356', '375.314509', '30.19486262', '10.83880408', '281.5355133', '26.23008843', '32.38170845', '116.4536885', '24.72227397', '11.43114859', '244.6390505', '2.379944757', '217.7396345', '275.4502857', '221.0999974', '166.2781815', '5.560506533', '7.267648083', '7.460424754', '22.85640696', '2.319123137', '4.963028357', '57.71992207', '45.34403128'],
   ['727', '51.91714927', '247.6901279', '458.3409546', '436.9665731', '168.8077428', '91.22411424', '28.78398618', '483.9691033', '6.781352753', '6.793987837', '284.528293', '109.6392385', '12.99028899', '19.54693734', '5.879489499', '15.80683387', '12.82636729', '0.427657205', '5.043993142', '449.5396754', '311.247621', '153.0959416', '337.1724046', '269.1409296', '133.7404295', '40.35358446', '37.59754095', '168.9185094', '66.69905685', '51.78459291'],
   ['728', '119.1158594', '492.3394297', '11.99574488', '227.9244784', '486.6299145', '431.6823274', '451.7223701', '306.1286008', '478.2455992', '226.8515333', '28.70419582', '448.4814705', '483.3327706', '391.5484434', '488.769477', '434.3303551', '424.7981421', '499.0988113', '468.8425933', '491.5541634', '465.7273258', '221.3642124', '60.41039996', '148.3838136', '429.3880055', '493.9036662', '497.3496502', '128.9412436', '489.742107', '30.2204865'],
   ['729', '5.842881678', '9.03442794', '15.73246059', '360.8451247', '155.3285254', '56.39818412', '86.20429988', '454.504527', '32.90877348', '19.50840058', '110.3444581', '10.04240679', '68.81994351', '6.925970728', '29.74001677', '15.88501507', '69.9729929', '6.993064819', '130.4723144', '240.8506585', '16.43290205', '398.3296373', '291.5764576', '128.6797225', '47.13390454', '9.818570975', '10.45161724', '7.7462479', '217.8532466', '127.1554975'],
   ['730', '54.68614202', '338.6199876', '25.92706808', '431.9847979', '434.2166543', '426.5964828', '9.329976684', '493.8078522', '8.509000726', '0.956463387', '264.3052687', '174.411053', '16.47449215', '16.20331651', '51.67079975', '42.47622199', '257.4972777', '4.597014247', '113.3936055', '310.7327776', '59.94062135', '30.49110469', '32.36491883', '196.9916889', '10.66859619', '451.5110922', '423.9243119', '91.76829932', '298.9131705', '141.5627658'],
   ['731', '279.1907304', '267.4302398', '81.01035683', '196.5615416', '237.0135418', '64.62420747', '487.2899708', '317.1564042', '395.3128683', '110.6815548', '93.63896135', '359.5524286', '457.2658714', '308.226318', '467.2729378', '305.489053', '33.71083632', '488.2786708', '459.3324875', '371.4362183', '13.94215393', '337.5766094', '330.9900018', '207.9727541', '420.8808035', '474.6380499', '472.7558487', '141.0309526', '290.9070883', '140.8299817'],
   ['732', '6.407820181', '244.7474775', '27.44094363', '162.4642735', '140.3536323', '34.00840468', '18.85834571', '317.5341', '43.19889211', '6.274530307', '21.66060772', '147.3076723', '397.5763636', '33.21375005', '22.90693725', '35.4866483', '7.510090815', '56.67072897', '177.2312539', '77.19159766', '65.8765047', '364.3381016', '48.8022222', '19.10146693', '140.2961509', '160.9869573', '220.1918953', '10.81141868', '34.53871533', '11.01961329'],
   ['733', '230.3834094', '324.5264271', '56.95272345', '397.593163', '482.1746773', '470.5847772', '38.34215834', '496.4809595', '79.09534488', '312.1597592', '478.1761684', '69.86160642', '99.81225728', '75.62163702', '29.53968238', '34.03610675', '80.27345187', '2.006631964', '74.18847802', '455.5475713', '457.3246709', '209.4053225', '174.7624722', '11.76110737', '26.46176985', '171.78187', '64.95439886', '62.04222298', '409.8562965', '95.90881546'],
   ['734', '402.6077084', '442.4886798', '106.746734', '493.9352306', '466.4208278', '478.272399', '384.6044075', '484.6981115', '385.1085604', '457.2157011', '424.9797605', '311.4510111', '122.7341139', '284.3662032', '393.8903954', '243.7210193', '45.15043145', '8.924264939', '364.432918', '499.3422548', '497.1849595', '129.3544022', '217.0352342', '419.3972642', '211.8605887', '226.4804432', '354.2731285', '426.7592998', '471.0004611', '331.9248597'],
   ['735', '122.2275054', '415.2737909', '153.7269349', '370.4002894', '456.0440733', '397.7884587', '76.12050127', '353.7052371', '277.3760167', '487.8649873', '138.443618', '93.17796483', '329.3692087', '311.0804591', '415.8940955', '384.8624976', '404.5392549', '457.5990566', '385.6417524', '478.6925248', '424.636935', '209.4261682', '90.79561245', '77.63895345', '302.9982519', '125.8388764', '256.2202662', '117.6252092', '194.9958814', '9.566255932'],
   ['736', '234.9022529', '303.8919487', '15.67912416', '18.62831359', '359.5389814', '257.3458572', '35.34218367', '31.71699803', '30.25653506', '112.841246', '1.079516617', '3.548784942', '13.23513988', '15.1783511', '35.91901737', '24.32503709', '17.15870543', '16.93039349', '25.55008975', '4.501659386', '4.351621593', '3.207703962', '340.9870643', '116.1059833', '22.94886407', '175.4082501', '329.946336', '46.08127217', '448.2904145', '3.242105543'],
   ['737', '218.1589831', '6.564184319', '8.880247236', '0.430266455', '0.062471015', '0.319608439', '9.422767317', '7.043859386', '1.128939784', '0.998454689', '2.36118728', '0.794194855', '19.970763', '2.158344078', '7.596397897', '0.184168057', '0.195802993', '0.017096942', '0.714038638', '0.652986698', '0.978631334', '21.36225934', '393.0836485', '73.83225199', '26.741903', '3.411778588', '4.614221329', '209.6524028', '190.2416313', '461.3311353'],
   ['738', '248.1627158', '433.038078', '400.5254678', '6.55014651', '132.1269502', '63.14806651', '195.6392193', '50.3539105', '3.072190943', '0.909873718', '2.878086102', '18.58779821', '239.5554786', '3.074584271', '98.54153123', '13.61871989', '5.634810824', '8.392201554', '31.65019726', '199.4074553', '62.85264722', '226.8333706', '484.8932575', '449.0226429', '257.2544223', '239.0078196', '148.5853663', '321.7659791', '295.6850454', '65.20589221'],
   ['739', '11.90532353', '44.36664665', '208.6534698', '63.75493789', '14.3687526', '11.57503274', '2.538551948', '60.93126092', '2.999309017', '15.82021275', '1.062649411', '7.600592062', '95.11236748', '3.31027667', '0.723511129', '5.773454139', '9.491030223', '10.00121213', '2.927382739', '19.05471158', '27.72775083', '36.44130513', '79.45886951', '11.6658338', '16.7498913', '11.37045726', '15.51889084', '22.15590694', '11.55547977', '229.4472339'],
   ['740', '408.7536801', '66.20538321', '3.359523663', '58.39817226', '170.3176805', '168.8915121', '1.467532311', '396.0101287', '3.2967726', '1.705107951', '308.8699319', '5.848502212', '19.02414143', '295.9431392', '16.51661249', '12.29722112', '198.5713793', '0.232471639', '11.41547712', '36.00710661', '26.66550753', '132.2554632', '475.1421505', '75.83539394', '45.49795259', '169.5272473', '138.4125882', '373.1025273', '282.442873', '489.4395261'],
   ['741', '7.274745802', '363.4130483', '13.78107881', '5.556611929', '64.51599233', '61.21259267', '3.992796455', '7.507097601', '25.82471037', '37.01746147', '1.634486533', '17.79377786', '5.039081942', '96.22107571', '12.513452', '42.18594138', '68.57030381', '4.050997548', '17.48058593', '312.3710513', '416.1909575', '3.045115991', '1.307703686', '2.170050777', '24.36741942', '400.6369804', '416.5415216', '0.544345379', '296.9078755', '0.085886334'],
   ['742', '1.289607935', '3.510652292', '17.7187874', '1.610715954', '0.720344188', '1.977218922', '2.889954658', '3.505843173', '5.951931281', '3.264191793', '4.768030277', '0.974526958', '2.873439588', '1.499672753', '0.795112674', '5.499218213', '2.163587813', '0.671741625', '5.0557167', '0.116747237', '0.048473834', '23.74788556', '32.33842264', '2.593624597', '10.31281007', '52.03247282', '85.11682842', '1.358638473', '62.99364663', '15.0241184'],
   ['743', '76.59882618', '72.04802861', '4.606221184', '4.706631323', '30.84841569', '55.49245727', '30.29166987', '135.8636757', '90.23784253', '3.650628295', '406.9347439', '15.58048157', '95.38018229', '412.3896541', '45.33117507', '34.31938423', '156.3857749', '2.346754168', '34.34567837', '464.3319804', '456.0982403', '42.8769178', '34.58065923', '43.14631941', '35.23696588', '327.6831715', '53.61541845', '102.3594801', '262.9797869', '359.8511959'],
   ['744', '2.226537903', '20.24251912', '2.768587676', '238.7929252', '52.81697841', '31.45126276', '271.1302929', '282.2081226', '323.8094944', '3.083137736', '357.6196154', '98.02099975', '34.92775104', '3.05364207', '14.03855241', '39.85943871', '322.7239875', '412.9007149', '382.7577122', '118.61584', '24.30365347', '92.42198353', '1.179600146', '17.45127794', '9.570236154', '17.21696124', '12.88833578', '7.321015684', '27.44790669', '67.95935476'],
   ['745', '50.24817357', '22.46241409', '28.73154528', '22.65727168', '113.5428573', '28.47731801', '46.43087969', '27.60992686', '30.63270311', '14.17907893', '15.1730042', '6.78962398', '57.87646433', '31.67739765', '56.22527579', '37.6451945', '155.0744891', '28.42914973', '22.42904557', '14.99149716', '44.12861156', '57.53206681', '126.0407542', '41.81127068', '26.38865116', '84.5185345', '34.46951797', '76.25639639', '153.3155674', '244.4973685'],
   ['746', '42.85665302', '38.72159418', '3.95801766', '2.157773773', '450.7030327', '170.4975727', '12.6908883', '25.99771704', '3.200503292', '2.706086763', '241.3521799', '5.453130878', '14.34826259', '49.9774617', '20.31753009', '2.946375244', '28.68684946', '0.582883047', '20.09358156', '489.4610364', '474.5754546', '64.88060055', '73.12098728', '157.7883841', '2.884549335', '92.588629', '5.422765018', '71.74054681', '38.44517198', '397.2144227'],
   ['747', '96.17179403', '144.1659126', '45.86101136', '34.76070177', '42.13775351', '49.72662751', '7.364173472', '63.28159681', '62.6994201', '10.23345302', '97.01442693', '83.03917685', '242.9709057', '237.1755504', '64.58237487', '44.04345215', '292.8060268', '304.113768', '101.875711', '15.50052739', '35.95593027', '43.91600903', '80.89228693', '69.7468788', '135.6680557', '288.4622693', '179.2130528', '51.60161803', '236.6374415', '203.392065'],
   ['748', '117.8348403', '122.6430553', '74.05348553', '17.21066123', '258.4953693', '36.21108996', '428.2320702', '111.8292941', '120.2889306', '1.495294272', '6.970839912', '54.65894779', '299.5575694', '319.267628', '336.0980781', '54.791586', '325.4291165', '214.0763637', '308.6557418', '482.2897808', '342.9751151', '133.3101505', '380.3957697', '421.5918795', '38.52244023', '375.0767015', '201.5518839', '83.58962624', '59.36893453', '480.1753483'],
   ['749', '199.1035516', '7.651087746', '16.91111418', '47.64562077', '483.0291729', '237.1685679', '421.2716412', '213.2926912', '140.9467648', '49.22444744', '402.1003191', '398.583743', '163.2209691', '66.06606776', '55.30389038', '218.5926137', '105.1400603', '10.38272906', '437.2026496', '374.7304991', '151.1221796', '264.3465417', '386.085222', '428.3245659', '131.1018127', '75.96871294', '135.7199314', '173.1843096', '164.8582386', '296.8020537'],
   ['750', '18.42770754', '27.90784487', '50.82194105', '16.07270432', '24.26048764', '10.64725292', '77.24465174', '20.86690976', '51.17724113', '13.7511334', '13.45296081', '3.298966942', '57.42657912', '9.266055097', '1.430300836', '22.99467922', '103.3920856', '187.765963', '143.7128615', '1.51634056', '10.93557424', '10.05735325', '40.49411699', '6.738792215', '9.679920543', '16.99011369', '11.10420128', '6.648514766', '5.607340898', '20.60866364'],
   ['751', '2.579060096', '4.328487283', '18.05883746', '31.67868727', '2.049581046', '7.846608724', '5.484870495', '16.91535625', '10.37582753', '34.65346558', '23.70241453', '1.738180461', '9.33313735', '19.63443168', '9.10046355', '3.466661523', '5.480903321', '16.53798181', '4.259431761', '5.90402778', '9.793861219', '13.46324964', '22.06294154', '3.156083418', '1.564408575', '8.782842157', '13.81691308', '2.915535885', '32.5470434', '2.853230222'],
   ['752', '8.423821906', '52.49312903', '9.925068945', '55.99023645', '20.61440128', '29.98808938', '127.2807693', '134.7366049', '201.22135', '105.43043', '80.70567981', '46.6041792', '49.17190443', '21.19518777', '87.25805012', '149.9782596', '12.6848509', '83.78752699', '62.73138744', '10.25789807', '3.48218107', '21.35529565', '24.66809643', '5.820775082', '6.253291628', '67.45210778', '61.11140154', '30.97999624', '31.74322267', '9.953825504'],
   ['753', '51.71054686', '30.17022432', '35.09833393', '87.87611373', '105.869289', '165.1137257', '19.60661976', '112.8405744', '25.24560133', '90.72601393', '81.84934405', '46.10776225', '41.50379597', '16.71915543', '101.8038862', '37.8308719', '146.7981576', '16.03485884', '74.56808515', '84.30473585', '36.58993887', '49.49884761', '15.28643979', '11.73122439', '11.18903028', '16.64395683', '9.116550792', '35.26432217', '39.874791', '66.39073673'],
   ['754', '61.06417569', '122.4451643', '171.4795563', '32.13161819', '54.72962728', '72.05341451', '111.8890987', '63.52659829', '66.92022397', '84.15989177', '53.11604123', '45.43032164', '247.5539155', '76.80678171', '71.79910815', '28.15119503', '113.7692569', '219.3916455', '74.5675588', '46.73618493', '12.513115', '216.4689288', '54.09343337', '128.1291198', '178.0556934', '235.9433676', '76.52328085', '69.17106665', '133.7275553', '123.9142786'],
   ['755', '18.35294427', '8.288571804', '17.97492414', '3.847943755', '6.466528108', '34.96796943', '10.69198332', '5.848407914', '34.94480027', '17.21608761', '14.94503388', '66.85841413', '44.05437103', '29.30288864', '132.9686641', '20.30944608', '18.51369244', '3.736036474', '77.17040165', '56.59286906', '26.24727673', '50.53562167', '28.99763934', '63.76900838', '20.1749956', '46.60505766', '9.636114342', '13.68501744', '24.33334856', '7.412896501'],
   ['756', '38.48736325', '1.999504338', '53.21123135', '10.7228945', '60.14673636', '29.71986015', '25.34986264', '91.63111199', '12.94462866', '22.58000983', '15.56930476', '3.59217022', '5.801126509', '1.277981237', '17.54326459', '7.134265193', '5.249394436', '0.358810645', '63.94838855', '306.3716816', '239.0186968', '24.23618759', '25.85463459', '5.690553297', '5.220985486', '4.430167322', '8.78964996', '56.13844925', '32.12993229', '15.39408705'],
   ['757', '469.7970243', '311.8544273', '426.2084175', '495.2370994', '467.1911147', '456.6595128', '468.8704288', '465.7835382', '453.1160465', '489.0134839', '279.6986577', '439.1612535', '492.8110493', '480.8209089', '486.5453893', '487.0295677', '472.634047', '469.9307046', '464.516818', '493.0916407', '435.7357496', '441.5744995', '459.3468391', '482.366164', '493.8999613', '437.6232608', '483.7057678', '481.0952619', '474.9436701', '372.3123781'],
   ['758', '70.23553946', '59.34408326', '208.3275817', '29.17641052', '24.62400152', '28.17140635', '14.68047894', '22.59895459', '29.84181326', '14.11446923', '21.57438825', '20.00504155', '52.07231647', '153.9846784', '33.20987338', '37.65936398', '40.42416109', '28.99959619', '55.10181188', '20.93853348', '108.8749536', '27.34439358', '21.03474752', '25.24233608', '28.90791623', '84.33073832', '75.31088952', '63.08535755', '48.2235424', '38.71811279'],
   ['759', '427.1779647', '382.4441685', '460.0972834', '415.1173576', '217.1711515', '356.1698785', '498.5168483', '473.4709076', '491.1125582', '496.0549644', '462.4869124', '466.3189427', '477.3537925', '418.6237761', '497.2738999', '447.4882286', '477.5013401', '484.4034425', '495.7669738', '448.9650331', '346.4398666', '457.3689671', '469.7844499', '470.7453838', '450.9251567', '423.2209485', '443.2924049', '490.9595103', '409.3175969', '493.512146'],
   ['760', '3.919836476', '208.3510795', '1.992331442', '2.292668903', '196.6712329', '90.0148024', '412.2116178', '32.55833239', '400.1688456', '150.7296804', '19.58740976', '25.36428936', '471.9747984', '93.87059055', '282.5689006', '103.5785205', '139.0561297', '403.478306', '376.8816485', '243.7545688', '200.4182254', '105.6393711', '14.16906445', '4.251082697', '136.050481', '472.7880137', '411.513661', '5.145118749', '220.0823037', '0.921566351'],
   ['761', '25.39015671', '142.0963558', '68.7120106', '53.94213569', '190.7171576', '144.5841072', '300.6385859', '49.14984004', '199.4170549', '136.0402618', '219.7966728', '34.30217568', '246.770558', '204.4215697', '62.46683972', '124.9349686', '50.93211009', '182.4733558', '90.84088595', '77.8008581', '205.4225565', '40.70168681', '110.452972', '46.33969802', '27.31635505', '164.7064526', '99.05316631', '20.20334474', '122.8085594', '50.80809865'],
   ['762', '19.0757173', '47.30692532', '3.774309341', '2.835112281', '5.934829147', '23.48370749', '9.095465597', '4.090601784', '22.18269594', '4.760657055', '12.35039743', '13.13289222', '15.997315', '8.07736995', '13.84614709', '23.1048475', '37.1491624', '42.44593975', '42.10137902', '1.796208723', '1.511324092', '2.623168994', '8.701249618', '2.78128295', '10.21403843', '11.68827766', '5.443758672', '17.04413006', '17.96286102', '4.776868875'],
   ['763', '1.161363777', '261.6235166', '49.87436789', '150.8657126', '323.7571102', '352.9027261', '11.03910503', '83.87364589', '151.9634572', '17.24241649', '30.24062318', '85.76337093', '51.06595527', '71.40364309', '71.73038163', '276.741471', '303.1766944', '398.3813794', '87.92818799', '363.3109201', '433.6052278', '8.60643526', '5.042076384', '1.024250562', '19.59136356', '424.0640782', '364.1530988', '1.470797694', '28.58534425', '1.039590999'],
   ['764', '6.898871049', '18.48669539', '10.89370823', '2.139645822', '36.30471165', '15.50869172', '22.18133801', '7.917201106', '15.30577938', '0.656866835', '7.090138035', '8.322466253', '10.86565471', '2.806149188', '11.52428716', '9.789106301', '22.62686567', '59.62197122', '12.61761289', '10.5498211', '12.34909966', '19.82545972', '52.61909688', '10.63039995', '6.906662986', '31.5225576', '24.59168386', '5.228662568', '38.52349607', '2.011104349'],
   ['765', '26.73655958', '39.59256713', '19.46180469', '89.66734128', '9.229351794', '12.38372646', '15.44018567', '83.82591677', '149.8269204', '19.76208957', '51.58558942', '13.59679274', '13.40293374', '9.301007616', '16.02130895', '66.69408599', '12.92258325', '73.52432191', '8.39452053', '34.04884538', '6.849010377', '16.65992649', '10.39341968', '17.06434862', '7.470757464', '11.66835379', '11.88823542', '113.2057406', '6.036138475', '21.76675411'],
   ['766', '5.77757614', '15.3336384', '10.23802233', '4.469767428', '125.2855493', '12.45064416', '344.8110454', '49.06541289', '329.6652185', '2.126148052', '110.7034999', '88.35565849', '339.6559272', '19.70727964', '179.4294101', '21.29783051', '27.63042091', '387.5530844', '250.5230878', '377.0857484', '129.7678786', '191.7940064', '40.12685744', '43.15356367', '103.0296516', '192.3968347', '45.40362794', '5.697518443', '150.4938755', '36.74625879'],
   
     ];
   
     seg_1 = [
      
    ['1', '1', '0', '1', '0', '0', '0', '0', '0', '1', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['2', '1', '1', '0', '0', '1', '0', '0', '1', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['3', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['4', '1', '0', '1', '0', '0', '1', '0', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['5', '1', '1', '0', '0', '1', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['6', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['7', '1', '1', '0', '0', '1', '0', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['8', '1', '1', '0', '0', '1', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['9', '1', '1', '0', '0', '1', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['10', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['11', '1', '1', '0', '0', '1', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['12', '1', '0', '1', '0', '0', '0', '0', '0', '1', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['13', '1', '0', '1', '0', '0', '0', '0', '0', '1', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['14', '1', '1', '0', '0', '1', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['15', '1', '1', '0', '0', '1', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['16', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['17', '1', '0', '1', '0', '0', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['18', '1', '1', '0', '0', '1', '0', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['19', '1', '1', '0', '1', '0', '0', '0', '0', '1', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['20', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['21', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['22', '1', '0', '1', '0', '0', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['23', '1', '1', '0', '0', '1', '0', '0', '0', '1', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['24', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['25', '1', '1', '0', '0', '1', '0', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['26', '1', '1', '0', '0', '1', '0', '0', '0', '1', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['27', '1', '1', '0', '1', '0', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['28', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['29', '1', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['30', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['31', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['32', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['33', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['34', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['35', '1', '1', '0', '0', '1', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['36', '1', '1', '0', '1', '0', '1', '0', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['37', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['38', '1', '1', '0', '0', '1', '0', '0', '1', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['39', '1', '1', '0', '0', '1', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['40', '1', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['41', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['42', '1', '1', '0', '0', '1', '0', '0', '1', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['43', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['44', '1', '0', '1', '0', '0', '0', '0', '1', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['45', '1', '0', '1', '0', '0', '0', '0', '1', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['46', '1', '0', '1', '0', '0', '0', '0', '0', '1', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['47', '1', '0', '1', '0', '0', '0', '0', '1', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['48', '1', '1', '0', '0', '1', '0', '0', '0', '1', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['49', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['50', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['51', '1', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['52', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['53', '1', '1', '0', '0', '1', '0', '0', '1', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['54', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['55', '1', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['56', '1', '1', '0', '1', '0', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['57', '1', '1', '0', '0', '1', '0', '0', '0', '1', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['58', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['59', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['60', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['61', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['62', '1', '1', '0', '1', '0', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['63', '1', '1', '0', '0', '1', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['64', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['65', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['66', '1', '1', '0', '0', '1', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['67', '1', '1', '0', '1', '0', '0', '0', '0', '1', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['68', '1', '1', '0', '0', '1', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['69', '1', '1', '0', '0', '1', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['70', '1', '1', '0', '0', '1', '0', '0', '0', '1', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['71', '1', '1', '0', '1', '0', '1', '0', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['72', '1', '1', '0', '0', '1', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['73', '1', '1', '0', '0', '1', '0', '0', '0', '1', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['74', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['75', '1', '1', '0', '0', '1', '0', '0', '1', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['76', '1', '1', '0', '0', '1', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['77', '1', '0', '1', '0', '0', '0', '0', '0', '1', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['78', '1', '1', '0', '0', '1', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['79', '1', '0', '1', '0', '0', '0', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['80', '1', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['81', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['82', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['83', '1', '0', '1', '0', '0', '0', '0', '0', '1', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['84', '1', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['85', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['86', '1', '1', '0', '1', '0', '0', '0', '0', '1', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['87', '1', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['88', '1', '0', '1', '0', '0', '0', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['89', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['90', '1', '1', '0', '1', '0', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['91', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['92', '1', '1', '0', '0', '1', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['93', '1', '0', '1', '0', '0', '0', '0', '1', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['94', '1', '0', '1', '0', '0', '0', '0', '1', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['95', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['96', '1', '1', '0', '0', '1', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['97', '1', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['98', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['99', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['100', '1', '0', '1', '0', '0', '0', '0', '1', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   
   ['101', '1', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['102', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['103', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['104', '1', '1', '0', '0', '1', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['105', '1', '1', '0', '1', '0', '1', '0', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['106', '1', '1', '0', '0', '1', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['107', '1', '1', '0', '0', '1', '0', '0', '0', '1', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['108', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['109', '1', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['110', '1', '1', '0', '0', '1', '0', '0', '0', '1', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['111', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['112', '1', '1', '0', '1', '0', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['113', '1', '1', '0', '0', '1', '0', '0', '1', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['114', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['115', '1', '1', '0', '0', '1', '1', '0', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['116', '1', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['117', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['118', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['119', '1', '1', '0', '0', '1', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['120', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['121', '1', '0', '1', '0', '0', '0', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['122', '1', '1', '0', '0', '1', '0', '0', '1', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['123', '1', '1', '0', '0', '1', '1', '0', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['124', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['125', '1', '1', '0', '0', '1', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['126', '1', '0', '1', '0', '0', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['127', '1', '0', '1', '0', '0', '0', '0', '1', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['128', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['129', '1', '0', '1', '0', '0', '0', '0', '0', '1', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['130', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['131', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['132', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['133', '1', '0', '1', '0', '0', '0', '0', '0', '1', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['134', '1', '0', '1', '0', '0', '0', '0', '1', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['135', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['136', '1', '1', '0', '0', '1', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['137', '1', '1', '0', '1', '0', '0', '0', '0', '1', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['138', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['139', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['140', '1', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['141', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['142', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['143', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['144', '1', '1', '0', '0', '1', '0', '0', '0', '1', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['145', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['146', '1', '1', '0', '1', '0', '0', '0', '0', '1', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['147', '1', '0', '1', '0', '0', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['148', '1', '1', '0', '0', '1', '0', '0', '0', '1', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['149', '1', '0', '1', '0', '0', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['150', '1', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['151', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['152', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['153', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['154', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['155', '1', '1', '0', '0', '1', '0', '0', '0', '1', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['156', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['157', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['158', '1', '1', '0', '0', '1', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['159', '1', '1', '0', '1', '0', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['160', '1', '1', '0', '0', '1', '0', '0', '0', '1', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['161', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['162', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['163', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['164', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['165', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['166', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['167', '1', '0', '1', '0', '0', '0', '0', '0', '1', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['168', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['169', '1', '1', '0', '1', '0', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['170', '1', '1', '0', '0', '1', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['171', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['172', '1', '1', '0', '0', '1', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['173', '1', '0', '1', '0', '0', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['174', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['175', '1', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['176', '1', '1', '0', '1', '0', '1', '0', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['177', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['178', '1', '1', '0', '1', '0', '1', '0', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['179', '1', '1', '0', '1', '0', '0', '0', '0', '1', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['180', '1', '0', '1', '0', '0', '0', '0', '0', '1', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['181', '1', '0', '1', '0', '0', '0', '0', '0', '1', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['182', '1', '1', '0', '0', '1', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['183', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['184', '1', '1', '0', '0', '1', '0', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['185', '1', '1', '0', '1', '0', '0', '0', '1', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['186', '1', '1', '0', '1', '0', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['187', '1', '1', '0', '0', '1', '0', '0', '0', '1', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['188', '1', '1', '0', '1', '0', '0', '0', '0', '1', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['189', '1', '1', '0', '0', '1', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['190', '1', '0', '1', '0', '0', '0', '0', '1', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['191', '1', '1', '0', '0', '1', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['192', '1', '0', '1', '0', '0', '0', '0', '0', '1', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['193', '1', '1', '0', '0', '1', '0', '0', '0', '1', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['194', '1', '1', '0', '1', '0', '0', '0', '0', '1', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['195', '1', '1', '0', '1', '0', '0', '0', '1', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['196', '1', '1', '0', '1', '0', '0', '0', '0', '1', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['197', '1', '0', '1', '0', '0', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['198', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['199', '1', '0', '1', '0', '0', '1', '0', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['200', '1', '1', '0', '0', '1', '1', '0', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   
   ['201', '1', '1', '0', '0', '1', '0', '0', '1', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['202', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['203', '1', '1', '0', '1', '0', '0', '0', '1', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['204', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['205', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['206', '1', '1', '0', '0', '1', '0', '0', '0', '1', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['207', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['208', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['209', '1', '0', '1', '0', '0', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['210', '1', '1', '0', '0', '1', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['211', '1', '1', '0', '0', '1', '1', '0', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['212', '1', '1', '0', '0', '1', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['213', '1', '1', '0', '0', '1', '0', '0', '1', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['214', '1', '1', '0', '0', '1', '0', '0', '0', '1', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['215', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['216', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['217', '1', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['218', '1', '1', '0', '0', '1', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['219', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['220', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['221', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['222', '1', '1', '0', '0', '1', '0', '0', '0', '1', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['223', '1', '1', '0', '0', '1', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['224', '1', '0', '1', '0', '0', '0', '0', '0', '1', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['225', '1', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['226', '1', '1', '0', '0', '1', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['227', '1', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['228', '1', '0', '1', '0', '0', '0', '0', '0', '1', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['229', '1', '0', '1', '0', '0', '0', '0', '0', '1', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['230', '1', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['231', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['232', '1', '0', '1', '0', '0', '0', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['233', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['234', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['235', '1', '1', '0', '0', '1', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['236', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['237', '1', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['238', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['239', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['240', '1', '0', '1', '0', '0', '1', '0', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['241', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['242', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['243', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['244', '1', '1', '0', '0', '1', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['245', '1', '1', '0', '0', '1', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['246', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['247', '1', '1', '0', '0', '1', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['248', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['249', '1', '0', '1', '0', '0', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['250', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['251', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['252', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['253', '1', '1', '0', '1', '0', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['254', '1', '1', '0', '0', '1', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['255', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['256', '1', '1', '0', '0', '1', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['257', '1', '1', '0', '0', '1', '0', '0', '1', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['258', '1', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['259', '1', '0', '1', '0', '0', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['260', '1', '1', '0', '0', '1', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['261', '1', '0', '1', '0', '0', '0', '0', '1', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['262', '1', '1', '0', '0', '1', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['263', '1', '1', '0', '0', '1', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['264', '1', '1', '0', '0', '1', '0', '0', '1', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['265', '1', '1', '0', '0', '1', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['266', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['267', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['268', '1', '1', '0', '1', '0', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['269', '1', '1', '0', '0', '1', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['270', '1', '0', '1', '0', '0', '0', '0', '1', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['271', '1', '1', '0', '0', '1', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['272', '1', '1', '0', '0', '1', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['273', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['274', '1', '1', '0', '1', '0', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['275', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['276', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['277', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['278', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['279', '1', '1', '0', '0', '1', '0', '0', '0', '1', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['280', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['281', '1', '1', '0', '1', '0', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['282', '1', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['283', '1', '1', '0', '0', '1', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['284', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['285', '1', '1', '0', '0', '1', '0', '0', '1', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['286', '1', '1', '0', '1', '0', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['287', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['288', '1', '1', '0', '1', '0', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['289', '1', '1', '0', '0', '1', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['290', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['291', '1', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['292', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['293', '1', '1', '0', '0', '1', '0', '0', '1', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['294', '1', '0', '1', '0', '0', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['295', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['296', '1', '1', '0', '0', '1', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['297', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['298', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['299', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['300', '1', '1', '0', '0', '1', '1', '0', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   
   ['301', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['302', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['303', '1', '0', '1', '0', '0', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['304', '1', '1', '0', '0', '1', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['305', '1', '0', '1', '0', '0', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['306', '1', '1', '0', '0', '1', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['307', '1', '1', '0', '0', '1', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['308', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['309', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['310', '1', '1', '0', '1', '0', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['311', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['312', '1', '1', '0', '0', '1', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['313', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['314', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['315', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['316', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['317', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['318', '1', '1', '0', '0', '1', '1', '0', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['319', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['320', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['321', '1', '0', '1', '0', '0', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['322', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['323', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['324', '1', '1', '0', '1', '0', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['325', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['326', '1', '0', '1', '0', '0', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['327', '1', '1', '0', '0', '1', '1', '0', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['328', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['329', '1', '1', '0', '1', '0', '1', '0', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['330', '1', '1', '0', '0', '1', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['331', '1', '1', '0', '0', '1', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['332', '1', '1', '0', '0', '1', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['333', '1', '1', '0', '0', '1', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['334', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['335', '1', '1', '0', '0', '1', '0', '0', '1', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['336', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['337', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['338', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['339', '1', '0', '1', '0', '0', '0', '0', '0', '1', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['340', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['341', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['342', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['343', '1', '0', '1', '0', '0', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['344', '1', '1', '0', '1', '0', '1', '0', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['345', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['346', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['347', '1', '1', '0', '0', '1', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['348', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['349', '1', '0', '1', '0', '0', '0', '0', '0', '1', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['350', '1', '1', '0', '0', '1', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['351', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['352', '1', '1', '0', '1', '0', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['353', '1', '0', '1', '0', '0', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['354', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['355', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['356', '1', '0', '1', '0', '0', '0', '0', '1', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['357', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['358', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['359', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['360', '1', '0', '1', '0', '0', '0', '0', '1', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['361', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['362', '1', '1', '0', '0', '1', '0', '0', '1', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['363', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['364', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['365', '1', '1', '0', '0', '1', '1', '0', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['366', '1', '1', '0', '1', '0', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['367', '1', '1', '0', '0', '1', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['368', '1', '0', '1', '0', '0', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['369', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['370', '1', '0', '1', '0', '0', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['371', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['372', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['373', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['374', '1', '0', '1', '0', '0', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['375', '1', '0', '1', '0', '0', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['376', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['377', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['378', '1', '1', '0', '1', '0', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['379', '1', '0', '1', '0', '0', '0', '0', '1', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['380', '1', '1', '0', '1', '0', '0', '0', '1', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['381', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['382', '1', '1', '0', '1', '0', '0', '0', '1', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['383', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['384', '1', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['385', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['386', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['387', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['388', '1', '1', '0', '1', '0', '0', '0', '1', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['389', '1', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['390', '1', '0', '1', '0', '0', '0', '0', '1', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['391', '1', '1', '0', '0', '1', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['392', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['393', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['394', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['395', '1', '0', '1', '0', '0', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['396', '1', '1', '0', '0', '1', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['397', '1', '1', '0', '1', '0', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['398', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['399', '1', '1', '0', '1', '0', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['400', '1', '1', '0', '1', '0', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   
   ['401', '1', '0', '1', '0', '0', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['402', '1', '1', '0', '0', '1', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['403', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['404', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['405', '1', '1', '0', '1', '0', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['406', '1', '1', '0', '1', '0', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['407', '1', '0', '1', '0', '0', '1', '0', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['408', '1', '0', '1', '0', '0', '0', '0', '1', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['409', '1', '1', '0', '1', '0', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['410', '1', '1', '0', '0', '1', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['411', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['412', '1', '1', '0', '0', '1', '0', '0', '1', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['413', '1', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['414', '1', '1', '0', '0', '1', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['415', '1', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['416', '1', '1', '0', '0', '1', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['417', '1', '1', '0', '0', '1', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['418', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['419', '1', '1', '0', '0', '1', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['420', '1', '1', '0', '1', '0', '1', '0', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['421', '1', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['422', '1', '1', '0', '1', '0', '0', '0', '1', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['423', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['424', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['425', '1', '0', '1', '0', '0', '0', '0', '1', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['426', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['427', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['428', '1', '1', '0', '1', '0', '1', '0', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['429', '1', '1', '0', '0', '1', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['430', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['431', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['432', '1', '0', '1', '0', '0', '1', '0', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['433', '1', '1', '0', '0', '1', '0', '0', '1', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['434', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['435', '1', '1', '0', '0', '1', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['436', '1', '1', '0', '0', '1', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['437', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['438', '1', '1', '0', '0', '1', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['439', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['440', '1', '1', '0', '0', '1', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['441', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['442', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['443', '1', '1', '0', '1', '0', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['444', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['445', '1', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['446', '1', '0', '1', '0', '0', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['447', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['448', '1', '1', '0', '0', '1', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['449', '1', '1', '0', '0', '1', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['450', '1', '1', '0', '1', '0', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['451', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['452', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['453', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['454', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['455', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['456', '1', '1', '0', '1', '0', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['457', '1', '0', '1', '0', '0', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['458', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['459', '1', '1', '0', '1', '0', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['460', '1', '1', '0', '0', '1', '0', '0', '0', '1', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['461', '1', '1', '0', '1', '0', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['462', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['463', '1', '0', '1', '0', '0', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['464', '1', '1', '0', '0', '1', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['465', '1', '0', '1', '0', '0', '0', '0', '0', '1', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['466', '1', '0', '1', '0', '0', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['467', '1', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['468', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['469', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['470', '1', '1', '0', '1', '0', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['471', '1', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['472', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['473', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['474', '1', '1', '0', '0', '1', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['475', '1', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['476', '1', '0', '1', '0', '0', '0', '0', '0', '1', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['477', '1', '1', '0', '1', '0', '0', '0', '1', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['478', '1', '1', '0', '1', '0', '0', '0', '0', '1', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['479', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['480', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['481', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['482', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['483', '1', '1', '0', '0', '1', '0', '0', '1', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['484', '1', '0', '1', '0', '0', '0', '0', '1', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['485', '1', '0', '1', '0', '0', '0', '0', '0', '1', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['486', '1', '0', '1', '0', '0', '0', '0', '0', '1', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['487', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['488', '1', '1', '0', '0', '1', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['489', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['490', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['491', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['492', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['493', '1', '1', '0', '1', '0', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['494', '1', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['495', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['496', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['497', '1', '0', '1', '0', '0', '0', '0', '1', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['498', '1', '1', '0', '0', '1', '0', '0', '1', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['499', '1', '0', '1', '0', '0', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   ['500', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   
    ['501', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['502', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['503', '1', '1', '0', '0', '1', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['504', '1', '1', '0', '0', '1', '0', '0', '1', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['505', '1', '1', '0', '1', '0', '0', '0', '1', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['506', '1', '1', '0', '0', '1', '0', '0', '1', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['507', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['508', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['509', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['510', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['511', '1', '1', '0', '1', '0', '0', '0', '1', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['512', '1', '0', '1', '0', '0', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['513', '1', '0', '1', '0', '0', '0', '0', '1', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['514', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['515', '1', '1', '0', '0', '1', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['516', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['517', '1', '1', '0', '1', '0', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['518', '1', '0', '1', '0', '0', '1', '0', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['519', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['520', '1', '1', '0', '0', '1', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['521', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['522', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['523', '1', '1', '0', '0', '1', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['524', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['525', '1', '1', '0', '1', '0', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['526', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['527', '1', '1', '0', '0', '1', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['528', '1', '1', '0', '0', '1', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['529', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['530', '1', '1', '0', '0', '1', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['531', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['532', '1', '0', '1', '0', '0', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['533', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['534', '1', '0', '1', '0', '0', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['535', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['536', '1', '1', '0', '0', '1', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['537', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['538', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['539', '1', '1', '0', '0', '1', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['540', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['541', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['542', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['543', '1', '1', '0', '1', '0', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['544', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['545', '1', '1', '0', '1', '0', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['546', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['547', '1', '1', '0', '0', '1', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['548', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['549', '1', '1', '0', '0', '1', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['550', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['551', '1', '1', '0', '1', '0', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['552', '1', '0', '1', '0', '0', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['553', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['554', '1', '1', '0', '0', '1', '1', '0', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['555', '1', '1', '0', '0', '1', '1', '0', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['556', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['557', '1', '1', '0', '1', '0', '1', '0', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['558', '1', '1', '0', '1', '0', '1', '0', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['559', '1', '0', '1', '0', '0', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['560', '1', '0', '1', '0', '0', '1', '0', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['561', '1', '0', '1', '0', '0', '1', '0', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['562', '1', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['563', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['564', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['565', '1', '1', '0', '0', '1', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['566', '1', '1', '0', '1', '0', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['567', '1', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['568', '1', '1', '0', '1', '0', '0', '0', '0', '1', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['569', '1', '0', '1', '0', '0', '1', '0', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['570', '1', '0', '1', '0', '0', '0', '0', '1', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['571', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['572', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['573', '1', '1', '0', '1', '0', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['574', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['575', '1', '1', '0', '1', '0', '0', '0', '1', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['576', '1', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['577', '1', '1', '0', '0', '1', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['578', '1', '1', '0', '0', '1', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['579', '1', '1', '0', '0', '1', '0', '0', '1', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['580', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['581', '1', '0', '1', '0', '0', '0', '0', '1', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['582', '1', '0', '1', '0', '0', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['583', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['584', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['585', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['586', '1', '1', '0', '0', '1', '1', '0', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['587', '1', '1', '0', '0', '1', '1', '0', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['588', '1', '1', '0', '1', '0', '1', '0', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['589', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['590', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['591', '1', '1', '0', '1', '0', '1', '0', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['592', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['593', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['594', '1', '1', '0', '0', '1', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['595', '1', '1', '0', '1', '0', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['596', '1', '0', '1', '0', '0', '0', '0', '0', '1', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['597', '1', '1', '0', '1', '0', '0', '0', '0', '1', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['598', '1', '0', '1', '0', '0', '0', '0', '0', '1', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['599', '1', '1', '0', '1', '0', '0', '0', '0', '1', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['600', '1', '1', '0', '0', '1', '0', '0', '1', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   
    ['601', '1', '0', '1', '0', '0', '0', '0', '0', '1', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['602', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['603', '1', '1', '0', '0', '1', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['604', '1', '1', '0', '1', '0', '0', '0', '0', '1', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['605', '1', '1', '0', '1', '0', '0', '0', '1', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['606', '1', '1', '0', '0', '1', '0', '0', '0', '1', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['607', '1', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['608', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['609', '1', '1', '0', '1', '0', '0', '0', '0', '1', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['610', '1', '1', '0', '0', '1', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['611', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['612', '1', '0', '1', '0', '0', '0', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['613', '1', '1', '0', '0', '1', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['614', '1', '1', '0', '0', '1', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['615', '1', '1', '0', '1', '0', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['616', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['617', '1', '1', '0', '0', '1', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['618', '1', '0', '1', '0', '0', '0', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['619', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['620', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['621', '1', '1', '0', '0', '1', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['622', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['623', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['624', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['625', '1', '0', '1', '0', '0', '0', '0', '1', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['626', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['627', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['628', '1', '0', '1', '0', '0', '0', '0', '0', '1', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['629', '1', '1', '0', '1', '0', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['630', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['631', '1', '1', '0', '0', '1', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['632', '1', '1', '0', '0', '1', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['633', '1', '0', '1', '0', '0', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['634', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['635', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['636', '1', '1', '0', '0', '1', '0', '0', '1', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['637', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['638', '1', '0', '1', '0', '0', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['639', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['640', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['641', '1', '1', '0', '0', '1', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['642', '1', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['643', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['644', '1', '1', '0', '1', '0', '0', '0', '1', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['645', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['646', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['647', '1', '1', '0', '1', '0', '0', '0', '1', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['648', '1', '1', '0', '1', '0', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['649', '1', '1', '0', '0', '1', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['650', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['651', '1', '1', '0', '0', '1', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['652', '1', '1', '0', '1', '0', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['653', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['654', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['655', '1', '0', '1', '0', '0', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['656', '1', '1', '0', '0', '1', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['657', '1', '1', '0', '1', '0', '0', '0', '1', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['658', '1', '1', '0', '0', '1', '0', '0', '1', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['659', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['660', '1', '1', '0', '0', '1', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['661', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['662', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['663', '1', '1', '0', '0', '1', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['664', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['665', '1', '1', '0', '0', '1', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['666', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['667', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['668', '1', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['669', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['670', '1', '1', '0', '0', '1', '0', '0', '1', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['671', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['672', '1', '1', '0', '0', '1', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['673', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['674', '1', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['675', '1', '1', '0', '1', '0', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['676', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['677', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['678', '1', '1', '0', '0', '1', '0', '0', '1', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['679', '1', '1', '0', '0', '1', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['680', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['681', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['682', '1', '1', '0', '0', '1', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['683', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['684', '1', '0', '1', '0', '0', '0', '0', '1', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['685', '1', '1', '0', '0', '1', '0', '0', '1', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['686', '1', '1', '0', '0', '1', '0', '0', '1', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['687', '1', '1', '0', '1', '0', '0', '0', '1', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['688', '1', '1', '0', '0', '1', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['689', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['690', '1', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['691', '1', '0', '1', '0', '0', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['692', '1', '0', '1', '0', '0', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['693', '1', '1', '0', '1', '0', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['694', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['695', '1', '1', '0', '0', '1', '0', '0', '0', '1', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['696', '1', '1', '0', '0', '1', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['697', '1', '0', '1', '0', '0', '0', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['698', '1', '1', '0', '1', '0', '0', '0', '0', '1', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['699', '1', '1', '0', '0', '1', '0', '0', '0', '1', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['700', '1', '0', '1', '0', '0', '0', '0', '0', '1', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   
    ['701', '1', '1', '0', '0', '1', '0', '0', '0', '1', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['702', '1', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['703', '1', '1', '0', '0', '1', '0', '0', '1', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['704', '1', '0', '1', '0', '0', '0', '0', '0', '1', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['705', '1', '1', '0', '0', '1', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['706', '1', '1', '0', '0', '1', '0', '0', '0', '1', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['707', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['708', '1', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['709', '1', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['710', '1', '1', '0', '0', '1', '0', '0', '0', '1', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['711', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['712', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['713', '1', '1', '0', '0', '1', '0', '0', '1', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['714', '1', '1', '0', '1', '0', '0', '0', '0', '1', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['715', '1', '1', '0', '1', '0', '0', '0', '0', '1', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['716', '1', '1', '0', '1', '0', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['717', '1', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['718', '1', '1', '0', '1', '0', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['719', '1', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['720', '1', '1', '0', '0', '1', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['721', '1', '1', '0', '0', '1', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['722', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['723', '1', '1', '0', '0', '1', '0', '0', '0', '1', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['724', '1', '1', '0', '0', '1', '0', '0', '0', '1', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['725', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['726', '1', '0', '1', '0', '0', '0', '0', '0', '1', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['727', '1', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['728', '1', '1', '0', '1', '0', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['729', '1', '1', '0', '0', '1', '0', '0', '0', '1', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['730', '1', '1', '0', '0', '1', '0', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['731', '1', '1', '0', '0', '1', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['732', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['733', '1', '0', '1', '0', '0', '0', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['734', '1', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['735', '1', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['736', '1', '0', '1', '0', '0', '0', '0', '0', '1', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['737', '1', '1', '0', '0', '1', '0', '0', '0', '1', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['738', '1', '1', '0', '1', '0', '0', '0', '0', '1', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['739', '1', '1', '0', '1', '0', '0', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['740', '1', '1', '0', '1', '0', '0', '0', '0', '1', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['741', '1', '1', '0', '0', '1', '0', '0', '0', '1', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['742', '1', '0', '1', '0', '0', '0', '0', '0', '1', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['743', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['744', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['745', '1', '0', '1', '0', '0', '1', '0', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['746', '1', '0', '1', '0', '0', '0', '1', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['747', '1', '0', '1', '0', '0', '0', '1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['748', '1', '0', '1', '0', '0', '1', '0', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['749', '1', '0', '1', '0', '0', '0', '0', '0', '1', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['750', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['751', '1', '0', '1', '0', '0', '1', '0', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['752', '1', '1', '0', '0', '1', '1', '0', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['753', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['754', '1', '1', '0', '0', '1', '1', '0', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['755', '1', '1', '0', '0', '1', '1', '0', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['756', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['757', '1', '1', '0', '0', '1', '1', '0', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['758', '1', '1', '0', '1', '0', '1', '0', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['759', '1', '1', '0', '1', '0', '1', '0', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['760', '1', '1', '0', '1', '0', '1', '0', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['761', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['762', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['763', '1', '1', '0', '0', '1', '1', '0', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['764', '1', '0', '1', '0', '0', '1', '0', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['765', '1', '0', '1', '0', '0', '1', '0', '0', '0', '0', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ['766', '1', '0', '1', '0', '0', '1', '0', '0', '0', '1', '0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
   
          ];
   
     weight_1 = [
       ['1', '1', '1', '1'],
       ['2', '1', '1', '1'],
       ['3', '1', '1', '1'],
       ['4', '1', '1', '1'],
       ['5', '1', '1', '1'],
       ['6', '1', '1', '1'],
       ['7', '1', '1', '1'],
       ['8', '1', '1', '1'],
       ['9', '1', '1', '1'],
       ['10', '1', '1', '1'],
       ['11', '1', '1', '1'],
       ['12', '1', '1', '1'],
       ['13', '1', '1', '1'],
       ['14', '1', '1', '1'],
       ['15', '1', '1', '1'],
       ['16', '1', '1', '1'],
       ['17', '1', '1', '1'],
       ['18', '1', '1', '1'],
       ['19', '1', '1', '1'],
       ['20', '1', '1', '1'],
       ['21', '1', '1', '1'],
       ['22', '1', '1', '1'],
       ['23', '1', '1', '1'],
       ['24', '1', '1', '1'],
       ['25', '1', '1', '1'],
       ['26', '1', '1', '1'],
       ['27', '1', '1', '1'],
       ['28', '1', '1', '1'],
       ['29', '1', '1', '1'],
       ['30', '1', '1', '1'],
       ['31', '1', '1', '1'],
       ['32', '1', '1', '1'],
       ['33', '1', '1', '1'],
       ['34', '1', '1', '1'],
       ['35', '1', '1', '1'],
       ['36', '1', '1', '1'],
       ['37', '1', '1', '1'],
       ['38', '1', '1', '1'],
       ['39', '1', '1', '1'],
       ['40', '1', '1', '1'],
       ['41', '1', '1', '1'],
       ['42', '1', '1', '1'],
       ['43', '1', '1', '1'],
       ['44', '1', '1', '1'],
       ['45', '1', '1', '1'],
       ['46', '1', '1', '1'],
       ['47', '1', '1', '1'],
       ['48', '1', '1', '1'],
       ['49', '1', '1', '1'],
       ['50', '1', '1', '1'],
       ['51', '1', '1', '1'],
       ['52', '1', '1', '1'],
       ['53', '1', '1', '1'],
       ['54', '1', '1', '1'],
       ['55', '1', '1', '1'],
       ['56', '1', '1', '1'],
       ['57', '1', '1', '1'],
       ['58', '1', '1', '1'],
       ['59', '1', '1', '1'],
       ['60', '1', '1', '1'],
       ['61', '1', '1', '1'],
       ['62', '1', '1', '1'],
       ['63', '1', '1', '1'],
       ['64', '1', '1', '1'],
       ['65', '1', '1', '1'],
       ['66', '1', '1', '1'],
       ['67', '1', '1', '1'],
       ['68', '1', '1', '1'],
       ['69', '1', '1', '1'],
       ['70', '1', '1', '1'],
       ['71', '1', '1', '1'],
       ['72', '1', '1', '1'],
       ['73', '1', '1', '1'],
       ['74', '1', '1', '1'],
       ['75', '1', '1', '1'],
       ['76', '1', '1', '1'],
       ['77', '1', '1', '1'],
       ['78', '1', '1', '1'],
       ['79', '1', '1', '1'],
       ['80', '1', '1', '1'],
       ['81', '1', '1', '1'],
       ['82', '1', '1', '1'],
       ['83', '1', '1', '1'],
       ['84', '1', '1', '1'],
       ['85', '1', '1', '1'],
       ['86', '1', '1', '1'],
       ['87', '1', '1', '1'],
       ['88', '1', '1', '1'],
       ['89', '1', '1', '1'],
       ['90', '1', '1', '1'],
       ['91', '1', '1', '1'],
       ['92', '1', '1', '1'],
       ['93', '1', '1', '1'],
       ['94', '1', '1', '1'],
       ['95', '1', '1', '1'],
       ['96', '1', '1', '1'],
       ['97', '1', '1', '1'],
       ['98', '1', '1', '1'],
       ['99', '1', '1', '1'],
       ['100', '1', '1', '1'],
      
       ['101', '1', '1', '1'],
       ['102', '1', '1', '1'],
       ['103', '1', '1', '1'],
       ['104', '1', '1', '1'],
       ['105', '1', '1', '1'],
       ['106', '1', '1', '1'],
       ['107', '1', '1', '1'],
       ['108', '1', '1', '1'],
       ['109', '1', '1', '1'],
       ['110', '1', '1', '1'],
       ['111', '1', '1', '1'],
       ['112', '1', '1', '1'],
       ['113', '1', '1', '1'],
       ['114', '1', '1', '1'],
       ['115', '1', '1', '1'],
       ['116', '1', '1', '1'],
       ['117', '1', '1', '1'],
       ['118', '1', '1', '1'],
       ['119', '1', '1', '1'],
       ['120', '1', '1', '1'],
       ['121', '1', '1', '1'],
       ['122', '1', '1', '1'],
       ['123', '1', '1', '1'],
       ['124', '1', '1', '1'],
       ['125', '1', '1', '1'],
       ['126', '1', '1', '1'],
       ['127', '1', '1', '1'],
       ['128', '1', '1', '1'],
       ['129', '1', '1', '1'],
       ['130', '1', '1', '1'],
       ['131', '1', '1', '1'],
       ['132', '1', '1', '1'],
       ['133', '1', '1', '1'],
       ['134', '1', '1', '1'],
       ['135', '1', '1', '1'],
       ['136', '1', '1', '1'],
       ['137', '1', '1', '1'],
       ['138', '1', '1', '1'],
       ['139', '1', '1', '1'],
       ['140', '1', '1', '1'],
       ['141', '1', '1', '1'],
       ['142', '1', '1', '1'],
       ['143', '1', '1', '1'],
       ['144', '1', '1', '1'],
       ['145', '1', '1', '1'],
       ['146', '1', '1', '1'],
       ['147', '1', '1', '1'],
       ['148', '1', '1', '1'],
       ['149', '1', '1', '1'],
       ['150', '1', '1', '1'],
       ['151', '1', '1', '1'],
       ['152', '1', '1', '1'],
       ['153', '1', '1', '1'],
       ['154', '1', '1', '1'],
       ['155', '1', '1', '1'],
       ['156', '1', '1', '1'],
       ['157', '1', '1', '1'],
       ['158', '1', '1', '1'],
       ['159', '1', '1', '1'],
       ['160', '1', '1', '1'],
       ['161', '1', '1', '1'],
       ['162', '1', '1', '1'],
       ['163', '1', '1', '1'],
       ['164', '1', '1', '1'],
       ['165', '1', '1', '1'],
       ['166', '1', '1', '1'],
       ['167', '1', '1', '1'],
       ['168', '1', '1', '1'],
       ['169', '1', '1', '1'],
       ['170', '1', '1', '1'],
       ['171', '1', '1', '1'],
       ['172', '1', '1', '1'],
       ['173', '1', '1', '1'],
       ['174', '1', '1', '1'],
       ['175', '1', '1', '1'],
       ['176', '1', '1', '1'],
       ['177', '1', '1', '1'],
       ['178', '1', '1', '1'],
       ['179', '1', '1', '1'],
       ['180', '1', '1', '1'],
       ['181', '1', '1', '1'],
       ['182', '1', '1', '1'],
       ['183', '1', '1', '1'],
       ['184', '1', '1', '1'],
       ['185', '1', '1', '1'],
       ['186', '1', '1', '1'],
       ['187', '1', '1', '1'],
       ['188', '1', '1', '1'],
       ['189', '1', '1', '1'],
       ['190', '1', '1', '1'],
       ['191', '1', '1', '1'],
       ['192', '1', '1', '1'],
       ['193', '1', '1', '1'],
       ['194', '1', '1', '1'],
       ['195', '1', '1', '1'],
       ['196', '1', '1', '1'],
       ['197', '1', '1', '1'],
       ['198', '1', '1', '1'],
       ['199', '1', '1', '1'],
       ['200', '1', '1', '1'],
   
       ['201', '1', '1', '1'],
       ['202', '1', '1', '1'],
       ['203', '1', '1', '1'],
       ['204', '1', '1', '1'],
       ['205', '1', '1', '1'],
       ['206', '1', '1', '1'],
       ['207', '1', '1', '1'],
       ['208', '1', '1', '1'],
       ['209', '1', '1', '1'],
       ['210', '1', '1', '1'],
       ['211', '1', '1', '1'],
       ['212', '1', '1', '1'],
       ['213', '1', '1', '1'],
       ['214', '1', '1', '1'],
       ['215', '1', '1', '1'],
       ['216', '1', '1', '1'],
       ['217', '1', '1', '1'],
       ['218', '1', '1', '1'],
       ['219', '1', '1', '1'],
       ['220', '1', '1', '1'],
       ['221', '1', '1', '1'],
       ['222', '1', '1', '1'],
       ['223', '1', '1', '1'],
       ['224', '1', '1', '1'],
       ['225', '1', '1', '1'],
       ['226', '1', '1', '1'],
       ['227', '1', '1', '1'],
       ['228', '1', '1', '1'],
       ['229', '1', '1', '1'],
       ['230', '1', '1', '1'],
       ['231', '1', '1', '1'],
       ['232', '1', '1', '1'],
       ['233', '1', '1', '1'],
       ['234', '1', '1', '1'],
       ['235', '1', '1', '1'],
       ['236', '1', '1', '1'],
       ['237', '1', '1', '1'],
       ['238', '1', '1', '1'],
       ['239', '1', '1', '1'],
       ['240', '1', '1', '1'],
       ['241', '1', '1', '1'],
       ['242', '1', '1', '1'],
       ['243', '1', '1', '1'],
       ['244', '1', '1', '1'],
       ['245', '1', '1', '1'],
       ['246', '1', '1', '1'],
       ['247', '1', '1', '1'],
       ['248', '1', '1', '1'],
       ['249', '1', '1', '1'],
       ['250', '1', '1', '1'],
       ['251', '1', '1', '1'],
       ['252', '1', '1', '1'],
       ['253', '1', '1', '1'],
       ['254', '1', '1', '1'],
       ['255', '1', '1', '1'],
       ['256', '1', '1', '1'],
       ['257', '1', '1', '1'],
       ['258', '1', '1', '1'],
       ['259', '1', '1', '1'],
       ['260', '1', '1', '1'],
       ['261', '1', '1', '1'],
       ['262', '1', '1', '1'],
       ['263', '1', '1', '1'],
       ['264', '1', '1', '1'],
       ['265', '1', '1', '1'],
       ['266', '1', '1', '1'],
       ['267', '1', '1', '1'],
       ['268', '1', '1', '1'],
       ['269', '1', '1', '1'],
       ['270', '1', '1', '1'],
       ['271', '1', '1', '1'],
       ['272', '1', '1', '1'],
       ['273', '1', '1', '1'],
       ['274', '1', '1', '1'],
       ['275', '1', '1', '1'],
       ['276', '1', '1', '1'],
       ['277', '1', '1', '1'],
       ['278', '1', '1', '1'],
       ['279', '1', '1', '1'],
       ['280', '1', '1', '1'],
       ['281', '1', '1', '1'],
       ['282', '1', '1', '1'],
       ['283', '1', '1', '1'],
       ['284', '1', '1', '1'],
       ['285', '1', '1', '1'],
       ['286', '1', '1', '1'],
       ['287', '1', '1', '1'],
       ['288', '1', '1', '1'],
       ['289', '1', '1', '1'],
       ['290', '1', '1', '1'],
       ['291', '1', '1', '1'],
       ['292', '1', '1', '1'],
       ['293', '1', '1', '1'],
       ['294', '1', '1', '1'],
       ['295', '1', '1', '1'],
       ['296', '1', '1', '1'],
       ['297', '1', '1', '1'],
       ['298', '1', '1', '1'],
       ['299', '1', '1', '1'],
       ['300', '1', '1', '1'],
       
       ['301', '1', '1', '1'],
       ['302', '1', '1', '1'],
       ['303', '1', '1', '1'],
       ['304', '1', '1', '1'],
       ['305', '1', '1', '1'],
       ['306', '1', '1', '1'],
       ['307', '1', '1', '1'],
       ['308', '1', '1', '1'],
       ['309', '1', '1', '1'],
       ['310', '1', '1', '1'],
       ['311', '1', '1', '1'],
       ['312', '1', '1', '1'],
       ['313', '1', '1', '1'],
       ['314', '1', '1', '1'],
       ['315', '1', '1', '1'],
       ['316', '1', '1', '1'],
       ['317', '1', '1', '1'],
       ['318', '1', '1', '1'],
       ['319', '1', '1', '1'],
       ['320', '1', '1', '1'],
       ['321', '1', '1', '1'],
       ['322', '1', '1', '1'],
       ['323', '1', '1', '1'],
       ['324', '1', '1', '1'],
       ['325', '1', '1', '1'],
       ['326', '1', '1', '1'],
       ['327', '1', '1', '1'],
       ['328', '1', '1', '1'],
       ['329', '1', '1', '1'],
       ['330', '1', '1', '1'],
       ['331', '1', '1', '1'],
       ['332', '1', '1', '1'],
       ['333', '1', '1', '1'],
       ['334', '1', '1', '1'],
       ['335', '1', '1', '1'],
       ['336', '1', '1', '1'],
       ['337', '1', '1', '1'],
       ['338', '1', '1', '1'],
       ['339', '1', '1', '1'],
       ['340', '1', '1', '1'],
       ['341', '1', '1', '1'],
       ['342', '1', '1', '1'],
       ['343', '1', '1', '1'],
       ['344', '1', '1', '1'],
       ['345', '1', '1', '1'],
       ['346', '1', '1', '1'],
       ['347', '1', '1', '1'],
       ['348', '1', '1', '1'],
       ['349', '1', '1', '1'],
       ['350', '1', '1', '1'],
       ['351', '1', '1', '1'],
       ['352', '1', '1', '1'],
       ['353', '1', '1', '1'],
       ['354', '1', '1', '1'],
       ['355', '1', '1', '1'],
       ['356', '1', '1', '1'],
       ['357', '1', '1', '1'],
       ['358', '1', '1', '1'],
       ['359', '1', '1', '1'],
       ['360', '1', '1', '1'],
       ['361', '1', '1', '1'],
       ['362', '1', '1', '1'],
       ['363', '1', '1', '1'],
       ['364', '1', '1', '1'],
       ['365', '1', '1', '1'],
       ['366', '1', '1', '1'],
       ['367', '1', '1', '1'],
       ['368', '1', '1', '1'],
       ['369', '1', '1', '1'],
       ['370', '1', '1', '1'],
       ['371', '1', '1', '1'],
       ['372', '1', '1', '1'],
       ['373', '1', '1', '1'],
       ['374', '1', '1', '1'],
       ['375', '1', '1', '1'],
       ['376', '1', '1', '1'],
       ['377', '1', '1', '1'],
       ['378', '1', '1', '1'],
       ['379', '1', '1', '1'],
       ['380', '1', '1', '1'],
       ['381', '1', '1', '1'],
       ['382', '1', '1', '1'],
       ['383', '1', '1', '1'],
       ['384', '1', '1', '1'],
       ['385', '1', '1', '1'],
       ['386', '1', '1', '1'],
       ['387', '1', '1', '1'],
       ['388', '1', '1', '1'],
       ['389', '1', '1', '1'],
       ['390', '1', '1', '1'],
       ['391', '1', '1', '1'],
       ['392', '1', '1', '1'],
       ['393', '1', '1', '1'],
       ['394', '1', '1', '1'],
       ['395', '1', '1', '1'],
       ['396', '1', '1', '1'],
       ['397', '1', '1', '1'],
       ['398', '1', '1', '1'],
       ['399', '1', '1', '1'],
       ['400', '1', '1', '1'],
       
       ['401', '1', '1', '1'],
       ['402', '1', '1', '1'],
       ['403', '1', '1', '1'],
       ['404', '1', '1', '1'],
       ['405', '1', '1', '1'],
       ['406', '1', '1', '1'],
       ['407', '1', '1', '1'],
       ['408', '1', '1', '1'],
       ['409', '1', '1', '1'],
       ['410', '1', '1', '1'],
       ['411', '1', '1', '1'],
       ['412', '1', '1', '1'],
       ['413', '1', '1', '1'],
       ['414', '1', '1', '1'],
       ['415', '1', '1', '1'],
       ['416', '1', '1', '1'],
       ['417', '1', '1', '1'],
       ['418', '1', '1', '1'],
       ['419', '1', '1', '1'],
       ['420', '1', '1', '1'],
       ['421', '1', '1', '1'],
       ['422', '1', '1', '1'],
       ['423', '1', '1', '1'],
       ['424', '1', '1', '1'],
       ['425', '1', '1', '1'],
       ['426', '1', '1', '1'],
       ['427', '1', '1', '1'],
       ['428', '1', '1', '1'],
       ['429', '1', '1', '1'],
       ['430', '1', '1', '1'],
       ['431', '1', '1', '1'],
       ['432', '1', '1', '1'],
       ['433', '1', '1', '1'],
       ['434', '1', '1', '1'],
       ['435', '1', '1', '1'],
       ['436', '1', '1', '1'],
       ['437', '1', '1', '1'],
       ['438', '1', '1', '1'],
       ['439', '1', '1', '1'],
       ['440', '1', '1', '1'],
       ['441', '1', '1', '1'],
       ['442', '1', '1', '1'],
       ['443', '1', '1', '1'],
       ['444', '1', '1', '1'],
       ['445', '1', '1', '1'],
       ['446', '1', '1', '1'],
       ['447', '1', '1', '1'],
       ['448', '1', '1', '1'],
       ['449', '1', '1', '1'],
       ['450', '1', '1', '1'],
       ['451', '1', '1', '1'],
       ['452', '1', '1', '1'],
       ['453', '1', '1', '1'],
       ['454', '1', '1', '1'],
       ['455', '1', '1', '1'],
       ['456', '1', '1', '1'],
       ['457', '1', '1', '1'],
       ['458', '1', '1', '1'],
       ['459', '1', '1', '1'],
       ['460', '1', '1', '1'],
       ['461', '1', '1', '1'],
       ['462', '1', '1', '1'],
       ['463', '1', '1', '1'],
       ['464', '1', '1', '1'],
       ['465', '1', '1', '1'],
       ['466', '1', '1', '1'],
       ['467', '1', '1', '1'],
       ['468', '1', '1', '1'],
       ['469', '1', '1', '1'],
       ['470', '1', '1', '1'],
       ['471', '1', '1', '1'],
       ['472', '1', '1', '1'],
       ['473', '1', '1', '1'],
       ['474', '1', '1', '1'],
       ['475', '1', '1', '1'],
       ['476', '1', '1', '1'],
       ['477', '1', '1', '1'],
       ['478', '1', '1', '1'],
       ['479', '1', '1', '1'],
       ['480', '1', '1', '1'],
       ['481', '1', '1', '1'],
       ['482', '1', '1', '1'],
       ['483', '1', '1', '1'],
       ['484', '1', '1', '1'],
       ['485', '1', '1', '1'],
       ['486', '1', '1', '1'],
       ['487', '1', '1', '1'],
       ['488', '1', '1', '1'],
       ['489', '1', '1', '1'],
       ['490', '1', '1', '1'],
       ['491', '1', '1', '1'],
       ['492', '1', '1', '1'],
       ['493', '1', '1', '1'],
       ['494', '1', '1', '1'],
       ['495', '1', '1', '1'],
       ['496', '1', '1', '1'],
       ['497', '1', '1', '1'],
       ['498', '1', '1', '1'],
       ['499', '1', '1', '1'],
       ['500', '1', '1', '1'],
      
       ['501', '1', '1', '1'],
       ['502', '1', '1', '1'],
       ['503', '1', '1', '1'],
       ['504', '1', '1', '1'],
       ['505', '1', '1', '1'],
       ['506', '1', '1', '1'],
       ['507', '1', '1', '1'],
       ['508', '1', '1', '1'],
       ['509', '1', '1', '1'],
       ['510', '1', '1', '1'],
       ['511', '1', '1', '1'],
       ['512', '1', '1', '1'],
       ['513', '1', '1', '1'],
       ['514', '1', '1', '1'],
       ['515', '1', '1', '1'],
       ['516', '1', '1', '1'],
       ['517', '1', '1', '1'],
       ['518', '1', '1', '1'],
       ['519', '1', '1', '1'],
       ['520', '1', '1', '1'],
       ['521', '1', '1', '1'],
       ['522', '1', '1', '1'],
       ['523', '1', '1', '1'],
       ['524', '1', '1', '1'],
       ['525', '1', '1', '1'],
       ['526', '1', '1', '1'],
       ['527', '1', '1', '1'],
       ['528', '1', '1', '1'],
       ['529', '1', '1', '1'],
       ['530', '1', '1', '1'],
       ['531', '1', '1', '1'],
       ['532', '1', '1', '1'],
       ['533', '1', '1', '1'],
       ['534', '1', '1', '1'],
       ['535', '1', '1', '1'],
       ['536', '1', '1', '1'],
       ['537', '1', '1', '1'],
       ['538', '1', '1', '1'],
       ['539', '1', '1', '1'],
       ['540', '1', '1', '1'],
       ['541', '1', '1', '1'],
       ['542', '1', '1', '1'],
       ['543', '1', '1', '1'],
       ['544', '1', '1', '1'],
       ['545', '1', '1', '1'],
       ['546', '1', '1', '1'],
       ['547', '1', '1', '1'],
       ['548', '1', '1', '1'],
       ['549', '1', '1', '1'],
       ['550', '1', '1', '1'],
       ['551', '1', '1', '1'],
       ['552', '1', '1', '1'],
       ['553', '1', '1', '1'],
       ['554', '1', '1', '1'],
       ['555', '1', '1', '1'],
       ['556', '1', '1', '1'],
       ['557', '1', '1', '1'],
       ['558', '1', '1', '1'],
       ['559', '1', '1', '1'],
       ['560', '1', '1', '1'],
       ['561', '1', '1', '1'],
       ['562', '1', '1', '1'],
       ['563', '1', '1', '1'],
       ['564', '1', '1', '1'],
       ['565', '1', '1', '1'],
       ['566', '1', '1', '1'],
       ['567', '1', '1', '1'],
       ['568', '1', '1', '1'],
       ['569', '1', '1', '1'],
       ['570', '1', '1', '1'],
       ['571', '1', '1', '1'],
       ['572', '1', '1', '1'],
       ['573', '1', '1', '1'],
       ['574', '1', '1', '1'],
       ['575', '1', '1', '1'],
       ['576', '1', '1', '1'],
       ['577', '1', '1', '1'],
       ['578', '1', '1', '1'],
       ['579', '1', '1', '1'],
       ['580', '1', '1', '1'],
       ['581', '1', '1', '1'],
       ['582', '1', '1', '1'],
       ['583', '1', '1', '1'],
       ['584', '1', '1', '1'],
       ['585', '1', '1', '1'],
       ['586', '1', '1', '1'],
       ['587', '1', '1', '1'],
       ['588', '1', '1', '1'],
       ['589', '1', '1', '1'],
       ['590', '1', '1', '1'],
       ['591', '1', '1', '1'],
       ['592', '1', '1', '1'],
       ['593', '1', '1', '1'],
       ['594', '1', '1', '1'],
       ['595', '1', '1', '1'],
       ['596', '1', '1', '1'],
       ['597', '1', '1', '1'],
       ['598', '1', '1', '1'],
       ['599', '1', '1', '1'],
       ['600', '1', '1', '1'],
    
       ['601', '1', '1', '1'],
       ['602', '1', '1', '1'],
       ['603', '1', '1', '1'],
       ['604', '1', '1', '1'],
       ['605', '1', '1', '1'],
       ['606', '1', '1', '1'],
       ['607', '1', '1', '1'],
       ['608', '1', '1', '1'],
       ['609', '1', '1', '1'],
       ['610', '1', '1', '1'],
       ['611', '1', '1', '1'],
       ['612', '1', '1', '1'],
       ['613', '1', '1', '1'],
       ['614', '1', '1', '1'],
       ['615', '1', '1', '1'],
       ['616', '1', '1', '1'],
       ['617', '1', '1', '1'],
       ['618', '1', '1', '1'],
       ['619', '1', '1', '1'],
       ['620', '1', '1', '1'],
       ['621', '1', '1', '1'],
       ['622', '1', '1', '1'],
       ['623', '1', '1', '1'],
       ['624', '1', '1', '1'],
       ['625', '1', '1', '1'],
       ['626', '1', '1', '1'],
       ['627', '1', '1', '1'],
       ['628', '1', '1', '1'],
       ['629', '1', '1', '1'],
       ['630', '1', '1', '1'],
       ['631', '1', '1', '1'],
       ['632', '1', '1', '1'],
       ['633', '1', '1', '1'],
       ['634', '1', '1', '1'],
       ['635', '1', '1', '1'],
       ['636', '1', '1', '1'],
       ['637', '1', '1', '1'],
       ['638', '1', '1', '1'],
       ['639', '1', '1', '1'],
       ['640', '1', '1', '1'],
       ['641', '1', '1', '1'],
       ['642', '1', '1', '1'],
       ['643', '1', '1', '1'],
       ['644', '1', '1', '1'],
       ['645', '1', '1', '1'],
       ['646', '1', '1', '1'],
       ['647', '1', '1', '1'],
       ['648', '1', '1', '1'],
       ['649', '1', '1', '1'],
       ['650', '1', '1', '1'],
       ['651', '1', '1', '1'],
       ['652', '1', '1', '1'],
       ['653', '1', '1', '1'],
       ['654', '1', '1', '1'],
       ['655', '1', '1', '1'],
       ['656', '1', '1', '1'],
       ['657', '1', '1', '1'],
       ['658', '1', '1', '1'],
       ['659', '1', '1', '1'],
       ['660', '1', '1', '1'],
       ['661', '1', '1', '1'],
       ['662', '1', '1', '1'],
       ['663', '1', '1', '1'],
       ['664', '1', '1', '1'],
       ['665', '1', '1', '1'],
       ['666', '1', '1', '1'],
       ['667', '1', '1', '1'],
       ['668', '1', '1', '1'],
       ['669', '1', '1', '1'],
       ['670', '1', '1', '1'],
       ['671', '1', '1', '1'],
       ['672', '1', '1', '1'],
       ['673', '1', '1', '1'],
       ['674', '1', '1', '1'],
       ['675', '1', '1', '1'],
       ['676', '1', '1', '1'],
       ['677', '1', '1', '1'],
       ['678', '1', '1', '1'],
       ['679', '1', '1', '1'],
       ['680', '1', '1', '1'],
       ['681', '1', '1', '1'],
       ['682', '1', '1', '1'],
       ['683', '1', '1', '1'],
       ['684', '1', '1', '1'],
       ['685', '1', '1', '1'],
       ['686', '1', '1', '1'],
       ['687', '1', '1', '1'],
       ['688', '1', '1', '1'],
       ['689', '1', '1', '1'],
       ['690', '1', '1', '1'],
       ['691', '1', '1', '1'],
       ['692', '1', '1', '1'],
       ['693', '1', '1', '1'],
       ['694', '1', '1', '1'],
       ['695', '1', '1', '1'],
       ['696', '1', '1', '1'],
       ['697', '1', '1', '1'],
       ['698', '1', '1', '1'],
       ['699', '1', '1', '1'],
       ['700', '1', '1', '1'],
       
       ['701', '1', '1', '1'],
       ['702', '1', '1', '1'],
       ['703', '1', '1', '1'],
       ['704', '1', '1', '1'],
       ['705', '1', '1', '1'],
       ['706', '1', '1', '1'],
       ['707', '1', '1', '1'],
       ['708', '1', '1', '1'],
       ['709', '1', '1', '1'],
       ['710', '1', '1', '1'],
       ['711', '1', '1', '1'],
       ['712', '1', '1', '1'],
       ['713', '1', '1', '1'],
       ['714', '1', '1', '1'],
       ['715', '1', '1', '1'],
       ['716', '1', '1', '1'],
       ['717', '1', '1', '1'],
       ['718', '1', '1', '1'],
       ['719', '1', '1', '1'],
       ['720', '1', '1', '1'],
       ['721', '1', '1', '1'],
       ['722', '1', '1', '1'],
       ['723', '1', '1', '1'],
       ['724', '1', '1', '1'],
       ['725', '1', '1', '1'],
       ['726', '1', '1', '1'],
       ['727', '1', '1', '1'],
       ['728', '1', '1', '1'],
       ['729', '1', '1', '1'],
       ['730', '1', '1', '1'],
       ['731', '1', '1', '1'],
       ['732', '1', '1', '1'],
       ['733', '1', '1', '1'],
       ['734', '1', '1', '1'],
       ['735', '1', '1', '1'],
       ['736', '1', '1', '1'],
       ['737', '1', '1', '1'],
       ['738', '1', '1', '1'],
       ['739', '1', '1', '1'],
       ['740', '1', '1', '1'],
       ['741', '1', '1', '1'],
       ['742', '1', '1', '1'],
       ['743', '1', '1', '1'],
       ['744', '1', '1', '1'],
       ['745', '1', '1', '1'],
       ['746', '1', '1', '1'],
       ['747', '1', '1', '1'],
       ['748', '1', '1', '1'],
       ['749', '1', '1', '1'],
       ['750', '1', '1', '1'],
       ['751', '1', '1', '1'],
       ['752', '1', '1', '1'],
       ['753', '1', '1', '1'],
       ['754', '1', '1', '1'],
       ['755', '1', '1', '1'],
       ['756', '1', '1', '1'],
       ['757', '1', '1', '1'],
       ['758', '1', '1', '1'],
       ['759', '1', '1', '1'],
       ['760', '1', '1', '1'],
       ['761', '1', '1', '1'],
       ['762', '1', '1', '1'],
       ['763', '1', '1', '1'],
       ['764', '1', '1', '1'],
       ['765', '1', '1', '1'],
       ['766', '1', '1', '1'],
     ];
  alts_1 :any = [
    [false, false,  0,  0,  0, "Category 1",  "1",  true,true,false,1,1,true,"Item 01","IDX_1",0,"Item 01"],
    [ false,  false,  0,  0,  0, "Category 1", "1", true,true,false,2,2,true,"Item 02","IDX_2",0,"Item 02"],
    [ false,  false,  0,  0,  0, "Category 1", "1", true,true,false,3,3,true,"Item 03","IDX_3",0,"Item 03"],
    [ false,  false,  0,  0,  0, "Category 1", "1", true,true,false,4,4,true,"Item 04","IDX_4",0,"Item 04"],
    [ false,  false,  0,  0,  0, "Category 1", "1", true,true,false,5,5,true,"Item 05","IDX_5",0,"Item 05"],
    [ false,  false,  0,  0,  0, "Category 1", "1", true,true,false,6,6,true,"Item 06","IDX_6",0,"Item 06"],
    [ false,  false,  0,  0,  0, "Category 1", "1", true,true,false,7,7,true,"Item 07","IDX_7",0,"Item 07"],
    [ false,  false,  0,  0,  0, "Category 1", "1", true,true,false,8,8,true,"Item 08","IDX_8",0,"Item 08"],
    [ false,  false,  0,  0,  0, "Category 1", "1", true,true,false,9,9,true,"Item 09","IDX_9",0,"Item 09"],
    [ false,  false,  0,  0,  0, "Category 1", "1", true,true,false,10,10,true,"Item 10","IDX_10",0,"Item 10"],
    [ false,  false,  0,  0,  0, "Category 1", "1", true,true,false,11,11,true,"Item 11","IDX_11",0,"Item 11"],
    [ false,  false,  0,  0,  0, "Category 1", "1", true,true,false,12,12,true,"Item 12","IDX_12",0,"Item 12"],
    [ false,  false,  0,  0,  0, "Category 1", "1", true,true,false,13,13,true,"Item 13","IDX_13",0,"Item 13"],
    [ false,  false,  0,  0,  0, "Category 1", "1", true,true,false,14,14,true,"Item 14","IDX_14",0,"Item 14"],
    [ false,  false,  0,  0,  0, "Category 1", "1", true,true,false,15,15,true,"Item 15","IDX_15",0,"Item 15"],
    [ false,  false,  0,  0,  0, "Category 1", "1", true,true,false,16,16,true,"Item 16","IDX_16",0,"Item 16"],
    [ false,  false,  0,  0,  0, "Category 1", "1", true,true,false,17,17,true,"Item 17","IDX_17",0,"Item 17"],
    [ false,  false,  0,  0,  0, "Category 1", "1", true,true,false,18,18,true,"Item 18","IDX_18",0,"Item 18"],
    [ false,  false,  0,  0,  0, "Category 1", "1", true,true,false,19,19,true,"Item 19","IDX_19",0,"Item 19"],
    [ false,  false,  0,  0,  0, "Category 1", "1", true,true,false,20,20,true,"Item 20","IDX_20",0,"Item 20"],
    [ false,  false,  0,  0,  0, "Category 1", "1", true,true,false,21,21,true,"Item 21","IDX_21",0,"Item 21"],
    // [ false,  false,  0,  0,  0, "Category 1", "1", true,true,false,22,22,true,"Item 22","IDX_22",0,"Item 22"],
    // [ false,  false,  0,  0,  0, "Category 1", "1", true,true,false,23,23,true,"Item 23","IDX_23",0,"Item 23"],
    // [ false,  false,  0,  0,  0, "Category 1", "1", true,true,false,24,24,true,"Item 24","IDX_24",0,"Item 24"],
    // [ false,  false,  0,  0,  0, "Category 1", "1", true,true,false,25,25,true,"Item 25","IDX_25",0,"Item 25"],
    // [ false,  false,  0,  0,  0, "Category 1", "1", true,true,false,26,26,true,"Item 26","IDX_26",0,"Item 26"]
  ]

  alts_arr = [
    
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
    {ID: 21, Include:1, ShortDescription: 'Item 21',LongDescription: 'Item 21', CategoryIndex: 1, Category: 'Category 1', Consideration:1}
  
];

  setThreshold(e:any){
    InteractiveComponent.thresholdValue = (e.target as HTMLInputElement).value;
  }

  findDetails(data:any) {
    if(this.showSelected){
      return this.interactive.filter(x => x.Menu.categoryIndex === data.categoryIndex && x.Menu.include == 1);
     // return this.interactive1.filter(x => x.categoryIndex === data.categoryIndex && x.include == 1);
    }else{
      this.showSelected = false;
      //let res = this.interactive.filter(x => x.Menu.categoryIndex === data.categoryIndex);
      return this.interactive.filter(x => x.Menu.categoryIndex === data.categoryIndex);//res.sort(function(a: any, b: any){return b.reach - a.reach});
      //return this.interactive1.filter(x => x.categoryIndex === data.categoryIndex);
    }
  }

  async generateExcel() : Promise<void> {
    this.exportActive = true;
    const fileName = this.CellName;
    //var result = await this.services.getCellByPid(this.projectid).toPromise();
    let wb = XLSX.utils.book_new();
    let p : any[]=[];
    //this.interactive.forEach(async (x:any) => {
      this.interactive.map(function(obj:any) {
         var pp = {
              Item : obj.Menu.description,
              reach : obj.reach,
              incrementalreach : obj.incrementalreach,
              rank:obj.rank
            }
            p.push(pp);
        });
        let ws = XLSX.utils.json_to_sheet(p);
        XLSX.utils.book_append_sheet(wb, ws);
    //});
    setTimeout(async () => {
      XLSX.writeFile(wb, fileName + '_export_' + new Date().getTime()+ '.xlsx');
    },500);
    
   }
   async onInteractive() : Promise<void>{
    this.router.navigate(['admin/project/cell/interactive/' + this.id])
  }

   async onOptimized(): Promise<void>{
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '380px';
    dialogConfig.height = '280px';
  
    dialogConfig.data = {
    };
    const dialogRef = this.dialog.open(NoofitemComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      data => {
      try {
            localStorage.removeItem("chartData");
            var numberchosen = Number(data.numberchosen);
              this.getAltsRecordforOptimized();
              this.dataArrayMatrix();
              this.segArrayMatrix();
              this.weightArrayMatrix();
              var res = [];
              if(InteractiveComponent.thresholdValue){
                let c = new Calc(this.alts, this.data_matrix, this.vol_matrix,this.weight, this.seg, 1, 500, InteractiveComponent.thresholdValue);
                res = c.CalculateParallel(this.alts_list.length, true);
              }else{
                let c = new Calc(this.alts, this.data_matrix, this.vol_matrix,this.weight, this.seg, 1, 500, 130);
                res = c.CalculateParallel(numberchosen, true);
              }
              this.alts = [];
              localStorage.setItem("chartData", JSON.stringify(res));
              this.router.navigate(['admin/project/cell/chart/' + this.id])
            } catch (e) {
          }
        }
    );
  }

  interactiveitemreport(p:Menu){
    let arrArr: any = [];
    let num = 0; //this.obj.length -1;
    for(var i = 0; i < this.objItem.length; i ++){
      this.interactive.forEach(x=>{
        if(x.Menu.include == true){ 
          if(x.value == this.objItem[i]['item']){
            if(x.value == this.objValue.value){
              x.reach = this.objItem[i]['reach'], //(this.interactive_result[d][0][0]* 100).toFixed(1).toString()+'%',
              x.incrementalreach = this.objItem[i]['reach'],//-this.objItem[i-1]['reach'], //(this.interactive_result[d][0][0]* 100).toFixed(1).toString()+'%',
              x.rank= 1;
              x.index = 0;
              //x.rank= this.countStr; 
            }else{
              x.reach = this.objItem[i]['reach'], //(this.interactive_result[d][0][0]* 100).toFixed(1).toString()+'%',
              x.incrementalreach = parseFloat(((this.objItem[i]['itemreach']-this.objItem[i+1]['itemreach']) * 100).toFixed(1)), //(this.interactive_result[d][0][0]* 100).toFixed(1).toString()+'%',
              x.rank= 1;
              x.index = 0;
              //x.rank= this.countStr; 
              const obj1: any = {
                inreach: parseFloat(((this.objItem[i]['itemreach'] - this.objItem[i+1]['itemreach']) * 100).toFixed(1)),
                rank: 0,
                item: x.value
              }
              arrArr.push(obj1);
            }
           }
        }
      })  
    }
    arrArr.sort(function(a: any, b: any){return b.inreach - a.inreach});
    for (var i = 0; i < arrArr.length; i++) {
    arrArr[i].rank = i + 1;
     //this.obj[i].rank = i + 1;
    }
    arrArr.map((xy: any) => {
      this.interactive.forEach(x=>{
        if(x.Menu.include == true){  
          if(x.value == xy.item){
            x.rank= xy.rank+1;
          }
        }
      })  
    });
    //this.obj = []; 
    this.Reach = (this.interactive_result[0][0][0]* 100).toFixed(1).toString()+'%'
  }
}

export interface InteractiveMenu{
  Menu : Menu;
  reach : number;
  incrementalreach : number;
  rank:number;
  index: number;
  value: number;
}

export interface InteractiveMenu1{
  id: number;
  menuId:number;
  item:string;
  consideration: any;
  include:any;
  category:string;
  categoryIndex : number;
  shortDescription : string;
  longDescription : string;
  isExpanded :boolean;
  forcedIn : boolean;
  reach : string;
  incrementalreach : number;
  rank:number;
  index: number;
  
}


