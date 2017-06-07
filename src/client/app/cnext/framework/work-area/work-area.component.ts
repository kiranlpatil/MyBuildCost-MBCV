import {Component, EventEmitter, Output, Input} from "@angular/core";
import {Role} from "../model/role";
import {Section} from "../model/candidate";
import {ValueConstant, LocalStorage} from "../../../framework/shared/constants";
import {LocalStorageService} from "../../../framework/shared/localstorage.service";

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
  private isCandidate:boolean = false;

  private disableButton:boolean = true;

  ngOnInit() {
    if(LocalStorageService.getLocalValue(LocalStorage.IS_CANDIDATE)==='true') {
      this.isCandidate = true;
    }
  }

/*  ngOnChanges(changes:any) {
    if(changes.selectedRoles != undefined && changes.selectedRoles.currentValue != undefined){
      this.selectedRoles=changes.selectedRoles.currentValue;
    }
  }*/

  selectOption(role:Role,event:any) {
    if (event.target.checked) {
      this.disableButton=false;
      if (this.selectedRoles.length < ValueConstant.MAX_WORKAREA) {
        this.selectedRoles.push(role);
      } else {
          event.target.checked = false;
      }
    } else {
      if(this.selectedRoles.indexOf(role)>=0){
        this.selectedRoles.splice(this.selectedRoles.indexOf(role), 1);
      }
      if(this.selectedRoles.length===0){
        this.disableButton=true
      }
    }
  }

  onNext() {
//    this.compactView=false;
    this.highlightedSection.name = "Capabilities";
    this.highlightedSection.isDisable=false;
    this.onComplete.emit(this.selectedRoles);
  }

  isSelected(value:string) {
    return this.selectedRoles.filter(function (el:Role) {
        return el.name == value;
      }).length != 0;
  }

}
