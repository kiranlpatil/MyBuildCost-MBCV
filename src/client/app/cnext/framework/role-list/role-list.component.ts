import { Component } from '@angular/core';
import { MyIndustryService } from '../industry-service';
import { IndustryListService } from '../industry-list/industry-list.service';
import { Message } from '../../../framework/shared/message';
import { MessageService } from '../../../framework/shared/message.service';
import { MyRoleService } from '../role-service';
import { MyRoTypeTestService } from '../myRole-Type.service';
import {Role} from "../model/role";
import {ProfileCreatorService} from "../profile-creator/profile-creator.service";
import {Industry} from "../model/industry";
import {LocalStorageService} from "../../../framework/shared/localstorage.service";
import {LocalStorage} from "../../../framework/shared/constants";

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
  private industryRoles=new Industry();
  private  isnewindustry:boolean=false;
  private selectedOptions:string[]=new Array();
  private showfield: boolean = false;
  private alert:boolean=false;
  private roles=new Array();


  constructor(private messageService:MessageService ,
              private industryService: IndustryListService,
              private roleService : MyRoleService,
              private myIndustryService :MyIndustryService,
              private myRoleType:MyRoTypeTestService, private profileCreatorService:ProfileCreatorService ) {
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

  ngOnInit(){
    if(LocalStorageService.getLocalValue(LocalStorage.IS_CANDIDATE)==="true"){
      this.profileCreatorService.getCandidateDetails()
        .subscribe(
          candidateData => this.OnCandidateDataSuccess(candidateData),
          error => this.onError(error));

    }
  }

  OnCandidateDataSuccess(candidateData:any){
    if(candidateData.data[0].industry.roles.length > 0) {
      for (let role of candidateData.data[0].industry.roles) {
        this.storedRoles.push(role.name);
      }
      this.myRoleType.change(true);
      this.myIndustryService.change(candidateData.data[0].industry.name);
      this.roleService.change(this.storedRoles);
    }
  }

  selectOption(newVal:any) {
    if (newVal.target.checked) {
      if ((this.selectedOptions.length < 3) && newVal.target.value  !== undefined) {
        this.selectedOptions.push(newVal.target.value);
      } else {
        if(newVal.target.value !== undefined) {
          this.alert=true;
          newVal.target.checked=false;
        } else
          console.log('in elsae else');
      }
    } else {
      if(newVal.target.value !== undefined) {
        for(let data of this.selectedOptions) {
          if(data === newVal.target.value) {
            this.selectedOptions.splice(this.selectedOptions.indexOf(data), 1);
          }
        }
      }
    }
    this.fillDataInModel();
  }

  fillDataInModel(){
    this.disbleButton = false;
    if(this.selectedOptions.length == 0) {
      this.disbleButton = true;
    }
    this.industryRoles = new Industry();
    this.industryRoles.name = this.industry;
   for(let option of this.selectedOptions ){
     var r:Role=new Role();
     r.name=option;
     this.industryRoles.roles.push(r);
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

  isChecked(choice:any):boolean{ 
    for(let role of this.storedRoles){
      if(role===choice){
        //this.showfield=true;
        return true;
      }
    }
    return false;
  }

}
