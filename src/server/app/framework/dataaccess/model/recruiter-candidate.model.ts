class RecruiterCandidatesModel {
  recruiterId: string;
  source: string;
  candidateId: string;
  name: string;
  mobileNumber: number;
  email: string;
  status: string;
  noOfMatchingJobs: number;
  highestMatchingPercentage: number;
  jobTitle: string;
  statusUpdatedOn: Date;
  fromDate: Date;
  toDate: Date;
}
export = RecruiterCandidatesModel;
