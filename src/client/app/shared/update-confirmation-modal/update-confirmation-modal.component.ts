import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'bi-update-confirmation-modal',
  templateUrl: 'update-confirmation-modal.component.html',
  styleUrls: ['update-confirmation-modal.component.css']
})

export class UpdateConfirmationModalComponent {

  @Input() elementType: string;
  @Input() categoryId: string;
  @Input() workitem: string;
  @Input() workItemIndex ?: string;
  @Input() categoryIndex ?: string;
  @Input() total ?: number;
  @Output() updateTotalEvent = new EventEmitter<any>();
  @Output() updateElementEvent = new EventEmitter<any>();

  updateElement() {
    let workitemObj = {
      workitem : this.workitem,
      categoryId : this.categoryId,
      workItemIndex : this.workItemIndex,
      categoryIndex : this.categoryIndex
    };
    this.updateElementEvent.emit(workitemObj);
  }
  cancle() {
    let totalObj = {
      workitem: this.workitem,
      total: this.total
    };
    this.updateTotalEvent.emit(totalObj);
  }
}
