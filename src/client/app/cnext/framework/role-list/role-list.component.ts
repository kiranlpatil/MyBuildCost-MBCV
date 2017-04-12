import {Component, EventEmitter, Output, Input} from "@angular/core";
import {Role} from "../model/role";

@Component({
  moduleId: module.id,
  selector: 'cn-role-list',
  templateUrl: 'role-list.component.html',
  styleUrls: ['role-list.component.css']
})

export class RoleListComponent {

  @Input() roles:Role[] = new Array(0);
  @Input() candidateRoles:Role[] = new Array(0);
  @Output() selectRoles=new EventEmitter();
  private selectedRoles:Role[] = new Array(0);
  private showModalStyle:boolean = false;
  private candidateRolesList :string[]= new Array(0);

  ngOnChanges(changes:any) {debugger
    if(changes.candidateRoles){
      if(changes.candidateRoles.currentValue){
        for(let role of changes.candidateRoles.currentValue){
          this.candidateRolesList.push(role.name);
        }
      }
    }
    if(changes.roles){
      if(changes.roles.currentValue.length>0){
        this.roles=changes.roles.currentValue;
      }
    }
  }

  selectOption(role:Role,event:any) {
    if (event.target.checked) {
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
    }
  }

  showHideModal() {
    this.showModalStyle = !this.showModalStyle;
  }

  disableRolelist() {
    this.showModalStyle = !this.showModalStyle;
    this.selectRoles.emit(this.selectedRoles);
  }

  getStyleModal() {
    return this.showModalStyle?'block':'none';
  }

}
