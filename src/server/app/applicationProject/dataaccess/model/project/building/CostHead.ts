import SubCategory = require('./SubCategory');

class CostHead {
  name: string;
  rateAnalysisId:number;
  budgetedCostAmount:number;
  active: boolean;
  thumbRuleRate: any;
  subCategories: Array<SubCategory>;
}

export = CostHead;

