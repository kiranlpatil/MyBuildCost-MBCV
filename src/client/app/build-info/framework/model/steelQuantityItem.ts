 export class SteelQuantityItem {
  item: string;
  diameter: any;
  length: number;
  nos: number;
  six:number=0;
  eight:number=0;
  ten:number=0;
  twelve:number=0;
  sixteen:number=0;
  twenty:number=0;
  twentyFive:number=0;
  thirty:number=0;
  constructor(item: string, diameter: any, length: number, nos: number,
              six: number, eight: number, ten: number, twelve: number,
              sixteen: number, twenty: number, twentyFive: number, thirty: number) {
     this.item = item;
     this.diameter = diameter;
     this.length = length;
     this.nos = nos;
     this.six = six;
     this.eight = eight;
     this.ten = ten;
     this.twelve = twelve;
     this.sixteen = sixteen;
     this.twenty = twenty;
     this.twentyFive = twentyFive;
     this.thirty = thirty;
   }
}

