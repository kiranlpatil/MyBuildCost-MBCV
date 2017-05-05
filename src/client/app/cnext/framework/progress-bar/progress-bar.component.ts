import { Component, ElementRef, Input,ViewChild  } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'cn-progress-bar',
  template: '<canvas #canvas></canvas>',
  styleUrls: ['progress-bar.component.css']
})

export class ProgressBarComponent {
  @ViewChild('canvas') canvasRef:ElementRef;
  @Input() value : number;
  @Input() color : string;
  @Input() rotation : boolean = false;
  private canvas: HTMLCanvasElement;
  private ctx : CanvasRenderingContext2D;
  private imd:any = null;

  ngOnChanges(changes: any) {
    this.canvas = this.canvasRef.nativeElement;
    this.canvas.width = 110;
    this.canvas.height = 110;
    if (this.canvas.getContext) {
      this.ctx = this.canvas.getContext('2d');
      this.ctx.clearRect(0, 0,this.canvas.width,this.canvas.height);
      this.ctx.beginPath();
    }
    this.ctx.lineWidth = 2.0;
    if (this.rotation && this.value != 100){
      this.ctx.strokeStyle = '#e8e8e8';
    }
    else {
      this.ctx.strokeStyle = this.color;
    }
    this.ctx.lineCap = 'round';
    this.ctx.closePath();
    this.ctx.fill();
    this.imd = this.ctx.getImageData(0, 0, 110, 110);
    this.ctx.putImageData(this.imd, 0, 0);
    this.ctx.arc(55, 55, 50, -( Math.PI / 2), ((Math.PI * 2) * (this.value / 100) ) - ( Math.PI / 2), this.rotation);
    this.ctx.stroke();
  }
}
