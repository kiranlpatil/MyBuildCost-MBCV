import RAWorkItem = require('./RAWorkItem');

class  RACategory {
  name: string;
  rateAnalysisId: number;
  workItems : Array<RAWorkItem>;

  constructor(name:string, rateId:number) {
    this.name = name;
    this.rateAnalysisId = rateId;
  }
}
export  = RACategory;
