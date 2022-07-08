import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { PsolutionsService } from 'src/app/services/psolutions.service';
import { Alts } from '../../cell/calculation/Alt.model';
import { Calc } from '../../cell/calculation/Calc';
import { matrix, matrix1, matrix2, matrix3 } from '../../cell/calculation/matrix';
import { vector, vector1 } from '../../cell/calculation/vector';

@Component({
  selector: 'app-demo-upload',
  templateUrl: './demo-upload.component.html',
  styles: [
  ]
})
export class DemoUploadComponent implements OnInit {

  constructor(private services: PsolutionsService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService) {
    this.route.params.subscribe(res => {
      this.id = res.id;
    });
  }

  id: any;
  cid: any;
  modeltitleurl: string;
  modelform: FormGroup;
  save: boolean;
  edit: boolean;
  message: string;
  show: boolean;
  listLink: string;
  projectid: any;
  upload: boolean;
  csvPath: string;
  csv: any;
  fileToUpload: any;
  parsedCsv: string[][];
  csvContent: string;

  async ngOnInit(): Promise<void> {
    this.listLink = "/admin/project/cell/" + this.id;
    this.modelform = this.formBuilder.group({
      pic: ['', Validators.required]
    })
    if (this.id) {
      this.modeltitleurl = "";
      this.modeltitleurl = "/admin/project/uploadmenu/" + this.id;// + '&' + this.cid;
      this.save = false;
      this.edit = true;
    }
    else if (this.id === undefined) {
      this.save = true;
      this.edit = false;
    }
    this.show = false;
  }

  async uploadFile(): Promise<void> {
    const formModel = this.prepareSave();
    await this.services.postCsv(formModel).subscribe(data => {
      console.log(data);
    }, error => {
      console.log(error);
    });
  }
  private prepareSave(): any {
    let input = new FormData();
    input.append('file', this.modelform.get('pic').value);
    return input;
  }

  public onFileChange = async (e: any) => {
    const files = e.target.files;
    if (files.length === 0) {
      return;
    }
    let filesToUpload: File[] = files;
    const formData = new FormData();
    Array.from(filesToUpload).map((file, index) => {
      return formData.append('file' + index, file, file.name);
    });
    this.csv2Array(files);
    //this.changeListener(e);
    // await this.services.postCsv(formData).subscribe(data => {
    //   console.log(data);
    //  }, error => {
    //    console.log(error);
    //  });

  }
  fileReaded: any;
  alts: Alts[] = [];
  count_alts: number = 0;
  num_rows: number;
  irow: number = 0;
  list_row_data: any[] = [];
  rlines: any[][];
  rkeys: any;

  csv2Array(files: FileList) {
    let max_cols: number = 201
    let num_rows: number = 0

    let data_matrix: matrix = new matrix(0, 0, 0);
    let vol_matrix: matrix1 = new matrix1(0, 0, 0);
    let seg = new vector(0, 0);
    let weight = new vector1(0, 0);
    let seg_matrix: matrix2 = new matrix2(0, 0, 0);
    let weight_matrix: matrix3 = new matrix3(0, 0, 0);
    let seg_index: number = 1
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
            data_matrix = data;
            vol_matrix = vol;
            if (this.alts != null && weight != null && seg != null) {
              let c = new Calc(this.alts, data_matrix, vol_matrix, weight, seg, seg_index, 500, 130);
              var res = [];
              res = c.CalculateParallel(5, true);
            }
            //return data;
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
            seg_matrix = data;
            seg = new vector(data.rowCount, 0);
            seg.l_vector = seg_matrix.Column;
            if (this.alts != null && data_matrix != null && weight != null) {
              let c = new Calc(this.alts, data_matrix, vol_matrix, weight, seg, seg_index, 500, 130);
              var res = [];
              res = c.CalculateParallel(5, true);
            }
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
            weight_matrix = data;
            weight = new vector1(data.rowCount, 0);
            weight.l_vector = weight_matrix.Column;
            if (this.alts != null && data_matrix != null && seg != null) {
              let c = new Calc(this.alts, data_matrix, vol_matrix, weight, seg, seg_index, 500, 130);
              var res = [];
              res = c.CalculateParallel(5, true);
            }
          }
        }
      }
    }
  }
}
