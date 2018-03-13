import Category = require('./Category');
import ThumbRuleRate = require('./../reports/ThumbRuleRate');

class CostHead {
  name: string;
  rateAnalysisId:number;
  budgetedCostAmount:number;
  active: boolean;
  thumbRuleRate: ThumbRuleRate;
  categories: Array<Category>;

  constructor() {
    this.active = true;
  }
}

export = CostHead;

