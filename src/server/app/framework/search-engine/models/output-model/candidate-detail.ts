import { CoreMatchingDetail } from './base-detail';
import { JobListModel } from '../../../dataaccess/model/candidate-list.model';
export class CandidateDetail extends CoreMatchingDetail {
  job_list : JobListModel[];
}
