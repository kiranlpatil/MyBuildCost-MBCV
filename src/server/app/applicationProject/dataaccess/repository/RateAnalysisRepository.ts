import RateAnalysis = require('../mongoose/RateAnalysis');
import RateAnalysisSchema = require('../schemas/RateAnalysisSchema');
import RepositoryBase = require('./../../../framework/dataaccess/repository/base/repository.base');

class RateAnalysisRepository extends RepositoryBase<RateAnalysis> {
  constructor() {
    super(RateAnalysisSchema);
  }

}

Object.seal(RateAnalysisRepository);
export = RateAnalysisRepository;
