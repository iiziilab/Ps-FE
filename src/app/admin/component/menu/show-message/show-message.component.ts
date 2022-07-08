import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-show-message',
  templateUrl: './show-message.component.html',
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
export class ShowMessageComponent implements OnInit {

  title : string;
  forceditem : number;
  considerationsetitem : number;
  constructor(private dialogref : MatDialogRef<ShowMessageComponent>,
    @Inject(MAT_DIALOG_DATA) public data : any) { 
      this.title = "Turf";
    }

  ngOnInit(): void {
      this.forceditem = this.data.forceditem;
      this.considerationsetitem =  this.data.considerationsetitem;
  }

  async ok() : Promise<void>{
    this.dialogref.close();
  }

  cancel() {
    this.dialogref.close();
  }
}
