import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CandidateProfileService } from '../candidate-profile/candidate-profile.service';
import { Candidate, Section } from '../model/candidate';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  moduleId: module.id,
  selector: 'cn-academic-details',
  templateUrl: 'academic-details.component.html',
  styleUrls: ['academic-details.component.css']
})

export class AcademicDetailComponent {
  @Input() candidate: Candidate;
  @Input() highlightedSection: Section;
  @Output() onComplete = new EventEmitter();

  public academicDetail: FormGroup;
  private isButtonShow: boolean = false;
  private showButton: boolean = true;

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
    this.candidate.academics = this.academicDetail.value.academicDetails;
    this.profileCreatorService.addProfileDetail(this.candidate).subscribe(
      user => {
        if (type == 'next') {
          this.onNext();
        }
        else if (type == 'save') {
          this.onSave();
        }
      });
  }

  onNext() {
    this.onComplete.emit();
    this.highlightedSection.name = "Certification";
    this.highlightedSection.isDisable = false;
  }

  onSave() {
    this.onComplete.emit();
    this.highlightedSection.name = "none";
    this.highlightedSection.isDisable = false;
  }


}
