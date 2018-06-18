import { Component, Input, Output, EventEmitter } from '@angular/core';
//import {CommonService} from "../";

@Component({
  moduleId: module.id,
  selector: 'bi-delete-confirmation-modal',
  templateUrl: 'delete-confirmation-modal.component.html',
  styleUrls: ['delete-confirmation-modal.component.css']
})

export class DeleteConfirmationModalComponent {

  @Input() elementType: string;
  @Output() deleteElementEvent = new EventEmitter<string>();


  constructor() {

  }

  deleteElement() {
    this.deleteElementEvent.emit(this.elementType);

  }

}
