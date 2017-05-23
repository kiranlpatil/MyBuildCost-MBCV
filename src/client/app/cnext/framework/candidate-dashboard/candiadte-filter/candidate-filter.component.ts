import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {  FormGroup, FormBuilder } from '@angular/forms';
import {CandidateFilter} from "../../model/candidate-filter";
import {JobPosterModel} from "../../model/jobPoster";
import {ShowQcardviewService} from "../../showQCard.service";
import {JobFilterService} from "../../job-filter/job-filter.service";
import {Candidate} from "../../model/candidate";
import {FilterService} from "../../filters/filter.service";
import {CandidateFilterService} from "./candidate-filter.service";

@Component({
    moduleId: module.id,
    selector: 'cn-candidate-filter',
    templateUrl: 'candidate-filter.component.html',
    styleUrls: ['candidate-filter.component.css']
})

export class CandidateFilterComponent {

  private isShowJobFilter:boolean=false;
  private proficiencyList : string[] = new Array(0);
  private locationList : string[] = new Array(0);
  private experienceRangeList : string[] = new Array(0);
  private educationList : string[] = new Array(0);
  private jointimeList : string[] = new Array(0);
  private industryList : string[] = new Array(0);
  private salaryRangeList : string[] = new Array(0);
  private companySizeList : string[] = new Array(0);
  private queryList : string[] = new Array(0);
  private candidateFilter :  CandidateFilter=new CandidateFilter();
  private location:string[]= new Array(0);
  private All = "All";
  private userForm:FormGroup;

  @Input() private candidate :Candidate;
  @Input() private locations :any[];



  constructor(private formBuilder:FormBuilder, private showQCardview: ShowQcardviewService, private _filterSerive: CandidateFilterService, private filterService: FilterService) {
    this.showQCardview.showJobQCardView$.subscribe(
      data=> {
        this.isShowJobFilter=true;
      }
    );
    this.filterService.clearFilter$.subscribe(() => {
      this.clearFilter();
    })

    this.userForm = this.formBuilder.group({
      eduction:'',
      experienceMin:'',
      experienceMax:'',
      salaryMin:'',
      salaryMax:'',
      location:'',
      proficiencies:'',
      timetojoin:'',
      industry:'',
      companysize:''
    });
  }

  ngOnChanges(changes :any){
    if(changes.candidate){
      if(changes.candidate.currentValue) {
        this.proficiencyList = changes.candidate.currentValue.proficiencies;
        this.industryList = changes.candidate.currentValue.interestedIndustries;
        //this.location = changes.candidate.locations;
      }
    }
    if(changes.locations) {
      if(changes.locations.currentValue) {
        this.locationList = changes.locations.currentValue;
      }
    }
  }
  ngOnInit() {
    this._filterSerive.getListForFilter()
      .subscribe(
        (list:any) => {
          //this.proficiencyList = list.proficiency;
          this.companySizeList = list.companysize;
          this.salaryRangeList = list.salaryRangeList;
          this.educationList = list.education;
          this.jointimeList = list.joining_period;
          //this.industryList = list.industry_exposure;
          this.experienceRangeList = list.experienceRangeList;
        },
        (error:any) => this.onError(error));
  }
  onError(err:any) {

  }

  filterByProficiency(event:any) {
    var value = event.target.value;
    if(event.target.checked) {
      this.candidateFilter.proficiencyDataForFilter.push(value.toLowerCase())
    }
    else {
      var index = this.candidateFilter.proficiencyDataForFilter.indexOf(value.toLowerCase());
      if (index > -1) {
        this.candidateFilter.proficiencyDataForFilter.splice(index, 1);
      }
    }
    if(this.candidateFilter.proficiencyDataForFilter.length) {
      this.queryListPush('(item.proficiencies.filter(function (obj) {return args.proficiencyDataForFilter.indexOf(obj.toLowerCase()) !== -1;}).length == args.proficiencyDataForFilter.length)');
    } else {
      this.queryListRemove('(item.proficiencies.filter(function (obj) {return args.proficiencyDataForFilter.indexOf(obj.toLowerCase()) !== -1;}).length == args.proficiencyDataForFilter.length)');
    }
    this.buildQuery();
    this.filterService.filterby(this.candidateFilter);
  }

  filterByEducation(event:any) {
    var value = event.target.value;
    if(event.target.checked) {
      this.candidateFilter.educationDataForFilter.push(value.toLowerCase())
    }
    else {
      var index = this.candidateFilter.educationDataForFilter.indexOf(value.toLowerCase());
      if (index > -1) {
        this.candidateFilter.educationDataForFilter.splice(index, 1);
      }
    }
    if(this.candidateFilter.educationDataForFilter.length) {
      this.queryListPush('(args.educationDataForFilter.indexOf(item.education.toLowerCase()) !== -1)');
    } else {
      this.queryListRemove('(args.educationDataForFilter.indexOf(item.education.toLowerCase()) !== -1)');
    }
    this.buildQuery();
    this.filterService.filterby(this.candidateFilter);
  }

  filterByIndustryExposure(event:any) {
    var value = event.target.value;
    if(event.target.checked) {
      this.candidateFilter.industryExposureDataForFilter.push(value.toLowerCase())
    }
    else {
      var index = this.candidateFilter.industryExposureDataForFilter.indexOf(value.toLowerCase());
      if (index > -1) {
        this.candidateFilter.industryExposureDataForFilter.splice(index, 1);
      }
    }
    if(this.candidateFilter.industryExposureDataForFilter.length) {
      this.queryListPush('(item.interestedIndustries.filter(function (obj) {return args.industryExposureDataForFilter.indexOf(obj.toLowerCase()) !== -1;}).length == args.industryExposureDataForFilter.length)');
    } else {
      this.queryListRemove('(item.interestedIndustries.filter(function (obj) {return args.industryExposureDataForFilter.indexOf(obj.toLowerCase()) !== -1;}).length == args.industryExposureDataForFilter.length)');
    }
    this.buildQuery();
    this.filterService.filterby(this.candidateFilter);
  }

  filterByJoinTime(value:any) {
    if(value) {
      this.candidateFilter.filterByJoinTime = value;
      this.queryListPush('((args.filterByJoinTime && item.joiningPeriod) && (args.filterByJoinTime.toLowerCase() === item.joiningPeriod.toLowerCase()))');
      this.buildQuery();
      this.filterService.filterby(this.candidateFilter);
    }
  }


  selectSalaryMinModel(value:any) {
    this.candidateFilter.salaryMinValue = value;
    this.salaryFilterBy();
  }

  selectSalaryMaxModel(value:any) {
    this.candidateFilter.salaryMaxValue = value;
    this.salaryFilterBy();
  }

  salaryFilterBy() {
    if(Number(this.candidateFilter.salaryMaxValue) && Number(this.candidateFilter.salaryMinValue)) {
      this.queryListPush('((Number(item.salary.split(" ")[0]) >= Number(args.salaryMinValue)) && (Number(item.salary.split(" ")[0]) <= Number(args.salaryMaxValue)))');
      this.buildQuery();
      this.filterService.filterby(this.candidateFilter);
    }
  }

  selectExperiencesMaxModel(value:any) {
    this.candidateFilter.experienceMaxValue = value;
    this.experienceFilterBy();

  }

  selectExperiencesMinModel(value:any) {
    this.candidateFilter.experienceMinValue = value;
    this.experienceFilterBy();
  }

  experienceFilterBy() {
    if(Number(this.candidateFilter.experienceMinValue) && Number(this.candidateFilter.experienceMaxValue)){
      this.queryListPush('((Number(item.experience.split(" ")[0]) >= Number(args.experienceMinValue)) && (Number(item.experience.split(" ")[0]) <= Number(args.experienceMaxValue)))');
      this.buildQuery();
      this.filterService.filterby(this.candidateFilter);
    }
  }

  filterByLocation(value:any) {
    if(value) {
      this.candidateFilter.filterByLocation = value;
      this.queryListPush('(((args.filterByLocation && item.location))&&(args.filterByLocation.toLowerCase() === item.location.toLowerCase()))');
      this.buildQuery();
      this.filterService.filterby(this.candidateFilter);
    }
  }

  filterByCompanySize(value:any) {
    if(value) {
      this.candidateFilter.filterByCompanySize = value;
      this.queryListPush('(((args.filterByCompanySize && item.company_size))&&(args.filterByCompanySize.toLowerCase() === item.company_size.toLowerCase()))');
      this.buildQuery();
      this.filterService.filterby(this.candidateFilter);
    }
  }

  queryListPush(query:string) {
    if(this.queryList.indexOf(query) == -1) {
      this.queryList.push(query);
    }
  }
  queryListRemove(query:string) {
    var i = this.queryList.indexOf(query);
    if(i != -1) {
      this.queryList.splice(i, 1);
    }
  }

  buildQuery() {
    var query = 'true';
    for(var i=0;i<this.queryList.length;i++) {
      query = query +'&&'+this.queryList[i];
    }
    this.candidateFilter.query = query;
  }
  clearFilter() {
    var query = 'true';
    this.userForm.reset();
    this.candidateFilter=new CandidateFilter();
    this.queryList  = new Array(0);
    this.candidateFilter.query = query;
    this.filterService.filterby(this.candidateFilter);
  }

}
