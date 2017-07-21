import {Directive, Input} from "@angular/core";
import {IndustryDataService} from "../industry-data-service";

// Directive decorator
@Directive({selector: '[industrydata]'})
// Directive class
export class IndustryDataDirective {
  @Input() isCall: boolean;

  constructor(private industryDataService: IndustryDataService) {
    // Use renderer to render the element with styles
    this.industryDataService.change(true);
  }
}
