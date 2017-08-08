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
    var value:string;
    if (colorValue >= 91 && colorValue <= 100) {
      value = '#196F3D';
    } else if (colorValue >= 81 && colorValue <= 90) {
      value = '#1E8449';
    } else if (colorValue >= 71 && colorValue <= 80) {
      value = '#229954';
    } else if (colorValue >= 61 && colorValue <= 70) {
      value = '#27AE60';
    } else if (colorValue >= 51 && colorValue <= 60) {
      value = '#52BE80';
    } else if (colorValue >= 41 && colorValue <= 50) {
      value = '#7DCEA0';
    } else if (colorValue >= 31 && colorValue <= 40) {
      value = '#EC7063';
    } else if (colorValue >= 21 && colorValue <= 30) {
      value = '#E74C3C';
    } else if (colorValue >= 11 && colorValue <= 20) {
      value = '#CB4335';
    } else {
      value = '#B03A2E';
    }

    this.el.nativeElement.style.backgroundColor = value;
  }

}
