import {Directive, Input} from "@angular/core";
import {ProfessionalDetailsService} from "../professional-detail-service";

// Directive decorator
@Directive({selector: '[professionaldetails]'})
// Directive class
export class ProfessionalDetailsDirective {
  @Input() isCall: boolean;

  constructor(private professionalDetailService: ProfessionalDetailsService) {
    // Use renderer to render the element with styles
    this.professionalDetailService.change(true);
  }
}
