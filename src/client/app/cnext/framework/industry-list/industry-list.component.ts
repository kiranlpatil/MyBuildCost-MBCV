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





  constructor(private industryService: IndustryListService, private myindustryService : MyIndustryService,private myRolelist:MyRoleListTestService,
              private roleService : MyRoleService, private jobtitleservice:MYJobTitleService,private messageService:MessageService , private disableService:DisableTestService) {

  }

  ngOnInit() {
    this.industryService.getIndustries()
      .subscribe(
        industrylist => this.onIndustryListSuccess(industrylist.data),
        error => this.onError(error));


    this.jobtitleservice.showTestTitle$.subscribe(
      data => {
        this.title=data;
      }
    );
  }
  selectOption(option:string) {

    if(option !== undefined)
      this.abcd=option;
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

  selectIndustryModel(industry: string) {

    //this.disbleRole=false;
    this.searchIndustryId(industry);
    this.industryService.getRoles(industry)
      .subscribe(
        rolelist => this.onRoleListSuccess(rolelist.data),
        error => this.onError(error));
    this.storedindustry=industry;
  }

  searchIndustryId(industryName:string) {
    for(let industry of this.industryData) {
      if(industry.name===industryName) {
        this.industryRoles.industry=industry._id;
      }
    }
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
  };

  showHideModal() {
    this.selectIndustryModel(this.abcd);

      this.showModalStyle = !this.showModalStyle;

  }
  disableIndustrires() {


    this.myindustryService.change(this.storedindustry);

    this.disableService.change(true);
       this.myRolelist.change(true);
     // this.testService.change(true);
      this.showModalStyle = !this.showModalStyle;
      this.disbleRole = true;
      this.disbleButton = true;
      this.disableIndustry = true;
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


