import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { JobCompareService } from './job-compare-view.service';
import {Capability} from "../../model/capability";

@Component({
  moduleId: module.id,
  selector: 'cn-job-compare-view',
  templateUrl: 'job-compare-view.component.html',
  styleUrls: ['job-compare-view.component.css']
})

export class JobCompareViewComponent implements OnChanges {
  @Input() candiadteId: string;
  @Input() jobId: string;
  capabilities: Capability[];

  private recruiterId: string;
  private data: any;

  constructor(private jobCompareService: JobCompareService) {
  }

  ngOnChanges(changes: any) {
    if (changes.candiadteId != undefined && changes.candiadteId.currentValue != undefined) {
      this.candiadteId = changes.candiadteId.currentValue;
    }
    if (changes.jobId != undefined && changes.jobId.currentValue != undefined) {
      this.recruiterId = changes.jobId.currentValue;
    }
    if (this.candiadteId != undefined && this.recruiterId != undefined) {
      this.getCompareDetail(this.candiadteId, this.recruiterId);
    }
  }

  getCompareDetail(candidateId: string, recruiterId: string) {
    this.jobCompareService.getCompareDetail(candidateId, recruiterId)
      .subscribe(
        data => this.OnCompareSuccess(data),
        error => console.log(error));
  }

  OnCompareSuccess(data: any) {
    this.data = data.data;
    this.capabilities= this.jobCompareService.getStandardMatrix(this.data.match_map);
  }

}
