"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var candidate_details_1 = require("./candidate-details");
var Candidate = (function () {
    function Candidate() {
        this.personalDetails = new candidate_details_1.CandidateDetail();
        this.aboutMyself = '';
        this.interestedIndustries = new Array(0);
        this.roleType = '';
        this.proficiencies = new Array(0);
        this.secondaryCapability = [];
        this.summary = new Summary();
        this.basicInformation = new candidate_details_1.CandidateDetail();
        this.userFeedBack = new Array(3);
    }
    return Candidate;
}());
exports.Candidate = Candidate;
var Section = (function () {
    function Section() {
        this.name = '';
        this.isProficiencyFilled = false;
    }
    return Section;
}());
exports.Section = Section;
var Summary = (function () {
    function Summary() {
        this.percentProfileCompleted = 70;
        this.numberOfTimeSearched = 9999;
        this.numberOfTimesViewed = 999;
        this.numberOfTimesAddedToCart = 99;
        this.numberOfJobApplied = 0;
        this.numberJobsBlocked = 0;
    }
    return Summary;
}());
exports.Summary = Summary;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC91c2VyL21vZGVscy9jYW5kaWRhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx5REFBc0Q7QUFHdEQ7SUFBQTtRQUNFLG9CQUFlLEdBQW9CLElBQUksbUNBQWUsRUFBRSxDQUFDO1FBQ3pELGdCQUFXLEdBQVcsRUFBRSxDQUFDO1FBQ3pCLHlCQUFvQixHQUFhLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlDLGFBQVEsR0FBVyxFQUFFLENBQUM7UUFDdEIsa0JBQWEsR0FBYSxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2Qyx3QkFBbUIsR0FBYSxFQUFFLENBQUM7UUFDbkMsWUFBTyxHQUFZLElBQUksT0FBTyxFQUFFLENBQUM7UUFDakMscUJBQWdCLEdBQW9CLElBQUksbUNBQWUsRUFBRSxDQUFDO1FBRTFELGlCQUFZLEdBQWEsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUFELGdCQUFDO0FBQUQsQ0FYQSxBQVdDLElBQUE7QUFYWSw4QkFBUztBQWN0QjtJQUFBO1FBQ0UsU0FBSSxHQUFXLEVBQUUsQ0FBQztRQUVsQix3QkFBbUIsR0FBWSxLQUFLLENBQUM7SUFDdkMsQ0FBQztJQUFELGNBQUM7QUFBRCxDQUpBLEFBSUMsSUFBQTtBQUpZLDBCQUFPO0FBTXBCO0lBQUE7UUFDRSw0QkFBdUIsR0FBVyxFQUFFLENBQUM7UUFDckMseUJBQW9CLEdBQVcsSUFBSSxDQUFDO1FBQ3BDLHdCQUFtQixHQUFXLEdBQUcsQ0FBQztRQUNsQyw2QkFBd0IsR0FBVyxFQUFFLENBQUM7UUFDdEMsdUJBQWtCLEdBQVMsQ0FBQyxDQUFDO1FBQzdCLHNCQUFpQixHQUFTLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBQUQsY0FBQztBQUFELENBUEEsQUFPQyxJQUFBO0FBUFksMEJBQU8iLCJmaWxlIjoiYXBwL3VzZXIvbW9kZWxzL2NhbmRpZGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENhbmRpZGF0ZURldGFpbCB9IGZyb20gJy4vY2FuZGlkYXRlLWRldGFpbHMnO1xyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBDYW5kaWRhdGUge1xyXG4gIHBlcnNvbmFsRGV0YWlsczogQ2FuZGlkYXRlRGV0YWlsID0gbmV3IENhbmRpZGF0ZURldGFpbCgpO1xyXG4gIGFib3V0TXlzZWxmOiBzdHJpbmcgPSAnJztcclxuICBpbnRlcmVzdGVkSW5kdXN0cmllczogc3RyaW5nW10gPSBuZXcgQXJyYXkoMCk7XHJcbiAgcm9sZVR5cGU6IHN0cmluZyA9ICcnO1xyXG4gIHByb2ZpY2llbmNpZXM6IHN0cmluZ1tdID0gbmV3IEFycmF5KDApO1xyXG4gIHNlY29uZGFyeUNhcGFiaWxpdHk6IHN0cmluZ1tdID0gW107XHJcbiAgc3VtbWFyeTogU3VtbWFyeSA9IG5ldyBTdW1tYXJ5KCk7XHJcbiAgYmFzaWNJbmZvcm1hdGlvbjogQ2FuZGlkYXRlRGV0YWlsID0gbmV3IENhbmRpZGF0ZURldGFpbCgpO1xyXG4gIF9pZDogc3RyaW5nO1xyXG4gIHVzZXJGZWVkQmFjazogbnVtYmVyW10gPSBuZXcgQXJyYXkoMyk7XHJcbn1cclxuXHJcblxyXG5leHBvcnQgY2xhc3MgU2VjdGlvbiB7XHJcbiAgbmFtZTogc3RyaW5nID0gJyc7XHJcbiAgZGF0ZTogRGF0ZTtcclxuICBpc1Byb2ZpY2llbmN5RmlsbGVkOiBib29sZWFuID0gZmFsc2U7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBTdW1tYXJ5IHtcclxuICBwZXJjZW50UHJvZmlsZUNvbXBsZXRlZDogbnVtYmVyID0gNzA7XHJcbiAgbnVtYmVyT2ZUaW1lU2VhcmNoZWQ6IG51bWJlciA9IDk5OTk7XHJcbiAgbnVtYmVyT2ZUaW1lc1ZpZXdlZDogbnVtYmVyID0gOTk5O1xyXG4gIG51bWJlck9mVGltZXNBZGRlZFRvQ2FydDogbnVtYmVyID0gOTk7XHJcbiAgbnVtYmVyT2ZKb2JBcHBsaWVkOiBudW1iZXI9MDtcclxuICBudW1iZXJKb2JzQmxvY2tlZDogbnVtYmVyPTA7XHJcbn1cclxuIl19
