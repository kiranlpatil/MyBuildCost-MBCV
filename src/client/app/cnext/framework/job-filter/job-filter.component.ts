import {Component, Input, OnChanges, OnInit} from '@angular/core';
import { ShowQcardviewService } from '../showQCard.service';
import {QCardViewService} from "../q-card-view/q-card-view.service";
import {JobFilterService} from "./job-filter.service";
import {CandidateFilter} from "../model/candidate-filter";
import {CandidateFilterService} from "../filters/candidate-filter.service";
import {JobPosterModel} from "../model/jobPoster";


@Component({
    moduleId: module.id,
    selector: 'cn-job-filter',
    templateUrl: 'job-filter.component.html',
    styleUrls: ['job-filter.component.css']
})

export class JobFilterComponent implements OnInit,OnChanges{
  private isShowJobFilter:boolean=false;
  private proficiencyList : string[] = new Array(0);
  private locationList : string[] = new Array(0);
  private experienceRangeList : string[] = new Array(0);
  private educationList : string[] = new Array(0);
  private jointimeList : string[] = new Array(0);
  private industryList : string[] = new Array(0);
  private salaryRangeList : string[] = new Array(0);
  private candidateFilter :  CandidateFilter=new CandidateFilter();
  pune = "pune";
  All = "All";
  @Input() private selectedJob :JobPosterModel;


  constructor(private showQCardview:ShowQcardviewService,private jobFilterService:JobFilterService,private candidateFilterService:CandidateFilterService) {
    this.showQCardview.showJobQCardView$.subscribe(
      data=> {
        this.isShowJobFilter=true;
      }
    );
  }

  ngOnChanges(changes :any){
    if(changes.selectedJob.currentValue){
      this.proficiencyList = changes.selectedJob.currentValue.proficiencies;
      this.industryList = changes.selectedJob.currentValue.interestedIndustries;
      //this.industryList = changes.selectedJob.currentValue.interestedIndustries;
    }
  }
  ngOnInit() {
    this.jobFilterService.getListForFilter()
      .subscribe(
        list => {

          //this.proficiencyList = list.proficiency;
          this.locationList = list.current_location;
          this.salaryRangeList = list.salaryRangeList;
          this.educationList = list.education;
          this.jointimeList = list.joining_period;
          //this.industryList = list.industry_exposure;
          this.experienceRangeList = list.experienceRangeList;
        },
        error => this.onError(error));
  }
  onError(err:any) {

  }

  filterByProficiency(event:any) {
    if(event.target.checked) {
      this.candidateFilter.proficiencyDataForFilter.push(event.target.value)
    }
    else {
      var index = this.candidateFilter.proficiencyDataForFilter.indexOf(event.target.value);
      if (index > -1) {
        this.candidateFilter.proficiencyDataForFilter.splice(index, 1);
      }
    }
    this.candidateFilterService.filterby(this.candidateFilter);
  }

  filterByLocation(value:any) {
    //this.candidateFilter.filterName = 'CurrentLocation';
    this.candidateFilter.filterByValue = value;
    this.candidateFilterService.filterby(this.candidateFilter);
  }

  filterByEducation(event:any) {
    //this.candidateFilter.filterName = 'Education';
    if(event.target.checked) {
      this.candidateFilter.educationDataForFilter.push(event.target.value)
    }
    else {
      var index = this.candidateFilter.educationDataForFilter.indexOf(event.target.value);
      if (index > -1) {
        this.candidateFilter.educationDataForFilter.splice(index, 1);
      }
    }
    this.candidateFilterService.filterby(this.candidateFilter);
  }

  filterByIndustryExposure(event:any) {
    //this.candidateFilter.filterName = 'IndustryExposure';
    if(event.target.checked) {
      this.candidateFilter.industryExposureDataForFilter.push(event.target.value)
    }
    else {
      var index = this.candidateFilter.industryExposureDataForFilter.indexOf(event.target.value);
      if (index > -1) {
        this.candidateFilter.industryExposureDataForFilter.splice(index, 1);
      }
    }
    this.candidateFilterService.filterby(this.candidateFilter);
  }



  filterByJoinTime(value:any) {
    //this.candidateFilter.filterName = 'JoinTime';
    this.candidateFilter.filterByJoinTime = value;
    this.candidateFilterService.filterby(this.candidateFilter);
  }


  selectSalaryMinModel(event:any) {
    //this.candidateFilter.filterName = 'Salary';
    this.candidateFilter.salaryMinValue = event;
    this.candidateFilterService.filterby(this.candidateFilter);
  }
  selectSalaryMaxModel(event:any) {
    //this.candidateFilter.filterName = 'Salary';
    this.candidateFilter.salaryMaxValue = event;
    this.candidateFilterService.filterby(this.candidateFilter);
  }

  selectExperiencesMaxModel(event:any) {
    //this.candidateFilter.filterName = 'Experience';
    this.candidateFilter.experienceMaxValue = event;
    this.candidateFilterService.filterby(this.candidateFilter);
  }
  selectExperiencesMinModel(event:any) {
    this.candidateFilter.experienceMinValue = event;
    this.candidateFilterService.filterby(this.candidateFilter);
  }
  onSelectionChange(value:any) {
    this.candidateFilter.filterByLocation = value;
    this.candidateFilterService.filterby(this.candidateFilter);
  }
}
