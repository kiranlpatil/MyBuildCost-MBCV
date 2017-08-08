import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from "@angular/core";
import {Role} from "../model/role";
import {Section} from "../model/candidate";
import {LocalStorage, Messages, Tooltip, ValueConstant} from "../../../framework/shared/constants";
import {LocalStorageService} from "../../../framework/shared/localstorage.service";

@Component({
  moduleId: module.id,
  selector: 'cn-work-area',
  templateUrl: 'work-area.component.html',
  styleUrls: ['work-area.component.css']
})

export class WorkAreaComponent implements OnInit,OnChanges {
  @Input() roles: Role[] = new Array(0);
  @Input() selectedRoles: Role[] = new Array(0);
  @Input() highlightedSection: Section;
  @Output() onComplete = new EventEmitter();
  tooltipCandidateMessage: string =
    '<ul>' +
    '<li><p>1. '+ Tooltip.AREA_OF_WORK_TOOLTIP_1+' </p></li>' +
    '<li><p>2. '+ Tooltip.AREA_OF_WORK_TOOLTIP_2+'</p></li>' +
    '</ul>';

  tooltipRecruiterMessage: string =
    '<ul>' +
    '<li><p>1. Select Those Areas in Which the Candidate is Expected to Work. You can select maximum 3 areas of work for a job profile in order to make your search more relevant.</p></li>' +
    '</ul>';
  private savedSelectedRoles: Role[] = new Array(0);
  private isCandidate: boolean = false;
  private showModalStyle:boolean = false;
  private showModalStyle2:boolean = false;
  private showButton: boolean = true;
  private isValid:boolean = true;
  private validationMessage: string;

  ngOnInit() {
    if (LocalStorageService.getLocalValue(LocalStorage.IS_CANDIDATE) === 'true') {
      this.isCandidate = true;
    }
  }

    ngOnChanges(changes:any) {
      if(changes.selectedRoles !== undefined && changes.selectedRoles.currentValue !== undefined) {
        this.selectedRoles=changes.selectedRoles.currentValue;
        this.savedSelectedRoles=new Array(0);
        for(let role of this.selectedRoles){
          let savetempRole =Object.assign({}, role);
          this.savedSelectedRoles.push(savetempRole);
        }
      }
   }

  selectOption(role: Role, event: any) {
    this.validationMessage = '';
    this.isValid = true;
    if (event.target.checked) {
      if (this.savedSelectedRoles.length < ValueConstant.MAX_WORKAREA) {
        let isFound: boolean = false;
        for (let selrole of this.savedSelectedRoles) {
          if (role.code === selrole.code) {
            isFound = true;
          }
        }
        if (!isFound) {
          this.savedSelectedRoles.push(role);
        }
      } else {
        event.target.checked = false;
        this.validationMessage = Messages.MSG_ERROR_VALIDATION_MAX_AREAS_WORKED_CROSSED;
        this.isValid = false;
      }
    } else {
      let tempRole: Role;
      for (let selrole of this.savedSelectedRoles) {
        if (role.code === selrole.code) {
          tempRole = selrole;
        }
      }
      if (tempRole) {
        this.savedSelectedRoles.splice(this.savedSelectedRoles.indexOf(tempRole), 1);
      }
    }
  }

  onPrevious() {
    this.validationMessage = '';
    this.isValid = true;
    this.selectedRoles = new Array(0);
    for (let role of this.savedSelectedRoles) {
      let savetempRole = Object.assign({}, role);
      this.selectedRoles.push(savetempRole);
    }
    this.highlightedSection.name = 'Industry';

    let _body: any = document.getElementsByTagName('BODY')[0];
    _body.scrollTop = -1;
  }

  onNext() {
    if(this.savedSelectedRoles.length === 0){
      this.validationMessage = Messages.MSG_ERROR_VALIDATION_AREAS_WORKED_REQUIRED;
      this.isValid = false;
      return;
    }
    this.selectedRoles=new Array(0);
    for(let role of this.savedSelectedRoles){
      let savetempRole =Object.assign({}, role);
      this.selectedRoles.push(savetempRole);
    }
    this.highlightedSection.name = 'Capabilities';
    this.highlightedSection.isDisable = false;
    this.onComplete.emit(this.selectedRoles);
  }

  onSave() {
    this.isValid = true;
    if(this.savedSelectedRoles.length == 0){
      this.validationMessage = Messages.MSG_ERROR_VALIDATION_AREAS_WORKED_REQUIRED;
      this.isValid = false;
      return;
    }
      var roleId:any[]=new Array(0);
      var goNext:boolean;
      if(this.selectedRoles.length === this.savedSelectedRoles.length ) {
        for (let role of this.selectedRoles) {
          roleId.push(role.code);
      }
        for(let selectedRole of this.savedSelectedRoles){
          if(roleId.indexOf(selectedRole.code)=== -1) {
            goNext=true;
          }
        }
        if(goNext) {
          this.onNext();
        } else {
          this.onNext();
        }
      } else {
        this.onNext();
      }
    let _body: any = document.getElementsByTagName('BODY')[0];
    _body.scrollTop = -1;
  }
onCancel() {
  this.highlightedSection.name='none';
  this.highlightedSection.isDisable=false;
  this.savedSelectedRoles=new Array(0);
  for(let role of this.selectedRoles){
    let savetempRole =Object.assign({}, role);
    this.savedSelectedRoles.push(savetempRole);
  }
}
  isSelected(value: string) {
    return this.selectedRoles.filter(function (el: Role) {
        return el.code === value;
      }).length !== 0;
  }
  getStyleModal() {
    if (this.showModalStyle) {
      return 'block';
    } else {
      return 'none';
    }
  }

  showHideModal() {
    this.showModalStyle = !this.showModalStyle;
  }

  getStyleModal2() {
    if (this.showModalStyle2) {
      return 'block';
    } else {
      return 'none';
    }
  }

  showHideModal2() {
    this.showModalStyle2 = !this.showModalStyle2;
  }

  OnEdit() {
    this.highlightedSection.name = 'Work-Area';
    this.showButton = false;
    this.highlightedSection.sectionName = 'capability';
    this.highlightedSection.isDisable = true;
    let _body: any = document.getElementsByTagName('BODY')[0];
    _body.scrollTop = -1;
  }
}
