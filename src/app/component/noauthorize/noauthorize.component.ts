import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-noauthorize',
  template: `<div id="root" class="h-100">
    <div class="fixed-background"></div>
    <div class="container-fluid p-0 h-100 position-relative">
    <div class="row g-0 h-100">
    <div class="offset-0 col-12 d-none d-lg-flex offset-md-1 col-lg h-lg-100">
    <div class="min-h-100 d-flex align-items-center">
    <div class="w-100 w-lg-75 w-xxl-50">
        <div>
            <div class="mb-5">
                <h1 class="display-3 text-white">Not Authorized</h1>
            </div>
        </div>
    </div>
    </div>
    </div>
    <div class="col-12 col-lg-auto h-100 pb-4 px-4 pt-0 p-lg-0">
    <div class="sw-lg-80 min-h-100 bg-foreground d-flex justify-content-center align-items-center shadow-deep py-5 full-page-content-right-border">
    <div class="sw-lg-60 px-5">
    <div class="sh-11">
    <a href="#">
        <span style="font-size:30px;">
        Precipio Solution
        </span>
    </a>
    </div>
    <div class="mb-5">
    <h2 class="cta-1 mb-0 text-primary">Ooops, you are not authorized to access this page!</h2>
    <h2 class="display-2 text-primary">Unauthorized 401</h2>
    </div>
    <div class="mb-5">
    <p class="h6">If you have any query or doubt regarding this,</p>
    <p class="h6">please contact the administrator.
    </p>
    </div>
    <div>
    <a routerLink="/login" class="btn btn-icon btn-icon-start btn-primary">
    <i data-cs-icon="arrow-left"></i>
    <span>Back to Dashboard</span>
    </a>
    </div>
    </div>
    </div>
    </div>
    </div>
    </div>
  </div>`,
  styles: [
    `
    `
  ]
})
export class NoauthorizeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}