import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[amountValidate]'
})
export class AmountValidationDirective {
  @Input() amountValidate: boolean;
  constructor(private el: ElementRef) { }
  @HostListener('keydown', ['$event']) onKeyDown(event:any) {
    let e = <KeyboardEvent> event;
    if (this.amountValidate) {
      if(e.keyCode===190 &&event.target.value.toString().indexOf('.')>-1 ) {
        event.preventDefault();
      }
      if(e.keyCode===189 &&event.target.value.toString().indexOf('-')>-1 ) {
        event.preventDefault();
      }
    }
  }
}
