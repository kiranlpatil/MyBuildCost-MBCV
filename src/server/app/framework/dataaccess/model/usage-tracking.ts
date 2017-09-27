import {Actions} from '../../shared/sharedconstants';
export class UsageTracking {
  recruiterId : string;
  candidateId : string;
  jobProfileId : string;
  action : Actions;
  timestamp : Date;
  constructor(action : Actions, recruiterId : string, jobProfileId : string, candidateId : string) {
      this.action= action;
      this.recruiterId = recruiterId;
      this.candidateId= candidateId;
      this.jobProfileId = jobProfileId;
  }
}
