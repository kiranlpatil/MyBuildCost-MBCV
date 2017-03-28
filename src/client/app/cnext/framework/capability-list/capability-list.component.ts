
import {Component} from '@angular/core';
import {VALUE_CONSTANT, LocalStorage} from "../../../framework/shared/constants";
import {TestService} from "../test.service";
import {ComplexityService} from "../complexity.service";
import {MyIndustryService} from "../industry-service";
import {MyRoleService} from "../role-service";
import {MessageService} from "../../../framework/shared/message.service";
import {CapabilityListService} from "./capability-list.service";
import {MyCapabilityService} from "../capability-service";
import {LocalStorageService} from "../../../framework/shared/localstorage.service";
import {MyJobRequirementService} from "../jobrequirement-service";
import {Message} from "../../../framework/shared/message";



@Component({
  moduleId: module.id,
  selector: 'cn-capibility-list',
  templateUrl: 'capability-list.component.html',
  styleUrls: ['capability-list.component.css']
})

export class CapabilityListComponent {
  private capabilities =new Array();
  private primaryCapabilities=new Array();
  private secondaryCapabilities=new Array();
  private isShowCapability :boolean=false;
  private isPrimary: boolean[] =new Array() ;
  private isSecondary: boolean[] =new Array() ;
  private industry: string;
  private capabilityData:any;
  private capabilityIds=new Array();
  private roles:any;
  private iscandidate:boolean=false;
  constructor(
              private testService : TestService,
              private complexityService : ComplexityService,
              private myIndustryService :MyIndustryService,
              private roleservice :MyRoleService,
              private messageService:MessageService,
              private capabilityListServive:CapabilityListService,
              private myCapabilityListService:MyCapabilityService,
              private myJobrequirementService :MyJobRequirementService) {

    testService.showTest$.subscribe(
      data=>{
        this.isShowCapability=data;
      }
    );
    myIndustryService.showTest$.subscribe(
      data=>{
        this.industry=data;
        console.log("industry list in capab",this.industry);
      }
    );
    roleservice.showTest$.subscribe(
      data=>{
        this.roles=data;
        console.log("role list in capab",this.roles);
        this.capabilityListServive.getCapability(this.industry,this.roles)
          .subscribe(
            capabilitylist => this.onCapabilityListSuccess(capabilitylist.data),
            error => this.onError(error));
      }
    );
    myJobrequirementService.showTest$.subscribe(
      data=>{
        this.isShowCapability=true;
        this.roles=data.roleModel;
        this.industry=data.industryModel;
        console.log("role list in capab",this.roles,this.industry);
        this.capabilityListServive.getCapability(this.industry,this.roles)
          .subscribe(
            capabilitylist => this.onCapabilityListSuccess(capabilitylist.data),
            error => this.onError(error));
      }
    );
  }

  ngOnInit(){
    this.iscandidate= !(LocalStorageService.getLocalValue(LocalStorage.IS_CANDIDATE));
    console.log("capability",LocalStorageService.getLocalValue(LocalStorage.IS_CANDIDATE));
  }

  onCapabilityListSuccess(data:any){
    this.capabilityData=data;
    if(data != undefined){
      this.isPrimary=new Array(data.length);
      this.isSecondary=new Array(data.length);
      for(let capability of data){
        this.capabilities.push(capability.name);
      }
    }
  }
  onError(error:any){
    var message = new Message();
    message.error_msg = error.err_msg;
    message.isError = true;
    this.messageService.message(message);
  }

  selectedOption(selectedCapability:any){
    if (selectedCapability.target.checked) {
      this.searchCapabilityId(selectedCapability.target.value);
      if(this.primaryCapabilities.length < VALUE_CONSTANT.MAX_CAPABILITIES) {
        this.primaryCapabilities.push(selectedCapability.target.value);
        this.isPrimary[this.capabilities.indexOf(selectedCapability.target.value)]=true;

      }
      else{
        this.secondaryCapabilities.push(selectedCapability.target.value);
        this.isSecondary[this.capabilities.indexOf(selectedCapability.target.value)]=true;
      }
    }
    else{
      this.deleteCapabilityById(selectedCapability.target.value);
      for(let capability of this.primaryCapabilities){
        if(capability===selectedCapability.target.value){
          this.isPrimary[this.capabilities.indexOf(selectedCapability.target.value)]=false;
          this.primaryCapabilities.splice(this.primaryCapabilities.indexOf(capability), 1);
        }
      }

      for(let capability of this.secondaryCapabilities){
        if(capability===selectedCapability.target.value){
          this.isSecondary[this.capabilities.indexOf(selectedCapability.target.value)]=false;
          this.secondaryCapabilities.splice(this.secondaryCapabilities.indexOf(capability), 1);
        }
      }
    }

    if(this.primaryCapabilities.length>1){
      this.complexityService.change(true);
    }
    this.myCapabilityListService.change(this.primaryCapabilities);

  }




  searchCapabilityId(capabilityName:any){
    for(let capability of this.capabilityData){
      if(capability.name===capabilityName){
        this.capabilityIds.push(capability._id);
        console.log("add",this.capabilityIds);
      }
    }
  }
  deleteCapabilityById(capabilityName:any){
    for(let capability of this.capabilityData){
      if(capability.name===capabilityName){
        this.capabilityIds.splice(this.capabilityIds.indexOf(capability._id), 1);

      }
    }
  }

  createAndSave() {
    this.capabilityListServive.addCapability(this.capabilityIds).subscribe(
      user => {
        console.log(user);
      },
      error => {
        console.log(error);
      });
  };
}
