import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PsolutionsService } from 'src/app/services/psolutions.service';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styles: [
    `.btn-back{
      border: 1px solid;
      background: transparent;
      color: #e23952;
      float: right;
  }
  i.fa.fa-arrow-left {
    font-size: 17px;
  }`
  ]
})
export class BreadcrumbComponent implements OnInit {

  constructor(private services: PsolutionsService,
    private router: Router,
    private route: ActivatedRoute) {
    this.route.params.subscribe(res => {
      this.id = res.id;
    })
  }
  
  id: any;
  cellId: any;
  pName: string;
  cellName: string;
  listLink: string;
  modeltitleurl: string;
  async ngOnInit():  Promise<void>  {
   var project = await this.services.getCellByid(this.id).toPromise();
   this.cellId = project.cellId;
   this.listLink = "/admin/project/cell/" + project.projectId;
   this.modeltitleurl = "/admin/project/cell/optimized/" + this.cellId;
   this.pName = localStorage.getItem('projectName');
   this.cellName = project.cellName;
  }

  goBackCell(){
    this.router.navigate(['admin/project/cell/view/' + this.cellId]);
  }
  //this.router.navigate(['admin/project/cell/view/' + this.selectedCell]);
}
