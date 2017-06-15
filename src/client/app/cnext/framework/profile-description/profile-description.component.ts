import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
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

export class ProfileDescriptionComponent implements OnInit {
  @Input() candidate: Candidate = new Candidate();
  @Input() highlightedSection: Section;
  @Output() onComplete = new EventEmitter();

  // private compactView:boolean=true;
  private disableButton: boolean = true;
  private showButton: boolean = true;
  private candidateDetails: CandidateDetail = new CandidateDetail();
  private image_path: string = 'assets/framework/images/dashboard/profile.png';
  tooltipMessage: string =
    "<ul>" +
    "<li><h5> Job Title </h5><p>Enter your current job title</p></li>" +
    "<li><h5>Core Industry</h5><p>Enter your core Industry in which you are working or have your maximum experience</p></li>" +
    "<li><h5>Profile Picture</h5><p>Please update your latest profile picture. Profiles with your best picture increase your possiblity to get shortlisted.</p></li>" +
    "</ul>";

  constructor(private userProfileService: DashboardService) {
  }

  ngOnInit() {
    this.userProfileService.getUserProfile()
      .subscribe(
        userprofile => {
          this.candidateDetails = userprofile.data;
          if (this.candidateDetails.picture != undefined) {
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

  onIndustryChange(newIndustry: Industry) {
    if (newIndustry !== undefined && newIndustry.name !== "") {
      if (this.candidate.industry.name !== newIndustry.name) {
        this.candidate.industry = newIndustry;
        this.candidate.industry.roles = new Array();
        this.disableButton = false;
      }
    }
  }

  onPictureUpload(imagePath: string) {
    this.candidate.basicInformation.picture = imagePath;
    this.image_path = AppSettings.IP + imagePath.substring(4).replace('"', '');
  }

  onNext() {
//    this.compactView = true;
    this.highlightedSection.name = 'Work-Area';
    this.highlightedSection.isDisable = false;

    this.onComplete.emit(this.candidate);
    let height = screen.height;
    var p = document.getElementById('work-area');
    var top = p.offsetTop;
    window.scrollBy(0, -(top - 50));
  }

  onSave() {
//    this.compactView = true;
    this.highlightedSection.name = 'none';
    this.highlightedSection.isDisable = false;
    this.onComplete.emit(this.candidate);
    this.showButton = true;
  }
}


