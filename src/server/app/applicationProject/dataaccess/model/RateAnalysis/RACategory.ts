import RAWorkItem = require('./RAWorkItem');

class  RACategory {
  name: string;
  rateAnalysisId: number;
  workItems : Array<RAWorkItem>;

  constructor() {
  }
}
export  = RACategory;
