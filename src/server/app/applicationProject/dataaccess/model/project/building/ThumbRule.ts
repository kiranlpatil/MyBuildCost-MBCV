import ThumbRuleReport = require('../reports/ThumbRuleReport');

class  ThumbRule {
  name: string;
  totalRate: number;
  totalBudgetedCost: number;
  thumbRuleReports: Array<ThumbRuleReport>;

  constructor() {
    this.totalRate = 0;
    this.totalBudgetedCost = 0;
    this.thumbRuleReports = new Array<ThumbRuleReport>(0);
  }
}
export = ThumbRule;
