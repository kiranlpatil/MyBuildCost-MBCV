import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'bi-update-confirmation-modal',
  templateUrl: 'update-confirmation-modal.component.html',
  styleUrls: ['update-confirmation-modal.component.css']
})

export class UpdateConfirmationModalComponent {

  @Input() elementType: string;
  @Output() updateElementEvent = new EventEmitter<string>();

  constructor() {

  }

  updateElement() {
    this.updateElementEvent.emit(this.elementType);
  }
}
