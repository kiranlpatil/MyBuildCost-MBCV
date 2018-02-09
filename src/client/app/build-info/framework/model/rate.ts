import { RateItem } from './RateItem';

export class Rate {
  rateFromRateAnalysis: number;
  total: number;
  quantity: number;
  unit :string;
  item: RateItem[] = new Array(0);
}
