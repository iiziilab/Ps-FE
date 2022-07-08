import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-menu',
  templateUrl: './delete-menu.component.html',
  styles: [
  ]
})
export class DeleteMenuComponent implements OnInit {

  title: string;

  constructor(private formbuilder: FormBuilder,
    private dialogref: MatDialogRef<DeleteMenuComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.title = "Delete Project";
  }

  ngOnInit(): void {
  }

  no(): void {
    this.dialogref.close('no');
  }

  yes(): void {
    this.dialogref.close('yes');
  }
}
