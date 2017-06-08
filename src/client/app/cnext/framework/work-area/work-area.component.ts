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
  tooltipMessage : string=

      "<ul>" +
      "<li><p><strong> Area Of Work </strong></br>" + "&nbspSelect those areas of work that describe what you are best at or where you would like to position your career.</br></p></li>" +
      "</ul>"



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

  selectOption(role:Role,event:any) {debugger
    if (event.target.checked) {
      if (this.selectedRoles.length < ValueConstant.MAX_WORKAREA) {
        let isFound : boolean=false;
        for(let selrole of this.selectedRoles){
          if(role.name === selrole.name){
            isFound=true;
          }
        }
        if(!isFound){
          this.selectedRoles.push(role);
        }
      } else {
          event.target.checked = false;
      }
    } else {
      let tempRole : Role;
      for(let selrole of this.selectedRoles){
        if(role.name === selrole.name){
          tempRole=selrole;
        }
      }
      if(tempRole){
        this.selectedRoles.splice(this.selectedRoles.indexOf(tempRole), 1);
      }
    }
  }

  onNext() {debugger
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
