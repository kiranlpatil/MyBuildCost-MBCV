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
  }

  ngOnInit() {
    this.certificationDetail = this._fb.group({
      certifications: this._fb.array([])
    });

    //subscribe to addresses value changes
    this.certificationDetail.controls['certifications'].valueChanges.subscribe(x => {
      this.isButtonShow = true;
    });

    this.addCertification();
  }

  ngOnChanges(changes: any) {
    if (changes.candidate.currentValue != undefined) {
      this.candidate = changes.candidate.currentValue;
      if (this.candidate.certifications != undefined && this.candidate.certifications.length > 0) {

        let controlArray = <FormArray>this.certificationDetail.controls['certifications'];
        this.candidate.certifications.forEach(item => {
          const fb = this.initCertificateDetails();
          fb.patchValue(item);
          controlArray.push(fb);
        });
        if (!this.candidate.certifications) {
          this.addCertification();
        }
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

  addCertification() {
    this.submitStatus = false;
    const control = <FormArray>this.certificationDetail.controls['certifications'];
    const addrCtrl = this.initCertificateDetails();
    control.push(addrCtrl);
  }

  removeCertification(i: number) {
    const control = <FormArray>this.certificationDetail.controls['certifications'];
    control.removeAt(i);
    this.postData('do_nothing');
  }

  postData(type: string) {
    let certificationsData = this.certificationDetail.value.certifications[0];

    if(type == 'delete' && this.certificationDetail.valid){
      this.candidate.certifications = this.certificationDetail.value.certifications;
      this.profileCreatorService.addProfileDetail(this.candidate).subscribe(
        user => {
          if (type == 'next') {
            this.onNext();
          }
          else if (type == 'save') {
            this.onSave()
          }
        });
    }


    if(certificationsData.issuedBy != "" && certificationsData.name != "" && certificationsData.year != "") {
      this.candidate.certifications = this.certificationDetail.value.certifications;
      this.profileCreatorService.addProfileDetail(this.candidate).subscribe(
        user => {
          if (type == 'next') {
            this.onNext();
          }
          else if (type == 'save') {
            this.onSave()
          }
        });
    }

    if(certificationsData.issuedBy != "" || certificationsData.name != "" || certificationsData.year != "") {
      this.submitStatus = true;
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
