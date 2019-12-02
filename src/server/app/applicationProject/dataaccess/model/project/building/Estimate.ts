import EstimateReport = require('../reports/EstimateReport');

class Estimate {
  name: string;
  area: number;
  totalRate: number;
  totalEstimatedCost: number;
  estimatedCosts: Array<EstimateReport>;
  totalGstComponent: number;
  totalBasicEstimatedCost: number;
  totalRateWithoutGst: number;


  constructor() {
    this.area = 0;
    this.totalRate = 0;
    this.totalEstimatedCost = 0;
    this.estimatedCosts = new Array< EstimateReport>();
    this.totalGstComponent = 0;
    this.totalBasicEstimatedCost = 0;
    this.totalRateWithoutGst = 0;
  }
}
export = Estimate;
