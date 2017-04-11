 import { Capability } from './capability';
export class Role {
  name: string='';
  capabilities: Capability[]= new Array(0);
  secondaryCapabilities :SecondaryCapability[]=new Array(0);
}
