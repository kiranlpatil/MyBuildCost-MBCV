export class UsageTracking {
  recruiterId: string;
  candidateId: string;
  jobProfileId: string;
  action: Actions;
  timestamp: Date;

  constructor(action: Actions, recruiterId: string, jobProfileId: string, candidateId: string) {
    this.action = action;
    this.recruiterId = recruiterId;
    this.candidateId = candidateId;
    this.jobProfileId = jobProfileId;
  }
}

export enum Actions  {
  ADDED_IN_TO_CART_BY_RECRUITER,
  ADDED_IN_TO_REJECT_BY_RECRUITER,
  ADDED_IN_TO_COMPARE_VIEW_BY_RECRUITER,
  VIEWED_HALF_PROFILE_BY_RECRUITER,
  VIEWED_FULL_PROFILE_BY_RECRUITER,
  VIEWED_VALUE_PORTRAIT_BY_RECRUITER,
  VIEWED_JOB_PROFILE_BY_CANDIDATE,
  APPLIED_FOR_JOB_PROFILE_BY_CANDIDATE,
  ADDED_INTO_NOT_INTERESTED,
  REMOVED_FROM_CART_BY_RECRUITER,
  REMOVED_FROM_REJECT_BY_RECRUITER,
  REMOVED_FROM_COMPARE_VIEW_BY_RECRUITER,
  REMOVED_FROM_NOT_INTERESTED,
  DEFAULT_VALUE = 999
  //append your new enum value at the end of the list DON'T MODIFY THE LIST
}


