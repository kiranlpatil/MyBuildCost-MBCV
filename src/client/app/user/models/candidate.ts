import { CandidateDetail } from './candidate-details';


export class Candidate {
  personalDetails: CandidateDetail = new CandidateDetail();
  aboutMyself: string = '';
  interestedIndustries: string[] = new Array(0);
  roleType: string = '';
  proficiencies: string[] = new Array(0);
  secondaryCapability: string[] = [];
  summary: Summary = new Summary();
  basicInformation: CandidateDetail = new CandidateDetail();
  _id: string;
  userFeedBack: number[] = new Array(3);
}


export class Section {
  name: string = '';
  date: Date;
  isProficiencyFilled: boolean = false;
}

export class Summary {
  percentProfileCompleted: number = 70;
  numberOfTimeSearched: number = 9999;
  numberOfTimesViewed: number = 999;
  numberOfTimesAddedToCart: number = 99;
  numberOfJobApplied: number=0;
  numberJobsBlocked: number=0;
}
