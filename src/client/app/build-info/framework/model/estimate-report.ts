export class EstimateReport {
  name: string;
  rate: number;
  total : number;
  rateAnalysisId: number;
  disableCostHeadView : boolean;
  gstComponent: number;
  rateWithoutGst: number;
  basicEstimatedCost: number;
  constructor() {
    this.rate = 0;
    this.total = 0;
    this.rateAnalysisId = 0;
    this.gstComponent = 0;
    this.rateWithoutGst = 0;
    this.basicEstimatedCost = 0;
  }
}
