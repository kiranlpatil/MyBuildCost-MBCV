import {Component} from "@angular/core";
import {Http} from "@angular/http";
import {JobRequirement} from "../model/job-requirement";
import {FormGroup} from "@angular/forms";
import {MessageService} from "../../../framework/shared/message.service";
import {IndustryListService} from "../industry-list/industry-list.service";
import {Message} from "../../../framework/shared/message";
import {MyJobRequirementService} from "../jobrequirement-service";
import {ProfessionalDataService} from "../professional-data/professional-data.service";


@Component({
  moduleId: module.id,
  selector: 'cn-job-requirement',
  templateUrl: 'job-requirement.component.html',
  styleUrls: ['job-requirement.component.css']
})

export class JobRequirementComponent {
  private jobRequirement = new JobRequirement();
  private storedIndustry: string;
  private industries = new Array();
  private roles = new Array();
  private storedRoles = new Array();
  private industryModel = "";
  private roleModel = "";

  private educationlist: string[];
  private experiencelist: string[];
  private salarylist: string[];
  private noticeperiodlist: string[];
  private educationModel: string;
  private experienceModel: string;
  private salaryModel: string;
  private noticeperiodModel: string;


  constructor(private industryService: IndustryListService,
              private professionaldataservice:ProfessionalDataService,
              private http: Http,
              private messageService: MessageService,
              private myJobrequirementService :MyJobRequirementService) {
  }


  ngOnInit() {
    this.industryService.getIndustries()
      .subscribe(
        industrylist => this.onIndustryListSuccess(industrylist.data),
        error => this.onError(error));
  }


  selectIndustryModel(newVal: any) {
    this.storedIndustry = newVal;
    this.industryModel = newVal;
    this.jobRequirement.industryModel = this.industryModel;


    this.industryService.getRoles(newVal)
      .subscribe(
        (rolelist:any) => this.onRoleListSuccess(rolelist.data),
        (error:any) => this.onError(error));

  }



  onRoleListSuccess(data:any){
    //this.rolesData=data;
    for(let role of data){
      this.roles.push(role.name);
    }
  }
  selectRolesModel(newVal: any) {
    this.roleModel =newVal;
    this.storedRoles.push(newVal);
    this.jobRequirement.roleModel = this.roleModel;

    this.myJobrequirementService.change(this.jobRequirement);



    this.professionaldataservice.getEducationList()
      .subscribe(
        data=> { this.onEducationListSuccess(data);},
        error =>{ this.onError(error);});
  }
  onEducationListSuccess(data:any){
    for(let k of data.educated){
      this.educationlist.push(k);
    }

  }

  selecteducationModel(newVal: any) {debugger
    this.educationModel = newVal;

    this.jobRequirement.educationModel = this.educationModel;



    this.professionaldataservice.getExperienceList()
      .subscribe(
        data=> { this.onExperienceListSuccess(data);},
        error =>{ this.onError(error);});

  }
  onExperienceListSuccess(data:any){
    for(let k of data.experience){
      this.experiencelist.push(k);
    }

  }

  selectexperienceModel(newVal: any) {debugger
    this.experienceModel = newVal;

    this.jobRequirement.experienceModel = this.experienceModel;



    this.professionaldataservice.getCurrentSalaryList()
      .subscribe(
        data=> { this.onCurrentSalaryListSuccess(data);},
        error =>{ this.onError(error);});

  }


  onCurrentSalaryListSuccess(data:any){
    for(let k of data.salary ){
      this.salarylist.push(k);
    }

  }
  selectsalaryModel(newVal: any) {
    this.salaryModel = newVal;
    this.jobRequirement.salaryModel = this.salaryModel;
    this.professionaldataservice.getNoticePeriodList()
      .subscribe(
        data=> { this.onGetNoticePeriodListSuccess(data);},
        error =>{ this.onError(error);});


  }


  onGetNoticePeriodListSuccess(data:any){
    for(let k of data.noticeperiod){
      this.noticeperiodlist.push(k);
    }

  }

  selectenoticeperiodModel(newVal: any) {
     this.noticeperiodModel = newVal;
    this.jobRequirement.noticeperiodModel = this.noticeperiodModel;
  }




  onIndustryListSuccess(data: any) {

    for (let industry of data) {
      this.industries.push(industry.name);
    }
  }

  onError(error:any){
    var message = new Message();
    message.error_msg = error.err_msg;
    message.isError = true;
    this.messageService.message(message);
  }

}
