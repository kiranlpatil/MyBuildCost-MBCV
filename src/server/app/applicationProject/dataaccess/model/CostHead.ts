import WorkItem = require('./WorkItem');

class CostHead {
  name: string;
  rateAnalysisId:number;
  active: string;
  workitem: Map<string, WorkItem>;
}

export = CostHead;

