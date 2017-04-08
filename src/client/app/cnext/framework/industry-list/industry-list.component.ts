import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { IndustryListService } from './industry-list.service';
import { MyIndustryService } from '../industry-service';
import { MyRoleService } from '../role-service';
import { Message } from '../../../framework/shared/message';
import { MessageService } from '../../../framework/shared/message.service';
import { IndustryList } from '../model/industryList';
import { MyRoleListTestService } from '../myRolelist.service';
import { DisableTestService } from '../disable-service';
import { MYJobTitleService } from '../myJobTitle.service';
import { SingleSelectList } from '../model/single-select-list';
import {LocalStorageService} from "../../../framework/shared/localstorage.service";
import {LocalStorage} from "../../../framework/shared/constants";

@Component({
  moduleId: module.id,
  selector: 'cn-industry-list',
  templateUrl: 'industry-list.component.html',
  styleUrls: ['industry-list.component.css']
})

export class IndustryListComponent implements OnInit {
  @Input() radioData:SingleSelectList;
  @Output() selectedData = new EventEmitter<string>();
  private industryNames :string[]=new Array();
  private storedRoles :string[] =new Array();
  private industryData:any;
  private rolesData:any;
  private roleNames:string[] =new Array();
  private showModalStyle: boolean = false;
  private disbleRole: boolean = true;
  private disbleButton: boolean = true;
  private disableIndustry: boolean = false;
  private industryRoles=new IndustryList();
  private storedindustry:string;
  private title:string='';
  private abcd:string;
  private isCandidate : boolean = true;





  constructor(private industryService: IndustryListService, private myindustryService : MyIndustryService,private myRolelist:MyRoleListTestService,
              private roleService : MyRoleService, private jobtitleservice:MYJobTitleService,private messageService:MessageService , private disableService:DisableTestService) {

  }

  ngOnInit() {debugger
    this.industryService.getIndustries()
      .subscribe(
        industrylist => this.onIndustryListSuccess(industrylist.data),
        error => this.onError(error));


    this.jobtitleservice.showTestTitle$.subscribe(
      data => {
        this.title=data;
      }
    );

    if(LocalStorageService.getLocalValue(LocalStorage.IS_CANDIDATE)==="false"){debugger
      this.isCandidate=false;
    }
  }
  selectOption(option:string) {
      
    

    if(option !== undefined){debugger

      this.abcd=option;
      this.storedindustry=option;
      if(LocalStorageService.getLocalValue(LocalStorage.IS_CANDIDATE)==="false"){debugger
        this.isCandidate=false;
        this.disableIndustrires();
      }
      this.abcd=option;
      this.storedindustry=option;
    }
    this.disbleButton=false;

  }
  onIndustryListSuccess(data:any) {
    this.industryData=data;
    for(let industry of data) {
      this.industryNames.push(industry.name);
    }
  }

  onError(error:any) {
    var message = new Message();
    message.error_msg = error.err_msg;
    message.isError = true;
    this.messageService.message(message);
  }

  selectIndustryModel(industry: string) {debugger
   this.industryRoles.name=industry;
    if(LocalStorageService.getLocalValue(LocalStorage.IS_CANDIDATE)==="false"){debugger
      this.isCandidate=false;
      this.disableIndustrires();

    }
    this.industryService.getRoles(industry)
      .subscribe(
        rolelist => this.onRoleListSuccess(rolelist.data),
        error => this.onError(error));
    this.storedindustry=industry;
  }

  searchRolesId(roleName:any) {
    for(let role of this.rolesData) {
      if(role.name===roleName) {
        this.industryRoles.roles.push(role._id);
      }
    }
  }

  onRoleListSuccess(data:any) {
    this.rolesData=data;
    for(let role of data) {
      this.roleNames.push(role.name);
    }
  }

  selectRolesModel(roleName: string) {
    if(roleName === 'u can select max ') {
      console.log('u can select max ');
    } else {
      this.disbleButton = false;
      this.storedRoles.push(roleName);
      this.searchRolesId(roleName);
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
  }

  showHideModal() {
    this.selectIndustryModel(this.abcd);

      this.showModalStyle = !this.showModalStyle;

  }
  disableIndustrires() {debugger


    this.myindustryService.change(this.storedindustry);

    this.disableService.change(true);
       this.myRolelist.change(true);
     // this.testService.change(true);
    
      this.disbleRole = true;
      this.disbleButton = true;
      
    if(LocalStorageService.getLocalValue(LocalStorage.IS_CANDIDATE)==="true"){debugger
      this.createAndSave();
      this.showModalStyle = !this.showModalStyle;
      this.disableIndustry = true;
    }
      //this.roleService.change(this.storedRoles);
  }

  getStyleModal() {
    if (this.showModalStyle) {
      return 'block';
    } else {
      return 'none';
    }
  }
}


