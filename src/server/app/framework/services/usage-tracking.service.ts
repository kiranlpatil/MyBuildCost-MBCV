import IUsesTracking = require('../dataaccess/mongoose/usage-tracking.interface');
import UsageTrackingRepository = require("../dataaccess/repository/usage-tracking.repository");


class UsageTrackingService {
  private usageTrackingRepository: UsageTrackingRepository;

  constructor() {
    this.usageTrackingRepository = new UsageTrackingRepository();
  }

  create(usageData: any, callback: (error: any, result: any) => void) {
    this.usageTrackingRepository.create(usageData, callback);
  }

}


Object.seal(UsageTrackingService);
export = UsageTrackingService;
