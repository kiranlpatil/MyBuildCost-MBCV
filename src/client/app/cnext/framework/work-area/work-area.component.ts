import {Component, EventEmitter, Output, Input} from "@angular/core";
import {Role} from "../model/role";
import {Section} from "../model/candidate";

@Component({
  moduleId: module.id,
  selector: 'cn-work-area',
  templateUrl: 'work-area.component.html',
  styleUrls: ['work-area.component.css']
})

export class WorkAreaComponent {
  @Input() roles:Role[] = new Array(0);
  @Input() selectedRoles:Role[] = new Array(0);
  @Input() highlightedSection :Section;
  @Output() onComplete = new EventEmitter();

  //private compactView:boolean = true;
  private disableButton:boolean = true;

  // ngOnChanges(changes:any) {
  //   if (this.selectedRoles !== undefined && this.selectedRoles.length > 0) {
  //     this.compactView = false;
  //   }
  //   else{
  //     this.compactView =true;
  //   }
  // }

  selectOption(role:Role,event:any) {
    if (event.target.checked) {
      this.disableButton=false;
      if (this.selectedRoles.length < 3) {
        this.selectedRoles.push(role);
      } else {
          event.target.checked = false;
      }
    } else {
        for (let data of this.selectedRoles) {
          if (data.name === role.name) {
            this.selectedRoles.splice(this.selectedRoles.indexOf(data), 1);
          }
      }
      if(this.selectedRoles.length===0){
        this.disableButton=true
      }
    }
  }

  onNext() {
//    this.compactView=false;
    this.highlightedSection.name = "Capabilities";
    this.onComplete.emit(this.selectedRoles);
  }

  isSelected(value:string) {
    return this.selectedRoles.filter(function (el:Role) {
        return el.name == value;
      }).length != 0;
  }

}
