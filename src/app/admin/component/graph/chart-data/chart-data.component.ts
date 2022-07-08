import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { CalculationDataService } from 'src/app/services/calculation-data.service';
import { PsolutionsService } from 'src/app/services/psolutions.service';
import * as XLSX from 'xlsx';
import { exportexcel } from '../chart/exportexcel';
import { topCounter } from '../count/count.component';
import * as Excel from 'exceljs';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

@Component({
  selector: 'app-chart-data',
  templateUrl: './chart-data.component.html',
  styles: [`
  .btnrptcontainer{
    display:grid;
  }
  .btnrptcontainer > button{
    width : auto;
    margin : 3px;
    text-align: center;
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
  `
  ]
})
export class ChartDataComponent implements OnInit {

  id:any;
  displayedColumns: string[] = ['Sr.No','Items','Reach','IncrementalReach','FinalReach'];
  dataSource = new MatTableDataSource([]);
  selectedRow: any;
  editmode = false;
  listLink : string;
  OneItem :string;
  TwoItem : string;
  ThreeItem : string;
  FourItem : string;
  FiveItem : string;
  SixItem : string;
  SevenItem : string;
  EightItem : string;
  NineItem : string;
  TenItem : string;
  modeltitleurl : string;
  charturl : string;
  counturl : string;
  result : any[];
  chartdatalist : chartData[] = [];
  d:any[]=[];
  arrlength : number;
  barChartLabels1:any[]=[];
  data: string[] = [];
  exportlist : exportexcel;
  chartimg : any;

  constructor(private services: PsolutionsService,
    private route: ActivatedRoute) {
    this.route.params.subscribe(res => {
      this.id = res.id; 
    }); 
  }

  async ngOnInit(): Promise<void> {
    this.exportlist = new exportexcel();
    this.result = JSON.parse(localStorage.getItem("chartData"));
    this.chartimg = localStorage.getItem("chart");

    console.log(70,this.chartimg);
    
    var project = await this.services.getCellByid(this.id).toPromise();
    this.listLink = "/admin/project/cell/" + project.projectId;
    this.modeltitleurl = "/admin/project/cell/optimized/" + this.id;
    this.OneItem = "/admin/project/cell/oneitem/"+this.id;
    this.TwoItem = "/admin/project/cell/twoitems/"+this.id;
    this.ThreeItem = "/admin/project/cell/threeitems/"+this.id;
    this.FourItem = "/admin/project/cell/fouritems/"+this.id;
    this.FiveItem = "/admin/project/cell/fiveitems/"+this.id;
    this.SixItem = "/admin/project/cell/sixitems/"+this.id;
    this.SevenItem = "/admin/project/cell/sevenitems/"+this.id;
    this.EightItem = "/admin/project/cell/eightitems/"+this.id;
    this.NineItem = "/admin/project/cell/nineitems/"+this.id;
    this.TenItem = "/admin/project/cell/tenitems/"+this.id;
    this.charturl = "/admin/project/cell/chart/"+this.id;
    this.counturl = "/admin/project/cell/count/" + this.id;
    this.loadchartData();
    for(let i = 0;i < this.arrlength;i++){
      const cdata : chartData ={
        items : this.barChartLabels1[i],
        reach : this.d[i],
        incrementalreach : this.data[i],
        finalreach : this.pdata[i]
      }
      this.chartdatalist.push(cdata);
    }
  
    this.dataSource = new MatTableDataSource(this.chartdatalist);
   
  }
  selectNode(node: any){
    let range  =  document.createRange();
    range.selectNodeContents(node)
    let select =  window.getSelection()
    select.removeAllRanges()
    select.addRange(range)
  }

  copy(){
    this.selectNode(document.querySelector('table'));
    document.execCommand('copy');    
  }

  loadchartData() {
    this.arrlength = this.result.length;
    let data1 = "";
    let data2 = "";
    let data3 = "";
    let data4 = "";
    let data5 = "";
    let data6 = "";
    let data7 = "";
    let data8 = "";
    let arr: any[] = [];

      if (data1 === '' && this.arrlength >= 1) {
        this.d.push(0);
        data1 = (this.result[0][1][0]*100).toFixed(2).toString();
        this.barChartLabels1.push(this.result[0][2][0][0]);
        arr.push(this.result[0][2][0][0]);
        let da1 = (this.result[0][1][0]*100).toFixed(2).toString();
        this.pdata.push(da1);
        this.data.push(data1);
      }

      if (data2 === '' && this.arrlength >= 2) {
        data2 = ((this.result[1][1][0]-this.result[0][1][0])*100).toFixed(2).toString();
        for (let i = 0; i < this.result[1][2].length; i++) {
        if(this.result[0][2][0].every((v:any) => this.result[1][2][i].includes(v))){
          this.d.push((this.result[0][1][0]*100).toFixed(2).toString());
          this.barChartLabels1.push(this.result[1][2][i].filter((val:any) => !arr[0].includes(val)));
          let da2 = (this.result[1][1][i]*100).toFixed(2).toString();
          this.pdata.push(da2);
          arr.push(this.result[1][2][i]);
          this.data.push(data2);
          break;
        }}
      }

      if (data3 === '' && this.arrlength >= 3) {
        data3 = ((this.result[2][1][0]-this.result[1][1][0])*100).toFixed(2).toString();
        for (let i = 0; i < this.result[2][2].length; i++) {
        if(arr[1].every((v:any) => this.result[2][2][i].includes(v))){
          this.barChartLabels1.push(this.result[2][2][i].filter((val:any) => !arr[1].includes(val)));
          let da3 = (this.result[2][1][i]*100).toFixed(2).toString();
          this.pdata.push(da3);
          arr.push(this.result[2][2][i]);
          this.d.push((this.result[1][1][i]*100).toFixed(2).toString());
          this.data.push(data3);
          break;
        }}
      }

      if (data4 === '' && this.arrlength >= 4) {
        data4 = ((this.result[3][1][0]-this.result[2][1][0])*100).toFixed(2).toString();
        for (let i = 0; i < this.result[3][2].length; i++) {
        if(arr[2].every((v:any) => this.result[3][2][i].includes(v))){
          this.barChartLabels1.push(this.result[3][2][i].filter((val:any) => !arr[2].includes(val)));
          let da3 = (this.result[3][1][i]*100).toFixed(2).toString();
          this.pdata.push(da3);
          arr.push(this.result[3][2][i]);
          this.d.push((this.result[2][1][i]*100).toFixed(2).toString());
          this.data.push(data4);
          break;
        }}
      }
      if (data5 === '' && this.arrlength >= 5) {
        data5 = ((this.result[4][1][0]-this.result[3][1][0])*100).toFixed(2).toString();
        for (let i = 0; i < this.result[4][2].length; i++) {
          if(arr[3].every((v:any) => this.result[4][2][i].includes(v))){
            this.barChartLabels1.push(this.result[4][2][i].filter((val:any) => !arr[3].includes(val)));
            let da3 = (this.result[4][1][i]*100).toFixed(2).toString();
            this.pdata.push(da3);
            arr.push(this.result[4][2][i]);
            this.d.push((this.result[3][1][i]*100).toFixed(2).toString());
            this.data.push(data5);
            break;
          }}
      }
      if (data6 === '' && this.arrlength >= 6) {
        data6 = ((this.result[5][1][0] - this.result[4][1][0])*100).toFixed(2).toString()
        for (let i = 0; i < this.result[5][2].length; i++) {
          if (arr[4].every((v: any) => this.result[5][2][i].includes(v))) {
            this.barChartLabels1.push(this.result[5][2][i].filter((val: any) => !arr[4].includes(val)));
            let da3 = (this.result[5][1][i] * 100).toFixed(2).toString();
            this.pdata.push(da3);
            arr.push(this.result[5][2][i]);
            this.d.push((this.result[4][1][i]*100).toFixed(2).toString());
            this.data.push(data6);
            break;
          }
        }
      }
      if (data7 === '' && this.arrlength >= 7) {
        data7 = ((this.result[6][1][0] - this.result[5][1][0])*100).toFixed(2).toString()
        for (let i = 0; i < this.result[6][2].length; i++) {
          if (arr[5].every((v: any) => this.result[6][2][i].includes(v))) {
            this.barChartLabels1.push(this.result[6][2][i].filter((val: any) => !arr[5].includes(val)));
            let da3 = (this.result[6][1][i] * 100).toFixed(2).toString();
            this.pdata.push(da3);
            arr.push(this.result[6][2][i]);
            this.d.push((this.result[5][1][i]*100).toFixed(2).toString());
            this.data.push(data7);
            break;
          }
        }
      }
      if (data8 === '' && this.arrlength >= 8) {
        data8 = ((this.result[7][1][0] - this.result[6][1][0])*100).toFixed(2).toString()
        for (let i = 0; i < this.result[7][2].length; i++) {
          if (arr[6].every((v: any) => this.result[7][2][i].includes(v))) {
            this.barChartLabels1.push(this.result[7][2][i].filter((val: any) => !arr[6].includes(val)));
            let da3 = (this.result[7][1][i] * 100).toFixed(2).toString();
            this.pdata.push(da3);
            arr.push(this.result[7][2][i]);
            this.d.push((this.result[6][1][i]*100).toFixed(2).toString());
            this.data.push(data8);
            break;
          }
        }
      }
  }
  pdata: string[]=[];

  highlight(): void {
    this.editmode = !!this.selectedRow;
  }

  async savereport(): Promise<void> {
    
    this.reportforcount();
    this.generateExcel();
    // const fileName = "Cell_1";
    // let wb = XLSX.utils.book_new();

    // var itemlist: any[] = [];
    // itemlist=this.exportlist.itemreport();
    // for (let d = 0; d < this.arrlength; d++) {
    //   let ws = XLSX.utils.json_to_sheet(itemlist[d]);
    //   XLSX.utils.book_append_sheet(wb, ws, (d + 1) + 'Item');
    // }
    // let ws = XLSX.utils.json_to_sheet(this.countData);
    // XLSX.utils.book_append_sheet(wb, ws, 'Count');
    // let ws1 = XLSX.utils.json_to_sheet(this.chartdatalist);
    // XLSX.utils.book_append_sheet(wb, ws1, 'ChartData');
    // XLSX.writeFile(wb, fileName + '_export_' + new Date().getTime() + '.xlsx');
  }
  async reportforcount(): Promise<void> {
    for (let p = 0; p < this.result[0][2].length; p++) {
      var l = this.result[0][2][p][0];
      this.topcounter = [];
      for (let r = 1; r < this.arrlength; r++) {
        let count100: number = 0;
        let count200: number = 0;
        let count300: number = 0;
        let count400: number = 0;
        let count500: number = 0;
        let c: number = 0;
        for (let i = 0; i < this.result[r][2].length; i++) {
          if (i >= 0 && i <= 99) {
            count100 = c;
          } else if (i >= 100 && i <= 199) {
            count200 = c;
          } else if (i >= 200 && i <= 299) {
            count300 = c;
          } else if (i >= 300 && i <= 399) {
            count400 = c;
            if (r === 1) {
              count500 = c;
            }
          } else if (i >= 400 && i <= 499) {
            count500 = c;
          }
          if (this.result[r][2][i].includes(l)) {
            c += 1;
          }
        }
        const cou: topCounter = {
          itemindex: r,
          countfromtop100: count100,
          countfromtop200: count200,
          countfromtop300: count300,
          countfromtop400: count400,
          countfromtop500: count500
        }
        this.topcounter.push(cou);
      }
      if (this.arrlength === 2) {
        const coun: any = {
          items: l,
          Item2_Count_from_Top100 : this.topcounter[0].countfromtop100,
          Item2_Count_from_Top200 : this.topcounter[0].countfromtop200,
          Item2_Count_from_Top300 : this.topcounter[0].countfromtop300,
          Item2_Count_from_Top400 : this.topcounter[0].countfromtop400,
          Item2_Count_from_Top500 : this.topcounter[0].countfromtop500
        }
        this.countData.push(coun);
      }
      if (this.arrlength === 3) {
        const coun : any = {
          items: l,
          Item2_Count_from_Top100 : this.topcounter[0].countfromtop100,
          Item2_Count_from_Top200 : this.topcounter[0].countfromtop200,
          Item2_Count_from_Top300 : this.topcounter[0].countfromtop300,
          Item2_Count_from_Top400 : this.topcounter[0].countfromtop400,
          Item2_Count_from_Top500 : this.topcounter[0].countfromtop500,
          Item3_Count_from_Top100 : this.topcounter[1].countfromtop100,
          Item3_Count_from_Top200 : this.topcounter[1].countfromtop200,
          Item3_Count_from_Top300 : this.topcounter[1].countfromtop300,
          Item3_Count_from_Top400 : this.topcounter[1].countfromtop400,
          Item3_Count_from_Top500 : this.topcounter[1].countfromtop500
        }
        this.countData.push(coun);
      }
      if (this.arrlength === 4) {
        const coun: any = {
          items: l,
          Item2_Count_from_Top100 : this.topcounter[0].countfromtop100,
          Item2_Count_from_Top200 : this.topcounter[0].countfromtop200,
          Item2_Count_from_Top300 : this.topcounter[0].countfromtop300,
          Item2_Count_from_Top400 : this.topcounter[0].countfromtop400,
          Item2_Count_from_Top500 : this.topcounter[0].countfromtop500,
          Item3_Count_from_Top100 : this.topcounter[1].countfromtop100,
          Item3_Count_from_Top200 : this.topcounter[1].countfromtop200,
          Item3_Count_from_Top300 : this.topcounter[1].countfromtop300,
          Item3_Count_from_Top400 : this.topcounter[1].countfromtop400,
          Item3_Count_from_Top500 : this.topcounter[1].countfromtop500,
          Item4_Count_from_Top100 : this.topcounter[2].countfromtop100,
          Item4_Count_from_Top200 : this.topcounter[2].countfromtop200,
          Item4_Count_from_Top300 : this.topcounter[2].countfromtop300,
          Item4_Count_from_Top400 : this.topcounter[2].countfromtop400,
          Item4_Count_from_Top500 : this.topcounter[2].countfromtop500
        }
        this.countData.push(coun);
      }
      if (this.arrlength === 5) {
        const coun: any = {
          items: l,
          Item2_Count_from_Top100 : this.topcounter[0].countfromtop100,
          Item2_Count_from_Top200 : this.topcounter[0].countfromtop200,
          Item2_Count_from_Top300 : this.topcounter[0].countfromtop300,
          Item2_Count_from_Top400 : this.topcounter[0].countfromtop400,
          Item2_Count_from_Top500 : this.topcounter[0].countfromtop500,
          Item3_Count_from_Top100 : this.topcounter[1].countfromtop100,
          Item3_Count_from_Top200 : this.topcounter[1].countfromtop200,
          Item3_Count_from_Top300 : this.topcounter[1].countfromtop300,
          Item3_Count_from_Top400 : this.topcounter[1].countfromtop400,
          Item3_Count_from_Top500 : this.topcounter[1].countfromtop500,
          Item4_Count_from_Top100 : this.topcounter[2].countfromtop100,
          Item4_Count_from_Top200 : this.topcounter[2].countfromtop200,
          Item4_Count_from_Top300 : this.topcounter[2].countfromtop300,
          Item4_Count_from_Top400 : this.topcounter[2].countfromtop400,
          Item4_Count_from_Top500 : this.topcounter[2].countfromtop500,
          Item5_Count_from_Top100 : this.topcounter[3].countfromtop100,
          Item5_Count_from_Top200 : this.topcounter[3].countfromtop200,
          Item5_Count_from_Top300 : this.topcounter[3].countfromtop300,
          Item5_Count_from_Top400 : this.topcounter[3].countfromtop400,
          Item5_Count_from_Top500 : this.topcounter[3].countfromtop500
        }
        this.countData.push(coun);
      }
      if (this.arrlength === 6) {
        const coun: any = {
          items: l,
          Item2_Count_from_Top100 : this.topcounter[0].countfromtop100,
          Item2_Count_from_Top200 : this.topcounter[0].countfromtop200,
          Item2_Count_from_Top300 : this.topcounter[0].countfromtop300,
          Item2_Count_from_Top400 : this.topcounter[0].countfromtop400,
          Item2_Count_from_Top500 : this.topcounter[0].countfromtop500,
          Item3_Count_from_Top100 : this.topcounter[1].countfromtop100,
          Item3_Count_from_Top200 : this.topcounter[1].countfromtop200,
          Item3_Count_from_Top300 : this.topcounter[1].countfromtop300,
          Item3_Count_from_Top400 : this.topcounter[1].countfromtop400,
          Item3_Count_from_Top500 : this.topcounter[1].countfromtop500,
          Item4_Count_from_Top100 : this.topcounter[2].countfromtop100,
          Item4_Count_from_Top200 : this.topcounter[2].countfromtop200,
          Item4_Count_from_Top300 : this.topcounter[2].countfromtop300,
          Item4_Count_from_Top400 : this.topcounter[2].countfromtop400,
          Item4_Count_from_Top500 : this.topcounter[2].countfromtop500,
          Item5_Count_from_Top100 : this.topcounter[3].countfromtop100,
          Item5_Count_from_Top200 : this.topcounter[3].countfromtop200,
          Item5_Count_from_Top300 : this.topcounter[3].countfromtop300,
          Item5_Count_from_Top400 : this.topcounter[3].countfromtop400,
          Item5_Count_from_Top500 : this.topcounter[3].countfromtop500,
          Item6_Count_from_Top100 : this.topcounter[4].countfromtop100,
          Item6_Count_from_Top200 : this.topcounter[4].countfromtop200,
          Item6_Count_from_Top300 : this.topcounter[4].countfromtop300,
          Item6_Count_from_Top400 : this.topcounter[4].countfromtop400,
          Item6_Count_from_Top500 : this.topcounter[4].countfromtop500
        }
        this.countData.push(coun);
      }
      if (this.arrlength === 7) {
        const coun: any = {
          items: l,
          Item2_Count_from_Top100 : this.topcounter[0].countfromtop100,
          Item2_Count_from_Top200 : this.topcounter[0].countfromtop200,
          Item2_Count_from_Top300 : this.topcounter[0].countfromtop300,
          Item2_Count_from_Top400 : this.topcounter[0].countfromtop400,
          Item2_Count_from_Top500 : this.topcounter[0].countfromtop500,
          Item3_Count_from_Top100 : this.topcounter[1].countfromtop100,
          Item3_Count_from_Top200 : this.topcounter[1].countfromtop200,
          Item3_Count_from_Top300 : this.topcounter[1].countfromtop300,
          Item3_Count_from_Top400 : this.topcounter[1].countfromtop400,
          Item3_Count_from_Top500 : this.topcounter[1].countfromtop500,
          Item4_Count_from_Top100 : this.topcounter[2].countfromtop100,
          Item4_Count_from_Top200 : this.topcounter[2].countfromtop200,
          Item4_Count_from_Top300 : this.topcounter[2].countfromtop300,
          Item4_Count_from_Top400 : this.topcounter[2].countfromtop400,
          Item4_Count_from_Top500 : this.topcounter[2].countfromtop500,
          Item5_Count_from_Top100 : this.topcounter[3].countfromtop100,
          Item5_Count_from_Top200 : this.topcounter[3].countfromtop200,
          Item5_Count_from_Top300 : this.topcounter[3].countfromtop300,
          Item5_Count_from_Top400 : this.topcounter[3].countfromtop400,
          Item5_Count_from_Top500 : this.topcounter[3].countfromtop500,
          Item6_Count_from_Top100 : this.topcounter[4].countfromtop100,
          Item6_Count_from_Top200 : this.topcounter[4].countfromtop200,
          Item6_Count_from_Top300 : this.topcounter[4].countfromtop300,
          Item6_Count_from_Top400 : this.topcounter[4].countfromtop400,
          Item6_Count_from_Top500 : this.topcounter[4].countfromtop500,
          Item7_Count_from_Top100 : this.topcounter[5].countfromtop100,
          Item7_Count_from_Top200 : this.topcounter[5].countfromtop200,
          Item7_Count_from_Top300 : this.topcounter[5].countfromtop300,
          Item7_Count_from_Top400 : this.topcounter[5].countfromtop400,
          Item7_Count_from_Top500 : this.topcounter[5].countfromtop500
        }
        this.countData.push(coun);
      }
    }

  }

  countData: any[] = [];
  topcounter: topCounter[] = [];
  barChartLabels2 : string[] = []; 

  async reportforchartData(): Promise<void> {
    let dat1 = "";
    let dat2 = "";
    let dat3 = "";
    let dat4 = "";
    let dat5 = "";
    let dat6 = "";
    let dat7 = "";
    let dat8 = "";
    let arr1: any[] = [];

    if (dat1 === '' && this.arrlength >= 1) {
      this.d.push(0);
      dat1 = (this.result[0][1][0]*100).toFixed(2).toString();
      this.barChartLabels2.push(this.result[0][2][0]);
      arr1.push(this.result[0][2][0][0]);
      let da1 = (this.result[0][1][0] * 100).toFixed(2).toString();
      this.pdata.push(da1);
      this.data.push(dat1);
    }

    if (dat2 === '' && this.arrlength >= 2) {
      dat2 = ((this.result[1][1][0] - this.result[0][1][0])*100).toFixed(2).toString()
      for (let i = 0; i < this.result[1][2].length; i++) {
        if (this.result[0][2][0].every((v: any) => this.result[1][2][i].includes(v))) {
          this.d.push((this.result[0][1][0]*100).toFixed(2).toString());
          this.barChartLabels2.push(this.result[1][2][i].filter((val: any) => !arr1[0].includes(val)));
          let da2 = (this.result[1][1][i] * 100).toFixed(2).toString();
          this.pdata.push(da2);
          arr1.push(this.result[1][2][i]);
          this.data.push(dat2);
          break;
        }
      }
    }

    if (dat3 === '' && this.arrlength >= 3) {
      dat3 = ((this.result[2][1][0] - this.result[1][1][0])*100).toFixed(2).toString();
      for (let i = 0; i < this.result[2][2].length; i++) {
        if (arr1[1].every((v: any) => this.result[2][2][i].includes(v))) {
          this.barChartLabels2.push(this.result[2][2][i].filter((val: any) => !arr1[1].includes(val)));
          let da3 = (this.result[2][1][i] * 100).toFixed(2).toString();
          this.pdata.push(da3);
          arr1.push(this.result[2][2][i]);
          this.d.push((this.result[1][1][i]*100).toFixed(2).toString());
          this.data.push(dat3);
          break;
        }
      }
    }

    if (dat4 === '' && this.arrlength >= 4) {
      dat4 = ((this.result[3][1][0] - this.result[2][1][0])*100).toFixed(2).toString();
      for (let i = 0; i < this.result[3][2].length; i++) {
        if (arr1[2].every((v: any) => this.result[3][2][i].includes(v))) {
          this.barChartLabels2.push(this.result[3][2][i].filter((val: any) => !arr1[2].includes(val)));
          let da3 = (this.result[3][1][i] * 100).toFixed(2).toString();
          this.pdata.push(da3);
          arr1.push(this.result[3][2][i]);
          this.d.push((this.result[2][1][i]*100).toFixed(2).toString());
          this.data.push(dat4);
          break;
        }
      }
    }
    if (dat5 === '' && this.arrlength >= 5) {
      dat5 = ((this.result[4][1][0] - this.result[3][1][0])*100).toFixed(2).toString();
      for (let i = 0; i < this.result[4][2].length; i++) {
        if (arr1[3].every((v: any) => this.result[4][2][i].includes(v))) {
          this.barChartLabels2.push(this.result[4][2][i].filter((val: any) => !arr1[3].includes(val)));
          let da3 = (this.result[4][1][i] * 100).toFixed(2).toString();
          this.pdata.push(da3);
          arr1.push(this.result[4][2][i]);
          this.d.push((this.result[3][1][i]*100).toFixed(2).toString());
          this.data.push(dat5);
          break;
        }
      }
    }
    if (dat6 === '' && this.arrlength >= 6) {
      dat6 = ((this.result[5][1][0] - this.result[4][1][0])*100).toFixed(2).toString();
      for (let i = 0; i < this.result[5][2].length; i++) {
        if (arr1[4].every((v: any) => this.result[5][2][i].includes(v))) {
          this.barChartLabels2.push(this.result[5][2][i].filter((val: any) => !arr1[4].includes(val)));
          let da3 = (this.result[5][1][i] * 100).toFixed(2).toString();
          this.pdata.push(da3);
          arr1.push(this.result[5][2][i]);
          this.d.push((this.result[4][1][i]*100).toFixed(2).toString());
          this.data.push(dat6);
          break;
        }
      }
    }
    if (dat7 === '' && this.arrlength >= 7) {
      dat7 = ((this.result[6][1][0] - this.result[5][1][0])*100).toFixed(2).toString();
      for (let i = 0; i < this.result[6][2].length; i++) {
        if (arr1[5].every((v: any) => this.result[6][2][i].includes(v))) {
          this.barChartLabels2.push(this.result[6][2][i].filter((val: any) => !arr1[5].includes(val)));
          let da3 = (this.result[6][1][i] * 100).toFixed(2).toString();
          this.pdata.push(da3);
          arr1.push(this.result[6][2][i]);
          this.d.push((this.result[5][1][i]*100).toFixed(2).toString());
          this.data.push(dat7);
          break;
        }
      }
    }
    if (dat8 === '' && this.arrlength >= 8) {
      dat8 = ((this.result[7][1][0] - this.result[6][1][0])*100).toFixed(2).toString();
      for (let i = 0; i < this.result[7][2].length; i++) {
        if (arr1[6].every((v: any) => this.result[7][2][i].includes(v))) {
          this.barChartLabels2.push(this.result[7][2][i].filter((val: any) => !arr1[6].includes(val)));
          let da3 = (this.result[7][1][i] * 100).toFixed(2).toString();
          this.pdata.push(da3);
          arr1.push(this.result[7][2][i]);
          this.d.push((this.result[6][1][i]*100).toFixed(2).toString());
          this.data.push(dat8);
          break;
        }
      }
    }
  }

  generateExcel() {
    const title = 'Chart graph';
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Chart');
    let titleRow = worksheet.addRow([title]);
    titleRow.font = { name: 'Comic Sans MS', family: 4, size: 16, underline: 'double', bold: true }
    worksheet.addRow([]);
    //const canvas = document.getElementById('ctx') as HTMLCanvasElement;
    //this.chartimg = canvas.toDataURL("image/png");
    //Add Image
    let logo = workbook.addImage({
      base64: this.chartimg,
      extension: 'png',
    });

    worksheet.addImage(logo, 'A3:I18');

    worksheet.addRow([]);

    let worksheetChartData = workbook.addWorksheet('ChartData');
    const header = ["Items", "Initial Reach", "Incremental Reach", "Final Reach"]
    worksheetChartData.addRow(header);
    worksheetChartData.columns = [
      { key: 'items' },{key:'reach'},{key:'incrementalreach'},{key:'finalreach'}
    ];
    this.chartdatalist.forEach(function(item, index) {
      worksheetChartData.addRow(item);
    })

    let worksheetCount = workbook.addWorksheet('Count');
    worksheetCount.addRow([]);
    if(this.arrlength == 2){
        let countheader = ["",
        "Count from Top100","Count from Top200","Count from Top300","Count from Top400","Count from Top500"];
        worksheetCount.addRow(countheader);
        worksheetCount.mergeCells('A1:A2');
        worksheetCount.getCell('A1').value ="Item";
        worksheetCount.mergeCells('B1:F1');
        worksheetCount.getCell('D1').value ="Item 2";
      worksheetCount.columns = [
        { key:'items' },{key:'Item2_Count_from_Top100'},{key:'Item2_Count_from_Top200'},{key:'Item2_Count_from_Top300'},
        {key: 'Item2_Count_from_Top400'},{key:'Item2_Count_from_Top500'}
      ];
    }
    if(this.arrlength == 3){
      let countheader = ["",
      "Count from Top100","Count from Top200","Count from Top300","Count from Top400","Count from Top500",
      "Count from Top100","Count from Top200","Count from Top300","Count from Top400","Count from Top500"];
      worksheetCount.addRow(countheader);
        worksheetCount.mergeCells('A1:A2');
        worksheetCount.getCell('A1').value ="Item";
        worksheetCount.mergeCells('B1:F1');
        worksheetCount.getCell('D1').value ="Item 2";
        worksheetCount.mergeCells('G1:K1');
        worksheetCount.getCell('I1').value ="Item 3";
      worksheetCount.columns = [
        { key: 'items' },{key:'Item2_Count_from_Top100'},{key:'Item2_Count_from_Top200'},{key:'Item2_Count_from_Top300'},
        {key: 'Item2_Count_from_Top400'},{key:'Item2_Count_from_Top500'},{key:'Item3_Count_from_Top100'},{key:'Item3_Count_from_Top200'},
        {key:'Item3_Count_from_Top300'},{key: 'Item3_Count_from_Top400'},{key:'Item3_Count_from_Top500'}
      ];
    }
    if(this.arrlength == 4){
      let countheader = ["",
      "Count from Top100","Count from Top200","Count from Top300","Count from Top400","Count from Top500",
      "Count from Top100","Count from Top200","Count from Top300","Count from Top400","Count from Top500",
      "Count from Top100","Count from Top200","Count from Top300","Count from Top400","Count from Top500"];
      worksheetCount.addRow(countheader);
        worksheetCount.mergeCells('A1:A2');
        worksheetCount.getCell('A1').value ="Item";
        worksheetCount.mergeCells('B1:F1');
        worksheetCount.getCell('D1').value ="Item 2";
        worksheetCount.mergeCells('G1:K1');
        worksheetCount.getCell('I1').value ="Item 3";
        worksheetCount.mergeCells('L1:P1');
        worksheetCount.getCell('N1').value ="Item 4";
      worksheetCount.columns = [
        { key: 'items' },{key:'Item2_Count_from_Top100'},{key:'Item2_Count_from_Top200'},{key:'Item2_Count_from_Top300'},
        {key: 'Item2_Count_from_Top400'},{key:'Item2_Count_from_Top500'},{key:'Item3_Count_from_Top100'},{key:'Item3_Count_from_Top200'},
        {key:'Item3_Count_from_Top300'},{key: 'Item3_Count_from_Top400'},{key:'Item3_Count_from_Top500'},{key:'Item4_Count_from_Top100'},
        {key:'Item4_Count_from_Top200'},{key:'Item4_Count_from_Top300'},{key: 'Item4_Count_from_Top400'},{key:'Item4_Count_from_Top500'}
      ];
    }
    if(this.arrlength == 5){
        let countheader = ["",
        "Count from Top100","Count from Top200","Count from Top300","Count from Top400","Count from Top500",
        "Count from Top100","Count from Top200","Count from Top300","Count from Top400","Count from Top500",
        "Count from Top100","Count from Top200","Count from Top300","Count from Top400","Count from Top500",
        "Count from Top100","Count from Top200","Count from Top300","Count from Top400","Count from Top500"];

        worksheetCount.addRow(countheader);
        worksheetCount.mergeCells('A1:A2');
        worksheetCount.getCell('A1').value ="Item";
        worksheetCount.mergeCells('B1:F1');
        worksheetCount.getCell('D1').value ="Item 2";
        worksheetCount.mergeCells('G1:K1');
        worksheetCount.getCell('I1').value ="Item 3";
        worksheetCount.mergeCells('L1:P1');
        worksheetCount.getCell('N1').value ="Item 4";
        worksheetCount.mergeCells('Q1:U1');
        worksheetCount.getCell('S1').value ="Item 5";
      
      worksheetCount.columns = [
        { key: 'items' },{key:'Item2_Count_from_Top100'},{key:'Item2_Count_from_Top200'},{key:'Item2_Count_from_Top300'},
        {key: 'Item2_Count_from_Top400'},{key:'Item2_Count_from_Top500'},{key:'Item3_Count_from_Top100'},{key:'Item3_Count_from_Top200'},
        {key:'Item3_Count_from_Top300'},{key: 'Item3_Count_from_Top400'},{key:'Item3_Count_from_Top500'},{key:'Item4_Count_from_Top100'},
        {key:'Item4_Count_from_Top200'},{key:'Item4_Count_from_Top300'},{key: 'Item4_Count_from_Top400'},{key:'Item4_Count_from_Top500'},
        {key:'Item5_Count_from_Top100'},{key:'Item5_Count_from_Top200'},{key:'Item5_Count_from_Top300'},{key: 'Item5_Count_from_Top400'},
        {key:'Item5_Count_from_Top500'}
      ];
    }
    if(this.arrlength == 6){
        let countheader = ["",
        "Count from Top100","Count from Top200","Count from Top300","Count from Top400","Count from Top500",
        "Count from Top100","Count from Top200","Count from Top300","Count from Top400","Count from Top500",
        "Count from Top100","Count from Top200","Count from Top300","Count from Top400","Count from Top500",
        "Count from Top100","Count from Top200","Count from Top300","Count from Top400","Count from Top500",
        "Count from Top100","Count from Top200","Count from Top300","Count from Top400","Count from Top500"];
        worksheetCount.addRow(countheader);
        worksheetCount.mergeCells('A1:A2');
        worksheetCount.getCell('A1').value ="Item";
        worksheetCount.mergeCells('B1:F1');
        worksheetCount.getCell('D1').value ="Item 2";
        worksheetCount.mergeCells('G1:K1');
        worksheetCount.getCell('I1').value ="Item 3";
        worksheetCount.mergeCells('L1:P1');
        worksheetCount.getCell('N1').value ="Item 4";
        worksheetCount.mergeCells('Q1:U1');
        worksheetCount.getCell('S1').value ="Item 5";
        worksheetCount.mergeCells('V1:Z1');
        worksheetCount.getCell('V1').value ="Item 6";
      worksheetCount.columns = [
        {key: 'items' },{key:'Item2_Count_from_Top100'},{key:'Item2_Count_from_Top200'},{key:'Item2_Count_from_Top300'},
        {key: 'Item2_Count_from_Top400'},{key:'Item2_Count_from_Top500'},{key:'Item3_Count_from_Top100'},{key:'Item3_Count_from_Top200'},
        {key:'Item3_Count_from_Top300'},{key: 'Item3_Count_from_Top400'},{key:'Item3_Count_from_Top500'},{key:'Item4_Count_from_Top100'},
        {key:'Item4_Count_from_Top200'},{key:'Item4_Count_from_Top300'},{key: 'Item4_Count_from_Top400'},{key:'Item4_Count_from_Top500'},
        {key:'Item5_Count_from_Top100'},{key:'Item5_Count_from_Top200'},{key:'Item5_Count_from_Top300'},{key: 'Item5_Count_from_Top400'},
        {key:'Item5_Count_from_Top500'},{key:'Item6_Count_from_Top100'},{key:'Item6_Count_from_Top200'},{key:'Item6_Count_from_Top300'},
        {key: 'Item6_Count_from_Top400'},{key:'Item6_Count_from_Top500'}
      ];
    }
    if(this.arrlength == 7){
        let countheader = ["",
        "Count from Top100","Count from Top200","Count from Top300","Count from Top400","Count from Top500",
        "Count from Top100","Count from Top200","Count from Top300","Count from Top400","Count from Top500",
        "Count from Top100","Count from Top200","Count from Top300","Count from Top400","Count from Top500",
        "Count from Top100","Count from Top200","Count from Top300","Count from Top400","Count from Top500",
        "Count from Top100","Count from Top200","Count from Top300","Count from Top400","Count from Top500",
        "Count from Top100","Count from Top200","Count from Top300","Count from Top400","Count from Top500"];
        worksheetCount.addRow(countheader);
        worksheetCount.mergeCells('A1:A2');
        worksheetCount.getCell('A1').value ="Item";
        worksheetCount.mergeCells('B1:F1');
        worksheetCount.getCell('D1').value ="Item 2";
        worksheetCount.mergeCells('G1:K1');
        worksheetCount.getCell('I1').value ="Item 3";
        worksheetCount.mergeCells('L1:P1');
        worksheetCount.getCell('N1').value ="Item 4";
        worksheetCount.mergeCells('Q1:U1');
        worksheetCount.getCell('S1').value ="Item 5";
        worksheetCount.mergeCells('V1:Z1');
        worksheetCount.getCell('V1').value ="Item 6";
        worksheetCount.mergeCells('AA1:AE1');
        worksheetCount.getCell('AA1').value ="Item 7";
      worksheetCount.columns = [
        { key: 'items' },{key:'Item2_Count_from_Top100'},{key:'Item2_Count_from_Top200'},{key:'Item2_Count_from_Top300'},
        {key: 'Item2_Count_from_Top400'},{key:'Item2_Count_from_Top500'},{key:'Item3_Count_from_Top100'},{key:'Item3_Count_from_Top200'},
        {key:'Item3_Count_from_Top300'},{key: 'Item3_Count_from_Top400'},{key:'Item3_Count_from_Top500'},{key:'Item4_Count_from_Top100'},
        {key:'Item4_Count_from_Top200'},{key:'Item4_Count_from_Top300'},{key: 'Item4_Count_from_Top400'},{key:'Item4_Count_from_Top500'},
        {key:'Item5_Count_from_Top100'},{key:'Item5_Count_from_Top200'},{key:'Item5_Count_from_Top300'},{key: 'Item5_Count_from_Top400'},
        {key:'Item5_Count_from_Top500'},{key:'Item6_Count_from_Top100'},{key:'Item6_Count_from_Top200'},{key:'Item6_Count_from_Top300'},
        {key: 'Item6_Count_from_Top400'},{key:'Item6_Count_from_Top500'},{key:'Item7_Count_from_Top100'},{key:'Item7_Count_from_Top200'},
        {key:'Item7_Count_from_Top300'},{key: 'Item7_Count_from_Top400'},{key:'Item7_Count_from_Top500'}
      ];
    }
    if(this.arrlength == 8){
        let countheader = ["",
        "Count from Top100","Count from Top200","Count from Top300","Count from Top400","Count from Top500",
        "Count from Top100","Count from Top200","Count from Top300","Count from Top400","Count from Top500",
        "Count from Top100","Count from Top200","Count from Top300","Count from Top400","Count from Top500",
        "Count from Top100","Count from Top200","Count from Top300","Count from Top400","Count from Top500",
        "Count from Top100","Count from Top200","Count from Top300","Count from Top400","Count from Top500",
        "Count from Top100","Count from Top200","Count from Top300","Count from Top400","Count from Top500",
        "Count from Top100","Count from Top200","Count from Top300","Count from Top400","Count from Top500"];
        worksheetCount.addRow(countheader);
        worksheetCount.mergeCells('A1:A2');
        worksheetCount.getCell('A1').value ="Item";
        worksheetCount.mergeCells('B1:F1');
        worksheetCount.getCell('D1').value ="Item 2";
        worksheetCount.mergeCells('G1:K1');
        worksheetCount.getCell('I1').value ="Item 3";
        worksheetCount.mergeCells('L1:P1');
        worksheetCount.getCell('N1').value ="Item 4";
        worksheetCount.mergeCells('Q1:U1');
        worksheetCount.getCell('S1').value ="Item 5";
        worksheetCount.mergeCells('V1:Z1');
        worksheetCount.getCell('V1').value ="Item 6";
        worksheetCount.mergeCells('AA1:AE1');
        worksheetCount.getCell('AA1').value ="Item 7";
        worksheetCount.mergeCells('AF1:AJ1');
        worksheetCount.getCell('AF1').value ="Item 8";
      worksheetCount.columns = [
        { key: 'items' },{key:'Item2_Count_from_Top100'},{key:'Item2_Count_from_Top200'},{key:'Item2_Count_from_Top300'},
        {key: 'Item2_Count_from_Top400'},{key:'Item2_Count_from_Top500'},{key:'Item3_Count_from_Top100'},{key:'Item3_Count_from_Top200'},
        {key:'Item3_Count_from_Top300'},{key: 'Item3_Count_from_Top400'},{key:'Item3_Count_from_Top500'},{key:'Item4_Count_from_Top100'},
        {key:'Item4_Count_from_Top200'},{key:'Item4_Count_from_Top300'},{key: 'Item4_Count_from_Top400'},{key:'Item4_Count_from_Top500'},
        {key:'Item5_Count_from_Top100'},{key:'Item5_Count_from_Top200'},{key:'Item5_Count_from_Top300'},{key: 'Item5_Count_from_Top400'},
        {key:'Item5_Count_from_Top500'},{key:'Item6_Count_from_Top100'},{key:'Item6_Count_from_Top200'},{key:'Item6_Count_from_Top300'},
        {key: 'Item6_Count_from_Top400'},{key:'Item6_Count_from_Top500'},{key:'Item7_Count_from_Top100'},{key:'Item7_Count_from_Top200'},
        {key:'Item7_Count_from_Top300'},{key: 'Item7_Count_from_Top400'},{key:'Item7_Count_from_Top500'},{key:'Item8_Count_from_Top100'},
        {key:'Item8_Count_from_Top200'},{key:'Item8_Count_from_Top300'},{key: 'Item8_Count_from_Top400'},{key:'Item8_Count_from_Top500'}
      ];
    }
    
    this.countData.forEach(function(item, index) {
        worksheetCount.addRow(item);
    })
    var itemlist: any[] = [];
    itemlist = JSON.parse(localStorage.report);//this.exportlist.itemreport();
    for (let d = 0; d < this.arrlength; d++) {
      let worksheetitem  = workbook.addWorksheet((d+1)+"Item")
      if(d == 0){
        const header = ["Reach", "Frequency", "Item"];
        worksheetitem.addRow(header);
        worksheetitem.columns = [
          { key: 'reach' },{key:'frequency'},{key:'item'}
        ];
      }else if(d==1){
        const header = ["Reach", "Frequency", "Item","Incremental Reach 1","Incremental Reach 2"]
        worksheetitem.addRow(header);
        worksheetitem.columns = [
          { key: 'reach' },{key:'frequency'},{key:'item'},{key:'incremental_reach1'},{key:'incremental_reach2'}
        ];
      }else if(d==2){
        const header = ["Reach", "Frequency", "Item","Incremental Reach 1","Incremental Reach 2","Incremental Reach 3"]
        worksheetitem.addRow(header);
        worksheetitem.columns = [
          { key: 'reach' },{key:'frequency'},{key:'item'},{key:'incremental_reach1'},{key:'incremental_reach2'},{key:'incremental_reach3'}
        ];
      }else if(d==3){
        const header = ["Reach", "Frequency", "Item","Incremental Reach 1","Incremental Reach 2","Incremental Reach 3","Incremental Reach 4"]
        worksheetitem.addRow(header);
        worksheetitem.columns = [
          { key: 'reach' },{key:'frequency'},{key:'item'},{key:'incremental_reach1'},{key:'incremental_reach2'},{key:"incremental_reach3"},{key:"incremental_reach4"}
        ];
      }else if(d==4){
        const header = ["Reach", "Frequency", "Item","Incremental Reach 1","Incremental Reach 2","Incremental Reach 3","Incremental Reach 4","Incremental Reach 5"]
        worksheetitem.addRow(header);
        worksheetitem.columns = [
          { key: 'reach' },{key:'frequency'},{key:'item'},{key:'incremental_reach1'},{key:'incremental_reach2'},{key:'incremental_reach3'},{key:'incremental_reach4'},{key:'incremental_reach5'}
        ];
      }else if(d==5){
        const header = ["Reach", "Frequency", "Item","Incremental Reach 1","Incremental Reach 2","Incremental Reach 3","Incremental Reach 4","Incremental Reach 5","Incremental Reach 6"]
        worksheetitem.addRow(header);
        worksheetitem.columns = [
          { key: 'reach' },{key:'frequency'},{key:'item'},{key:'incremental_reach1'},{key:'incremental_reach2'},{key:'incremental_reac3'},{key:'incremental_reach4'},{key:'incremental_reach5'},{key:'incremental_reach6'}
        ];
      }else if(d==6){
        const header = ["Reach", "Frequency", "Item","Incremental Reach 1","Incremental Reach 2","Incremental Reach 3","Incremental Reach 4","Incremental Reach 5","Incremental Reach 6","Incremental Reach 7"]
        worksheetitem.addRow(header);
        worksheetitem.columns = [
          { key: 'reach' },{key:'frequency'},{key:'item'},{key:'incremental_reach1'},{key:'incremental_reach2'},{key:'incremental_reach3'},{key:'incremental_reach4'},{key:'incremental_reach5'},{key:'incremental_reach6'},{key:'incremental_reach7'},
        ];
      }else if(d==7){
        const header = ["Reach", "Frequency", "Item","Incremental Reach 1","Incremental Reach 2","Incremental Reach 3","Incremental Reach 4","Incremental Reach 5","Incremental Reach 6","Incremental Reach 7","Incremental Reach 8"]
        worksheetitem.addRow(header);
        worksheetitem.columns = [
          { key: 'reach' },{key:'frequency'},{key:'item'},{key:'incremental_reach1'},{key:'incremental_reach2'},{key:'incremental_reach3'},{key:'incremental_reach4'},{key:'incremental_reach5'},{key:'incremental_reach6'},{key:'incremental_reach7'},{key:'incremental_reach8'}
        ];
      }
      
      itemlist[d].forEach(function(item:any, index:any) {
        worksheetitem.addRow(parseInt(item));
      })
    }

    workbook.views = [
        {
            x: 0, y: 0, width: 10000, height: 20000,
            firstSheet: 0, activeTab: 0, visibility: 'visible'
        }
    ];
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'Chart' + new Date().getTime() + '.xlsx');
    })

  }
 
}
export interface chartData{
  items : string;
  reach : any;
  incrementalreach : any;
  finalreach : any;
}
