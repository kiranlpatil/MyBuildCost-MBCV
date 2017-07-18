import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {ReleventIndustryListService} from "./relevent-industry-list.service";
import {Messages} from "../../../framework/shared/constants";
import {Section} from "../model/candidate";
import {ReleventIndustry} from "./relevent-industry";
import {Role} from "../model/role";
import {Industry} from "../model/industry";


@Component({
  moduleId: module.id,
  selector: 'cn-relevent-industry-list',
  templateUrl: 'relevent-industry-list.component.html',
  styleUrls: ['relevent-industry-list.component.css']
})

export class ReleventIndustryListComponent implements OnInit {
  releventIndustries: ReleventIndustry[] = new Array();
  workAreas: string[] = new Array();
  workAreasToUpdate: string[] = new Array();
  @Output() onNextComplete = new EventEmitter();
  @Output() checkReleventIndustries = new EventEmitter();
  @Input() highlightedSection: Section;
  @Input() roles: Role[] = new Array(0);
  @Input() industry: Industry;
  suggestionMsgForReleventIndustry: string;
  showRleventindustry: boolean = false;
  private showButton: boolean = true;


  tooltipMessage: string =
    '<ul>' +
    '<li><p>1. Relevant Industry Message.</p></li>' +
    '</ul>';

  constructor(private releventIndustryService: ReleventIndustryListService) {

  }

  ngOnInit() {
    this.suggestionMsgForReleventIndustry = Messages.SUGGESTION_MSG_FOR_RELEVENT_INDUSTRY;
    this.getReleventIndustries();

  }

  ngOnChanges(changes: any) {
    if (changes.roles !== undefined && changes.roles.currentValue !== undefined) {
      this.getReleventIndustries();
    }
  }

  getReleventIndustries() {
    if (this.roles.length) {
      this.roles.forEach(x => this.workAreas.push(x.name));
      this.releventIndustryService.getReleventIndustries(this.workAreas, this.industry.name)
        .subscribe(
          res => {
            this.onGetIndustriesSuccess(res);
          },
          error => {
            this.onError(error);
          });
    }
  }

  onGetIndustriesSuccess(res: any) {
    this.releventIndustries = new Array(0);
    this.releventIndustries = <ReleventIndustry[]>res.data;
    this.checkReleventIndustries.emit(res.data.length);
  }

  onError(error: any) {
    console.log('----errorr------', error);
  }

  goNext() {
    this.highlightedSection.name = 'Compentancies';
    this.onNextComplete.emit(this.workAreasToUpdate);
  }

  onSave() {
    this.highlightedSection.name = 'none';
    this.highlightedSection.isDisable = false;
    this.onNextComplete.emit(this.workAreasToUpdate);
  }

  getReleventIndustry(event: any) {
    this.showRleventindustry = event.target.checked;
    //this.showRleventindustry = true;
    //if(event.target.checked) {
    this.releventIndustries.forEach(x => x.isChecked = event.target.checked);
    /* } else {
     this.releventIndustries.forEach(x => x.isChecked = event.target.checked);
     }*/
  }

  onValueChange(event: any, index: number) {
    this.releventIndustries[index].isChecked = event.target.checked;
  }

  onNext() {
    this.workAreasToUpdate = new Array(0);
    this.releventIndustries.forEach(item => {
      if (item.isChecked) {
        this.workAreasToUpdate.push(item.name);
      }
    });

    this.goNext();
  }

}
