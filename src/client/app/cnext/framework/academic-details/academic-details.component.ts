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
    this.academicDetail = this._fb.group({
      academicDetails: this._fb.array([])
    });
  }

  ngOnInit() {
    //subscribe to addresses value changes
    this.academicDetail.controls['academicDetails'].valueChanges.subscribe(x => {
      this.isButtonShow = true;
    });
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
        this.addAcademicDetail("fromNgOnChanges");
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
    if ((calledFrom == "fromNgOnChanges" && this.academicDetail.controls["academicDetails"].value.length == 0) || calledFrom == "addAnother") {
      const control = <FormArray>this.academicDetail.controls['academicDetails'];
      const addrCtrl = this.initAcademicDetails();
      control.push(addrCtrl);
    }
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

    if (type == 'delete') {
      this.profileCreatorService.addProfileDetail(this.candidate).subscribe(
        user => {
        });
      return;
    }

    let academics = this.academicDetail.value.academicDetails;
    if(academics.length == 1){
      if (academics[0].board == "" && academics[0].specialization == ""
        && academics[0].yearOfPassing == "") {
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
      if (academicsData.board != "" && academicsData.specialization != "" && academicsData.yearOfPassing != "") {
          isDataValid = true;
      } else if(academicsData.board != "" || academicsData.specialization != "" || academicsData.yearOfPassing != "") {
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
        });
      return;
    }


    if (type === 'next') {
      this.onNext();
    } else if (type === 'save') {
      this.onSave();
    }
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
