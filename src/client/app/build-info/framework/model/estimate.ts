import { EstimateReport } from './estimate-report';

export class Estimate {
  name: string;
  area: number;
  totalRate: number;
  totalEstimatedCost: number;
  estimatedCosts: Array<EstimateReport>;

  constructor() {
    this.area = 0;
    this.totalRate = 0;
    this.totalEstimatedCost = 0;
    this.estimatedCosts = new Array< EstimateReport>();
  }
}

