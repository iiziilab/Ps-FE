import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PsolutionsService } from 'src/app/services/psolutions.service';

@Component({
  selector: 'app-noofitem',
  templateUrl: './noofitem.component.html',
  styles: [`
  .close-button{
    float: right;
    top:-24px;
    right:-24px;
    wdith: 40px;
    position: absolute;
    display: inline-flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    position: relative;
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
    background-color: transparent;
    outline: 0px;
    border: 0px;
    margin: 0px;
    cursor: pointer;
    user-select: none;
    vertical-align: middle;
    appearance: none;
    text-decoration: none;
    text-align: center;
    flex: 0 0 auto;
    font-size: 1.5rem;
    padding: 8px;
    border-radius: 50%;
    overflow: visible;
    transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  }`
  ]
})
export class NoofitemComponent implements OnInit {

  title : string;
  form : FormGroup;
  forceditem : number;
  considerationsetitem : number;
  constructor(private formbuilder : FormBuilder,
    private services : PsolutionsService,
    private dialogref : MatDialogRef<NoofitemComponent>,
    @Inject(MAT_DIALOG_DATA) public data : any) { 
      this.title = "Items";
    }

  ngOnInit(): void {
    this.forceditem = this.data.forceditem;
    this.considerationsetitem =  this.data.considerationsetitem;
    this.form = this.formbuilder.group({
      numberchosen : ['5', [Validators.required,Validators.min(1), Validators.max(8)]],
    });
  }

  get f() { return this.form.controls; }

  async ok() : Promise<void>{
    if((this.considerationsetitem + this.forceditem) < Number(this.f.numberchosen.value)){
      this.f.numberchosen.setValue(this.considerationsetitem + this.forceditem);
    }else{
      if(this.considerationsetitem > Number(this.f.numberchosen.value)){
        this.f.numberchosen.setValue(this.f.numberchosen.value);
      }else if(this.considerationsetitem < Number(this.f.numberchosen.value)){
        this.f.numberchosen.setValue(this.considerationsetitem);
      }
    }
    this.dialogref.close(this.form.value);
  }

  cancel() {
    this.dialogref.close();
  }

  // async addNumberChosenDialog(i: number): Promise<void> {
  //   const dialogConfig = new MatDialogConfig();
  //   dialogConfig.disableClose = true;
  //   dialogConfig.autoFocus = true;
  //   dialogConfig.width = '380px';
  //   dialogConfig.height = '280px';

  //   const dialogRef = this.dialog.open(NoofitemComponent, dialogConfig);
  //   dialogRef.afterClosed().subscribe(
  //     data => {
  //       this.numberchosen = data.numberchosen;
  //     }
  //   );
  // }
}
