import {Component} from "@angular/core";
import {Http} from "@angular/http";
import {JobRequirement} from "../model/job-requirement";
import {FormGroup} from "@angular/forms";
import {MessageService} from "../../../framework/shared/message.service";
import {IndustryListService} from "../industry-list/industry-list.service";
import {Message} from "../../../framework/shared/message";
import {MyJobRequirementService} from "../jobrequirement-service";
import {ProfessionalDataService} from "../professional-data/professional-data.service";
import {JobRequirementService} from "./job-requirement.service";


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

  private educationlist=new Array();
  private experiencelist=new Array();
  private salarylist=new Array()
  private noticeperiodlist=new Array();
  private educationModel: string;
  private experienceModel: string;
  private salaryModel: string;
  private noticeperiodModel: string;


  constructor(private industryService: IndustryListService,
              private professionaldataservice:ProfessionalDataService,
              private http: Http,
              private messageService: MessageService,
              private myJobrequirementService :MyJobRequirementService,
              private jobrequirement:JobRequirementService ) {
  }


  ngOnInit() {
    this.professionaldataservice.getEducationList()
      .subscribe(
        data=> { this.onEducationListSuccess(data);},
        error =>{ this.onError(error);});


  }


  selectIndustryModel(industry: any) {
    this.storedIndustry = industry;
    this.industryModel = industry;
    this.jobRequirement.industry = this.industryModel;


    this.industryService.getRoles(industry)
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
  selectRolesModel(role: any) {debugger
    this.roleModel =role;
    this.storedRoles.push(role);
    this.jobRequirement.role = this.roleModel;

    this.myJobrequirementService.change(this.jobRequirement);




  }
  onEducationListSuccess(data:any){
    for(let k of data.educated){
      this.educationlist.push(k);
    }

  }

  selecteducationModel(education: any) {
    this.educationModel = education;

    this.jobRequirement.education = this.educationModel;



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

  selectexperienceModel(experience: any) {
    this.experienceModel = experience;

    this.jobRequirement.experience = this.experienceModel;



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
  selectsalaryModel(salary: any) {
    this.salaryModel = salary;
    this.jobRequirement.salary = this.salaryModel;
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

  selectenoticeperiodModel(noticeperiod: any) {
     this.noticeperiodModel = noticeperiod;
    this.jobRequirement.noticeperiod= this.noticeperiodModel;
    this.jobrequirement.change(this.jobRequirement);

    this.industryService.getIndustries()
      .subscribe(
        industrylist => this.onIndustryListSuccess(industrylist.data),
        error => this.onError(error));
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
