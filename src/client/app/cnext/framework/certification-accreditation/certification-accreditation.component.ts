import {Component, Input, Output, EventEmitter} from "@angular/core";
import {Certifications} from "../model/certification-accreditation";
import {ValueConstant, LocalStorage} from "../../../framework/shared/constants";
import {MessageService} from "../../../framework/shared/message.service";
import {CandidateProfileService} from "../candidate-profile/candidate-profile.service";
import {LocalStorageService} from "../../../framework/shared/localstorage.service";
import {Message} from "../../../framework/shared/message";
import {Candidate, Section} from "../model/candidate";

@Component({
  moduleId: module.id,
  selector: 'cn-certification-accreditation',
  templateUrl: 'certification-accreditation.component.html',
  styleUrls: ['certification-accreditation.component.css']
})

export class CertificationAccreditationComponent {
  @Input() candidate:Candidate;
  @Input() highlightedSection:Section;
  @Output() onComplete = new EventEmitter();

  private tempfield:string[];
  private year:any;
  private currentDate:any;
  private yearList = new Array();
  private disableAddAnother:boolean = true;
  private sendPostCall:boolean = false;
  private isShowError:boolean = false;


  constructor(private messageService:MessageService,
              private profileCreatorService:CandidateProfileService) {

    this.tempfield = new Array(1);
    this.currentDate = new Date();
    this.year = this.currentDate.getUTCFullYear();
    this.createYearList(this.year);

  }

  ngOnChanges(changes:any) {
    if (this.candidate.certifications.length == 0) {
      this.candidate.certifications.push(new Certifications());
    }
  }

  ngOnInit() {
    if (LocalStorageService.getLocalValue(LocalStorage.IS_CANDIDATE) === "true") {
      this.profileCreatorService.getCandidateDetails()
        .subscribe(
          candidateData => this.OnCandidateDataSuccess(candidateData),
          error => this.onError(error));

    }
  }

  OnCandidateDataSuccess(candidateData:any) {
  }

  onError(error:any) {
    var message = new Message();
    message.error_msg = error.err_msg;
    message.isError = true;
    this.messageService.message(message);
  }

  createYearList(year:number) {
    for (let i = 0; i < ValueConstant.MAX_ACADEMIC_YEAR_LIST; i++) {
      this.yearList.push(year--);
    }

  }

  addAnother() {
    for (let item of this.candidate.certifications) {
      if (item.name === "" || item.issuedBy === "" || item.year === "") {
        this.disableAddAnother = false;
        this.isShowError = true;

      }
    }
    if (this.disableAddAnother === true) {
      this.candidate.certifications.push(new Certifications());
    }
    this.disableAddAnother = true;
  }

  postCertificates() {
    this.isShowError = false;
    for (let item of this.candidate.certifications) {
      if (item.name !== "" || item.issuedBy !== "" || item.year !== "") {

      }
    }
    for (let item of this.candidate.certifications) {
      if (item.name === "" || item.issuedBy === "" || item.year === "") {
        this.sendPostCall = false;

      }
    }
    if (this.sendPostCall === true) {
      this.profileCreatorService.addProfileDetail(this.candidate).subscribe(
        user => {
          console.log(user);
        },
        error => {
          console.log(error);
        });
    }
    this.sendPostCall = true;
  }

  onNext() {
    this.onComplete.emit();
    this.highlightedSection.name = "Awards";
  }
}
