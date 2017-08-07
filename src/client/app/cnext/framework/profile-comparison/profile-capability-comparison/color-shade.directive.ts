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
    /*var value: string;
    var r:number=0;
    var g:number=0;
    var b:number=0;
    if (colorValue >= 0 && colorValue <= 25) {
      //value = '#fe3d01';
      r = 100-colorValue;
    } else {
      g = 100-colorValue;
    } *//*else if (colorValue >= 26 && colorValue <= 50) {
      //value = '#7ba015';
      g=colorValue;
    }
    else if (colorValue >= 51 && colorValue <= 75) {
      //value = '#538216';
      g=colorValue
    }
    else if (colorValue >= 76 && colorValue <= 100) {
      value = '#33691e';
    }*/

    //var rgb = this.getColorForPercentage(15);
    var r = Math.floor((255 * (100-colorValue)) / 100);
    var g = Math.floor((255 * 100) / 100);
    var b = 0;
    this.el.nativeElement.style.backgroundColor = 'rgb('+r+","+g+","+b+')';
  }



  getColorForPercentage (pct:any) {
    var percentColors = [
      { pct: 0.0, color: { r: 0xff, g: 0x00, b: 0 } },
      { pct: 0.5, color: { r: 0xff, g: 0xff, b: 0 } },
      { pct: 1.0, color: { r: 0x00, g: 0xff, b: 0 } } ];
  for (var i = 1; i < percentColors.length - 1; i++) {
    if (pct < percentColors[i].pct) {
      break;
    }
  }
  var lower = percentColors[i - 1];
  var upper = percentColors[i];
  var range = upper.pct - lower.pct;
  var rangePct = (pct - lower.pct) / range;
  var pctLower = 1 - rangePct;
  var pctUpper = rangePct;
  var color = {
    r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
    g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
    b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
  };
  return 'rgb(' + [color.r, color.g, color.b].join(',') + ')';
  // or output as hex if preferred
}


}
