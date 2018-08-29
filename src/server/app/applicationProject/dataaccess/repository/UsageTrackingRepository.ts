import UsageTracking = require('../mongoose/UsageTracking');
import UsageTrackingSchema = require('../schemas/UsageTrackingSchema');
import RepositoryBase = require('./../../../framework/dataaccess/repository/base/repository.base');

class UsageTrackingRepository extends RepositoryBase<UsageTracking> {
  constructor() {
    super(UsageTrackingSchema);
  }

}

Object.seal(UsageTrackingRepository);
export = UsageTrackingRepository;
