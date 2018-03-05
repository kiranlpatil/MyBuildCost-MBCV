import ClonedWorkItem = require('./ClonedWorkItem');

class ClonedSubCategory {
  name: string;
  rateAnalysisId:number;
  active:boolean;
  amount:number;
  workItems: Array<ClonedWorkItem>;
}

export = ClonedSubCategory;

