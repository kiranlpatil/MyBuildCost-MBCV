import ClonedWorkItem = require('./ClonedWorkItem');

class ClonedSubcategory {
  name: String;
  rateAnalysisId:number;
  active:boolean;
  amount:number;
  workitem: Array<ClonedWorkItem>;
}

export = ClonedSubcategory;

