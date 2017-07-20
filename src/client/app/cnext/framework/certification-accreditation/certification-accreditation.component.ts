import {Component, EventEmitter, Input, Output} from "@angular/core";
import {CandidateProfileService} from "../candidate-profile/candidate-profile.service";
import {Candidate, Section} from "../model/candidate";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  moduleId: module.id,
  selector: 'cn-certification-accreditation',
  templateUrl: 'certification-accreditation.component.html',
  styleUrls: ['certification-accreditation.component.css']
})

export class CertificationAccreditationComponent {

  @Input() candidate: Candidate;
  @Input() highlightedSection: Section;
  @Output() onComplete = new EventEmitter();
  tooltipMessage: string = "<ul><li><p>1. Certification/Accreditation Message</p></li></ul>";

  public certificationDetail: FormGroup;


  private isButtonShow: boolean = false;
  private showButton: boolean = true;
  private submitStatus: boolean;

  constructor(private _fb: FormBuilder, private profileCreatorService: CandidateProfileService) {
    this.certificationDetail = this._fb.group({
      certifications: this._fb.array([])
    });
  }

  ngOnInit() {
    //subscribe to addresses value changes
    this.certificationDetail.controls['certifications'].valueChanges.subscribe(x => {
      this.isButtonShow = true;
    });
  }

  ngOnChanges(changes: any) {
    if (changes.candidate.currentValue != undefined) {
      this.candidate = changes.candidate.currentValue;
      if (this.candidate.certifications != undefined && this.candidate.certifications.length > 0) {

        this.clearCertificationDetails();
        let controlArray = <FormArray>this.certificationDetail.controls['certifications'];
        this.candidate.certifications.forEach(item => {
          const fb = this.initCertificateDetails();
          fb.patchValue(item);
          controlArray.push(fb);
        });
      }
      if (this.candidate.certifications.length == 0) {
        this.addCertification("fromNgOnChanges");
      }
    }
  }

  initCertificateDetails() {
    return this._fb.group({
      remark: [''],
      name: ['', Validators.required],
      issuedBy: ['', Validators.required],
      year: ['', Validators.required]
    });
  }

  addCertification(calledFrom: string) {
    if ((calledFrom == "fromNgOnChanges" && this.certificationDetail.controls["certifications"].value.length == 0) || calledFrom == "addAnother") {
      this.submitStatus = false;
      const control = <FormArray>this.certificationDetail.controls['certifications'];
      const addrCtrl = this.initCertificateDetails();
      control.push(addrCtrl);
    }
  }

  removeCertification(i: number) {
    const control = <FormArray>this.certificationDetail.controls['certifications'];
    control.removeAt(i);
    this.candidate.certifications.splice(i, 1);
    this.postData('do_nothing');
  }

  clearCertificationDetails() {
    const control = <FormArray>this.certificationDetail.controls['certifications'];
    for (let index = 0; index < control.length; index++) {
      control.removeAt(index);
    }
  }

  postData(type: string) {
    let isDataValid = false;

    if (type == 'do_nothing') {
      this.profileCreatorService.addProfileDetail(this.candidate).subscribe(
        user => {
        });
      return;
    }

    let certifications = this.certificationDetail.value.certifications;
    if(certifications.length == 1){
      if (certifications[0].issuedBy == "" && certifications[0].name == ""
        && certifications[0].year == "") {
        if (type == 'next') {
          this.onNext();
        }
        else if (type == 'save') {
          this.onSave();
        }
        return;
      }
    }

    for (let certificationsData of this.certificationDetail.value.certifications) {
      if (certificationsData.issuedBy != "" && certificationsData.name != "" && certificationsData.year != "") {
        isDataValid = true;
      } else if(certificationsData.issuedBy != "" || certificationsData.name != "" || certificationsData.year != "") {
        this.submitStatus = true;
        return;
      } else {
        isDataValid = false;
        this.submitStatus = true;
        return;
      }
    }

    if (isDataValid) {
      this.candidate.certifications = this.certificationDetail.value.certifications;
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

    if (type == 'next') {
      this.onNext();
    }
    else if (type == 'save') {
      this.onSave()
    }
  }

  onNext() {
    this.onComplete.emit();
    this.highlightedSection.name = 'Awards';
    this.highlightedSection.isDisable = false;
  }

  onSave() {
    this.onComplete.emit();
    this.highlightedSection.name = 'none';
    this.highlightedSection.isDisable = false;
  }

}
