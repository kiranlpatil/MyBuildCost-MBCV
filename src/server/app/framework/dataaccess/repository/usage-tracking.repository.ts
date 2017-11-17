import IUsageTrackingModel = require("../mongoose/usage-tracking.interface");
import UsageTrackingSchema = require("../schemas/usage-tracking.schema");
import RepositoryBase = require("./base/repository.base");

class UsageTrackingRepository extends RepositoryBase<IUsageTrackingModel> {
  constructor() {
    super(UsageTrackingSchema);
  }
}

Object.seal(UsageTrackingRepository);
export = UsageTrackingRepository;
