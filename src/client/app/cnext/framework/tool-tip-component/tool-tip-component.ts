import {Component, Input, Output, EventEmitter} from "@angular/core";
import {Industry} from "../model/industry";
import {Section} from "../model/candidate";
import {JobPosterModel} from "../model/jobPoster";
import {ProfessionalDataService} from "../professional-data/professional-data.service";
import {BasicJobInformationService} from "./basic-job-information.service";
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import {JobLocation} from "../model/job-location";
import {MyGoogleAddress} from "../../../framework/registration/candidate/google-our-place/my-google-address";

@Component({
  moduleId: module.id,
  selector: 'cn-tool-tip',
  templateUrl: 'tool-tip-component.html',
  styleUrls: ['tool-tip-component.css']
})

export class TooltipComponent {
  @Input() message : string;
}
