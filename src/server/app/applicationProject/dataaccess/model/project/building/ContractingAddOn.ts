class ContractingAddOn {
  id:number;
  name: string;
  rate: number;
  unit: string;

  constructor(id:number, name:string, rate:number, unit:string) {
    this.id = id;
    this.name = name;
    this.rate = rate;
    this.unit = unit;
  }
}
export = ContractingAddOn;

