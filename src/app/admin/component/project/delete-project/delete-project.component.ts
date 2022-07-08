import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-project',
  templateUrl: './delete-project.component.html',
  styles: [
  ]
})
export class DeleteProjectComponent implements OnInit {

  title: string;

  constructor(private formbuilder: FormBuilder,
    private dialogref: MatDialogRef<DeleteProjectComponent>,
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
