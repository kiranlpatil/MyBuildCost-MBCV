import User = require('../mongoose/user');
import JobProfileSchema = require('../schemas/job-profile.schema');
import RepositoryBase = require('./base/repository.base');
import IJobProfile = require('../mongoose/job-profile');
import {ConstVariables} from "../../shared/sharedconstants";

class JobProfileRepository extends RepositoryBase<IJobProfile> {
  constructor() {
    super(JobProfileSchema);
  }

  retrieveAndPopulate(query : Object,included : Object, callback:(error : any, result : any) => void) {
    JobProfileSchema.find(query, included).populate('recruiterId').lean().exec(function (err, items) {
      callback(err, items);
    });
  }
  retrieveWithoutPopulate(query : Object,included : Object, callback:(error : any, result : any) => void) {
    JobProfileSchema.find(query, included).lean().exec(function (err, items) {
      callback(err, items);
    });
  }
  public retrieveSortedResult(query: any, included: Object, sortingQuery: any, callback: (error: any, result: any) => void) {
    JobProfileSchema.find(query, included).sort(sortingQuery).populate('recruiterId').lean().exec(function (err: any, items: any) {
      callback(err, items);
    });
  }

  public retrieveResult(query: any, included: Object, callback: (error: any, result: any) => void) {
    JobProfileSchema.find(query, included).populate('recruiterId').lean().exec(function (err: any, items: any) {
      callback(err, items);
    });
  }

  public retrieveJobProfiles(field: any, callback:(error : any, result : any) => void) {
    JobProfileSchema.find(field).populate('recruiterId').lean().exec(function (err, res) {
      callback(err, res);
    });
  }

}
Object.seal(JobProfileRepository);
export = JobProfileRepository;
