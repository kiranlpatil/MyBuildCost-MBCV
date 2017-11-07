import {
  AfterViewChecked,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  Renderer,
  ViewChild
} from "@angular/core";
import {CandidateProfileService} from "../candidate-profile/candidate-profile.service";
import {Candidate, Section} from "../../../user/models/candidate";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Headings, Tooltip, CandidateProfileUpdateTrack, LocalStorage, Messages} from "../../../shared/constants";
import {ErrorService} from "../../../shared/services/error.service";
import {LocalStorageService} from "../../../shared/services/localstorage.service";
import {ComplexityAnsweredService} from "../complexity-answered.service";
import {Router} from "@angular/router";

@Component({
  moduleId: module.id,
  selector: 'cn-academic-details',
  templateUrl: 'academic-details.component.html',
  styleUrls: ['academic-details.component.css']
})

export class AcademicDetailComponent implements OnInit, OnChanges, AfterViewChecked {
  @Input() candidate: Candidate;
  @Input() highlightedSection: Section;
  @Output() onComplete = new EventEmitter();
  @ViewChild('parentDiv') parentContainer: ElementRef;
  @ViewChild('innerDiv') innerContainer: ElementRef;
  isScrollActive: boolean = false;
  temp: number = 20;


  public academicDetail: FormGroup;
  tooltipMessage: string = '<ul><li><p>1. '+Tooltip.ACADEMIC_DETAIL_TOOLTIP+'</p></li></ul>';
  public showButton: boolean = true;
  acadamicDetailsHeading: string= Headings.ACADAMIC_DETAILS;
  private isButtonShow: boolean = false;
  private submitStatus: boolean;
  private isCandidate: boolean;
  private userId: string;

  constructor(private _fb: FormBuilder,
              private errorService:ErrorService,
              private profileCreatorService: CandidateProfileService,
              private renderer: Renderer,
              private complexityAnsweredService: ComplexityAnsweredService,
              private _router: Router) {
    this.academicDetail = this._fb.group({
      academicDetails: this._fb.array([])
    });
  }

  ngOnInit() {
    if (LocalStorageService.getLocalValue(LocalStorage.IS_CANDIDATE) === 'true') {
      this.isCandidate = true;
      this.userId=LocalStorageService.getLocalValue(LocalStorage.USER_ID);
    }

    //subscribe to addresses value changes
    this.academicDetail.controls['academicDetails'].valueChanges.subscribe(x => {
      this.isButtonShow = true;
    });
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
      if (this.candidate.academics != undefined && this.candidate.academics.length > 0) {

        this.clearAcademicDetails();
        let controlArray = <FormArray>this.academicDetail.controls['academicDetails'];
        this.candidate.academics.forEach(item => {
          const fb = this.initAcademicDetails();
          fb.patchValue(item);
          controlArray.push(fb);
        });
      }
      if (this.candidate.academics.length == 0) {
        this.addAcademicDetail('fromNgOnChanges');
      }
    }
  }

  initAcademicDetails() {
    return this._fb.group({
      schoolName: [''],
      board: ['', Validators.required],
      yearOfPassing: ['', Validators.required],
      specialization: ['', Validators.required]
    });
  }

  addAcademicDetail(calledFrom: string) {
    if ((calledFrom == 'fromNgOnChanges' && this.academicDetail.controls['academicDetails'].value.length == 0) || calledFrom == 'addAnother') {
      const control = <FormArray>this.academicDetail.controls['academicDetails'];
      const addrCtrl = this.initAcademicDetails();
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
    const control = <FormArray>this.academicDetail.controls['academicDetails'];
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


  removeAcademicDetail(i: number) {
    const control = <FormArray>this.academicDetail.controls['academicDetails'];
    control.removeAt(i);
    this.candidate.academics.splice(i, 1);
    this.postData('delete');
  }

  clearAcademicDetails() {
    const control = <FormArray>this.academicDetail.controls['academicDetails'];
    for (let index = 0; index < control.length; index++) {
      control.removeAt(index);
    }
  }

  postData(type: string) {
    let isDataValid = false;
    if(this.candidate.profile_update_tracking < CandidateProfileUpdateTrack.STEP_IS_ENTER_ACADEMIC_DETAILS) {
      this.candidate.profile_update_tracking = CandidateProfileUpdateTrack.STEP_IS_ENTER_ACADEMIC_DETAILS;
    }
    if (type == 'delete') {
      this.profileCreatorService.addProfileDetail(this.candidate).subscribe(
        user => {
        },error => this.errorService.onError(error));
      return;
    }

    let academics = this.academicDetail.value.academicDetails;
    if(academics.length == 1){
      if (academics[0].board == '' && academics[0].specialization == ''
          && academics[0].yearOfPassing == '') {
        if (type == 'next') {
          this.onNext();
        }
        else if (type == 'save') {
          this.onSave();
        }
        return;
      }
    }

    for (let academicsData of this.academicDetail.value.academicDetails) {
      if (academicsData.board != '' && academicsData.specialization != '' && academicsData.yearOfPassing != '') {
          isDataValid = true;
      } else if (academicsData.board != '' || academicsData.specialization != '' || academicsData.yearOfPassing != '') {
        this.submitStatus = true;
        return;
      } else {
        isDataValid = false;
        this.submitStatus = true;
        return;
      }
    }


    if (isDataValid) {
      this.candidate.academics = this.academicDetail.value.academicDetails;
      this.profileCreatorService.addProfileDetail(this.candidate).subscribe(
        user => {
          if (type == 'next') {
            this.onNext();
          }
          else if (type == 'save') {
            this.onSave();
          }
        },error => this.errorService.onError(error));
      return;
    }


    if (type === 'next') {
      this.onNext();
    } else if (type === 'save') {
      this.onSave();
    }

    window.scrollTo(0, 0);
  }

  onNext() {
    this.profileCreatorService.updateStepTracking(CandidateProfileUpdateTrack.STEP_IS_ENTER_ACADEMIC_DETAILS);
    this.onComplete.emit();
    this.complexityAnsweredService.change(true);
    this.highlightedSection.name = 'Certification';
    this.highlightedSection.isDisable = false;
    window.scrollTo(0, 0);
  }

  onSave() {
    this.onComplete.emit();
    this.highlightedSection.name = 'none';
    this.highlightedSection.isDisable = false;
    window.scrollTo(0, 0);
  }

  onPrevious() {
    this.highlightedSection.name = 'EmploymentHistory';
    window.scrollTo(0, 0);
  }

  onEdit() {
    this.highlightedSection.name = 'AcademicDetails';
    this.highlightedSection.isDisable = true;
    this.showButton = false;
    window.scrollTo(0, 0);
  }

  getMessage() {
    return Messages;
  }

  navigateToWithId(nav:string) {
    var userId = LocalStorageService.getLocalValue(LocalStorage.USER_ID);
    if (nav !== undefined) {
      let x = nav+'/'+ userId + '/create';
      // this._router.navigate([nav, userId]);
      this._router.navigate([x]);
    }
  }
}
