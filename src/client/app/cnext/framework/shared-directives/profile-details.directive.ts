import {Directive, Input} from "@angular/core";
import {ProfileDetailsService} from "../profile-detail-service";

// Directive decorator
@Directive({selector: '[profiledetails]'})
// Directive class
export class ProfileDetailsDirective {
  @Input() isCall: boolean;

  constructor(private profileDetailService: ProfileDetailsService) {
    // Use renderer to render the element with styles
    this.profileDetailService.change(true);
  }
}
