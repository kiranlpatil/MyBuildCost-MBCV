
import {Component, OnInit, Input} from '@angular/core';
import { BaseService } from '../../../framework/shared/httpservices/base.service';
import { ProfessionalData } from '../model/professional-data';
import { ProfessionalDataService } from './professional-data.service';
import { Message } from '../../../framework/shared/message';
import { MessageService } from '../../../framework/shared/message.service';
import { ProfessionalService } from '../professional-service';
import {ProfileCreatorService} from "../profile-creator/profile-creator.service";
import {LocalStorageService} from "../../../framework/shared/localstorage.service";
import {LocalStorage} from "../../../framework/shared/constants";
@Component({
  moduleId: module.id,
  selector: 'cn-professional-data',
  templateUrl: 'professional-data.component.html',
  styleUrls: ['professional-data.component.css']
})

export class ProfessionalDataComponent extends BaseService implements OnInit {
  @Input() professionalDetails:ProfessionalData;

  private realocationlist=new Array();
  private educationlist=new Array();
  private experiencelist=new Array();
  private salarylist=new Array();
  private noticeperiodlist=new Array();

  constructor(private professionaldataservice:ProfessionalDataService,
              private messageService:MessageService,
              private professionalService : ProfessionalService,
              private profileCreatorService:ProfileCreatorService) {
    super();
  }

  ngOnInit() {

      this.professionaldataservice.getRealocationList()
        .subscribe(
          data => { this.onRealocationListSuccess(data); },
          error => { this.onError(error);});

    this.professionaldataservice.getEducationList()
      .subscribe(
        data=> { this.onEducationListSuccess(data);},
        error => { this.onError(error);});


    this.professionaldataservice.getExperienceList()
      .subscribe(
        data=> { this.onExperienceListSuccess(data);},
        error => { this.onError(error);});

    this.professionaldataservice.getCurrentSalaryList()
      .subscribe(
        data=> { this.onCurrentSalaryListSuccess(data);},
        error => { this.onError(error);});


    this.professionaldataservice.getNoticePeriodList()
      .subscribe(
        data=> { this.onGetNoticePeriodListSuccess(data);},
        error => { this.onError(error);});


      if(LocalStorageService.getLocalValue(LocalStorage.IS_CANDIDATE)==="true"){
        this.profileCreatorService.getCandidateDetails()
          .subscribe(
            candidateData => this.OnCandidateDataSuccess(candidateData),
            error => this.onError(error));

      }
  }

  OnCandidateDataSuccess(candidateData:any){}

  onGetNoticePeriodListSuccess(data:any) {
    for(let k of data.noticeperiod) {
      this.noticeperiodlist.push(k);
    }

  }

  onCurrentSalaryListSuccess(data:any) {
    for(let k of data.salary ) {
      this.salarylist.push(k);
    }

  }

  onExperienceListSuccess(data:any) {
    for(let k of data.experience) {
      this.experiencelist.push(k);
    }

  }

  onEducationListSuccess(data:any) {
    for(let k of data.educated) {
      this.educationlist.push(k);
    }

  }
  onRealocationListSuccess(data:any) {
    for(let k of data.realocate ) {
      this.realocationlist.push(k);
    }
  }
  onError(error:any) {
    var message = new Message();
    message.error_msg = error.err_msg;
    message.isError = true;
    this.messageService.message(message);
  }

  changeValue() {
    this.professionalService.change(true);

  }

  saveProfessionalData() {
    this.professionaldataservice.addProfessionalData(this.professionalDetails)
      .subscribe(
        user => console.log(user),
        error => console.log(error));
  }
}

