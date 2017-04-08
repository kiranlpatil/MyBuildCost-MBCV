import { Component } from '@angular/core';
import { MyIndustryService } from '../industry-service';
import { IndustryListService } from '../industry-list/industry-list.service';
import { Message } from '../../../framework/shared/message';
import { MessageService } from '../../../framework/shared/message.service';
import { IndustryList } from '../model/industryList';
import { MyRoleService } from '../role-service';
import { MyRoTypeTestService } from '../myRole-Type.service';
import {Role} from "../model/role";

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
  private  isnewindustry:boolean=false;
  private selectedOptions:string[]=new Array();
  private showfield: boolean = false;
  private alert:boolean=false;


  constructor(private messageService:MessageService ,
              private industryService: IndustryListService,
              private roleService : MyRoleService,
              private myIndustryService :MyIndustryService,
              private myRoleType:MyRoTypeTestService ) {
    myIndustryService.showTest$.subscribe(
      data => {

        this.industry=data;
        this.industryRoles.name=data;
        this.industryService.getRoles(this.industry)
          .subscribe(
            rolelist => this.onRoleListSuccess(rolelist.data),
            error => this.onError(error));
      }
    );


  }
  selectOption(newVal:any) {
    var option=newVal.target.value;
    if (newVal.target.checked) {
      if ((this.selectedOptions.length < 3) && option !== undefined) {
        this.selectedOptions.push(option);
        this.selectRolesModel(option);

      } else {
        if(option !== undefined) {
          this.alert=true;
          newVal.target.checked=false;
        } else
          console.log('in elsae else');
      }
    } else {
      if(option !== undefined) {
        for(let data of this.selectedOptions) {
          if(data === option) {
            this.selectedOptions.splice(this.selectedOptions.indexOf(data), 1);
          }
        }
      }
    }
  }
  onError(error:any) {
    var message = new Message();
    message.error_msg = error.err_msg;
    message.isError = true;
    this.messageService.message(message);
  }

  onRoleListSuccess(data:any) {
    this.rolesData=data;
    if(!this.isnewindustry) {
      for (let role of data) {
        this.roleNames.push(role.name);
      }
      this.isnewindustry=true;
    } else {
      this.roleNames.splice(0);
      for (let role of data) {
        this.roleNames.push(role.name);
      }

    }
  }
  selectRolesModel(roleName: string) {
     if(roleName === 'u can select max ') {
      console.log('u can select max ');
} else {
      this.disbleButton = false;
      this.storedRoles.push(roleName);
       var r:Role=new Role();
       r.name=roleName;
       this.industryRoles.roles.push(r);

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
    this.myRoleType.change(true);
    this.showfield=true;
    this.showModalStyle = !this.showModalStyle;
    this.disbleRole = true;
    this.disbleButton = true;
    this.disableIndustry = true;
    this.createAndSave();
    this.roleService.change(this.storedRoles);
  }

  createAndSave() {
    this.industryService.addIndustryProfile(this.industryRoles).subscribe(
      user => {
        console.log(user);
      },
      error => {
        console.log(error);
      });
  };

  getStyleModal() {
    if (this.showModalStyle) {
      return 'block';
    } else {
      return 'none';
    }
  }


}
