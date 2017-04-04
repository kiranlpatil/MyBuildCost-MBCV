
import { Component } from '@angular/core';
import { BaseService } from '../../../framework/shared/httpservices/base.service';
import { ProfessionalData } from '../model/professional-data';
import { ProfessionalDataService  } from './professional-data.service'
import { Message } from '../../../framework/shared/message';
import { MessageService } from '../../../framework/shared/message.service';
import { ProfessionalService } from '../professional-service';
@Component({
  moduleId: module.id,
  selector: 'cn-professional-data',
  templateUrl: 'professional-data.component.html',
  styleUrls: ['professional-data.component.css']
})

export class ProfessionalDataComponent extends BaseService {
  private selectedProfessionalData=new ProfessionalData();
  private realocationlist=new Array();
  private educationlist=new Array();
  private experiencelist=new Array();
  private salarylist=new Array();
  private noticeperiodlist=new Array();
  private realocationModel:string;
  private educationModel:string;
  private experienceModel:string;
  private salaryModel:string;
  private noticeperiodModel:string;



  constructor(private professionaldataservice:ProfessionalDataService,
              private messageService:MessageService,
              private professionalService : ProfessionalService) {
    super();
  }

  ngOnInit() {

      this.professionaldataservice.getRealocationList()
        .subscribe(
          data=> { this.onRealocationListSuccess(data)},
          error =>{ this.onError(error);});

    this.professionaldataservice.getEducationList()
      .subscribe(
        data=> { this.onEducationListSuccess(data);},
        error =>{ this.onError(error);});


    this.professionaldataservice.getExperienceList()
      .subscribe(
        data=> { this.onExperienceListSuccess(data);},
        error =>{ this.onError(error);});

    this.professionaldataservice.getCurrentSalaryList()
      .subscribe(
        data=> { this.onCurrentSalaryListSuccess(data);},
        error =>{ this.onError(error);});


    this.professionaldataservice.getNoticePeriodList()
      .subscribe(
        data=> { this.onGetNoticePeriodListSuccess(data);},
        error =>{ this.onError(error);});


  }
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
  selectedRealocationModel(newVal: any) {
    this.realocationModel = newVal;
    this.selectedProfessionalData.relocate=this.realocationModel;

  }

  selectedEducationModel(newVal: any) {
    this.educationModel = newVal;
    this.selectedProfessionalData.education=this.educationModel;

  }

  selectedExperienceModel(newVal: any) {
    this.experienceModel = newVal;
    this.selectedProfessionalData.experience=this.experienceModel;

  }

  selectedSalaryModel(newVal: any) {
    this.salaryModel = newVal;
    this.selectedProfessionalData.currentSalary=this.salaryModel;
  }

  selectedNoticeperiodModel(newVal: any) {
    this.noticeperiodModel = newVal;
    this.selectedProfessionalData.noticePeriod=this.noticeperiodModel;

    this.professionaldataservice.addProfessionalData(this.selectedProfessionalData)
      .subscribe(
        user => console.log(user),
        error => console.log(error));
  }
}

