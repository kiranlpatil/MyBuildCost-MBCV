import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SingleSelectList } from '../model/single-select-list';

@Component({
  moduleId: module.id,
  selector: 'cn-multi-select-list',
  templateUrl: 'multi-select-list.component.html',
  styleUrls: ['multi-select-list.component.css']
})

export class MultiSelectListComponent {
  @Input() checkBoxData:SingleSelectList;
  @Input() maxInput:string;
  @Output() selectedData = new EventEmitter<string>();

 private selectedOptions:string[]=new Array();

  constructor() {


  }
  selectOption(newVal:any) {debugger
    var option=newVal.target.value;

    if (newVal.target.checked) {debugger
      if ((this.selectedOptions.length < parseInt(this.maxInput)) && option !== undefined) {
        this.selectedOptions.push(option);
        this.selectedData.emit(option);
      }
      else {
        if(option !== undefined) {
          this.selectedData.emit('u can select max ');
          newVal.target.checked=false;
        }
        else
          console.log('in elsae else');
      }
    }
    else{debugger
      if(option !== undefined) {
       // this.selectedData.emit(option);
        for(let data of this.selectedOptions) {
          if(data===option) {
            this.selectedOptions.splice(this.selectedOptions.indexOf(data), 1);
          }
        }
      }
    }
  }
}
