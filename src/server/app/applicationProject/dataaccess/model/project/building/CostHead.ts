import Category = require('./Category');
import ThumbRuleRate = require('./../reports/ThumbRuleRate');

class CostHead {
  name: string;
  priorityId: number;
  rateAnalysisId:number;
  budgetedCostAmount:number;
  active: boolean;
  thumbRuleRate: ThumbRuleRate;
  categories: Array<Category>;
  gst: number;

  constructor() {
    this.active = true;
  }
}

export = CostHead;

