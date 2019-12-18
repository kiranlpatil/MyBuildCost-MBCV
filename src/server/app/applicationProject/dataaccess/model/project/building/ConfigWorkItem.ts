class ConfigWorkItem {
  name: string;
  rateAnalysisId:number;
  isMeasurementSheet: boolean;
  measurementUnit : string;
  isRateAnalysis : boolean;
  rateAnalysisPerUnit:number;
  rateAnalysisUnit: string;
  directRate: number;
  directRatePerUnit : string;
  isItemBreakdownRequired : boolean;
  length : boolean;
  breadthOrWidth : boolean;
  height : boolean;
  isSteelWorkItem: boolean;

  constructor(name: string, rateAnalysisId?: number) {
    this.name = name;
    if(rateAnalysisId) {
      this.rateAnalysisId = rateAnalysisId;
    }
  }
}
export = ConfigWorkItem;

