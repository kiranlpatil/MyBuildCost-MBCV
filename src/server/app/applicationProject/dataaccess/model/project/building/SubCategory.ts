import WorkItem = require('./WorkItem');

class  SubCategory {
  name: string;
  rateAnalysisId: number;
  amount: number;
  workItems : Array<WorkItem>;

  constructor(name:string, rateAnalysisId: number) {
    this.name = name;
    this.rateAnalysisId = rateAnalysisId;
    this.amount = 0;
    this.workItems = new Array<WorkItem>();
  }
}
export  = SubCategory;
