import User = require("../mongoose/user");
import JobProfileSchema = require("../schemas/job-profile.schema");
import RepositoryBase = require("./base/repository.base");

class JobProfileRepository extends RepositoryBase<User> {
  constructor() {
    super(JobProfileSchema);
  }
}
Object.seal(JobProfileRepository);
export = JobProfileRepository;
