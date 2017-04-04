import { Component } from '@angular/core';
import { Message } from "../../../framework/shared/message";
import { MessageService } from "../../../framework/shared/message.service";
import { RoleTypeService } from "./role-type.service";
import { TestService } from "../test.service";

@Component({
  moduleId: module.id,
  selector: 'cn-role-type-list',
  templateUrl: 'role-type.component.html',
  styleUrls: ['role-type.component.css']
})

export class RoleTypetListComponent {

  private showModalStyle: boolean = false;
  private disbleRole: boolean = true;
  private disbleButton: boolean = false;
  private disableIndustry: boolean = false;
  private roleTypes:string[]=new Array();




  constructor(private roleTypeService: RoleTypeService, private messageService:MessageService , private testService : TestService) {
  }

  ngOnInit() {debugger
    this.roleTypeService.getRoleTypes()
      .subscribe(
        data=> this.onRoleTypesSuccess(data),
        error => this.onError(error));

  }
  onRoleTypesSuccess(data:any) {debugger
    for(let proficiency of data.roletypes) {
      this.roleTypes.push(proficiency);
  }}

  onError(error:any) {
    var message = new Message();
    message.error_msg = error.err_msg;
    message.isError = true;
    this.messageService.message(message);
  }
  showHideModal() {
    this.showModalStyle = !this.showModalStyle;
  }
  disableRoleltype() {
    this.testService.change(true);
    this.showModalStyle = !this.showModalStyle;
    this.disbleRole = true;
    this.disbleButton = true;
    this.disableIndustry = true;

  }

  getStyleModal() {
    if (this.showModalStyle) {
      return 'block';
    } else {
      return 'none';
    }
  }
  selectIndustryModel(event:string)
  {


  }

}
