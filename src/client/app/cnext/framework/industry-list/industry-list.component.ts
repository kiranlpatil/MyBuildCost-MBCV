import {Component, Input, Output, EventEmitter} from "@angular/core";
import {Industry} from "../model/industry";

@Component({
  moduleId: module.id,
  selector: 'cn-industry-list',
  templateUrl: 'industry-list.component.html',
  styleUrls: ['industry-list.component.css']
})

export class IndustryListComponent {
  @Input() industries:Industry[] = new Array(0);
  private selectedIndustry:Industry = new Industry();
  @Input() candidateIndustry:Industry = new Industry();
  @Output() selectIndustry=new EventEmitter();

  private showModalStyle:boolean = false;

  ngOnChanges(changes:any) {
    if (changes.industries != undefined) {
      if (changes.industries.currentValue != undefined)
        this.industries = changes.industries.currentValue;
    }
  }

  choosedIndustry(industry:Industry) {
    this.selectedIndustry = industry;
  }

  showHideModal() { //TODO
    this.showModalStyle = !this.showModalStyle;
  }

  disableIndustrires() {
    this.showModalStyle = !this.showModalStyle;
    this.selectIndustry.emit(this.selectedIndustry); // this.createAndSave();

  }

  getStyleModal() {
    if (this.showModalStyle) {
      return 'block';
    } else {
      return 'none';
    }
  }
}


