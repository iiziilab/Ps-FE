import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PsolutionsService } from 'src/app/services/psolutions.service';

@Component({
  selector: 'app-quicknoofitem',
  templateUrl: './quicknoofitem.component.html',
  styleUrls: ['./quicknoofitem.component.css']
})
export class QuicknoofitemComponent implements OnInit {

  title : string;
  form : FormGroup;
  forceditem : number;
  considerationsetitem : number;
  constructor(private formbuilder : FormBuilder,
    private services : PsolutionsService,
    private dialogref : MatDialogRef<QuicknoofitemComponent>,
    @Inject(MAT_DIALOG_DATA) public data : any) { 
      this.title = "Items";
    }

  ngOnInit(): void {
    this.forceditem = this.data.forceditem;
    this.considerationsetitem =  this.data.considerationsetitem;
    this.form = this.formbuilder.group({
      numberchosen : [6, [Validators.required,Validators.min(1), Validators.max(30)]],
    });
  }

  get f() { return this.form.controls; }

  async ok() : Promise<void>{
    // if((this.considerationsetitem + this.forceditem) < Number(this.f.numberchosen.value)){
    //   this.f.numberchosen.setValue(this.considerationsetitem + this.forceditem);
    // }else{
    //   if(this.considerationsetitem > Number(this.f.numberchosen.value)){
    //     this.f.numberchosen.setValue(this.f.numberchosen.value);
    //   }else if(this.considerationsetitem < Number(this.f.numberchosen.value)){
    //     this.f.numberchosen.setValue(this.considerationsetitem);
    //   }
    //}
    this.dialogref.close(this.form.value);
  }

  cancel() {
    this.dialogref.close();
  }

}
