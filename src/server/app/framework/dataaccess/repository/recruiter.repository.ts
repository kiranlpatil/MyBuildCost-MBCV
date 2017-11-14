import RecruiterSchema = require('../schemas/recruiter.schema');
import RepositoryBase = require('./base/repository.base');
import IRecruiter = require('../mongoose/recruiter');
import { JobQCard } from '../../search/model/job-q-card';
import { ConstVariables } from '../../shared/sharedconstants';
import * as mongoose from 'mongoose';
import CandidateModel = require('../model/candidate.model');
import RecruiterModel = require('../model/recruiter.model');
import JobProfileModel = require('../model/jobprofile.model');

class RecruiterRepository extends RepositoryBase<IRecruiter> {
  constructor() {
    super(RecruiterSchema);
  }

  getJobProfileQCard(recruiters: any[], candidate: CandidateModel, jobProfileIds: string[], isSearchView: string, callback: (error: any, result: any) => void) {
      console.log('In getJobProfileQCard');
  }

  getJobById(jobId : string, callback : (err : any, res : any)=> void) {
   /* let query = {
      'postedJobs': {$elemMatch: {'_id': new mongoose.Types.ObjectId(jobId)}}
    };
    RecruiterSchema.find(query).lean().exec((err: any, response : IRecruiter[]) => {
      if (err) {
        callback(new Error('Problem in Job Retrieve'), null);
      } else {
        let jobProfile: JobProfileModel;
        if (response.length > 0) {
          for (let job of response[0].postedJobs) {
            if (job._id.toString() === jobId) {
              jobProfile = job;
              break;
            }
          }
        }
        callback(null, jobProfile);
      }
    });*/
  }
}

Object.seal(RecruiterRepository);
export = RecruiterRepository;
