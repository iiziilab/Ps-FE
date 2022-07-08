import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styles: [
    `

    .footer-content{
      padding-top: 0.45rem;
      padding-bottom: 0.55rem;
      height: 2rem;
      right: 0;
      left: 0;
      width: 100%;
      justify-content: center;
      padding-left: var(--main-spacing-horizontal);
      padding-right: var(--main-spacing-horizontal);
      border-top-right-radius: 0;
      border-top-left-radius: 0;
      background-color: #d2d2d2;
      position: fixed;
      bottom: 0;
    }
    `
  ]
})
export class FooterComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
