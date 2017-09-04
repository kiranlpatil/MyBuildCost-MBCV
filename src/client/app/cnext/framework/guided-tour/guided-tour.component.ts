import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'cn-guided-tour',
    templateUrl: 'guided-tour.component.html',
    styleUrls: ['guided-tour.component.css']
})

export class GuidedTourComponent implements OnInit {
    @Output() onSkip = new EventEmitter();
    private isShowNext: boolean = true;
    private isShowPrev: boolean = false;

    ngOnInit() {
        let item: any = $('#myCarousel');
        item.carousel({
            interval: false
        });

    }

    showHide(isPrev: boolean) {
        let carouselData: any = document.getElementsByClassName('carousel-slide');
        let isFound: boolean = false;
        let isPrevFound: boolean = false;

        for (let index = 0; index < carouselData.length; index++) {
            if (isPrev) {
                (index == 1) ? carouselData[index].classList.contains('active') ? isPrevFound = true : console.log() : console.log();
            }
            if (index == carouselData.length - 2) {
                if (!isPrev) {
                    carouselData[index].classList.contains('active') ? isFound = true : console.log();
                }
            }
        }
        (isFound) ? this.isShowNext = false : this.isShowNext = true;
        (isPrevFound) ? this.isShowPrev = false : this.isShowPrev = true;
    }

    onSkipClick() {
        this.onSkip.emit();
    }
}
