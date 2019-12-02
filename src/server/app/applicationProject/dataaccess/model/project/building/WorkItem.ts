import Quantity = require('./Quantity');
import Rate = require('./Rate');
import { AttachmentDetailsModel } from './AttachmentDetails';
import ContractingAddOn = require('./ContractingAddOn');

class WorkItem {
  name: string;
  rateAnalysisId: number;
  workItemId: number;
  quantity: Quantity;

  isMeasurementSheet : boolean;
  isRateAnalysis : boolean;
  rateAnalysisPerUnit: number;
  rateAnalysisUnit : string;
  isItemBreakdownRequired : boolean;
  length: boolean;
  breadthOrWidth : boolean;
  height : boolean;
  isSteelWorkItem : boolean=false;

  unit: string;
  rate: Rate;
  systemRate: Rate;
  isDirectRate: boolean;
  isFree: boolean;
  amount: number;
  remarks: string;
  active: boolean;
  attachmentDetails:AttachmentDetailsModel[];
  contractingAddOns: Array<ContractingAddOn>;
  gst: number;
  gstComponent: number;
  totalRate: number;
  rateWithGst: number;

  constructor(name:string, rateAnalysisId:number) {
    this.name = name;
    this.rateAnalysisId = rateAnalysisId;
    this.quantity = new Quantity();
    this.rate = new Rate();
    this.workItemId = 1;
    this.systemRate = new Rate();
    this.attachmentDetails = new Array<AttachmentDetailsModel>();
    this.contractingAddOns = new Array<ContractingAddOn>();
    this.amount = 0;
    this.isDirectRate = false;
    this.isFree = false;
    this.isSteelWorkItem = false;
    this.active=false;
    this.remarks = '';
    this.gstComponent = 0;
  }
}
export = WorkItem;

