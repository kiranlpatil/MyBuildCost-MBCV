
import {Http} from '@angular/http';
import {Component} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {VALUE_CONSTANT} from "../../../framework/shared/constants";
import {TestService} from "../test.service";
import {ComplexityService} from "../complexity.service";
import {MyIndustryService} from "../industry-service";
import {MyRoleService} from "../role-service";
import {MessageService} from "../../../framework/shared/message.service";
import {CapabilityListService} from "./capability-list.service";
import {MyCapabilityService} from "../capability-service";



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
  private roles:any;
  constructor(private _router:Router, private http:Http,
              private activatedRoute:ActivatedRoute,
              private testService : TestService,
              private complexityService : ComplexityService,
              private myIndustryService :MyIndustryService,
              private roleservice :MyRoleService,
              private messageService:MessageService,
              private capabilityListServive:CapabilityListService,
              private myCapabilityListService:MyCapabilityService) {
    testService.showTest$.subscribe(
      data=>{
        this.isShowCapability=true;
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
  }


  onCapabilityListSuccess(data:any){
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

  selectOption(newVal:any){
    if (newVal.target.checked) {
      if(this.primaryCapabilities.length < VALUE_CONSTANT.MAX_CAPABILITIES) {
        this.primaryCapabilities.push(newVal.target.value);
        this.isPrimary[this.capabilities.indexOf(newVal.target.value)]=true;

      }
      else{
        this.secondaryCapabilities.push(newVal.target.value);
        this.isSecondary[this.capabilities.indexOf(newVal.target.value)]=true;
      }
    }
    else{
      for(let capability of this.primaryCapabilities){
        if(capability===newVal.target.value){
          this.isPrimary[this.capabilities.indexOf(newVal.target.value)]=false;
          this.primaryCapabilities.splice(this.primaryCapabilities.indexOf(capability), 1);
        }
      }

      for(let capability of this.secondaryCapabilities){
        if(capability===newVal.target.value){
          this.isSecondary[this.capabilities.indexOf(newVal.target.value)]=false;
          this.secondaryCapabilities.splice(this.secondaryCapabilities.indexOf(capability), 1);
        }
      }
    }

    if(this.primaryCapabilities.length>1){
      this.complexityService.change(true);
    }
    this.myCapabilityListService.change(this.primaryCapabilities);

  }

}
