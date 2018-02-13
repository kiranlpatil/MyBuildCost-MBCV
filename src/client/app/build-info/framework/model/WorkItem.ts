import Rate = require('./rate');

class WorkItem {
  name: string;
  rateAnalysisId:number;
  unit: string;
  amount: number;
  remarks: string;
  constructor(name:string, rateAnalysisId:number) {
    this.name = name;
    this.rateAnalysisId = rateAnalysisId;
    this.amount = 0;
    this.unit = 'sqft';
    this.remarks = '';
  }
}
export = WorkItem;

