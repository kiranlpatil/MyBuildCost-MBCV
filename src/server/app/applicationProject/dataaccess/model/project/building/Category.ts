import WorkItem = require('./WorkItem');

class  Category {
  name: string;
  rateAnalysisId: number;
  amount: number;
  active: boolean;
  workItems : Array<WorkItem>;

  constructor(name:string, rateAnalysisId ?: number) {
    this.name = name;
    if(rateAnalysisId || rateAnalysisId === 0) {
      this.rateAnalysisId = rateAnalysisId;
    }
    this.amount = 0;
    this.active = true;
    this.workItems = new Array<WorkItem>();
  }
}
export  = Category;
