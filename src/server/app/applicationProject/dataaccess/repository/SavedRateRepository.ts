
import RepositoryBase = require('./../../../framework/dataaccess/repository/base/repository.base');
import SavedRateSchema = require('../schemas/SavedRateSchema');
import SavedRate = require('../mongoose/SavedRate');

class SavedRateRepository extends RepositoryBase<SavedRate> {
  constructor() {
    super(SavedRateSchema);
  }

}

Object.seal(SavedRateRepository);
export = SavedRateRepository;
