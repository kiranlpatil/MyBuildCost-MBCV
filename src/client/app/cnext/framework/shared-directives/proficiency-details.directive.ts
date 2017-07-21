import {Directive, Input} from "@angular/core";
import {ProficiencyDetailsService} from "../proficiency-detail-service";

// Directive decorator
@Directive({selector: '[proficiencydetails]'})
// Directive class
export class ProficiencyDetailsDirective {
  @Input() isCall: boolean;

  constructor(private proficiencyDetailService: ProficiencyDetailsService) {
    // Use renderer to render the element with styles
    this.proficiencyDetailService.change(true);
  }
}
