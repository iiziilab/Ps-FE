import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-permission',
  templateUrl: './delete-permission.component.html',
  styles: [
  ]
})
export class DeletePermissionComponent implements OnInit {

  title: string;

  constructor(private formbuilder: FormBuilder,
    private dialogref: MatDialogRef<DeletePermissionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.title = "Delete User Permission";
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
