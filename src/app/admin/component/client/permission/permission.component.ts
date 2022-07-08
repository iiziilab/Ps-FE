import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { PsolutionsService } from 'src/app/services/psolutions.service';

@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styles: [ `
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
export class PermissionComponent implements OnInit {

  title: string;
  form : FormGroup;
  constructor(private fb : FormBuilder,private services : PsolutionsService,
    private dialogref: MatDialogRef<PermissionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.title = "Employee Permission";
  }

  async ngOnInit(): Promise<void> {
    this.form = this.fb.group({
      id : this.data.id,
      changePassword : [false],
      editProject : [false],
      viewProject :[true]
    });
    if(this.data.eid){
      this.form.controls.id.setValue(this.data.eid);
      const res = await this.services.getEmployeeByid(this.data.eid).toPromise();
      this.form.controls.changePassword.setValue(res.changePassword);
      this.form.controls.editProject.setValue(res.editProject);
      this.form.controls.viewProject.setValue(res.viewProject);
    }
  }

  Inactive(): void {
    this.dialogref.close('Inactive');
  }

  Active(): void {
    this.dialogref.close('Active');
  }

  async create() : Promise<void>{
    if(this.data.eid){
      const result = await this.services.updateEmployeePermission(this.form.value).toPromise();
      if(result.statusCode == 200){
        console.log(result)
      }
    }
    this.dialogref.close(this.form.value);
  }

  cancel() {
    this.dialogref.close();
  }
}