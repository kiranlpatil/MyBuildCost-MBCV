import ClonedWorkItem = require('./ClonedWorkItem');

class ClonedCategory {
  name: string;
  rateAnalysisId:number;
  active:boolean;
  amount:number;
  workItems: Array<ClonedWorkItem>;
}

export = ClonedCategory;

