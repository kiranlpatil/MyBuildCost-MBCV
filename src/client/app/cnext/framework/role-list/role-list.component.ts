import { Component } from '@angular/core';
import { myRoleListTestService } from "../myRolelist.service";
import { MyIndustryService } from "../industry-service";
import { IndustryListService } from "../industry-list/industry-list.service";
import { Message } from "../../../framework/shared/message";
import { MessageService } from "../../../framework/shared/message.service";
import { IndustryList } from "../model/industryList";
import { MyRoleService } from "../role-service";
import { myRoTypeTestService } from "../myRole-Type.service";

@Component({
  moduleId: module.id,
  selector: 'cn-role-list',
  templateUrl: 'role-list.component.html',
  styleUrls: ['role-list.component.css']
})

export class RoleListComponent {
  private industry:string;
  private storedRoles :string[] =new Array();
  private roleNames:string[] =new Array();
  private rolesData:any;
  private showModalStyle: boolean = false;
  private disbleRole: boolean = true;
  private disbleButton: boolean = true;
  private disableIndustry: boolean = false;
  private industryRoles=new IndustryList();


  constructor(private messageService:MessageService ,
              private industryService: IndustryListService,
              private myRolelist :myRoleListTestService,
              private roleService : MyRoleService,
              private myIndustryService :MyIndustryService,
              private myRoleType:myRoTypeTestService ) {
    myIndustryService.showTest$.subscribe(
      data=>{
        this.industry=data;
        this.industryService.getRoles(this.industry)
          .subscribe(
            rolelist => this.onRoleListSuccess(rolelist.data),
            error => this.onError(error));
      }
    );


  }
  onError(error:any) {
    var message = new Message();
    message.error_msg = error.err_msg;
    message.isError = true;
    this.messageService.message(message);
  }

  onRoleListSuccess(data:any) {
    this.rolesData=data;
    for(let role of data) {
      this.roleNames.push(role.name);
    }
  }
  selectRolesModel(roleName: string) {
    if(roleName === "u can select max ") {
      console.log("u can select max ");
    }
    else {
      this.disbleButton = false;
      this.storedRoles.push(roleName);
      this.searchRolesId(roleName);
    }
  }
  searchRolesId(roleName:any) {
    for(let role of this.rolesData) {
      if(role.name===roleName) {
        this.industryRoles.roles.push(role._id);
      }
    }
  }
  showHideModal() {
    this.showModalStyle = !this.showModalStyle;
  }
  disableRolelist() {
    //this.myRolelist.change(true);
    // this.testService.change(true);
    this.myRoleType.change(true);
    this.showModalStyle = !this.showModalStyle;
    this.disbleRole = true;
    this.disbleButton = true;
    this.disableIndustry = true;
    this.roleService.change(this.storedRoles);

  }

  getStyleModal() {
    if (this.showModalStyle) {
      return 'block';
    } else {
      return 'none';
    }
  }


}
