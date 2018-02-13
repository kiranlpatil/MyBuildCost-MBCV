import WorkItem = require('./WorkItem');
import SubCategory = require('./SubCategory');

class CostHead {
  name: string;
  rateAnalysisId:number;
  budgetedCostAmount:number;
  active: boolean;
  thumbRuleRate: any;
  subCategory: Array<SubCategory>;
}

export = CostHead;

