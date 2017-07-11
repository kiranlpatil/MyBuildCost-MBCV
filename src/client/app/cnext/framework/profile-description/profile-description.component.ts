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
  styleUrls: ['profile-description.component.css'],
   host: {
         '(document:keydown)': 'keyboardInput($event)'
       }
})

export class ProfileDescriptionComponent implements OnInit {
  @Input() candidate: Candidate = new Candidate();
  @Input() highlightedSection: Section;
  @Output() onComplete = new EventEmitter();

  // private compactView:boolean=true;
  private savedIndustry: string = '';
  private changedIndustry: Industry = new Industry();
  private disableButton: boolean = true;
  private showButton: boolean = true;
  private savedJobTitle: string;
  private candidateDetails: CandidateDetail = new CandidateDetail();
  private showModalStyle: boolean = false;
  private image_path: string = 'assets/framework/images/dashboard/profile.png';
  tooltipMessage: string =
    '<ul>' +
    '<li><h5> Job Title </h5><p>Enter your current job title. </p></li>' +
    '<li><h5>Industry</h5><p>Enter your industry. This industry forms the core of your current professional profile. In next sections, you shall be shown questions and parameters that are relevant to this industry. If you have worked in multiple industries, choose the one that is most relevent as on date. You shall get option to include additional industries in later section.</p></li>' +
    '<li><h5>Profile Picture</h5><p>Please update your latest profile picture. Profiles with your best picture increase your possiblity to get shortlisted.</p></li>' +
    '</ul>';

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


  ngOnChanges(changes: any) {
    if (changes.candidate !== undefined && changes.candidate.currentValue !== undefined) {
      this.candidate = changes.candidate.currentValue;
    }
    if (this.candidate.jobTitle !== undefined && this.candidate.jobTitle !== ""
      && this.candidate.industry.name !== undefined && this.candidate.industry.name !== "") {
      this.savedIndustry = this.candidate.industry.name;
      this.savedJobTitle = this.candidate.jobTitle;
      this.changedIndustry = new Industry();
      this.changedIndustry.name = this.savedIndustry;
      console.log(this.savedIndustry);
    }
  }



  onPictureUpload(imagePath: string) {
    this.candidate.basicInformation.picture = imagePath;
    this.image_path = AppSettings.IP + imagePath.substring(4).replace('"', '');
  }

  onNext() {
    console.log("from next");
    this.candidate.industry = this.changedIndustry;
    this.candidate.industry.roles = [];
    this.disableButton = false;
    this.savedIndustry = this.candidate.industry.name;
//    this.compactView = true;
    this.highlightedSection.name = 'Industry';
    this.highlightedSection.isDisable = false;

    this.onComplete.emit(this.candidate);
    let height = screen.height;
    var p = document.getElementById('work-area');
    var top = p.offsetTop;
    window.scrollBy(0, -(top - 50));
  }

  onSave() {
    console.log("from save");
//    this.compactView = true;
    if (this.changedIndustry.name !== this.savedIndustry || this.candidate.jobTitle !== this.savedJobTitle) {
      if(this.changedIndustry.name !== this.savedIndustry) {
        this.showModalStyle = !this.showModalStyle;
      }
      else {
        this.savedJobTitle = this.candidate.jobTitle ;
        this.highlightedSection.name = 'none';
        this.highlightedSection.isDisable = false;
        this.onComplete.emit(this.candidate);
      }
    } else {
      this.onCancel();
    }
  }

  onJobTitleChange() {
    if (this.candidate && this.candidate.jobTitle === '') {
      this.disableButton = true;
    } else {
      if ((this.candidate.industry && this.candidate.industry.name !== '') || (this.changedIndustry && this.changedIndustry.name !== '')) {
        this.disableButton = false;
      }
      console.log("hello");
    }
  }

  getStyleModal() {
    if (this.showModalStyle) {
      return 'block';
    } else {
      return 'none';
    }
  }

  showHideModal() {
    this.showModalStyle = !this.showModalStyle;
  }

  onCancel() {
    console.log("from cancel");
    this.highlightedSection.name = 'none';
    this.highlightedSection.isDisable = false;
    this.candidate.jobTitle = this.savedJobTitle;
    this.changedIndustry = new Industry();
    this.changedIndustry.name = this.savedIndustry;
  }

  keyboardInput(event: KeyboardEvent) {
    if (event.keyCode === 39) {
      this.onNext();
    }
    if (event.keyCode === 37) {
      this.onCancel();
    }
  }
}


