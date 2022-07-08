import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styles: [
  ]
})
export class LayoutComponent implements OnInit {

  @Output() msgTolayout = new EventEmitter<any>();
  @Input() images : any;
  //images : any;
  constructor() { }

  ngOnInit(): void {
    
  }

  onActivate(){
    window.scroll(0,0);
  }

  // fwdMsgToSib2($event:any) { 
  //   this.images = $event;
  //   console.log("Raju ban gaya gentleman");
    
  //   console.log(this.images);
  // }

  toggle:boolean=false;
  msgToSib() { 
    this.msgTolayout.emit(this.images)
    console.log(this.images);
  }

  togglemenuclick(){
    this.toggle = !this.toggle;
  }
}
