import { SearchService } from './search.service';
import RecruiterRepository = require('../../dataaccess/repository/recruiter.repository');
import { JobDetail } from '../models/output-model/job-detail';
import { CoreMatchingDetail } from '../models/output-model/base-detail';
import { EList } from '../models/input-model/list-enum';
import { ConstVariables } from '../../shared/sharedconstants';
import * as mongoose from 'mongoose';
import JobProfileRepository = require('../../dataaccess/repository/job-profile.repository');

export class CandidateSearchService extends SearchService {
  recruiterRepository : RecruiterRepository;
  jobProfileRepository : JobProfileRepository;
  constructor() {
    super();
    this.recruiterRepository= new RecruiterRepository();
    this.jobProfileRepository= new JobProfileRepository();
  }
}
