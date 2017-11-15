import User = require('../mongoose/user');
import JobProfileSchema = require('../schemas/job-profile.schema');
import RepositoryBase = require('./base/repository.base');
import IJobProfile = require('../mongoose/job-profile');

class JobProfileRepository extends RepositoryBase<IJobProfile> {
  constructor() {
    super(JobProfileSchema);
  }

  retrieveAndPopulate(query : Object,included : Object, callback:(error : any, result : any) => void) {
    JobProfileSchema.find(query, included).populate('recruiterId').lean().exec(function (err, items) {
      callback(err, items);
    });
  }

}
Object.seal(JobProfileRepository);
export = JobProfileRepository;
