import ClonedWorkItem = require('./ClonedWorkItem');

class ClonedCostHead {
  name: string;
  rateAnalysisId:number;
  active:boolean;
  thumbRuleRate: any;
  workitem: Array<ClonedWorkItem>;
}

export = ClonedCostHead;

