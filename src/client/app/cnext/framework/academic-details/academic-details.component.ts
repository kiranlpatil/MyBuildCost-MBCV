import {Component, Input,Output,EventEmitter} from '@angular/core';
import {  Academicdetails  } from '../model/academic-details';
import {ValueConstant, LocalStorage} from '../../../framework/shared/constants';
import {  EducationalService  } from '../educational-service';
import {CandidateAcadmyDetailService} from "./academic-details.service";
import {CandidateProfileService} from "../candidate-profile/candidate-profile.service";
import {MessageService} from "../../../framework/shared/message.service";
import {Message} from "../../../framework/shared/message";
import {LocalStorageService} from "../../../framework/shared/localstorage.service";
import {Candidate, Section} from "../model/candidate";

@Component({
  moduleId: module.id,
  selector: 'cn-academic-details',
  templateUrl: 'academic-details.component.html',
  styleUrls: ['academic-details.component.css']
})

export class AcademicDetailComponent {
  @Input() candidate:Candidate;
  @Input() highlightedSection :Section;
  @Output() onComplete = new EventEmitter();

  private  tempfield: string[];
  private year: any;
  private currentDate: any;
  private yearList = new Array();
  private tempSchoolName:string='';
  private tempUnivercityName:string='';
  private tempPassingYear:string='';
  private  tempSpecialization:string='';
  private disableAddAnother:boolean=true;
  private sendPostCall:boolean=false;
  private isShowError:boolean=false;
  private hideDiv:boolean[] = new Array();


  private newAcademicDetails=new Academicdetails();
  constructor(private educationalService : EducationalService,
              private profileCreatorService:CandidateProfileService) {

    this.tempfield = new Array(1);
    this.currentDate = new Date();
    this.year = this.currentDate.getUTCFullYear();
    this.createYearList(this.year);
  }

  createYearList(year: number) {
    for (let i = 0; i < ValueConstant.MAX_ACADEMIC_YEAR_LIST; i++) {
      this.yearList.push(year--);
    }
  }
  selectedSchoolName(schoolname:string) {
   this.tempSchoolName=schoolname;
    this.newAcademicDetails.schoolName=schoolname;
    this.postAcademicDetails();
  }

  selectedeUniversityName(board:string) {
    this.tempUnivercityName=board;
    this.newAcademicDetails.board=board;
    this.postAcademicDetails();
  };
  selectedPassingYear(yearOfPassing:string) {
    this.tempPassingYear=yearOfPassing;
    this.newAcademicDetails.yearOfPassing=yearOfPassing;
    this.postAcademicDetails();
  };

  selectedSpecialization(specialization:string) {
    this.tempSpecialization=specialization;
    this.newAcademicDetails.specialization=specialization;
    this.postAcademicDetails();
  };

  changeValue() {
    this.educationalService.change(true);   //to change the value of progress bar
  }
  ngOnChanges(changes :any){
    if(this.candidate.academics.length===0){
      this.candidate.academics.push(new Academicdetails());
    }
  }


  addAnother() {
    for(let item of this.candidate.academics) {
      if (item.board ==="" || item.schoolName ==="" || item.yearOfPassing ==="") {
        this.disableAddAnother=false;
        this.isShowError=true;

      }
    }
    if(this.disableAddAnother===true)
    {
      this.candidate.academics.push(new Academicdetails());
    }
    this.disableAddAnother=true;

  }

  postAcademicDetails(){
    this.isShowError=false;
    for(let item of this.candidate.academics) {
      if (item.board === '' || item.specialization === '' || item.yearOfPassing === '' || item.yearOfPassing === null) {
        this.sendPostCall=false;

      }
    }
    if(this.sendPostCall===true)
    {
      this.postData();
    }
    this.sendPostCall=true;


  }
  deleteItem(i:number) {
    this.hideDiv[i] = true;
    this.candidate.academics.splice(i, 1);
    this.postData();
    this.hideDiv[i]=false;
  }
  postData(){

    this.profileCreatorService.addProfileDetail(this.candidate).subscribe(
      user => {
        console.log(user);
      });
  }
  onNext() {
    this.onComplete.emit();
    this.highlightedSection.name = "Certification";
  }
}
