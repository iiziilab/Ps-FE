import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Menu } from 'src/app/model/menu.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CalculationDataService } from 'src/app/services/calculation-data.service';
import { PsolutionsService } from 'src/app/services/psolutions.service';
import { Alts } from '../../cell/calculation/Alt.model';
import { Calc } from '../../cell/calculation/Calc';
import { matrix, matrix1, matrix2, matrix3 } from '../../cell/calculation/matrix';
import { vector, vector1 } from '../../cell/calculation/vector';
import { CellListComponent } from '../../cell/cell-list/cell-list.component';
import { SelectMenuComponent } from '../select-menu/select-menu.component';

@Component({
  selector: 'app-optimization',
  templateUrl: './optimization.component.html',
  styles: [`.excelbtn{
    text-decoration : underline;
    cursor: pointer;
    color : rgba(0,0,0,.6);
    padding:0px 4px;
  }
  .card {
    box-shadow: 0 4px 31px rgba(0,0,0,.28)!important;
    background: var(--foreground);
    border-radius: var(--border-radius-lg);
    border: initial;
}
.filledcontrol .form-control {
  font-size: 19px;
  padding: 12px;
  border: 1px solid #ced4da;
  background: var(--background-light);
}
.centercard{
  width: 60%;
  margin-left: auto;
  margin-right: auto;
}
.btntext{
  padding-left:4px;
}`
  ]
})
export class OptimizationComponent implements OnInit {

  @ViewChild(CellListComponent) child: any;
  id: any;
  cid: any;
  modeltitleurl: string;
  modelform: FormGroup;
  save: boolean;
  edit: boolean;
  message: string;
  lmessage: string;
  show: boolean;
  lshow: boolean;
  listLink: string;
  projectid: any;
  upload: boolean;
  loading: boolean = false;
  alts_list : any[] = [];
  public menu : Menu[] = [];
  constructor(private services: PsolutionsService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private data: CalculationDataService,
    private toastr: ToastrService
    ) {
    // this.route.params.subscribe(res => {
    //   this.id = res.id;
    // });
    if (this.authenticationService.currentUserValue) {
      this.upload = this.authenticationService.currentUserValue.rolePermission.upload;
    }
  }

  pName: string;
  cellName: string;

  async ngOnInit(): Promise<void> {
    //this.alts_list = JSON.parse(localStorage.getItem("alts_1"));
    this.modelform = this.formBuilder.group({
      items: ['5', [Validators.required,Validators.min(1), Validators.max(8)]],
      mpic: ['', Validators.required]
    })
    this.id = JSON.parse(localStorage._id)
    var project = await this.services.getCellByid(this.id).toPromise();
    this.projectid = project.projectId;
    this.listLink = "/admin/project/cell/" + this.projectid;

    if (this.id) {
      this.modeltitleurl = "";
      this.modeltitleurl = "/admin/project/cell/optimized/" + this.id;
      this.save = false;
      this.edit = true;
    }
    else if (this.id === undefined) {
      this.save = true;
      this.edit = false;
    }
    this.show = false;

    this.pName = localStorage.getItem('projectName');
    this.cellName = project.cellName;
  }

  get f() { return this.modelform.controls; }

  public onChange = async (e: any) => {
    if(this.alts_arr != null){
      this.getAltsRecord();
    }
    const files = e.target.files;
    if (files.length === 0) {
      return;
    }
    let filesToUpload: File[] = files;
    this.fileReaded = files;
    this.loading = true;
  
    await this.csv2Array(files);
    (e.target as HTMLButtonElement).disabled = true;
    console.log(122,e.target);
    
    setTimeout(() => {
      (e.target as HTMLButtonElement).disabled = false;
    }, 2000);

    this.menu = await this.services.getMenuByCid(this.id).toPromise();
    this.menu.forEach(x=>{
      if(x.forcedIn == true){
        //this.forcedintoitem++;
        this.alts_list.push(x);
      }else if(x.consideration == true){
        //this.considerationsetitem++;
        this.alts_list.push(x);
      }
    })
  }

  async uploadMfile(e: any): Promise<void> {
    this.show = true;
    if (this.modelform.invalid) {
      return;
    }
    this.loading = true;
    this.lshow = true;
    var res = [];
    if (this.alts.length > 0 && this.data_matrix.rowCount != 0 && this.weight.VectorLength != 0 && this.seg.VectorLength != 0) {
      if(SelectMenuComponent.thresholdValue){
        let c = new Calc(this.alts, this.data_matrix, this.vol_matrix, this.weight, this.seg, this.seg_index, 500, SelectMenuComponent.thresholdValue);
        res = c.CalculateParallel(this.f.items.value, true);
      }else{
        let c = new Calc(this.alts, this.data_matrix, this.vol_matrix, this.weight, this.seg, this.seg_index, 500, 130);
        res = c.CalculateParallel(this.f.items.value, true);
      }
      localStorage.setItem("chartData", JSON.stringify(res));
      this.data.currentData = res;

      const obj = {
        projectId: this.projectid,
        cellId: this.id,
        data_1: JSON.stringify(this.data_01),
        seg_1: JSON.stringify(this.seg_01),
        weights_1: JSON.stringify(this.weigth_01),
      }
      this.services.postCsv(obj).subscribe(res => {
        if(res.statusCode == 200){
          //console.log(173,res.data);
          this.router.navigate(['admin/project/cell/chart/' + this.id])
        }
      })
      this.lmessage = "file uploaded successfully";
    }
    this.alts = [];
  }
  fileReaded: File[];
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

  data_01: any[] = [];
  seg_01: any[] = [];
  weigth_01: any[] = [];

  async csv2Array(files: FileList): Promise<void> {
    let max_cols: number = 201;
    let num_rows: number = 0;
    //localStorage.setItem('files', JSON.stringify(files));
    if (files && files.length > 0) {
      
      for (let p = 0; p < files.length; p++) {
        let file: File = files.item(p);
        //console.log(file);
      
        if (file.name == "alts_1.xlsx" || file.name == "data_1.xlsx" || file.name == "seg_1.xlsx" || file.name == "weights_1.xlsx"){
          this.toastr.success('Only .csv file supported');
          return;
        }
        
        let reader: FileReader = new FileReader();
        reader.readAsText(file);

        reader.onload = (e) => {
          let csv1: string = reader.result as string;
          let allTextLines = csv1.split(/\r|\n|\r/);
          let headers = allTextLines[0].split(',');
          let lines = [];
        
         // const csvData = csv1.split(',').join('');
         
          for (let i = 0; i < allTextLines.length; i++) {
            // split content based on comma
            let data = allTextLines[i].split(',');
            if (data.length === headers.length) {
              let tarr = [];
              // if (file.name == "alts_1.csv") {
              //   console.log(186,'chek')
              //   for (let j = 0; j < headers.length; j++) {
              //     tarr.push(data[j]);
              //   } 
              // } 
              if (file.name == "data_1.csv") {
                for (let j = 0; j < this.count_alts + 1; j++) {
                  tarr.push(data[j]);
                }
              } else if (file.name == "seg_1.csv") {
                for (let j = 0; j < headers.length; j++) {
                  tarr.push(data[j]);
                }
              } else if (file.name == "weights_1.csv") {
                for (let j = 0; j < headers.length; j++) {
                  tarr.push(data[j]);
                }
              }
              lines.push(tarr);
            }
          }
          let keys = lines.shift();
          this.rkeys = keys;
          this.list_row_data = this.rlines = lines;
          this.num_rows = this.list_row_data.length;
         
            // if (file.name == "alts_1.csv") {
            // if(this.alts_arr != null){
            //   this.getAltsRecord();
            // }else{
            //   this.count_alts = 0;
            //   for (let i = 1; i <= this.rlines.length; i++) {
            //     console.log(216, this.rlines)
            //     var a: Alts = new Alts();
            //     a.Id = this.rlines[i - 1][0];
            //     a.Include = this.rlines[i - 1][1] == "1" ? true : false;
            //     a.ShortDescription = this.rlines[i - 1][2];
            //     a.LongDescription = this.rlines[i - 1][3];
            //     a.CategoryIndex = this.rlines[i - 1][4];
            //     a.Category = this.rlines[i - 1][5];
            //     a.ID_Model = this.rlines[i - 1][6];
            //     a.Parm = this.rlines[i - 1][7];
            //     a.Parm = this.rlines[i - 1][9];
            //     a.Consideration_Set = this.rlines[i - 1][10] == "1" ? true : false;
            //     a.Default_Consideration_Set = a.Consideration_Set;
            //     a.Forced_In = false;
            //     if (a.Include) {
            //       this.count_alts += 1;
            //       this.alts.push(a);
            //     }
            //   }
            // }
            if (file.name == "data_1.csv") {
              console.log('data_1', this.list_row_data)
            this.data_01 = this.list_row_data;  
            // this.list_row_data = this.rlines;
            // this.num_rows = this.list_row_data.length;
            let data: matrix = new matrix(this.num_rows, this.count_alts + 1, 0);
            let vol: matrix1 = new matrix1(this.num_rows, this.count_alts + 1, 0);
            let icol: number = 0;
            
            for (var i = 1; i <= this.num_rows; i++) {
              icol = 0;
              for (var j = 2; j <= this.count_alts + 1; j++) {
                icol += 1;
                data._matrix[i - 1][icol - 1] = Math.round(this.list_row_data[i - 1][j - 1]);
                vol._matrix[i - 1][icol - 1] = Math.round(this.list_row_data[i - 1][j - 1]);
              }
            }
            this.data_matrix = data;
            this.vol_matrix = vol;
            console.log(293,data);
            
            //localStorage.setItem('data1', JSON.stringify(this.data_matrix))
          } else if (file.name == "seg_1.csv") {
            console.log('seg_1', this.list_row_data)
            this.seg_01 = this.list_row_data;
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
            // localStorage.setItem('seg1', JSON.stringify(this.seg_matrix))
            // localStorage.setItem('seg2', JSON.stringify(this.seg))
            // localStorage.setItem('seg3', JSON.stringify(this.seg.l_vector))
          } else if (file.name == "weights_1.csv") {
            //const w1 = this.list_row_data.join(',');
            console.log('weights_1', this.list_row_data)
            this.weigth_01 = this.list_row_data;

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
            // localStorage.setItem('weight1', JSON.stringify(this.weight_matrix))
            // localStorage.setItem('weight2', JSON.stringify( this.weight))
            // localStorage.setItem('weight3', JSON.stringify(this.weight.l_vector))
          }
        }
      }
    }
  }

  getAltsRecord(){
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
    //localStorage.setItem('alts', JSON.stringify(this.alts));
  }
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
export interface uploadFile {
  file: File[];
  //result: any;
  projectId: any;
}
