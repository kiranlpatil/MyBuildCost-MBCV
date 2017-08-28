import {Component, OnChanges} from "@angular/core";
import {CandidateSearchService} from "./candidate-search.service";
import {ErrorService} from "../error.service";
import {CandidateSearch} from "../model/candidate-search";
import {JobQcard} from "../model/JobQcard";
import {CandidateProfileMeta} from "../model/candidate-profile-meta";

@Component({
  moduleId: module.id,
  selector: 'cn-candidate-search',
  templateUrl: 'candidate-search.component.html',
  styleUrls: ['candidate-search.component.css']
})

export class CandidateSearchComponent implements OnChanges {

  private searchValue:string;
  private candidateDataList:CandidateSearch[] = new Array(0);
  private candidateProfileMeta:CandidateProfileMeta = new CandidateProfileMeta();
  private listOfJobs:JobQcard[] = new Array(0);
  //private candidateDataList:string[] = new Array(0);

  constructor(private candidateSearchService:CandidateSearchService, private errorService:ErrorService) {

  }

  ngOnChanges(changes:any) {

  }

  searchCandidate(value:string) {
    this.searchValue = value;
    if (value !== '') {
      this.candidateSearchService.getCandidateByName(value)
        .subscribe(
          (res:any) => {
            this.candidateDataList = res.data;
          },
          error => this.errorService.onError(error)
        );
    } else {
      this.candidateDataList = new Array(0);
      this.listOfJobs = new Array(0);
    }
  }

  getJobProfileMatching(candidateId:string) {
    this.candidateSearchService.getJobProfileMatching(candidateId)
      .subscribe(
        (res:any) => {
          this.listOfJobs = res.jobData;
          this.candidateProfileMeta = res.candidateProfile;
        },
        error => this.errorService.onError(error)
      );
  }

  viewProfile() {
    /*this.candidateSearchService.viewProfile()
     .subscribe(
     (res:any) => { debugger
     this.listOfJobs = res;
     },
     error => this.errorService.onError(error)
     );*/
  }
}
