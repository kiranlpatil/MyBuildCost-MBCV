import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { CandidateProfileService } from '../candidate-profile/candidate-profile.service';
import { Candidate, Section } from '../model/candidate';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  moduleId: module.id,
  selector: 'cn-academic-details',
  templateUrl: 'academic-details.component.html',
  styleUrls: ['academic-details.component.css']
})

export class AcademicDetailComponent implements OnInit, OnChanges {
  @Input() candidate: Candidate;
  @Input() highlightedSection: Section;
  @Output() onComplete = new EventEmitter();

  public academicDetail: FormGroup;
  tooltipMessage: string = "<ul><li><p>1. An individual must provide latest qualification details first.</p></li></ul>";
  public showButton: boolean = true;
  private isButtonShow: boolean = false;
  private submitStatus: boolean;
  constructor(private _fb: FormBuilder, private profileCreatorService: CandidateProfileService) {
  }

  ngOnInit() {
    this.academicDetail = this._fb.group({
      academicDetails: this._fb.array([])
    });

    //subscribe to addresses value changes
    this.academicDetail.controls['academicDetails'].valueChanges.subscribe(x => {
      this.isButtonShow = true;
    });

    this.addAcademicDetail();
  }

  ngOnChanges(changes: any) {
    if (changes.candidate.currentValue != undefined) {
      this.candidate = changes.candidate.currentValue;
      if (this.candidate.academics != undefined && this.candidate.academics.length > 0) {

        let controlArray = <FormArray>this.academicDetail.controls['academicDetails'];
        this.candidate.academics.forEach(item => {
          const fb = this.initAcademicDetails();
          fb.patchValue(item);
          controlArray.push(fb);
        });
        if (!this.candidate.academics) {
          this.addAcademicDetail();
        }
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

  addAcademicDetail() {
    this.submitStatus = false;
    const control = <FormArray>this.academicDetail.controls['academicDetails'];
    const addrCtrl = this.initAcademicDetails();
    control.push(addrCtrl);
  }

  removeAcademicDetail(i: number) {
    const control = <FormArray>this.academicDetail.controls['academicDetails'];
    control.removeAt(i);
    this.postData('delete');
  }

  postData(type: string) {
    if(!this.academicDetail.valid){
      this.submitStatus = true;
      return;
    }
    this.candidate.academics = this.academicDetail.value.academicDetails;
    this.profileCreatorService.addProfileDetail(this.candidate).subscribe(
      user => {
        if (type === 'next') {
          this.onNext();
        } else if (type === 'save') {
          this.onSave();
        }
      });
  }

  onNext() {
    this.onComplete.emit();
    this.highlightedSection.name = 'Certification';
    this.highlightedSection.isDisable = false;
  }

  onSave() {
    this.onComplete.emit();
    this.highlightedSection.name = 'none';
    this.highlightedSection.isDisable = false;
  }

}
