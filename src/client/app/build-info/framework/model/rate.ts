import { RateItem } from './rate-item';

export class Rate {
  rateFromRateAnalysis: number;
  total: number;
  quantity: number;
  unit :string;
  imageURL: string;
  notes: string;
  rateItems: RateItem[] = new Array(0);
}
