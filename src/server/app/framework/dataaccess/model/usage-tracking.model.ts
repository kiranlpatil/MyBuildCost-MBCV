import {Actions} from "../../shared/sharedconstants";
export class UsageTracking {
  recruiterId: string;
  candidateId: string;
  jobProfileId: string;
  action: Actions;
  timestamp: Date;

  constructor() {

  }
}
