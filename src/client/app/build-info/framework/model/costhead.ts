import { Category } from './category';

export class CostHead {
  name: string;
  rateAnalysisId:number;
  budgetedCostAmount:number;
  active: boolean;
  thumbRuleRate: any;
  categories: Array<Category>;
}
