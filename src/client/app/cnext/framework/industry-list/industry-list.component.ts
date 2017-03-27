import {Component} from '@angular/core';
import {IndustryListService} from "./industry-list.service";
import {TestService} from "../test.service";
import {MyIndustryService} from "../industry-service";
import {MyRoleService} from "../role-service";
import {Message} from "../../../framework/shared/message";
import {MessageService} from "../../../framework/shared/message.service";
import {IndustryList} from "../model/industryList";

@Component({
  moduleId: module.id,
  selector: 'cn-industry-list',
  templateUrl: 'industry-list.component.html',
  styleUrls: ['industry-list.component.css']
})

export class IndustryListComponent {
  private industryNames :string[]=new Array();
  private storedRoles :string[] =new Array();
  private industryModel:string = "";
  private industryData:any;
  private rolesData:any;
  private roleModel:string= "";
  private isRoleSelected : boolean= false;
  private temproles : string[];
  private maxRoles : number =3;
  private  roleNames:string[] =new Array();
  private showModalStyle: boolean = false;
  private disbleRole: boolean = false;
  private industryRoles=new IndustryList();


  constructor(private industryService: IndustryListService, private myindustryService : MyIndustryService,
              private roleService : MyRoleService, private messageService:MessageService , private testService : TestService) {

  }

  ngOnInit(){
    this.temproles= new Array(1);
    this.industryService.getIndustries()
      .subscribe(
        industrylist => this.onIndustryListSuccess(industrylist.data),
        error => this.onError(error));

  }

  onIndustryListSuccess(data:any){
    this.industryData=data;
    for(let industry of data){
      this.industryNames.push(industry.name);
    }
  }

  onError(error:any){
    var message = new Message();
    message.error_msg = error.err_msg;
    message.isError = true;
    this.messageService.message(message);
  }

  selectIndustryModel(industry: any) {
    this.industryModel = industry;
    this.searchIndustryId(industry);
    this.industryService.getRoles(industry)
      .subscribe(
        rolelist => this.onRoleListSuccess(rolelist.data),
        error => this.onError(error));
    this.myindustryService.change(this.industryModel);
  }

  searchIndustryId(industryName:any){
    for(let industry of this.industryData){
      if(industry.name===industryName){
        this.industryRoles.industry=industry._id;
      }
    }
  }

  searchRolesId(roleName:any){
    for(let role of this.rolesData){
      if(role.name===roleName){
        this.industryRoles.roles.push(role._id);
      }
    }
  }
  onRoleListSuccess(data:any){
    this.rolesData=data;
    for(let role of data){
      this.roleNames.push(role.name);
    }
  }

  selectRolesModel(roleName: any) {
    this.storedRoles.push(roleName);
    this.deleteSelectedRole(roleName);
    this.searchRolesId(roleName);
    this.isRoleSelected=true;
    if(this.isRoleSelected===true)
      this.roleModel="";
    else
      this.roleModel=roleName;
  }

  deleteSelectedRole(roleName: any){
    for (let  i = 0; i < this.roleNames.length; i++)
    {
      if (this.roleNames[i]===roleName)
      {
        if (i > -1) {
          this.roleNames.splice(i, 1);
        }
      }

    }
  }



  addNewRole(){
    if(this.temproles.length<this.maxRoles){
      this.temproles.push("null");
    }
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


  showHideModal() {
    this.showModalStyle = !this.showModalStyle;
  }


  disableRole(){
    this.testService.change(true);
    this.showModalStyle = !this.showModalStyle;
    this.disbleRole=true;
    this.createAndSave();
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


