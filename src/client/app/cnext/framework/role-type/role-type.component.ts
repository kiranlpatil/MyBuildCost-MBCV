import {Component, Input, Output, EventEmitter} from "@angular/core";

@Component({
  moduleId: module.id,
  selector: 'cn-role-type-list',
  templateUrl: 'role-type.component.html',
  styleUrls: ['role-type.component.css']
})

export class RoleTypetListComponent {

  @Input() roleTypes:string[] = new Array(0);
  @Input() candidateRoletype:string='';
  @Output() selectRoleType=new EventEmitter();
  private selectedRoletype:string='';
  private showModalStyle: boolean = false;

  ngOnChanges (changes:any) {debugger
    if (changes.roleTypes != undefined) {
      if (changes.roleTypes.currentValue != undefined)
        this.roleTypes = changes.roleTypes.currentValue;
    }
  }
  choosedRoleType(roleType:string) {debugger
    this.selectedRoletype = roleType;
  }
  
  showHideModal() {
    this.showModalStyle = !this.showModalStyle;
  }
  
  disableRoleltype() {debugger
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
