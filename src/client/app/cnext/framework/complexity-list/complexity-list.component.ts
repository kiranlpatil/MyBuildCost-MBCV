import { Component } from '@angular/core';
import { Complexity } from '../model/complexity';
import { ComplexityService } from '../complexity.service';
import { ProficiencyService } from '../proficience.service';
import { MyCapabilityService } from '../capability-service';
import { MyIndustryService } from '../industry-service';
import { MyRoleService } from '../role-service';
import { ComplexityListService } from './complexity-list.service';
import { MessageService } from '../../../framework/shared/message.service';
import { MyJobRequirementService } from '../jobrequirement-service';
import { Message } from '../../../framework/shared/message';
import { JobPostComplexityService } from '../job-post-complexity.service';
import {IndustryList} from "../model/industryList";
import {Scenario} from "../model/scenario";
import {IndustryListService} from "../industry-list/industry-list.service";

@Component({
  moduleId: module.id,
  selector: 'cn-complexity-list',
  templateUrl: 'complexity-list.component.html',
  styleUrls: ['complexity-list.component.css']
})

export class ComplexityListComponent {
  private complexities: any[]=new Array();
  private selectedComplexity=new Array();
  private isComplexityShow : boolean =false;
  private capabilities=new Array();
  private roles=new Array();
  private industry:any;
  private showfield: boolean = false;
  private complexityData:any;
  private count:number=0;
  private industryRoles:IndustryList=new IndustryList();
  constructor(
               private complexityService: ComplexityService,
               private industryService: IndustryListService,
               private proficiencyService: ProficiencyService,
               private complexityListServive:ComplexityListService,
               private messageService:MessageService,
               private myCapabilityListService:MyCapabilityService,
               private myIndustryService :MyIndustryService,
               private roleservice :MyRoleService,
               private myJobrequirementService:MyJobRequirementService,
               private jobPostComplexiyservice:JobPostComplexityService) {
    complexityService.showTest$.subscribe(
      data => {
          this.isComplexityShow=data;
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
      }
    );

    myCapabilityListService.showTest$.subscribe(
      data => {
        this.capabilities=data;
        console.log('from complex capab',this.capabilities);
        this.complexityListServive.getComplexity(this.industry,this.roles,this.capabilities)
         .subscribe(
         complexitylist => this.onComplexityListSuccess(complexitylist.data),
         error => this.onError(error));
      }
    );

    myJobrequirementService.showTest$.subscribe(
      data => {
        this.isComplexityShow=true;
        this.roles=data.role;
        this.industry=data.industry;
      }
    );

  }

  onComplexityListSuccess(data:any) {
    this.complexityData=data;
    this.complexities=new Array(0);
    for(let role of data) {
      for(let capability of role.capabilities){
        for(let complexity of capability.complexities){
          this.complexities.push(complexity);
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
  selectOption(selectedComplexity:any) {
    if (selectedComplexity.target.checked) {
      let currentComplexity = new Complexity();
      currentComplexity.name = (selectedComplexity.currentTarget.children[0].innerText).trim();
      let scenario = new Scenario();
      scenario.name = selectedComplexity.target.value
      currentComplexity.scenarios.push(scenario);
      this.count++;
      this.searchSelectedComplexity(currentComplexity);

      if(this.count>=this.complexities.length) {debugger
        for(let data of this.complexityData) {
            this.industryRoles.roles.push(data);
        }
        this.industryService.addIndustryProfile(this.industryRoles).subscribe(
          user => {
            console.log(user);
          },
          error => {
            console.log(error);
          });
        this.showfield=true;
        this.proficiencyService.change(true);
        this.jobPostComplexiyservice.change(this.industryRoles);
      }
    }

  }

  searchSelectedComplexity(selectComplexity:Complexity){
    for(let i=0;i<this.complexityData.length;i++){
      for(let j=0;j<this.complexityData[i].capabilities.length;j++){
        for (let k=0;k<this.complexityData[i].capabilities[j].complexities.length;k++){
          if(this.complexityData[i].capabilities[j].complexities[k].name===selectComplexity.name){
            this.complexityData[i].capabilities[j].complexities[k]=selectComplexity;

          }
        }
      }
    }
  }

}
