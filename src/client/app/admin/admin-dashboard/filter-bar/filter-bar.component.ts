import {Component, Input, Output, EventEmitter} from "@angular/core";

@Component({
  moduleId: module.id,
  selector: 'cn-filter-bar',
  templateUrl: 'filter-bar.component.html',
  styleUrls: ['filter-bar.component.css']
})

export class FilterBarComponent {
  @Output() onItemSelect = new EventEmitter();
  public filterData: string[] = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q",
    "r", "s", "t", "u", "v", "w", "x", "y", "z"]

  onFilterSelect(item: any,event:any) {
    if(document.getElementsByClassName('select-filter-bar-item').length){
      document.getElementsByClassName('select-filter-bar-item')[0].className = '';
    }
    document.getElementById("button"+item).className = 'select-filter-bar-item';
    this.onItemSelect.emit(item);
  }

}
