import {Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild} from "@angular/core";
import {Role} from "../model/role";
import {ComplexityService} from "../complexity.service";
import {LocalStorageService} from "../../../framework/shared/localstorage.service";
import {LocalStorage, Messages, Tooltip, ValueConstant, ImagePath, Headings} from "../../../framework/shared/constants";
import {Section} from "../model/candidate";
import {ComplexityDetails} from "../model/complexity-detail";
import {ComplexityComponentService} from "./complexity.service";
import {JobCompareService} from "../single-page-compare-view/job-compare-view/job-compare-view.service";
import {Capability} from "../model/capability";
import {GuidedTourService} from "../guided-tour.service";
import {ErrorService} from "../error.service";

@Component({
  moduleId: module.id,
  selector: 'cn-complexities',
  templateUrl: 'complexities.component.html',
  styleUrls: ['complexities.component.css']
})

export class ComplexitiesComponent implements OnInit, OnChanges {
  @Input() roles: Role[] = new Array(0); //TODO remove this
  @Input() complexities: any; //TODO why this is of type of ANY
  @Output() onComplete = new EventEmitter();
  @Output() onComplextyAnswered = new EventEmitter();
  @Input() highlightedSection: Section;
  @Input() isComplexityPresent: boolean = true;

  gotItMessage: string= Headings.GOT_IT;
  capabilitiesHeading: string= Headings.CAPABITITIES_HEADING;
  private complexityIds: string[] = [];
  //private duplicateComplexityIds: string[] = [];
  private complexityList: any[] = new Array(0);
  private currentComplexityDetails: ComplexityDetails = new ComplexityDetails();
  private isComplexityButtonEnable: boolean = false;
  private showModalStyle: boolean = false;
  private isCandidate: boolean = false;
  private currentComplexity: number;
  private showMore: boolean = false;
  private slideToRight: boolean = false;
  private slideToLeft: boolean = false;
  private capabilities: Capability[] = [];
  private complexityData: any;
  private isValid: boolean = true;
  private currentCapability: Capability = new Capability();
  private currentCapabilityNumber: number;
  private singleComplexity: boolean = false;
  private currentRecruiterQuestion: string;
  private requiedValidationMessageCandidate = Messages.MSG_ERROR_VALIDATION_COMPLEXITY_REQUIRED_CANDIDATE;
  private requiedValidationMessageRecruiter = Messages.MSG_ERROR_VALIDATION_COMPLEXITY_REQUIRED_RECRUITER;

  tooltipCandidateMessage: string = '<ul><li>' +
    '<p>1. '+ Tooltip.COMPLEXITIES_CANDIDATE_TOOLTIP_1+'</p></li>'+
    '<li><p>2. '+Tooltip.COMPLEXITIES_CANDIDATE_TOOLTIP_2+'</p></li></ul>';
  tooltipRecruiterMessage: string = '<ul><li>' +
    '<p>1. '+Tooltip.COMPLEXITIES_RECRUITER_TOOLTIP_1+'</p></li>' +
    '<li><p>2. '+Tooltip.COMPLEXITIES_RECRUITER_TOOLTIP_2+'</p>' +
    '</li></ul>';
  @ViewChild('save')
  private _inputElement1: ElementRef;
  private maxCapabilitiesToShow = ValueConstant.MAX_CAPABILITIES_TO_SHOW;
  private guidedTourStatus:string[] = new Array(0);
  private guidedTourImgOverlayScreensKeySkills:string;
  private guidedTourImgOverlayScreensKeySkillsPath:string;
  private isGuideImg:boolean = false;

  constructor(private complexityService: ComplexityService,
              private complexityComponentService: ComplexityComponentService,
              private jobCompareService: JobCompareService,
              private errorService: ErrorService,
              private guidedTourService:GuidedTourService) {
  }

  ngOnInit() {
    if (LocalStorageService.getLocalValue(LocalStorage.IS_CANDIDATE) === 'true') {
      this.isCandidate = true;
    }
  }

  ngOnChanges(changes: any) {

    if (changes.roles && changes.roles.currentValue) {
      this.roles = changes.roles.currentValue;
    }
    if (changes.complexities && changes.complexities.currentValue) {
      this.complexities = changes.complexities.currentValue;
      let jobId: string;
      if (!this.isCandidate) {
        jobId = LocalStorageService.getLocalValue(LocalStorage.POSTED_JOB);
      }
      this.complexityComponentService.getCapabilityMatrix(jobId).subscribe(
        capa => {
          this.complexityData = capa.data;
          let savedCapabilities:Capability[]=new Array(0);
          for( let i=0;i<this.capabilities.length;i++ ) {
            let originalcapability =Object.assign({}, this.capabilities[i]);
            savedCapabilities.push(originalcapability);
          }
          this.capabilities = this.jobCompareService.getStandardMatrix(capa.data);
          if(!this.isEqualArrays(this.capabilities,savedCapabilities)) {
            this.getComplexityIds(this.complexities);
          }
        },error => this.errorService.onError(error));
    }
  }


  inArray(array:Capability[], el:Capability) {
  for ( let i = array.length; i--; ) {
    if ( array[i].code === el.code ) return true;
  }
  return false;
}
  isEqualArrays(arr1:Capability[], arr2:Capability[]) {
  if ( arr1.length !== arr2.length ) {
    return false;
  }
  for ( let i = arr1.length; i--; ) {
    if ( !this.inArray( arr2, arr1[i] ) ) {
      return false;
    }
  }
  return true;
}
  getCurrentComplexityPosition() {
    for (let i = 0; i < this.complexityIds.length; i++) {
      if (this.complexityList[i].userChoice === undefined || this.complexityList[i].userChoice === '') {
        return i;
      }
    }
    return 0;
  }

  getComplexityIds(complexities: any) {
    this.currentComplexity = 0;
    this.currentCapabilityNumber = 0;
    this.complexityIds = [];
    this.complexityIds = Object.keys(complexities);
    //this.removeDuplicateIds();
    this.complexityList = [];
    for (let id in complexities) {
      this.complexityList.push(this.complexityData[id]);
    }
    this.getCapabilityDetail(this.currentCapabilityNumber);
    this.currentComplexity = this.getCurrentComplexityPosition();
    this.getComplexityDetails(this.complexityIds[this.currentComplexity]);
  }

  /*removeDuplicateIds() {
   /!* let copyOfcomplexityIds = this.complexityIds.slice();
     for(let copy of copyOfcomplexityIds){
     copy = copy.replace("d", "");
     }

     var sorted_arr = copyOfcomplexityIds.slice().sort();
     for (var i = 0; i < this.complexityIds.length - 1; i++) {
     if (sorted_arr[i + 1] == sorted_arr[i]) {
     this.duplicateComplexityIds.push(sorted_arr[i]);
     }
   }*!/

    for (let id of this.complexityIds) {
      for (let index of this.complexityIds) {
        if (id.indexOf("d") == 0) {
          let temp = id.split("d")[1];
          if (temp == index) {
            this.duplicateComplexityIds.push(id);
          }
        }
      }
    }
   }*/

  onSaveComplexity() {
    this.isValid = true;
    let jobId: string;
    if (!this.isCandidate) {
      jobId = LocalStorageService.getLocalValue(LocalStorage.POSTED_JOB);
    }
    this.complexityComponentService.getCapabilityMatrix(jobId).subscribe(
      capa => {
        this.capabilities = this.jobCompareService.getStandardMatrix(capa.data);
      },error => this.errorService.onError(error));
    this.isComplexityButtonEnable = false;
    if (this.isCandidate) {
      // this.showModalStyle = !this.showModalStyle;
      this.highlightedSection.isLocked = true;

    }
    this.complexityService.change(true);
    if (this.highlightedSection.isProficiencyFilled && this.highlightedSection.iscompleted) {
      this.highlightedSection.name = 'none';
    } else {
      this.highlightedSection.name = 'Proficiencies';
    }
    this.highlightedSection.isDisable = false;
    this.onComplete.emit();
  }

  saveComplexity() {
    this.isGuidedTourImgRequire();
  }

  onAnswered(complexityDetail: ComplexityDetails) {
    this.isValid = true;
    this.complexities[this.complexityIds[this.currentComplexity]] = complexityDetail.userChoice;
    /*if (this.duplicateComplexityIds.indexOf("d" + this.complexityIds[this.currentComplexity]) > -1) {
      let tempIndex = "d" + this.complexityIds[this.currentComplexity];
      this.complexities[tempIndex] = complexityDetail.userChoice;
     }*/
    this.complexityData[this.complexityIds[this.currentComplexity]] = complexityDetail;
    //this.onNext();
  }

  onCapabilityAnswered(capability: Capability) {
    this.capabilities[this.currentCapabilityNumber] = capability;
    /*let currentNumber = this.currentCapabilityNumber;
    if (this.singleComplexity === false) {
      if (currentNumber + 1 === this.capabilities.length) {
        this.saveComplexity();
      } else if (this.currentCapabilityNumber < this.capabilities.length) {
        this.onNextCapability();
      }
    }*/
  }

  oncurrentComplexityAnswered(complexityDetails: ComplexityDetails) {

    this.complexities[complexityDetails.code] = complexityDetails.userChoice;
    this.onComplextyAnswered.emit(this.complexities);
  }

  getCapabilityDetail(currentCapability: number) {

    this.currentCapability = this.capabilities[this.currentCapabilityNumber];
    this.currentRecruiterQuestion = this.currentCapability.complexities[0].complexityDetails.questionHeaderForRecruiter;
  }

  onNextCapability() {
    //this.currentCapabilityNumber++;
      let _body: any = document.getElementsByTagName('BODY')[0];
      _body.scrollTop = -1;
    for (let complexity of this.capabilities[this.currentCapabilityNumber].complexities) {
      if (complexity.complexityDetails.userChoice === undefined) {
        this.isValid = false;
        return;
      }
    }

    let currentCapability = this.currentCapabilityNumber;
    if (currentCapability + 1 === this.capabilities.length) {
      this.isValid = true;
      this.saveComplexity();
      this.highlightedSection.name = 'Proficiencies';
      return;
    }
    this.isValid = true;
    this.getCapabilityDetail(++this.currentCapabilityNumber);
  }

  onPreviousCapability() {
    this.isValid = true;
      let _body: any = document.getElementsByTagName('BODY')[0];
      _body.scrollTop = -1;
    if (this.currentCapabilityNumber === 0) {
      this.highlightedSection.name = 'Capabilities';
      return;
    }
    this.getCapabilityDetail(--this.currentCapabilityNumber);
  }

  onNext() {
    this.isValid = true;
    let _body: any = document.getElementsByTagName('BODY')[0];
    _body.scrollTop = -1;
    if (this.complexities[this.complexityIds[this.currentComplexity]] === -1) {
      this.isValid = false;
      return;
    }

    this.onComplextyAnswered.emit(this.complexities);
    if (this.slideToLeft === true) {
      this.slideToLeft = !this.slideToLeft;
    }
    this.slideToRight = !this.slideToRight;
    if (this.currentComplexity === this.complexityIds.length - 1) {
      if (this.isCandidate) {
        this.saveComplexity();
      } else {
        this.saveComplexity();
      }
    } else if (this.currentComplexity <= this.complexityIds.length - 1) {
      if (this.singleComplexity === false) {
        this.getComplexityDetails(this.complexityIds[++this.currentComplexity]);
      }
    }
    /* setTimeout(() => {
     this.slideToRight = false;
     }, 3000);*/

  }

  isGuidedTourImgRequire() {
    this.isGuideImg = true;
    this.guidedTourImgOverlayScreensKeySkills = ImagePath.CANDIDATE_OERLAY_SCREENS_KEY_SKILLS;
    this.guidedTourImgOverlayScreensKeySkillsPath = ImagePath.BASE_ASSETS_PATH_DESKTOP + ImagePath.CANDIDATE_OERLAY_SCREENS_KEY_SKILLS;
    this.guidedTourStatus = this.guidedTourService.getTourStatus();
    if(this.guidedTourStatus.indexOf(this.guidedTourImgOverlayScreensKeySkills) !== -1 && this.isCandidate) {
      this.onSaveComplexity();
    }
    if(this.isCandidate == false){
      this.onSaveComplexity();
    }
  }

  onGotItGuideTour() {
    this.guidedTourStatus = this.guidedTourService.updateTourStatus(ImagePath.CANDIDATE_OERLAY_SCREENS_KEY_SKILLS,true);
    this.isGuidedTourImgRequire();
  }

  onPrevious() {
    this.isValid = true;
      let _body: any = document.getElementsByTagName('BODY')[0];
      _body.scrollTop = -1;
    if (this.currentComplexity === 0) {
      this.highlightedSection.name = 'Capabilities';
      return;
    }
    if (this.currentComplexity > 0) {
      this.getComplexityDetails(this.complexityIds[--this.currentComplexity]);
    }

    if (this.slideToRight === true) {
      this.slideToRight = !this.slideToRight;
    }
    this.slideToLeft = !this.slideToLeft;
    setTimeout(() => {
      this.slideToLeft = false;
    }, 3000);
  }

  onDone() {
      let _body: any = document.getElementsByTagName('BODY')[0];
      _body.scrollTop = -1;
    if (this.isCandidate) {
      this.onSaveComplexity();
    } else {
      this.onSaveComplexity();
      this.highlightedSection.name = 'None';
    }
    this.singleComplexity = false;
  }

  getComplexityDetails(complexityId: string) {  //TODO remove after amits call of updated get API
    /*if (this.complexityData !== undefined && this.duplicateComplexityIds.indexOf(complexityId) == -1) {*/
    if (this.complexityData !== undefined) {
      this.currentComplexityDetails = this.complexityData[complexityId];
    }
  }

  getStyleModal() {
    if (this.showModalStyle) {
      this._inputElement1.nativeElement.focus();
      return 'block';
    } else {
      this._inputElement1.nativeElement.focus();
      return 'none';
    }
  }

  showHideModal() {
    this.showModalStyle = !this.showModalStyle;
  }

  edit() {
    this.highlightedSection.name = 'Complexities';
    this.highlightedSection.isDisable = true;
    this.showMore = false;
      let _body: any = document.getElementsByTagName('BODY')[0];
      _body.scrollTop = -1;
  }

  SelectedComplexity(selectedComplexity: any) {
    this.singleComplexity = true;
    if (this.isCandidate) {
      this.currentComplexity = this.complexityIds.indexOf(selectedComplexity.complexityDetails.code);
      this.getComplexityDetails(selectedComplexity.complexityDetails.code);
    } else {
      this.currentCapability = selectedComplexity;
    }
    this.currentRecruiterQuestion = this.currentCapability.complexities[0].complexityDetails.questionHeaderForRecruiter;
    this.highlightedSection.name = 'Complexities';
  }
}
