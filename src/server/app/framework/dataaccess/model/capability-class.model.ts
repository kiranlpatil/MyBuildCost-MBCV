import ComplexityClassModel = require('./complexity-class.model');

class CapabilityClassModel {
  complexities: ComplexityClassModel[];
  name: string;
  code : string;
  sort_order: number;
  isPrimary: boolean;
  isSecondary: boolean

  constructor(name:string, code:string, sort_order:number) {
    this.name = name;
    this.code = code;
    this.sort_order = sort_order;
  }

}
export = CapabilityClassModel;
