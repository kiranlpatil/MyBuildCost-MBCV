import Quantity = require('./Quantity');
import Rate = require('./Rate');
import Constants = require('../../../../shared/constants');
import { AttachmentDetailsModel } from './AttachmentDetails';

class WorkItem {
  name: string;
  rateAnalysisId: number;
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
  amount: number;
  remarks: string;
  active: boolean;
  attachmentDetails:AttachmentDetailsModel[];


  constructor(name:string, rateAnalysisId:number) {
    this.name = name;
    this.rateAnalysisId = rateAnalysisId;
    this.quantity = new Quantity();
    this.rate = new Rate();
    this.systemRate = new Rate();
    this.attachmentDetails = new Array<AttachmentDetailsModel>();
    this.amount = 0;
    this.isDirectRate = false;
    this.isSteelWorkItem = false;
    this.active=false;
    this.remarks = '';
  }
}
export = WorkItem;

