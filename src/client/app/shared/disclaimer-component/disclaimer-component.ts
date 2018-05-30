import { Component, Input } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'bi-disclaimer-component',
  templateUrl: 'disclaimer-component.html',
  styleUrls: ['disclaimer-component.css']
})

export class DisclaimerComponent {
  @Input() note: string;
}
