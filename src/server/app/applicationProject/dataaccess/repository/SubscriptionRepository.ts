import Subscription = require('../mongoose/Subscription');
import SubscriptionSchema = require('../schemas/SubscriptionSchema');
import RepositoryBase = require('./../../../framework/dataaccess/repository/base/repository.base');

class SubscriptionRepository extends RepositoryBase<Subscription> {
  constructor() {
    super(SubscriptionSchema);
  }

}

Object.seal(SubscriptionRepository);
export = SubscriptionRepository;
