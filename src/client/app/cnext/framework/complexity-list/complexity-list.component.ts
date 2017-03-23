import {Response, Http} from '@angular/http';
import {Component} from '@angular/core';
import {Complexity} from "../model/complexity";
import {ComplexityService} from "../complexity.service";
import {ProficiencyService} from "../proficience.service";
import {MyCapabilityService} from "../capability-service";
import {MyIndustryService} from "../industry-service";
import {MyRoleService} from "../role-service";
import {ComplexityListService} from "./complexity-list.service";
import {MessageService} from "../../../framework/shared/message.service";




@Component({
  moduleId: module.id,
  selector: 'cn-complexity-list',
  templateUrl: 'complexity-list.component.html',
  styleUrls: ['complexity-list.component.css']
})

export class ComplexityListComponent {
  private complexities: Complexity[];
  private selectedComplexity=new Array();
  private isComplexityShow : boolean =false;
  private capabilities=new Array();
  private roles=new Array();
  private industry:any;

  constructor( private http:Http,
                private complexityService: ComplexityService,
               private proficiencyService: ProficiencyService,
               private complexityListServive:ComplexityListService,
               private messageService:MessageService,
               private myCapabilityListService:MyCapabilityService,
               private myIndustryService :MyIndustryService,
               private roleservice :MyRoleService) {
    complexityService.showTest$.subscribe(
      data=>{
          this.isComplexityShow=data;
      }
    );
    myIndustryService.showTest$.subscribe(
      data=>{
        this.industry=data;
      }
    );
    roleservice.showTest$.subscribe(
      data=>{
        this.roles=data;
      }
    );

    myCapabilityListService.showTest$.subscribe(
      data=>{
        this.capabilities=data;
        console.log("from complex capab",this.capabilities);

        this.complexityListServive.getComplexity(this.industry,this.roles,this.capabilities)
         .subscribe(
         complexitylist => this.onComplexityListSuccess(complexitylist.data),
         error => this.onError(error));
      }
    );

  }

  onComplexityListSuccess(data:any){
    setTimeout(()=>{
      this.complexities=data.data;
    },1000);


  }

  onError(error:any){
    var message = new Message();
    message.error_msg = error.err_msg;
    message.isError = true;
    this.messageService.message(message);
  }



  selectOption(newVal:any){
    if (newVal.target.checked) {
      for (let i = 0; i < this.selectedComplexity.length; i++) {
        if (this.selectedComplexity[i].name === newVal.currentTarget.children[0].innerHTML) {
          if (i > -1) {
            this.selectedComplexity.splice(i, 1);
          }
        }
      }
      let currentComplexity=new Complexity();
      currentComplexity.name=newVal.currentTarget.children[0].innerHTML;
      currentComplexity.scenario=newVal.target.value
      if(newVal.target.value !== "none") {
        this.selectedComplexity.push(currentComplexity);
      }
    }
    if(this.selectedComplexity.length>1){
      this.proficiencyService.change(true);
    }
  }
}
