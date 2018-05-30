import { RateItem } from './rate-item';


export class Rate {
  rateFromRateAnalysis: number;
  total: number;
  isEstimated : boolean;
  quantity: number;
  unit :string;
  imageURL: string;
  notes: string;
  rateItems: Array<RateItem>;

  constructor() {
    this.total = 0;
    this.isEstimated = false;
    this.quantity = 0;
    this.rateItems = new Array<RateItem>();
    this.unit = 'sqft';
  }
}
