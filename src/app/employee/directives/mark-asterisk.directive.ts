import { Directive,OnInit,ElementRef,Renderer2,Input } from '@angular/core';
import {FormGroup} from '@angular/forms';

@Directive({
  selector: '[required]'
})
export class MarkAsteriskDirective implements OnInit{

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
