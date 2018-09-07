import UsageTrackingRepository = require('../dataaccess/repository/UsageTrackingRepository');
import UsageTracking = require('../dataaccess/model/Users/UsageTracking');
let config = require('config');
var log4js = require('log4js');
var logger=log4js.getLogger('subscription Service');

class UsageTrackingService {
  private usageTrackingRepository = new UsageTrackingRepository();

  constructor() {
    this.usageTrackingRepository = new UsageTrackingRepository();
  }

  addUserDeviceDetails(userDeviceDetails: UsageTracking,  callback: (error: any, result: any) => void) {
    this.usageTrackingRepository.create(userDeviceDetails, (err: Error, res: any) => {
      if (err) {
        callback(err, null);
      } else {
        logger.info('subscription service, create has been hit');
        callback(null, res);
      }
    });
  }

}

export = UsageTrackingService;
