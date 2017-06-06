import {Component, Input, Output, EventEmitter} from "@angular/core";
import {Router} from "@angular/router";
import {Industry} from "../model/industry";
import {Candidate, Section} from "../model/candidate";
import {AppSettings} from "../../../framework/shared/constants";
import {DashboardService} from "../../../framework/dashboard/dashboard.service";
import {CandidateDetail} from "../../../framework/registration/candidate/candidate";

@Component({
  moduleId: module.id,
  selector: 'cn-profile-description',
  templateUrl: 'profile-description.component.html',
  styleUrls: ['profile-description.component.css']
})

export class ProfileDescriptionComponent {
  @Input() candidate:Candidate = new Candidate();
  @Input() highlightedSection: Section;
  @Output() onComplete = new EventEmitter();

 // private compactView:boolean=true;
  private disableButton:boolean=true;
  private showButton:boolean=true;
  private candidateDetails:CandidateDetail = new CandidateDetail();
  private image_path:string='assets/framework/images/dashboard/profile.png' ;

  constructor(private userProfileService:DashboardService) {
  }

  ngOnInit() {
    this.userProfileService.getUserProfile()
      .subscribe(
        userprofile => {
          this.candidateDetails = userprofile.data;
          if(this.candidateDetails.picture != undefined ){
          this.image_path = AppSettings.IP + this.candidateDetails.picture.substring(4).replace('"', '');
          }
        });
  }


  // ngOnChanges() {
  //   if (this.candidate.jobTitle !== undefined && this.candidate.jobTitle !== ""
  //     && this.candidate.industry.name !== undefined && this.candidate.industry.name !== "") {
  //     this.compactView = true;
  //   }
  //   else{
  //     this.compactView = false;
  //   }
  // }

  onIndustryChange(newIndustry:Industry) {
    if (newIndustry !== undefined && newIndustry.name !== "") {
      if (this.candidate.industry.name !== newIndustry.name) {
        this.candidate.industry = newIndustry;
        this.candidate.industry.roles=new Array();
        this.disableButton=false;
      }
    }
  }

  onPictureUpload(imagePath:string){
this.candidate.basicInformation.picture=imagePath;
    this.image_path=AppSettings.IP + imagePath.substring(4).replace('"', '');
  }
  onNext() {
//    this.compactView = true;
    this.highlightedSection.name = "Work-Area";
    this.highlightedSection.isDisable=false;

    this.onComplete.emit(this.candidate);
    let height = screen.height;
    //window.scrollBy(0, -(height * 10));
  }
  onSave() {
//    this.compactView = true;
    this.highlightedSection.name = "none";
    this.highlightedSection.isDisable=false;
    this.onComplete.emit(this.candidate);
    this.showButton = true;
  }
}


