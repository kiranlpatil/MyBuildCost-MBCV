import {UsageActions} from '../../../shared/constants';
export class UsageTracking {
  recruiterId : string;
  candidateId : string;
  jobProfileId : string;
  action : UsageActions;
  constructor(action : UsageActions, recruiterId : string, jobProfileId : string, candidateId : string) {
      this.action= action;
      this.recruiterId = recruiterId;
      this.candidateId= candidateId;
      this.jobProfileId = jobProfileId;
  }
}
