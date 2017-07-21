import {Directive, Input} from "@angular/core";
import {IndustryDetailsService} from "../industry-detail-service";

// Directive decorator
@Directive({selector: '[industrydetails]'})
// Directive class
export class IndustryDetailsDirective {
  @Input() isCall: boolean;

  constructor(private industryDetailService: IndustryDetailsService) {
    // Use renderer to render the element with styles
    this.industryDetailService.change(true);
  }
}
