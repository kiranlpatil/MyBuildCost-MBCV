import ClonedSubcategory = require('./ClonedSubcategory');

class ClonedCostHead {
  name: string;
  rateAnalysisId:number;
  budgetedCostAmount:number;
  active:boolean;
  thumbRuleRate: any;
  subCategory: Array<ClonedSubcategory>;
}

export = ClonedCostHead;

