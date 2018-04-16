"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("../../../shared/constants");
var quantity_1 = require("./quantity");
var rate_1 = require("./rate");
var WorkItem = (function () {
    function WorkItem(name, rateAnalysisId) {
        this.name = name;
        this.rateAnalysisId = rateAnalysisId;
        this.quantity = new quantity_1.Quantity();
        this.rate = new rate_1.Rate();
        this.systemRate = new rate_1.Rate();
        this.isDirectRate = false;
        this.amount = 0;
        this.unit = constants_1.Units.UNIT;
        this.active = false;
        this.remarks = '';
    }
    return WorkItem;
}());
exports.WorkItem = WorkItem;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9idWlsZC1pbmZvL2ZyYW1ld29yay9tb2RlbC93b3JrLWl0ZW0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx1REFBa0Q7QUFDbEQsdUNBQXNDO0FBQ3RDLCtCQUE4QjtBQUM5QjtJQVlFLGtCQUFZLElBQVksRUFBRSxjQUFzQjtRQUM5QyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsY0FBYyxHQUFHLGNBQWMsQ0FBQztRQUNyQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksbUJBQVEsRUFBRSxDQUFDO1FBQy9CLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxXQUFJLEVBQUUsQ0FBQztRQUN2QixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksV0FBSSxFQUFFLENBQUM7UUFDN0IsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7UUFDMUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFDaEIsSUFBSSxDQUFDLElBQUksR0FBRyxpQkFBSyxDQUFDLElBQUksQ0FBQztRQUN2QixJQUFJLENBQUMsTUFBTSxHQUFDLEtBQUssQ0FBQztRQUNsQixJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztJQUNwQixDQUFDO0lBQ0gsZUFBQztBQUFELENBeEJBLEFBd0JDLElBQUE7QUF4QlksNEJBQVEiLCJmaWxlIjoiYXBwL2J1aWxkLWluZm8vZnJhbWV3b3JrL21vZGVsL3dvcmstaXRlbS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFVuaXRzIH0gZnJvbSAnLi4vLi4vLi4vc2hhcmVkL2NvbnN0YW50cyc7XHJcbmltcG9ydCB7IFF1YW50aXR5IH0gZnJvbSAnLi9xdWFudGl0eSc7XHJcbmltcG9ydCB7IFJhdGUgfSBmcm9tICcuL3JhdGUnO1xyXG5leHBvcnQgY2xhc3MgV29ya0l0ZW0ge1xyXG4gIG5hbWU6IHN0cmluZztcclxuICByYXRlQW5hbHlzaXNJZDogbnVtYmVyO1xyXG4gIHF1YW50aXR5OiBRdWFudGl0eTtcclxuICB1bml0OiBzdHJpbmc7XHJcbiAgcmF0ZTogUmF0ZTtcclxuICBzeXN0ZW1SYXRlOiBSYXRlO1xyXG4gIGlzRGlyZWN0UmF0ZSA6IGJvb2xlYW47XHJcbiAgYW1vdW50OiBudW1iZXI7XHJcbiAgYWN0aXZlOiBib29sZWFuO1xyXG4gIHJlbWFya3M6IHN0cmluZztcclxuXHJcbiAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCByYXRlQW5hbHlzaXNJZDogbnVtYmVyKSB7XHJcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgdGhpcy5yYXRlQW5hbHlzaXNJZCA9IHJhdGVBbmFseXNpc0lkO1xyXG4gICAgdGhpcy5xdWFudGl0eSA9IG5ldyBRdWFudGl0eSgpO1xyXG4gICAgdGhpcy5yYXRlID0gbmV3IFJhdGUoKTtcclxuICAgIHRoaXMuc3lzdGVtUmF0ZSA9IG5ldyBSYXRlKCk7XHJcbiAgICB0aGlzLmlzRGlyZWN0UmF0ZSA9IGZhbHNlO1xyXG4gICAgdGhpcy5hbW91bnQgPSAwO1xyXG4gICAgdGhpcy51bml0ID0gVW5pdHMuVU5JVDtcclxuICAgIHRoaXMuYWN0aXZlPWZhbHNlO1xyXG4gICAgdGhpcy5yZW1hcmtzID0gJyc7XHJcbiAgfVxyXG59XHJcblxyXG4iXX0=
