import UsageTrackingRepository = require("../dataaccess/repository/usage-tracking.repository");
import {UsageTracking} from "../dataaccess/model/usage-tracking.model";
import UsageTrackingModel = require("../dataaccess/mongoose/usage-tracking.interface");


class UsageTrackingService {

  create(usageData: UsageTrackingModel, callback: (error: Error, status: string) => void) {
    usageData.timestamp = new Date();
    let usageTrackingRepository = new UsageTrackingRepository();
    usageTrackingRepository.create(usageData, callback);
  }

  customCreate(recruiterId: string, jobProfileId: string, candidateId: string, action: number,
               callback: (error: Error, status: string) => void) {
    let usageData: any = {
      'action' : action,
    'recruiterId' : recruiterId,
    'jobProfileId' : jobProfileId
  };
    if(candidateId != '') {
      usageData.candidateId = candidateId;
    }
    usageData.timestamp = new Date();
    let usageTrackingRepository = new UsageTrackingRepository();
    usageTrackingRepository.create(usageData, callback);
  }

}


Object.seal(UsageTrackingService);
export = UsageTrackingService;
