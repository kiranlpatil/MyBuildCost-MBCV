import ClonedWorkItem = require('./ClonedWorkItem');

class ClonedSubcategory {
  name: String;
  rateAnalysisId:number;
  active:boolean;
  amount:number;
  workItems: Array<ClonedWorkItem>;
}

export = ClonedSubcategory;

