import { Directive,OnInit,ElementRef,Renderer2,Input } from '@angular/core';
 import {FormGroup} from '@angular/forms';
@Directive({
  selector: '[required]'
})
export class MarkAsteriskDirective implements OnInit{
 
  // constructor(
  //   private renderer: Renderer2, 
  //   private el: ElementRef
  //   ) {}

  //   ngOnInit(){
  //     const parent = this.renderer.parentNode(this.el.nativeElement);
  //     if (parent.getElementsByTagName('LABEL').length && !parent.getElementsByClassName('required-asterisk').length) {
  //       parent.getElementsByTagName('LABEL')[0].innerHTML += '<span class="required-asterisk">*</span>';
  //     }
  //   }
  @Input() formGroup: FormGroup;
  @Input() controlName: string;

  constructor(private elementRef: ElementRef) {
  }

  ngOnInit(): void {
    const isRequired = this.formGroup.controls[this.controlName]?.errors?.required;
    if (isRequired) {
      this.elementRef.nativeElement.innerHTML = '*';
    }else{
      this.elementRef.nativeElement.innerHTML = '';
    }
  }
}
