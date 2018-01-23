import ClonedWorkItem = require('./ClonedWorkItem');

class ClonedCostHead {
  name: string;
  rateAnalysisId:number;
  active:boolean;
  workitem: Array<ClonedWorkItem>;
}

export = ClonedCostHead;

