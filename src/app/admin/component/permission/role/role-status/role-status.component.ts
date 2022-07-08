import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';

@Component({
  selector: 'app-role-status',
  templateUrl: './role-status.component.html',
  styles: [`
  .close-button{
    float: right;
    top:-24px;
    right:-24px;
    wdith: 40;
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
  }
  .mat-raised-button{
    min-width: 78px!important;
  }`
  ]
})
export class RoleStatusComponent implements OnInit {

  title: string;

  constructor(private formbuilder: FormBuilder,
    private dialogref: MatDialogRef<RoleStatusComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.title = "Change Status";
  }

  ngOnInit(): void {
  }

  Inactive(): void {
    this.dialogref.close('Inactive');
  }

  Active(): void {
    this.dialogref.close('Active');
  }
}
