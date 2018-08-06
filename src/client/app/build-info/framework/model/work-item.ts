import { Units } from '../../../shared/constants';
import { Quantity } from './quantity';
import { Rate } from './rate';
import { AttachmentDetailsModel } from './attachment-details';
export class WorkItem {
  name: string;
  rateAnalysisId: number;
  workItemId: number;
  quantity: Quantity;
  unit: string;
  rate: Rate;
  systemRate: Rate;
  isDirectRate : boolean;
  amount: number;
  active: boolean;
  remarks: string;
  isRateAnalysis : boolean;
  rateAnalysisPerUnit : number;
  rateAnalysisUnit : string;
  isItemBreakdownRequired : boolean=false;
  length : boolean;
  isSteelWorkItem:boolean;
  breadthOrWidth : boolean;
  height : boolean;
  attachmentDetails: AttachmentDetailsModel[];
  isMeasurementSheet:boolean=false;
  isDetailedQuantity:boolean=false;
  constructor(name: string, rateAnalysisId: number) {
    this.name = name;
    this.rateAnalysisId = rateAnalysisId;
    this.quantity = new Quantity();
    this.rate = new Rate();
    this.systemRate = new Rate();
    this.isDirectRate = false;
    this.amount = 0;
    this.unit = Units.UNIT;
    this.active=false;
    this.remarks = '';
  }
}

