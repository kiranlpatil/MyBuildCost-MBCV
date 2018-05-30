import { ThumbRuleReport } from './thumbrule-report';

export class  ThumbRule {
  name: string;
  area: number;
  totalRate: number;
  totalBudgetedCost: number;
  thumbRuleReports: Array<ThumbRuleReport>;

  constructor() {
    this.totalRate = 0;
    this.totalBudgetedCost = 0;
    this.thumbRuleReports = new Array<ThumbRuleReport>(0);
  }
}

