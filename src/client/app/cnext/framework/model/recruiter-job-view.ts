import { JobPosterModel } from './jobPoster';
export  class RecruiterJobView {
  public jobProfileModel:JobPosterModel=new JobPosterModel();
  public numberOfMatchedCandidates:number=0;
  public numberOfShortListedCandidates:number=0;
  public numberOfCandidatesInCart:number=0;
  public numberOfCandidatesApplied:number=0;
  public numberOfCandidatesrejected:number=0;
}
