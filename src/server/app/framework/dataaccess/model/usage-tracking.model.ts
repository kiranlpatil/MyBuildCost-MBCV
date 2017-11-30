import {Actions} from "../../shared/sharedconstants";
import UsageTrackingModel = require("../mongoose/usage-tracking.interface");
export class UsageTracking {
  recruiterId: string;
  candidateId: string;
  jobProfileId: string;
  action: Actions;
  timestamp: Date;

}
