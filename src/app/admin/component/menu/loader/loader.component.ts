import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styles: [`
  #spinner {
	 -webkit-animation: frames 1s infinite linear;
	 animation: frames 1s infinite linear;
	 background: transparent;
	 border: 1.75vw solid #fff;
	 border-radius: 100%;
	 border-top-color: #df691a;
	 width: 20vw;
	 height: 20vw;
	 opacity: 0.6;
	 padding: 0;
	 position: absolute;
	 z-index: 999;
}
 @keyframes frames {
	 0% {
		 -webkit-transform: rotate(0deg);
		 transform: rotate(0deg);
	}
	 100% {
		 -webkit-transform: rotate(359deg);
		 transform: rotate(359deg);
	}
}
 #pause {
	 display: block;
	 background: rgba(0, 0, 0, 0.66) no-repeat 0 0;
	 width: 100%;
	 height: 100%;
	 position: fixed;
	 bottom: 0;
	 left: 0;
	 z-index: 1000;
}
  `
  ]
})
export class LoaderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
