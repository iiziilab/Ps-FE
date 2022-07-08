import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [`
  .spantext{
    color: white;
    padding-left: 12px;
  }
  .link_icon{
    color: white;
    vertical-align:-7px;
  }
  .sidebar-drop{
    background-color: transparent!important;
    border: none;
  }
  .dropdown-submenu{
    background-color: transparent!important;
    border: none;
  }
  .css-claira {
    width: 16px;
    height: 16px;
    margin-left: 8px;
}
.css-xdiy5h {
  flex: 1 1 auto;
  min-width: 0px;
  margin-top: 0px;
  margin-bottom: 0px;
}
.dropable{
  display:flex;
}
.dropdown-item{
  height : 44px;
}
.dropdown-item:hover {
  text-align: inherit;
  text-decoration: none;
  white-space: nowrap;
  background-color:  rgba(161, 180, 171, 0.16)!important;
  outline: 0;
  border: 0;
  color: white!important;
  border-radius: 0;
  cursor: pointer!important;
  user-select: none;
  vertical-align: middle;
  appearance: none;
}
  `
  ]
})
export class SidebarComponent implements OnInit {

  @Input() msgFromParent1: boolean;
  
  constructor() { }

  ngOnInit(): void {
    this.isExpanded = true;
  }
  isExpanded : boolean;
}