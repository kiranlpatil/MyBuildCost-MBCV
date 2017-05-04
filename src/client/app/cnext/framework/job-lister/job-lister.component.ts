import {  Component  } from '@angular/core';
import {JobListerService} from "./job-lister-service";
import {JobPosterModel} from "../model/jobPoster";
//import { JobListerService } from 'job-lister-service';
//import {JobPosterModel} from "../model/JobPosterModel";


@Component({
  moduleId: module.id,
  selector: 'cn-job-lister',
  templateUrl: 'job-lister.component.html',
  styleUrls: ['job-lister.component.css']
})

export class JobListerComponent {
  public jobList:JobPosterModel[] = new Array(0);
  constructor(private jobListerService:JobListerService) {
      jobListerService.getJobList().subscribe(
        data=> {
          this.jobList = data.data[0].postedJobs;
        }
      );
    }
  }
