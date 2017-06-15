import { Component, Input } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'cn-tool-tip',
  templateUrl: 'tool-tip-component.html',
  styleUrls: ['tool-tip-component.css']
})

export class TooltipComponent {
  @Input() message: string;
}
