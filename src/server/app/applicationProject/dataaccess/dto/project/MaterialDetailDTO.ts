class MaterialDetailDTO {
  building: string;
  costHead: string;
  category: string;
  workItem: string;
  material: string;
  label: string;
  quantity: number;
  unit: string;

  constructor(building: string, costHead: string,category: string, workItem: string, material: string, label: string, quantity: number, unit: string) {
  this.building = building;
  this.costHead = costHead;
  this.category = category;
  this.workItem = workItem;
  this.material = material;
  this.label = label;
  this.quantity = quantity;
  this.unit = unit;
  }
}
export = MaterialDetailDTO;
