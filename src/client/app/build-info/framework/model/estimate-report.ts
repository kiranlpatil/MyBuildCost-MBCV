export class EstimateReport {
  name: string;
  rate: number;
  total : number;
  rateAnalysisId: number;
  disableCostHeadView : boolean;

  constructor() {
    this.rate = 0;
    this.total = 0;
    this.rateAnalysisId = 0;
  }
}
