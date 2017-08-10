import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from "@angular/core";
import {CandidateProfileService} from "../candidate-profile/candidate-profile.service";
import {Candidate, Section} from "../model/candidate";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Tooltip, ImagePath} from "../../../framework/shared/constants";
import {GuidedTourService} from "../guided-tour.service";


@Component({
  moduleId: module.id,
  selector: 'cn-awards',
  templateUrl: 'awards.component.html',
  styleUrls: ['awards.component.css']
})

export class AwardsComponent implements OnInit {

  @Input() candidate: Candidate;
  @Input() highlightedSection: Section;
  @Output() onComplete = new EventEmitter();
  @ViewChild('awardParentDiv') parentContainer: ElementRef;
  @ViewChild('awardInnerDiv') innerContainer: ElementRef;
  isScrollActive: boolean = false;
  temp: number = 20;

  public awardDetail: FormGroup;


  private isButtonShow: boolean = false;
  private showButton: boolean = true;
  private submitStatus: boolean;
  tooltipMessage: string = '<ul><li><p>1. '+Tooltip.AWARDS_TOOLTIP+'</p></li></ul>';
  private guidedTourStatus:string[] = new Array(0);
  private guidedTourImgOverlayScreensProfile:string;
  private guidedTourImgOverlayScreensProfilePath:string;
  private isGuideImg:boolean;
  constructor(private _fb: FormBuilder, private profileCreatorService: CandidateProfileService,private guidedTourService:GuidedTourService) {
    this.awardDetail = this._fb.group({
      awards: this._fb.array([])
    });
  }

  ngOnInit() {
    //subscribe to addresses value changes
    this.awardDetail.controls['awards'].valueChanges.subscribe(x => {
      this.isButtonShow = true;
    });
    this.isGuideImg = false;
  }

  ngAfterViewChecked() {
    if (this.isScrollActive) {
      this.scrollToBottom();
      this.isScrollActive = false;
    }
  }

  ngOnChanges(changes: any) {
    if (changes.candidate.currentValue != undefined) {
      this.candidate = changes.candidate.currentValue;
      if (this.candidate.awards != undefined && this.candidate.awards.length > 0) {

        this.clearAwardDetails();
        let controlArray = <FormArray>this.awardDetail.controls['awards'];
        this.candidate.awards.forEach(item => {
          const fb = this.initAwardDetails();
          fb.patchValue(item);
          controlArray.push(fb);
        });
      }
      if (this.candidate.awards.length == 0) {
        this.addAward("fromNgOnChanges");
      }
    }
  }

  initAwardDetails() {
    return this._fb.group({
      remark: [''],
      name: ['', Validators.required],
      issuedBy: ['', Validators.required],
      year: ['', Validators.required]
    });
  }

  addAward(calledFrom: string) {
    if ((calledFrom == "fromNgOnChanges" && this.awardDetail.controls["awards"].value.length == 0) || calledFrom == "addAnother") {
      this.submitStatus = false;
      const control = <FormArray>this.awardDetail.controls['awards'];
      const addrCtrl = this.initAwardDetails();
      control.push(addrCtrl);
    }
    this.isScrollActive = true;
  }

  scrollToBottom(): void {
    try {
      this.scroll(this.parentContainer.nativeElement, 0);
    } catch (err) {
    }
  }

  scroll(c: any, i: any) {
    const control = <FormArray>this.awardDetail.controls['awards'];
    i++;
    if (i > control.length * 50) {
      this.temp = 20;
      return;
    }
    c.scrollTop = this.temp + 20;
    this.temp = c.scrollTop;
    setTimeout(() => {
      this.scroll(c, i);
    }, 20);
  }


  removeAward(i: number) {
    const control = <FormArray>this.awardDetail.controls['awards'];
    control.removeAt(i);
    this.candidate.awards.splice(i, 1);
    this.postData('do_nothing');
  }

  clearAwardDetails() {
    const control = <FormArray>this.awardDetail.controls['awards'];
    for (let index = 0; index < control.length; index++) {
      control.removeAt(index);
    }
  }

  postData(type: string) {
    let isDataValid = false;

    if (type == 'delete') {
      this.profileCreatorService.addProfileDetail(this.candidate).subscribe(
        user => {
        });
      return;
    }

    let awards = this.awardDetail.value.awards;
    if(awards.length == 1){
      if (awards[0].issuedBy == "" && awards[0].name == ""
        && awards[0].year == "") {
        if (type == 'next') {
          this.onNext();
        }
        else if (type == 'save') {
          this.onSave();
        }
        return;
      }
    }

    for (let awardsData of this.awardDetail.value.awards) {
      if (awardsData.issuedBy != "" && awardsData.name != "" && awardsData.year != "") {
        isDataValid = true;
      } else if(awardsData.issuedBy != "" || awardsData.name != "" || awardsData.year != "") {
        this.submitStatus = true;
        return;
      } else {
        isDataValid = false;
        this.submitStatus = true;
        return;
      }
    }

    if (isDataValid) {
      this.candidate.awards = this.awardDetail.value.awards;
      this.profileCreatorService.addProfileDetail(this.candidate).subscribe(
        user => {
          if (type == 'next') {
            this.onNext();
          }
          else if (type == 'save') {
            this.onSave();
          }
        });
      return;
    }
    if (type === 'next') {
      this.onNext();
    } else if (type === 'save') {
      this.onSave();
    }

    let _body: any = document.getElementsByTagName('BODY')[0];
    _body.scrollTop = -1;
  }

  onNext() {
    this.isGuidedTourImgRequire();
  }

  isGuidedTourImgRequire() {
    this.isGuideImg = true;
    this.guidedTourImgOverlayScreensProfile = ImagePath.CANDIDATE_OERLAY_SCREENS_PROFILE;
    this.guidedTourImgOverlayScreensProfilePath = ImagePath.BASE_ASSETS_PATH_DESKTOP + ImagePath.CANDIDATE_OERLAY_SCREENS_PROFILE;
    this.guidedTourStatus = this.guidedTourService.getTourStatus();
    if(this.guidedTourStatus.indexOf(this.guidedTourImgOverlayScreensProfile) !== -1) {
      this.onComplete.emit();
      this.highlightedSection.name = 'none';
      this.highlightedSection.isDisable = false;
    }
  }

  onGotItGuideTour() {
    this.guidedTourStatus = this.guidedTourService.updateTourStatus(ImagePath.CANDIDATE_OERLAY_SCREENS_PROFILE,true);
    this.isGuidedTourImgRequire()
  }

  onSave() {
    this.onComplete.emit();
    this.highlightedSection.name = 'none';
    this.highlightedSection.isDisable = false;
  }

  onPrevious() {
    this.highlightedSection.name = 'AcademicDetails';
    let _body: any = document.getElementsByTagName('BODY')[0];
    _body.scrollTop = -1;
  }

  onEdit() {
    this.highlightedSection.name = 'Awards';
    this.highlightedSection.isDisable = true;
    this.showButton = false;
    let _body: any = document.getElementsByTagName('BODY')[0];
    _body.scrollTop = -1;
  }
}
