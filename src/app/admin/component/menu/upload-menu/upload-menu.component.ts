import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Cell } from 'src/app/model/cell.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { PsolutionsService } from 'src/app/services/psolutions.service';
import * as XLSX from 'xlsx';
import { Alts } from '../../cell/calculation/Alt.model';
import { Calc } from '../../cell/calculation/Calc';
import { matrix, matrix1, matrix2, matrix3 } from '../../cell/calculation/matrix';
import { vector, vector1 } from '../../cell/calculation/vector';
import { CellListComponent } from '../../cell/cell-list/cell-list.component';

@Component({
  selector: 'app-upload-menu',
  templateUrl: './upload-menu.component.html',
  styles: [`
  .excelbtn{
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
}
  `
  ]
})
export class UploadMenuComponent implements OnInit {
  id:any;
  cid:any;
  modeltitleurl :string;
  modelform : FormGroup;
  save: boolean;
  edit: boolean;
  message: string;
  lmessage : string;
  show: boolean;
  lshow:boolean;
  listLink : string;
  projectid :any;
  upload : boolean;
  loading: boolean = false;
  pName: string;
  
  @ViewChild(CellListComponent) child: any;
  constructor(private services: PsolutionsService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService) {
    // this.route.params.subscribe(res => {
    //   this.id = res.id;//.substring(0,res.id.lastIndexOf('&'));//projectId
    //   //this.cid = res.id.substring(res.id.lastIndexOf('&')+1);
    // });
    if (this.authenticationService.currentUserValue) {//change clientInsert  to addmodelInsert
      this.upload = this.authenticationService.currentUserValue.rolePermission.upload;
    } 
  }

  async ngOnInit(): Promise<void> {
    this.listLink = "/admin/project/cell/"+this.id;
    this.modelform= this.formBuilder.group({
      pic: ['',Validators.required],
      mpic:['',Validators.required]
    })
    this.id = parseInt(localStorage._id);

    if(this.id){
      this.modeltitleurl = "";
      this.modeltitleurl = "/admin/project/uploadmenu/"+this.id;  // + '&' + this.cid;
      this.save = false;
      this.edit = true;
      //const res = await this.services.getCellByPid(this.id).toPromise();
      //this.modelform.setValue(res);
    }
    else if (this.id === undefined) {
      this.save = true;
      this.edit = false;
    }
    this.show = false;
    this.pName = localStorage.getItem('projectName');
  }

  get f() { return this.modelform.controls; }

  Menu:any=[];
  Cell:CellDTO[] = [];
  async onFileChange(evt: any) : Promise<void> {
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(evt.target);
    //check file is valid
    if (!this.validateFile(target.files[0].name)) {
      console.log('Selected file format is not supported');
      this.message = "Selected file format is not supported.";
      setTimeout(async () => {
        this.message = "";
      },1000);
      return;
    }
    const reader: FileReader = new FileReader();
    reader.onload = async (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});
      console.log(wb);
      /* grab all sheet */
      wb.SheetNames.forEach(async t=>{
        if(t != null){
          try {
            const model: Cell = {
              cellId: 0,//cid
              cellName: t,
              projectId: this.id//id
            };
            var res = await this.services.addCell(model).toPromise();
            if(res != null){
              this.Cell.push(res.data);
            }
          }
          catch (ex) {
            console.log(ex);
          }
        }
        const ws: XLSX.WorkSheet = wb.Sheets[t];
        /* save data */
        this.Menu.push(<any>(XLSX.utils.sheet_to_json(ws, {header: 1})));
      })
    };
    reader.readAsBinaryString(target.files[0]);
  }
menuresult : any;
async uploadfile(event : any) : Promise<void> {
  if(this.upload){
    //(event.target as HTMLButtonElement).disabled = true;
    this.show = true;
    var arr = [];
    for(let i = 0;i<this.Menu.length;i++){
      if(this.Menu[i][0].length == 1){
        let keys1 = ["ShortDescription"];
        let resArr1 = this.Menu[i].map((e:any) => {
        let obj1:any = {};
        keys1.forEach((key:any, i:any) => {
          obj1[key] = e[i];
        });
        return obj1;
        });
        console.log(160,resArr1)//this.id,this.Cell[i].cellId
        this.menuresult = await this.services.addMenu(this.id,this.Cell[i].cellId,resArr1).toPromise();
      }else{
        let keys =this.Menu[i].shift();
        let resArr = this.Menu[i].map((e:any) => {
        let obj:any = {};
        keys.forEach((key:any, i:any) => {
          obj[key] = e[i];
        });
        return obj;
        });
        arr.push(resArr);
        console.log(172,arr)
        this.menuresult = await this.services.addMenu(this.id,this.Cell[i].cellId,resArr).toPromise();
      }
    }

    if(this.menuresult.statusCode == 200){
        this.message = "Menu uploaded successfully";
        setTimeout(() => {
          this.message = "";
          this.Menu = [];
          this.authenticationService.Id$.next('okay');
          //this.router.navigate(['admin/project/cell/'+this.id]);
        },700);
      }
    }
    else{
      this.router.navigate(['noauthorize']);
    }
  }

  validateFile(name: String) {
    var ext = name.substring(name.lastIndexOf('.') + 1);
    if (ext.toLowerCase() == 'xlsx' || ext.toLowerCase() == 'xls' || ext.toLowerCase() == 'csv') {
      return true;
    }
    else {
      return false;
    }
  }

  async generateExcel() : Promise<void> {
    const arr = [
      [
        {notes: 'Include field used to include or remove an item from the project (1=true, 0=false)'},
        {notes: 'CategoryIndex used for sorting'},
        {notes: 'Category is the name of the category'},
        {notes: 'Consideration is the default value for consideration set (1=true, 0=false)'},
        {notes: 'Categories are not always in order'},
        {notes: 'There can be any number of cells in a project. If you need a limit, 20 should be the max.'},
        {notes: 'Description can be any text. It does not have to l…are used to see if data is being read correctly. '}
      ],
      [
        {ID: 1, Include: 0, Description: 'This is Item 1 in Cell 1 from Category 1', CategoryIndex: 1, Category: 'Category 1', Consideration:1},
        {ID: 2, Include: 0, Description: 'This is Item 2 in Cell 1 from Category 1', CategoryIndex: 1, Category: 'Category 1', Consideration:1},
        {ID: 3, Include: 0, Description: 'This is Item 3 in Cell 1 from Category 1', CategoryIndex: 1, Category: 'Category 1', Consideration:1},
        {ID: 4, Include: 0, Description: 'This is Item 4 in Cell 1 from Category 2', CategoryIndex: 2, Category: 'Category 2', Consideration:1},
        {ID: 5, Include: 0, Description: 'This is Item 5 in Cell 1 from Category 1', CategoryIndex: 1, Category: 'Category 1', Consideration:1},
        {ID: 6, Include: 0, Description: 'This is Item 6 in Cell 1 from Category 1', CategoryIndex: 1, Category: 'Category 1', Consideration:1},
        {ID: 7, Include: 0, Description: 'This is Item 7 in Cell 1 from Category 1', CategoryIndex: 1, Category: 'Category 1', Consideration:1},
        {ID: 8, Include: 0, Description: 'This is Item 8 in Cell 1 from Category 2', CategoryIndex: 2, Category: 'Category 2', Consideration:1},
        {ID: 9, Include: 0, Description: 'This is Item 9 in Cell 1 from Category 1', CategoryIndex: 1, Category: 'Category 1', Consideration:1},
        {ID: 10, Include: 0, Description: 'This is Item 10 in Cell 1 from Category 1', CategoryIndex: 1, Category: 'Category 1', Consideration:1},
        {ID: 11, Include: 0, Description: 'This is Item 11 in Cell 1 from Category 1', CategoryIndex: 1, Category: 'Category 1', Consideration:1},
        {ID: 12, Include: 0, Description: 'This is Item 12 in Cell 1 from Category 1', CategoryIndex: 1, Category: 'Category 1', Consideration:1},
        {ID: 13, Include: 0, Description: 'This is Item 13 in Cell 1 from Category 3', CategoryIndex: 3, Category: 'Category 3', Consideration:1},
        {ID: 14, Include: 0, Description: 'This is Item 14 in Cell 1 from Category 3', CategoryIndex: 3, Category: 'Category 3', Consideration:1},
        {ID: 15, Include: 0, Description: 'This is Item 15 in Cell 1 from Category 3', CategoryIndex: 3, Category: 'Category 3', Consideration:1},
        {ID: 16, Include: 0, Description: 'This is Item 16 in Cell 1 from Category 1', CategoryIndex: 1, Category: 'Category 1', Consideration:1},
        {ID: 17, Include: 0, Description: 'This is Item 17 in Cell 1 from Category 1', CategoryIndex: 1, Category: 'Category 1', Consideration:1},
        {ID: 18, Include: 0, Description: 'This is Item 18 in Cell 1 from Category 1', CategoryIndex: 1, Category: 'Category 1', Consideration:1},
        {ID: 19, Include: 0, Description: 'This is Item 19 in Cell 1 from Category 1', CategoryIndex: 1, Category: 'Category 1', Consideration:1},
        {ID: 20, Include: 0, Description: 'This is Item 20 in Cell 1 from Category 3', CategoryIndex: 3, Category: 'Category 3', Consideration:1},
        {ID: 21, Include: 0, Description: 'This is Item 21 in Cell 1 from Category 1', CategoryIndex: 1, Category: 'Category 1', Consideration:1}
      ],
      [
        {ID: 1, Include: 0, Description: 'This is Item 1 in Cell 2 from Category 1', CategoryIndex: 1, Category: 'Category 1', Consideration:1},
        {ID: 2, Include: 0, Description: 'This is Item 2 in Cell 2 from Category 1', CategoryIndex: 1, Category: 'Category 1', Consideration:1},
        {ID: 3, Include: 0, Description: 'This is Item 3 in Cell 2 from Category 1', CategoryIndex: 1, Category: 'Category 1', Consideration:1},
        {ID: 4, Include: 0, Description: 'This is Item 4 in Cell 2 from Category 1', CategoryIndex: 1, Category: 'Category 1', Consideration:1},
        {ID: 5, Include: 0, Description: 'This is Item 5 in Cell 2 from Category 1', CategoryIndex: 1, Category: 'Category 1', Consideration:1},
        {ID: 6, Include: 0, Description: 'This is Item 6 in Cell 2 from Category 1', CategoryIndex: 1, Category: 'Category 1', Consideration:1},
        {ID: 7, Include: 0, Description: 'This is Item 7 in Cell 2 from Category 1', CategoryIndex: 1, Category: 'Category 1', Consideration:1},
        {ID: 8, Include: 0, Description: 'This is Item 8 in Cell 2 from Category 1', CategoryIndex: 1, Category: 'Category 1', Consideration:1},
        {ID: 9, Include: 0, Description: 'This is Item 9 in Cell 2 from Category 1', CategoryIndex: 1, Category: 'Category 1', Consideration:1},
        {ID: 10, Include: 0, Description: 'This is Item 10 in Cell 2 from Category 1', CategoryIndex: 1, Category: 'Category 1', Consideration:1},
         {ID: 11, Include: 0, Description: 'This is Item 11 in Cell 2 from Category 1', CategoryIndex: 1, Category: 'Category 1', Consideration:1},
         {ID: 12, Include: 0, Description: 'This is Item 12 in Cell 2 from Category 1', CategoryIndex: 1, Category: 'Category 1', Consideration:1},
         {ID: 13, Include: 0, Description: 'This is Item 13 in Cell 2 from Category 1', CategoryIndex: 1, Category: 'Category 1', Consideration:1},
         {ID: 14, Include: 0, Description: 'This is Item 14 in Cell 2 from Category 1', CategoryIndex: 1, Category: 'Category 1', Consideration:1},
         {ID: 15, Include: 0, Description: 'This is Item 15 in Cell 2 from Category 1', CategoryIndex: 1, Category: 'Category 1', Consideration:1},
         {ID: 16, Include: 0, Description: 'This is Item 16 in Cell 2 from Category 1', CategoryIndex: 1, Category: 'Category 1', Consideration:1},
         {ID: 17, Include: 0, Description: 'This is Item 17 in Cell 2 from Category 1', CategoryIndex: 1, Category: 'Category 1', Consideration:1},
         {ID: 18, Include: 0, Description: 'This is Item 18 in Cell 2 from Category 1', CategoryIndex: 1, Category: 'Category 1', Consideration:1},
         {ID: 19, Include: 0, Description: 'This is Item 19 in Cell 2 from Category 1', CategoryIndex: 1, Category: 'Category 1', Consideration:1},
         {ID: 20, Include: 0, Description: 'This is Item 20 in Cell 2 from Category 1', CategoryIndex: 1, Category: 'Category 1', Consideration:1},
         {ID: 21, Include: 0, Description: 'This is Item 21 in Cell 2 from Category 1', CategoryIndex: 1, Category: 'Category 1', Consideration:1},
         {ID: 22, Include: 0, Description: 'This is Item 22 in Cell 2 from Category 1', CategoryIndex: 1, Category: 'Category 1', Consideration:1},
         {ID: 23, Include: 0, Description: 'This is Item 23 in Cell 2 from Category 1', CategoryIndex: 1, Category: 'Category 1', Consideration:1},
         {ID: 24, Include: 0, Description: 'This is Item 24 in Cell 2 from Category 1', CategoryIndex: 1, Category: 'Category 1', Consideration:1},
         {ID: 25, Include: 0, Description: 'This is Item 25 in Cell 2 from Category 1', CategoryIndex: 1, Category: 'Category 1', Consideration:1},
         {ID: 26, Include: 0, Description: 'This is Item 26 in Cell 2 from Category 1', CategoryIndex: 1, Category: 'Category 1', Consideration:1},
         {ID: 27, Include: 0, Description: 'This is Item 27 in Cell 2 from Category 1', CategoryIndex: 1, Category: 'Category 1', Consideration:1},
         {ID: 28, Include: 0, Description: 'This is Item 28 in Cell 2 from Category 1', CategoryIndex: 1, Category: 'Category 1', Consideration:1}
      ],
      [
        {ID: 1, Include: 0, Description: 'This is Item 1 in Cell 3 from Category 2', CategoryIndex: 2, Category: 'Category 2', Consideration:1},
        {ID: 2, Include: 0, Description: 'This is Item 2 in Cell 3 from Category 2', CategoryIndex: 2, Category: 'Category 2', Consideration:1},
        {ID: 3, Include: 0, Description: 'This is Item 3 in Cell 3 from Category 2', CategoryIndex: 2, Category: 'Category 2', Consideration:1},
        {ID: 4, Include: 0, Description: 'This is Item 4 in Cell 3 from Category 1', CategoryIndex: 1, Category: 'Category 1', Consideration:1},
        {ID: 5, Include: 0, Description: 'This is Item 5 in Cell 3 from Category 1', CategoryIndex: 1, Category: 'Category 1', Consideration:1},
        {ID: 6, Include: 0, Description: 'This is Item 6 in Cell 3 from Category 1', CategoryIndex: 1, Category: 'Category 1', Consideration:1},
        {ID: 7, Include: 0, Description: 'This is Item 7 in Cell 3 from Category 1', CategoryIndex: 1, Category: 'Category 1', Consideration:1},
        {ID: 8, Include: 0, Description: 'This is Item 8 in Cell 3 from Category 1', CategoryIndex: 1, Category: 'Category 1', Consideration:1},
        {ID: 9, Include: 0, Description: 'This is Item 9 in Cell 3 from Category 1', CategoryIndex: 1, Category: 'Category 1', Consideration:1},
        {ID: 10, Include: 0, Description: 'This is Item 10 in Cell 3 from Category 1', CategoryIndex: 1, Category: 'Category 1', Consideration:1},
        {ID: 11, Include: 0, Description: 'This is Item 11 in Cell 3 from Category 1', CategoryIndex: 1, Category: 'Category 1', Consideration:1},
        {ID: 12, Include: 0, Description: 'This is Item 12 in Cell 3 from Category 1', CategoryIndex: 1, Category: 'Category 1', Consideration:1}
      ]
    ];
    const fileName = "alts_1.xlsx";
    const sheetName = ["Notes", "cell 1", "cell 2","cell 3"];
    
    let wb = XLSX.utils.book_new();
    for (var i = 0; i < sheetName.length; i++) {
      let ws = XLSX.utils.json_to_sheet(arr[i]);
      XLSX.utils.book_append_sheet(wb, ws, sheetName[i]);
    }
    XLSX.writeFile(wb, fileName);
  }

  public onChange = async (e: any) => {
    const files = e.target.files;
    if (files.length === 0) {
      return;
    }
    let filesToUpload: File[] = files;
    this.fileReaded = files;
    this.loading = true;
    await this.csv2Array(files);
  }
  
  async uploadMfile(e:any):Promise<void>{
    this.loading = true;
    this.lshow = true;
    var res = [];
    if(this.alts.length > 0 && this.data_matrix.rowCount != 0 && this.weight.VectorLength != 0 && this.seg.VectorLength != 0){
      let c = new Calc(this.alts, this.data_matrix, this.vol_matrix, this.weight, this.seg, this.seg_index, 500, 130);
      res = c.CalculateParallel(5, true);
    }
    this.alts = [];
    const formData = new FormData();
    Array.from(this.fileReaded).map((file, index) => {
      return formData.append('file' + index, file, file.name);
    });
    formData.append('file',JSON.stringify(this.fileReaded));
    formData.append('projectId',this.id);
    formData.append('result',JSON.stringify(res));
    await this.services.postCsv(formData).subscribe(data => {
      console.log(data);
      this.lmessage = "file uploaded successfully";
      this.loading = false;
     }, error => {
       console.log(error);
     });
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
  weight_matrix: matrix3 = new matrix3(0, 0, 0);
  seg_index: number = 1;

  async csv2Array(files: FileList) : Promise<void> {
    let max_cols: number = 201;
    let num_rows: number = 0;

    if (files && files.length > 0) {
      for (let p = 0; p < files.length; p++) {
        let file: File = files.item(p);

        let reader: FileReader = new FileReader();
        reader.readAsText(file);

        reader.onload = (e) => {
          let csv1: string = reader.result as string;
          let allTextLines = csv1.split(/\r|\n|\r/);
          let headers = allTextLines[0].split(',');
          let lines = [];
          for (let i = 0; i < allTextLines.length; i++) {
            // split content based on comma
            let data = allTextLines[i].split(',');
            if (data.length === headers.length) {
              let tarr = [];
              if (file.name == "alts_1.csv") {
                for (let j = 0; j < headers.length; j++) {
                  tarr.push(data[j]);
                }
              } else if (file.name == "data_1.csv") {
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
          if (file.name == "alts_1.csv") {
            this.count_alts = 0;
            for (let i = 1; i <= this.rlines.length; i++) {
              var a: Alts = new Alts();
              a.Id = this.rlines[i - 1][0];
              a.Include = this.rlines[i - 1][1] == "1" ? true : false;
              a.ShortDescription = this.rlines[i - 1][2];
              a.LongDescription = this.rlines[i - 1][3];
              a.CategoryIndex = this.rlines[i - 1][4];
              a.Category = this.rlines[i - 1][5];
              a.ID_Model = this.rlines[i - 1][6];
              a.Parm = this.rlines[i - 1][7];
              a.Parm = this.rlines[i - 1][9];
              a.Consideration_Set = this.rlines[i - 1][10] == "1" ? true : false;
              a.Default_Consideration_Set = a.Consideration_Set;
              a.Forced_In = false;
              if (a.Include) {
                this.count_alts += 1;
                this.alts.push(a);
              } 
            }
          } else if (file.name == "data_1.csv") {
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
          } else if (file.name == "seg_1.csv") {
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
          } else if (file.name == "weights_1.csv") {
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
        }
      }
    }
  }
}
export interface CellDTO{
  cellId: any;
  cellName: string;
  projectId: any
}
export interface uploadFile{
  file:File[];
  //result: any;
  projectId: any;
}