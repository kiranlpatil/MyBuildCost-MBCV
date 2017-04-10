import { Component, OnInit } from '@angular/core';
import { IndustryListService } from './industry-list.service';
import { MyIndustryService } from '../industry-service';
import { Message } from '../../../framework/shared/message';
import { MessageService } from '../../../framework/shared/message.service';
import { MyRoleListTestService } from '../myRolelist.service';
import { DisableTestService } from '../disable-service';
import {LocalStorageService} from "../../../framework/shared/localstorage.service";
import {LocalStorage} from "../../../framework/shared/constants";
import {ProfileCreatorService} from "../profile-creator/profile-creator.service";
import {Candidate} from "../model/candidate";
import {Industry} from "../model/industry";
import {Messages} from "../../../framework/shared/constants";

@Component({
  moduleId: module.id,
  selector: 'cn-industry-list',
  templateUrl: 'industry-list.component.html',
  styleUrls: ['industry-list.component.css']
})

export class IndustryListComponent implements OnInit {

  private industryNames :string[]=new Array();
  private industryData:any;
  private showModalStyle: boolean = false;
  private disbleRole: boolean = true;
  private disbleButton: boolean = true;
  private disableIndustry: boolean = false;
  private storedindustry:string;
  private industry=new Industry();
  private isCandidate : boolean = true;
  private candidate:Candidate=new Candidate();

  constructor(private industryService: IndustryListService,
              private myindustryService : MyIndustryService,
              private myRolelist:MyRoleListTestService,
              private messageService:MessageService ,
              private disableService:DisableTestService,
              private profileCreatorService:ProfileCreatorService) {
  }

  ngOnInit() {
    if(LocalStorageService.getLocalValue(LocalStorage.IS_CANDIDATE)==="true"){
      this.profileCreatorService.getCandidateDetails()
        .subscribe(
          candidateData =>  this.OnCandidateDataSuccess(candidateData),
          error => this.onError(error));

    }

    this.industryService.getIndustries()
      .subscribe(
        industrylist => this.onIndustryListSuccess(industrylist.data),
        error => this.onError(error));

    if(LocalStorageService.getLocalValue(LocalStorage.IS_CANDIDATE)==="false"){
      this.isCandidate=false;
    }
  }

  OnCandidateDataSuccess(candidateData:any){
    if(candidateData.data[0].industry.name !== undefined) {
        this.industry = candidateData.data[0].industry;
          this.disableIndustry = true;
          this.disbleButton = true;
      }
  }
  selectOption(industry:string) {

    if(industry !== undefined){
      this.storedindustry=industry;
      if(LocalStorageService.getLocalValue(LocalStorage.IS_CANDIDATE)==="true"){
        this.candidate.industry.name=industry;

      }
      if(LocalStorageService.getLocalValue(LocalStorage.IS_CANDIDATE)==="false"){
        this.isCandidate=false;
      }
      this.disbleButton=false;
    }

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
    this.storedindustry=industry;
    this.disbleButton = false;
  }


  createAndSave() {
    this.profileCreatorService.addProfileDetail(this.candidate).subscribe(
      user => {
        console.log(user);
      },
      error => {
        console.log(error);
      });
  }

  showHideModal() {
    this.showModalStyle = !this.showModalStyle;
  }
  disableIndustrires() {
    this.myindustryService.change(this.storedindustry);

    this.disableService.change(true);
       this.myRolelist.change(true);

      this.disbleRole = true;
      this.disbleButton = true;
      this.showModalStyle = !this.showModalStyle;
      this.disableIndustry = true;
    if(LocalStorageService.getLocalValue(LocalStorage.IS_CANDIDATE)==="true"){
      this.createAndSave();
    }
  }

  getStyleModal() {
    if (this.showModalStyle) {
      return 'block';
    } else {
      return 'none';
    }
  }
}


