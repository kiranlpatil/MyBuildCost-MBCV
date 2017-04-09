import { Component ,OnInit } from '@angular/core';
import { ValueConstant, LocalStorage } from '../../../framework/shared/constants';
import { TestService } from '../test.service';
import { ComplexityService } from '../complexity.service';
import { MyIndustryService } from '../industry-service';
import { MyRoleService } from '../role-service';
import { MessageService } from '../../../framework/shared/message.service';
import { CapabilityListService } from './capability-list.service';
import { MyCapabilityService } from '../capability-service';
import { LocalStorageService } from '../../../framework/shared/localstorage.service';
import { MyJobRequirementService } from '../jobrequirement-service';
import { Message } from '../../../framework/shared/message';
import {Industry} from "../model/industry";
import {IndustryListService} from "../industry-list/industry-list.service";
import {Role} from "../model/role";
import {Capability} from "../model/capability";
import {ProfileCreatorService} from "../profile-creator/profile-creator.service";

@Component({
  moduleId: module.id,
  selector: 'cn-capibility-list',
  templateUrl: 'capability-list.component.html',
  styleUrls: ['capability-list.component.css']
})

export class CapabilityListComponent implements OnInit  {
  private capabilities:string[] =new Array();
  private primaryCapabilities:string[]=new Array();
  private secondaryCapabilities:string[]=new Array();
  private isShowCapability :boolean=false;
  private isPrimary: boolean[] =new Array() ;
  private isSecondary: boolean[] =new Array() ;
  private industry: string;
  private capabilityData:any;
  private capabilityIds :string[]=new Array();
  private roles:any;
  private disablebutton:boolean=true;
  private iscandidate:boolean=false;
  private break1:boolean=false;
  private showfield: boolean = false;
  private industryRoles:Industry=new Industry();
  private savedCapabilities:Capability[]=new Array();

  constructor(private testService : TestService,
              private industryService:IndustryListService,
              private complexityService : ComplexityService,
              private myIndustryService :MyIndustryService,
              private roleservice :MyRoleService,
              private messageService:MessageService,
              private capabilityListServive:CapabilityListService,
              private myCapabilityListService:MyCapabilityService,
              private myJobrequirementService :MyJobRequirementService,
              private profileCreatorService:ProfileCreatorService
  ) {

    testService.showTest$.subscribe(
      data => {
        this.isShowCapability=data;
      }
    );


    myIndustryService.showTest$.subscribe(
      data => {
        this.industry=data;
        this.industryRoles.name=data;
      }
    );
    roleservice.showTest$.subscribe(
      data => {
        this.roles=data;
        this.capabilityListServive.getCapability(this.industry,this.roles)
          .subscribe(
            capabilitylist => this.onCapabilityListSuccess(capabilitylist.data),
            error => this.onError(error));
      }
    );
    myJobrequirementService.showTest$.subscribe(
      data => {
        this.isShowCapability=true;
        this.roles=data.role;
        this.industry=data.industry;
        this.capabilityListServive.getCapability(this.industry,this.roles)
          .subscribe(
            capabilitylist => this.onCapabilityListSuccess(capabilitylist.data),
            error => this.onError(error));
      }
    );
  }

  ngOnInit() {
    if(LocalStorageService.getLocalValue(LocalStorage.IS_CANDIDATE)==="true"){
      this.profileCreatorService.getCandidateDetails()
        .subscribe(
          candidateData => this.OnCandidateDataSuccess(candidateData),
          error => this.onError(error));

    }
  }

  OnCandidateDataSuccess(candidateData:any){
    
    
      for(let role of candidateData.data[0].industry.roles){
        for(let capability of role.capabilities){
          this.savedCapabilities.push(capability);
          this.primaryCapabilities.push(capability.name);
        }
      }
    this.showfield=true;
    this.myCapabilityListService.change(this.primaryCapabilities);
    console.log(this.savedCapabilities);
    this.complexityService.change(true);
  }

  onCapabilityListSuccess(data:any) {
    this.capabilityData=data;
    console.log(this.capabilityData);
    if(data !== undefined && data.length > 0) {
      for(let role of data) {
        this.isPrimary = new Array(role.capabilities.length);
        this.isSecondary = new Array(role.capabilities.length);
        for (let capability of role.capabilities) {
          this.capabilities.push(capability.name);
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

  selectedOption(selectedCapability:any) {
     this.disablebutton=false;
    if (selectedCapability.target.checked) {
      this.searchCapabilityData(selectedCapability.target.value);
      if(this.primaryCapabilities.length < ValueConstant.MAX_CAPABILITIES) {
        this.primaryCapabilities.push(selectedCapability.target.value);
        this.isPrimary[this.capabilities.indexOf(selectedCapability.target.value)]=true;
      } else {
        this.secondaryCapabilities.push(selectedCapability.target.value);
        this.isSecondary[this.capabilities.indexOf(selectedCapability.target.value)]=true;
      }
    } else {
      this.deleteCapabilityById(selectedCapability.target.value);
      for(let capability of this.primaryCapabilities) {
        if(capability===selectedCapability.target.value) {
          this.isPrimary[this.capabilities.indexOf(selectedCapability.target.value)]=false;
          this.primaryCapabilities.splice(this.primaryCapabilities.indexOf(capability), 1);
        }
      }

      for(let capability of this.secondaryCapabilities) {
        if(capability===selectedCapability.target.value) {
          this.isSecondary[this.capabilities.indexOf(selectedCapability.target.value)]=false;
          this.secondaryCapabilities.splice(this.secondaryCapabilities.indexOf(capability), 1);
        }
      }
    }
    this.myCapabilityListService.change(this.primaryCapabilities);
  }


  searchCapabilityData(capabilityName:string){
    for(let item of this.capabilityData) {
      for (let subitem of item.capabilities) {
        if (capabilityName === subitem.name) {
          var roleNotFound = true;
          if (this.industryRoles.roles.length > 0) {
            for (let role of this.industryRoles.roles) {
              if (role.name === subitem.roleName) {
                var capab:Capability = new Capability();
                capab.name = subitem.name;
                role.capabilities.push(capab);
                roleNotFound = false;
                break;
              }
            }
          }

          if (roleNotFound) {
            var role1:Role = new Role();
            role1.name = subitem.roleName;
            var capab1:Capability = new Capability();
            capab1.name = subitem.name;
            role1.capabilities.push(capab1);
            this.industryRoles.roles.push(role1);
          }
        }
      }
    }
  }
  deleteCapabilityById(capabilityName:string) {
    for(let capability of this.capabilityData) {
      if(capability.name===capabilityName) {
        this.capabilityIds.splice(this.capabilityIds.indexOf(capability._id), 1);
      }
    }
  }
  createAndSave() {
    this.showfield=true;
    this.disablebutton=true;
    this.complexityService.change(true);
    this.industryService.addIndustryProfile(this.industryRoles).subscribe(
      user => {
        console.log(user);
      },
      error => {
        console.log(error);
      });
  }


  isChecked(choice:any):boolean{
    for(let capability of this.savedCapabilities){
      if(capability.name===choice){
        return true;
      }
    }
    return false;
  }

}
