import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import {Tooltip} from "../../../shared/constants";

@Component({
  moduleId: module.id,
  selector: 'cn-role-type-list',
  templateUrl: 'role-type.component.html',
  styleUrls: ['role-type.component.css']
})

export class RoleTypeListComponent implements OnChanges {

  @Input() roleTypes: string[] = new Array(0);
  @Input() candidateRoletype: string = '';
  @Output() selectRoleType = new EventEmitter();
  private selectedRoletype: string = '';
  private showModalStyle: boolean = false;
  disableRoletype: boolean = false;
  disableButton: boolean = true;

  ngOnChanges(changes: any) {
    if (changes.roleTypes != undefined) {
      if (changes.roleTypes.currentValue != undefined)
        this.roleTypes = changes.roleTypes.currentValue;
    }
  }

  choosedRoleType(roleType: string) {
    this.disableButton = false;
    this.selectedRoletype = roleType;
  }

  showHideModal() {
    this.showModalStyle = !this.showModalStyle;
  }

  disableRoleltype() {
    this.disableRoletype = true;
    this.showModalStyle = !this.showModalStyle;
    this.selectRoleType.emit(this.selectedRoletype);
  }

  getStyleModal() {
    if (this.showModalStyle) {
      return 'block';
    } else {
      return 'none';
    }
  }
}
