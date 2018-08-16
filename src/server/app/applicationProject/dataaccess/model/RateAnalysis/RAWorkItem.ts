import Rate = require('../project/building/Rate');


class RAWorkItem {
  name: string;
  unit: string;
  rateAnalysisId: number;
  rate: Rate;
  regionName: string;

  constructor() {
  }
}
export = RAWorkItem;

