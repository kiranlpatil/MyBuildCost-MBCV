"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var GroupByPipe = (function () {
    function GroupByPipe() {
    }
    GroupByPipe.prototype.transform = function (collection, property) {
        if (!collection) {
            return null;
        }
        var groupedCollection = collection.reduce(function (previous, current) {
            if (!previous[current[property]]) {
                previous[current[property]] = [current];
            }
            else {
                previous[current[property]].push(current);
            }
            return previous;
        }, {});
        return Object.keys(groupedCollection).map(function (key) { return ({ key: key, value: groupedCollection[key] }); });
    };
    GroupByPipe = __decorate([
        core_1.Pipe({ name: 'groupBy' })
    ], GroupByPipe);
    return GroupByPipe;
}());
exports.GroupByPipe = GroupByPipe;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9zaGFyZWQvc2VydmljZXMvY3VzdG9tLXBpcGVzL2dyb3VwYnkucGlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLHNDQUFvRDtBQUdwRDtJQUFBO0lBb0JBLENBQUM7SUFuQkMsK0JBQVMsR0FBVCxVQUFVLFVBQXNCLEVBQUUsUUFBZ0I7UUFFaEQsRUFBRSxDQUFBLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQ2YsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNkLENBQUM7UUFFRCxJQUFNLGlCQUFpQixHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsVUFBQyxRQUFRLEVBQUUsT0FBTztZQUM1RCxFQUFFLENBQUEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hDLFFBQVEsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzFDLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixRQUFRLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzVDLENBQUM7WUFFRCxNQUFNLENBQUMsUUFBUSxDQUFDO1FBQ2xCLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUdQLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUEsR0FBRyxJQUFJLE9BQUEsQ0FBQyxFQUFFLEdBQUcsS0FBQSxFQUFFLEtBQUssRUFBRSxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQXhDLENBQXdDLENBQUMsQ0FBQztJQUM3RixDQUFDO0lBbkJVLFdBQVc7UUFEdkIsV0FBSSxDQUFDLEVBQUMsSUFBSSxFQUFFLFNBQVMsRUFBQyxDQUFDO09BQ1gsV0FBVyxDQW9CdkI7SUFBRCxrQkFBQztDQXBCRCxBQW9CQyxJQUFBO0FBcEJZLGtDQUFXIiwiZmlsZSI6ImFwcC9zaGFyZWQvc2VydmljZXMvY3VzdG9tLXBpcGVzL2dyb3VwYnkucGlwZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBpcGUsIFBpcGVUcmFuc2Zvcm0gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbkBQaXBlKHtuYW1lOiAnZ3JvdXBCeSd9KVxyXG5leHBvcnQgY2xhc3MgR3JvdXBCeVBpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcclxuICB0cmFuc2Zvcm0oY29sbGVjdGlvbjogQXJyYXk8YW55PiwgcHJvcGVydHk6IHN0cmluZyk6IEFycmF5PGFueT4ge1xyXG4gICAgLy8gcHJldmVudHMgdGhlIGFwcGxpY2F0aW9uIGZyb20gYnJlYWtpbmcgaWYgdGhlIGFycmF5IG9mIG9iamVjdHMgZG9lc24ndCBleGlzdCB5ZXRcclxuICAgIGlmKCFjb2xsZWN0aW9uKSB7XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGdyb3VwZWRDb2xsZWN0aW9uID0gY29sbGVjdGlvbi5yZWR1Y2UoKHByZXZpb3VzLCBjdXJyZW50KT0+IHtcclxuICAgICAgaWYoIXByZXZpb3VzW2N1cnJlbnRbcHJvcGVydHldXSkge1xyXG4gICAgICAgIHByZXZpb3VzW2N1cnJlbnRbcHJvcGVydHldXSA9IFtjdXJyZW50XTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBwcmV2aW91c1tjdXJyZW50W3Byb3BlcnR5XV0ucHVzaChjdXJyZW50KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHByZXZpb3VzO1xyXG4gICAgfSwge30pO1xyXG5cclxuICAgIC8vIHRoaXMgd2lsbCByZXR1cm4gYW4gYXJyYXkgb2Ygb2JqZWN0cywgZWFjaCBvYmplY3QgY29udGFpbmluZyBhIGdyb3VwIG9mIG9iamVjdHNcclxuICAgIHJldHVybiBPYmplY3Qua2V5cyhncm91cGVkQ29sbGVjdGlvbikubWFwKGtleSA9PiAoeyBrZXksIHZhbHVlOiBncm91cGVkQ29sbGVjdGlvbltrZXldIH0pKTtcclxuICB9XHJcbn1cclxuIl19
