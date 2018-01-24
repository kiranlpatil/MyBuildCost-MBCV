import WorkItem = require('./WorkItem');

class CostHead {
  name: string;
  rateAnalysisId:number;
  active: boolean;
  thumbRuleRate: any;
  workitem: Map<string, WorkItem>;
}

export = CostHead;

