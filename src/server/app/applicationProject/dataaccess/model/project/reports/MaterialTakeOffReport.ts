import MaterialTakeOffSecondaryView = require('./MaterialTakeOffSecondaryView');
import MaterialTakeOffView = require("./MaterialTakeOffView");

class MaterialTakeOffReport {
   title: string;
   /*secondaryView: Map<string, MaterialTakeOffSecondaryView>;*/
   subTitle: MaterialTakeOffView;
  secondaryView: any;

   /*constructor(header: string, secondaryView: Map<string, MaterialTakeOffSecondaryView>) {
     this.header = header;
     this.secondaryView = secondaryView;
   }*/

  constructor(header: string,subTile: MaterialTakeOffView, secondaryView: any) {
    this.title = header;
    this.subTitle= subTile;
    this.secondaryView = secondaryView;
  }
}

export = MaterialTakeOffReport;
