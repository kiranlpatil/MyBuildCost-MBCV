import {Industry} from "./industry";
import {JobLocation} from "./job-location";
export class JobPosterModel {
  jobTitle : string = '';
  hiringManager : string = '';
  department : string= '';
  education : string = '';
  experience : string = '';
  salary : string = '';
  joiningPeriod :string ='';
  profiencies :string[] = new Array(0);
  industry : Industry = new Industry();
  location : JobLocation = new JobLocation();
  competencies : string = '';
  responsibility : string = '';
  postingDate : string ='';
  remark : string ='';
  roleType : string = '';
}
