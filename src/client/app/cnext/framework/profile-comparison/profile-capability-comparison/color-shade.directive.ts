import {Directive, ElementRef, Input, OnChanges} from "@angular/core";


@Directive(
  {
    selector: '[ColorShade]',
  }
)

export class ColorShadeDirective implements OnChanges {
  @Input('ColorShade') eLBackgroundColor: number;

  constructor(private el: ElementRef) {
  }

  ngOnChanges(changes: any) {
    if (changes.eLBackgroundColor.currentValue != undefined) {
      this._changeBackGround(this.eLBackgroundColor);
    }
  }

  _changeBackGround(colorValue: number) {
    var value: string;
    if (colorValue >= 0 && colorValue <= 25) {
      value = '#fe3d01';
    } else if (colorValue >= 26 && colorValue <= 50) {
      value = '#7ba015';
    }
    else if (colorValue >= 51 && colorValue <= 75) {
      value = '#538216';
    }
    else if (colorValue >= 76 && colorValue <= 100) {
      value = '#33691e';
    }
    this.el.nativeElement.style.backgroundColor = value;
  }

}
