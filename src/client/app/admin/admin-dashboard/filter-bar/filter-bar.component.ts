import {Component, Input, Output, EventEmitter} from "@angular/core";

@Component({
  moduleId: module.id,
  selector: 'cn-filter-bar',
  templateUrl: 'filter-bar.component.html',
  styleUrls: ['filter-bar.component.css']
})

export class FilterBarComponent {
  @Input() filterData: string[];
  @Output() onItemSelect = new EventEmitter();


  onFilterSelect(item: any) {
    this.onItemSelect.emit(item);
  }

}
