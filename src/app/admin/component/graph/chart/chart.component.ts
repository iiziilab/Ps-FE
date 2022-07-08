import { analyzeAndValidateNgModules } from '@angular/compiler';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartOptions, ChartType,ChartConfiguration, ChartData ,ChartDataset} from 'chart.js';
import { PsolutionsService } from 'src/app/services/psolutions.service';
import * as XLSX from 'xlsx';
import { chartData } from '../chart-data/chart-data.component';
import { countData, topCounter } from '../count/count.component';
import * as Excel from 'exceljs';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { exportexcel } from './exportexcel';
import {Chart} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
Chart.register(ChartDataLabels)

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
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

export class ChartComponent implements OnInit {

  @ViewChild('barchart') barchart: ElementRef<HTMLCanvasElement>;
  public context: CanvasRenderingContext2D;
  constructor(private services: PsolutionsService,
    private router: Router,
    private route: ActivatedRoute) {
    this.route.params.subscribe(res => {
      this.id = res.id;
    })
  }
  itemlist: any[] = [];
  id: any;
  projectid: number;
  listLink: string;
  modeltitleurl: string;
  chartlink: string;
  arrlength: number;
  d1: any;
  d2: any;
  d3: any;
  d4: any;
  d5: any;
  d6: any;
  d7: any;
  d8: any;
  chartimg :any;
  imageUrl :  any;
  exportlist : exportexcel;
  countheader: any[]=[];
  countheader1: any[]=[];
  pName: string;
  cellName: string;
  public static imgUrl: any;

  async ngOnInit(): Promise<void> {
    this.exportlist = new exportexcel();
    this.result = JSON.parse(localStorage.getItem("chartData"));
    var project = await this.services.getCellByid(this.id).toPromise();
    this.projectid = project.projectId;
    this.listLink = "/admin/project/cell/" + this.projectid;
    this.modeltitleurl = "/admin/project/cell/optimized/" + this.id;
    this.chartlink = "/admin/project/cell/chart/"+ this.id;
    // this.loadData();
    // this.lloadData();
    this.loadchartData();
    this.itemlist=this.exportlist.itemreport();
    
    localStorage.setItem('report',JSON.stringify(this.itemlist));
    const canvas = document.getElementById('ctx') as HTMLCanvasElement;
    this.chartimg = canvas.toDataURL("image/png");
    ChartComponent.imgUrl = canvas.toDataURL("image/png");
    localStorage.setItem("chart",this.chartimg);

    this.pName = localStorage.getItem('projectName');
    this.cellName = project.cellName;
  }

  result: any[] = [];
  barChartOptions: any = {
    responsive: true,
    tooltips: {
      enabled: true
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
          zeroLineColor: 'white',
          color: 'transparent'
        }
      },
      y: {
        stacked: true,
        grid: {
          display: false,
          zeroLineColor: 'white',
          color: 'transparent'
        }
      }
    },
    legend: {
      display: false
    },
    plugins: {
      title: {
        display: true,
        text: 'Turf Analyser Chart'
      },

      datalabels: {
        display: true,
        clamp: true,
        align: 'end',
        anchor: 'end'
        // anchor: 'end',
        // align: 'start',
        //formatter: Math.round,
      }
    }
  };
  barChartLabels: string[];
  barChartLabels1: string[];
  barChartType: ChartType = 'bar';
  barChartLegend: boolean = true;
  //barChartPlugins: any[] = [];
  barChartPlugins : any = [
    ChartDataLabels
  ];

  public barChartData: any[] = [];
  public barChartData1: any[] = [];
  loadchartData() {
    this.arrlength = this.result.length;
    let data1 : any = "";
    let data2 : any = "";
    let data3 : any = "";
    let data4 : any = "";
    let data5 : any = "";
    let data6 : any = "";
    let data7 : any = "";
    let data8 : any = "";
    let d1 : any = "";
    let d2 : any = "";
    let d3 : any = "";
    let d4 : any = "";
    let d5 : any = "";
    let d6 : any = "";
    let d7 : any = "";
    let d8 : any = "";
    let arr: any[] = [];
    this.barChartLabels1 = new Array<string>();

      if (data1 === '' && this.arrlength >= 1) {
        this.d.push(0);
        data1 = parseFloat((this.result[0][1][0]*100).toFixed(1));
        this.barChartLabels1.push(this.result[0][2][0][0]);
        arr.push(this.result[0][2][0][0]);
        let da1 = (this.result[0][1][0]*100).toFixed(2).toString();
        this.pdata.push(da1);
        this.data.push(data1);
        console.log(208,data1);
      }

      if (data2 === '' && this.arrlength >= 2) {
        data2 = parseFloat(((this.result[1][1][0]-this.result[0][1][0])*100).toFixed(2));
        for (let i = 0; i < this.result[1][2].length; i++) {
        if(this.result[0][2][0].every((v:any) => this.result[1][2][i].includes(v))){
          this.d.push((this.result[0][1][0]*100).toFixed(2).toString());
          d1 = (this.result[0][1][0]*100).toFixed(2).toString();
          this.barChartLabels1.push(this.result[1][2][i].filter((val:any) => !arr[0].includes(val)));
          let da2 = (this.result[1][1][i]*100).toFixed(2).toString();
          this.pdata.push(da2);
          arr.push(this.result[1][2][i]);
          this.data.push(data2);
          break;
        }}
      }

      if (data3 === '' && this.arrlength >= 3) {
        data3 = parseFloat(((this.result[2][1][0]-this.result[1][1][0])*100).toFixed(2));
        for (let i = 0; i < this.result[2][2].length; i++) {
        if(arr[1].every((v:any) => this.result[2][2][i].includes(v))){
          this.barChartLabels1.push(this.result[2][2][i].filter((val:any) => !arr[1].includes(val)));
          let da3 = (this.result[2][1][i]*100).toFixed(2).toString();
          this.pdata.push(da3);
          arr.push(this.result[2][2][i]);
          this.d.push((this.result[1][1][i]*100).toFixed(2).toString());
          d2 = (this.result[1][1][i]*100).toFixed(2).toString();
          this.data.push(data3);
          break;
        }}
      }

      if (data4 === '' && this.arrlength >= 4) {
        data4 = parseFloat(((this.result[3][1][0]-this.result[2][1][0])*100).toFixed(2));
        for (let i = 0; i < this.result[3][2].length; i++) {
        if(arr[2].every((v:any) => this.result[3][2][i].includes(v))){
          this.barChartLabels1.push(this.result[3][2][i].filter((val:any) => !arr[2].includes(val)));
          let da3 = (this.result[3][1][i]*100).toFixed(2).toString();
          this.pdata.push(da3);
          arr.push(this.result[3][2][i]);
          this.d.push((this.result[2][1][i]*100).toFixed(2).toString());
          d3 = (this.result[2][1][i]*100).toFixed(2).toString();
          this.data.push(data4);
          break;
        }}
      }
      if (data5 === '' && this.arrlength >= 5) {
        data5 = parseFloat(((this.result[4][1][0]-this.result[3][1][0])*100).toFixed(2));
        for (let i = 0; i < this.result[4][2].length; i++) {
          if(arr[3].every((v:any) => this.result[4][2][i].includes(v))){
            this.barChartLabels1.push(this.result[4][2][i].filter((val:any) => !arr[3].includes(val)));
            let da3 = (this.result[4][1][i]*100).toFixed(2).toString();
            this.pdata.push(da3);
            arr.push(this.result[4][2][i]);
            this.d.push((this.result[3][1][i]*100).toFixed(2).toString());
            d4 = (this.result[3][1][i]*100).toFixed(2).toString();
            this.data.push(data5);
            break;
          }}
      }
      if (data6 === '' && this.arrlength >= 6) {
        data6 = parseFloat(((this.result[5][1][0] - this.result[4][1][0])*100).toFixed(2));
        for (let i = 0; i < this.result[5][2].length; i++) {
          if (arr[4].every((v: any) => this.result[5][2][i].includes(v))) {
            this.barChartLabels1.push(this.result[5][2][i].filter((val: any) => !arr[4].includes(val)));
            let da3 = (this.result[5][1][i] * 100).toFixed(2).toString();
            this.pdata.push(da3);
            arr.push(this.result[5][2][i]);
            this.d.push((this.result[4][1][i]*100).toFixed(2).toString());
            d5 = (this.result[4][1][i]*100).toFixed(2).toString();
            this.data.push(data6);
            break;
          }
        }
      }
      if (data7 === '' && this.arrlength >= 7) {
        data7 = parseFloat(((this.result[6][1][0] - this.result[5][1][0])*100).toFixed(2));
        for (let i = 0; i < this.result[6][2].length; i++) {
          if (arr[5].every((v: any) => this.result[6][2][i].includes(v))) {
            this.barChartLabels1.push(this.result[6][2][i].filter((val: any) => !arr[5].includes(val)));
            let da3 = (this.result[6][1][i] * 100).toFixed(2).toString();
            this.pdata.push(da3);
            arr.push(this.result[6][2][i]);
            this.d.push((this.result[5][1][i]*100).toFixed(2).toString());
            d6 = (this.result[5][1][i]*100).toFixed(2).toString()
            this.data.push(data7);
            break;
          }
        }
      }
      if (data8 === '' && this.arrlength >= 8) {
        data8 = parseFloat(((this.result[7][1][0] - this.result[6][1][0])*100).toFixed(2));
        for (let i = 0; i < this.result[7][2].length; i++) {
          if (arr[6].every((v: any) => this.result[7][2][i].includes(v))) {
            this.barChartLabels1.push(this.result[7][2][i].filter((val: any) => !arr[6].includes(val)));
            let da3 = (this.result[7][1][i] * 100).toFixed(2).toString();
            this.pdata.push(da3);
            arr.push(this.result[7][2][i]);
            this.d.push((this.result[6][1][i]*100).toFixed(2).toString());
            d7 = (this.result[6][1][i]*100).toFixed(2).toString()
            this.data.push(data8);
            break;
          }
        }
      }

      let cda1 = data1 + data2;
      let cda2 = cda1 + data3;
      let cda3 = cda2 + data4;
      let cda4 = cda3 + data5;
      let cda5 = cda4 + data5;
      let cda6 = cda2 + data4;
      let cda7 = cda1 + data3;
      
      this.barChartData1 = [{ data: [0, d1, d2, d3, d4, d5, d6, d7], barPercentage: 1.0, categoryPercentage: 1.0, backgroundColor: '#fff', hoverBackgroundColor: 'transparent',"label": "Initial Reach" }, { data: [data1, data2, data3, data4, data5, data6, data7, data8], barPercentage: 1.0, categoryPercentage: 1.0, "label": "Incremental Reach" }];
  //this.barChartData1 = [{ data: [0, 10,20,30,40,50], barPercentage: 1.0, categoryPercentage: 1.0, backgroundColor: '#fff', hoverBackgroundColor: 'transparent',"label": "Initial Reach" },
       //{ data: [22,44,74,80,85], barPercentage: 1.0, categoryPercentage: 1.0, "label": "Incremental Reach"}];
      console.log(315,this.barChartLabels1);

      //[0, d1, d2, d3, d4, d5, d6, d7]  
  }

  oneitem(){
    const canvas = document.getElementById('ctx') as HTMLCanvasElement;
    this.chartimg = canvas.toDataURL("image/png");
    localStorage.setItem("chart",this.chartimg);
    this.router.navigate(['/admin/project/cell/oneitem/' + this.id]);
  }

  twoitem(){
    const canvas = document.getElementById('ctx') as HTMLCanvasElement;
    this.chartimg = canvas.toDataURL("image/png");
    localStorage.setItem("chart",this.chartimg);
    this.router.navigate(['/admin/project/cell/twoitems/' + this.id]);
  }
  threeitem(){
    const canvas = document.getElementById('ctx') as HTMLCanvasElement;
    this.chartimg = canvas.toDataURL("image/png");
    localStorage.setItem("chart",this.chartimg);
    this.router.navigate(['/admin/project/cell/threeitems/' + this.id]);
  }
  fouritem(){
    const canvas = document.getElementById('ctx') as HTMLCanvasElement;
    this.chartimg = canvas.toDataURL("image/png");
    localStorage.setItem("chart",this.chartimg);
    this.router.navigate(['/admin/project/cell/fouritems/' + this.id]);
  }
  fiveitem(){
    const canvas = document.getElementById('ctx') as HTMLCanvasElement;
    this.chartimg = canvas.toDataURL("image/png");
    localStorage.setItem("chart",this.chartimg);
    this.router.navigate(['/admin/project/cell/fiveitems/' + this.id]);
  }
  sixitem(){
    const canvas = document.getElementById('ctx') as HTMLCanvasElement;
    this.chartimg = canvas.toDataURL("image/png");
    localStorage.setItem("chart",this.chartimg);
    this.router.navigate(['/admin/project/cell/sixitems/' + this.id]);
  }
  sevenitem(){
    const canvas = document.getElementById('ctx') as HTMLCanvasElement;
    this.chartimg = canvas.toDataURL("image/png");
    localStorage.setItem("chart",this.chartimg);
    this.router.navigate(['/admin/project/cell/sevenitems/' + this.id]);
  }
  eightitem(){
    const canvas = document.getElementById('ctx') as HTMLCanvasElement;
    this.chartimg = canvas.toDataURL("image/png");
    localStorage.setItem("chart",this.chartimg);
    this.router.navigate(['/admin/project/cell/eightitems/' + this.id]);
  }
  count(){
    const canvas = document.getElementById('ctx') as HTMLCanvasElement;
    this.chartimg = canvas.toDataURL("image/png");
    localStorage.setItem("chart",this.chartimg);
    this.router.navigate(['/admin/project/cell/count/' + this.id]);
  }
  chartData(){
    const canvas = document.getElementById('ctx') as HTMLCanvasElement;
    this.chartimg = canvas.toDataURL("image/png");
    localStorage.setItem("chart",this.chartimg);
    this.router.navigate(['/admin/project/cell/chartData/' + this.id]);
  }

  async savereport(): Promise<void> {

    this.reportforcount();
    this.reportforchartData();
    for (let i = 0; i < this.arrlength; i++) {
      const cdata: chartData = {
        items: this.barChartLabels2[i][0],
        reach: this.d[i],
        incrementalreach: this.data[i],
        finalreach: this.pdata[i]
      }
      this.chartdatalist.push(cdata);
    }
    //this.senddataforExcel();
    this.generateExcel();
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
      if (this.arrlength === 8) {
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
          Item7_Count_from_Top500 : this.topcounter[5].countfromtop500,
          Item8_Count_from_Top100 : this.topcounter[6].countfromtop100,
          Item8_Count_from_Top200 : this.topcounter[6].countfromtop200,
          Item8_Count_from_Top300 : this.topcounter[6].countfromtop300,
          Item8_Count_from_Top400 : this.topcounter[6].countfromtop400,
          Item8_Count_from_Top500 : this.topcounter[6].countfromtop500
        }
        this.countData.push(coun);
      }
    }

  }

  chartdatalist: chartData[] = [];
  countData: any[] = [];
  topcounter: topCounter[] = [];
  pdata: string[] = [];
  d: any[] = [];
  data: string[] = [];
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
    const canvas = document.getElementById('ctx') as HTMLCanvasElement;
    this.chartimg = canvas.toDataURL("image/png");
    //Add Image
    let logo = workbook.addImage({
      base64: this.chartimg,
      extension: 'png',
    });

    worksheet.addImage(logo, 'B3:J18');

    worksheet.addRow([]);worksheet.addRow([]);worksheet.addRow([]);worksheet.addRow([]);
    worksheet.addRow([]);worksheet.addRow([]);worksheet.addRow([]);worksheet.addRow([]);
    worksheet.addRow([]);worksheet.addRow([]);worksheet.addRow([]);worksheet.addRow([]);
    worksheet.addRow([]);worksheet.addRow([]);worksheet.addRow([]);worksheet.addRow([]);
    let p = [],q=[],r=[];
    p.push("Final Reach");
    q.push("Incremental Reach");
    r.push("Initial Reach");
    for (let i = 0; i < this.arrlength; i++) {
      p.push(this.pdata[i]);
      q.push(this.data[i]);
      r.push(this.d[i]);
    }
    worksheet.addRow(p);
    worksheet.addRow(q);
    worksheet.addRow(r);
    worksheet.getColumn(1).width = 17;
    // worksheet.mergeCells('B19:C19');
    // worksheet.mergeCells('D19:E19');
    // worksheet.mergeCells('F19:G19');
    // worksheet.mergeCells('H19:I19');
    // worksheet.mergeCells('J19:K19');
    // worksheet.getColumn(2).width = 18.57;
    // worksheet.getColumn(3).width = 14.71;
    // worksheet.getColumn(4).width = 15.14;
    // worksheet.getColumn(5).width = 14.86;
    // worksheet.getColumn(6).width = 14.86;
    // worksheet.getColumn(7).width = 14.86;
    // worksheet.getColumn(8).width = 14.86;

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
    // var itemlist: any[] = [];
    // itemlist=this.exportlist.itemreport();
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
      
      this.itemlist[d].forEach(function(item:any, index:any) {
       // var val = parseInt(item)
        worksheetitem.addRow(item);
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

  async senddataforExcel() : Promise<void>{
    var data : any[] = [];
    // var itemlist: any[] = [];
    // itemlist = this.exportlist.itemreport();
    data.push(this.chartdatalist);
    data.push(this.countData);
    data.push(this.itemlist);
    const formData = new FormData();
    formData.append('result', JSON.stringify(this.result));
    var pp: Excel1={
    result : JSON.stringify(this.result)
    }
    const result = await this.services.saveReport(pp).toPromise();
    if (result.statusCode == 200) {
      this.router.navigate(['admin/project/uploadmenu/'+this.id+'&'+result.data.cellId]);
    }
  }
}
export interface item {
  reach: number;
  frequency: number;
  item: string;
}
export interface Excel1
{
  result : string
}
 

