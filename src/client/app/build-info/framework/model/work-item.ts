import { Units } from '../../../shared/constants';
import { Quantity } from './quantity';
import { Rate } from './rate';
export class WorkItem {
  name: string;
  rateAnalysisId: number;
  quantity: Quantity;
  unit: string;
  rate: Rate;
  systemRate: Rate;
  amount: number;
  active: boolean;
  remarks: string;

  constructor(name: string, rateAnalysisId: number) {
    this.name = name;
    this.rateAnalysisId = rateAnalysisId;
    this.quantity = new Quantity();
    this.rate = new Rate();
    this.systemRate = new Rate();
    this.amount = 0;
    this.unit = Units.UNIT;
    this.active=false;
    this.remarks = '';
  }
}

