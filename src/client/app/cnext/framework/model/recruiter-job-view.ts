import { JobPosterModel } from '../../../user/models/jobPoster';
export class RecruiterJobView {
  public jobProfileModel: JobPosterModel = new JobPosterModel();
  public numberOfMatchedCandidates: number;
  public numberOfShortListedCandidates: number = 0;
  public numberOfCandidatesInCart: number = 0;
  public numberOfCandidatesApplied: number = 0;
  public numberOfCandidatesrejected: number = 0;
  public numberOfCandidatesInCompare: number = 0;
}
