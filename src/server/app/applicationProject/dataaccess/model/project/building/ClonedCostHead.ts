import ClonedCategory = require('./ClonedCategory');

class ClonedCostHead {
  name: string;
  rateAnalysisId:number;
  budgetedCostAmount:number;
  active:boolean;
  thumbRuleRate: any;
  categories: Array<ClonedCategory>;
}

export = ClonedCostHead;

