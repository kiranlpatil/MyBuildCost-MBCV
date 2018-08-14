import RAWorkItem = require('./RAWorkItem');

class  RASavedRate {
  _id :string;
  userId: string;
  workItemList : Array<RAWorkItem>= new Array<RAWorkItem>();
}
export  = RASavedRate;
