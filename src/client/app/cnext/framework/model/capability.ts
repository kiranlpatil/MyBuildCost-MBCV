import { Complexity } from './complexity';
export class Capability {
  name: string='';
  complexities: Complexity[]= new Array(0);
  isPrimary : boolean=false;
  isSecondary : boolean=false;
}

export class SecondaryCapability {
  name: string='';
  complexities: Complexity[]= new Array(0);
}
export class DefaultCompexities {
  name: string='';
  complexities: Complexity[]= new Array(0);
}
