"use strict";
var Response = (function () {
    function Response(status, data) {
        this._data = data;
        this._status = status;
    }
    Object.defineProperty(Response.prototype, "status", {
        get: function () {
            return this._status;
        },
        set: function (value) {
            this._status = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Response.prototype, "data", {
        get: function () {
            return this._data;
        },
        set: function (value) {
            this._data = value;
        },
        enumerable: true,
        configurable: true
    });
    return Response;
}());
module.exports = Response;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hcHBsaWNhdGlvblByb2plY3QvaW50ZXJjZXB0b3IvcmVzcG9uc2UvUmVzcG9uc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0lBR0Usa0JBQVksTUFBYyxFQUFFLElBQVM7UUFDbkMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDbEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7SUFDeEIsQ0FBQztJQUVELHNCQUFJLDRCQUFNO2FBQVY7WUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUN0QixDQUFDO2FBRUQsVUFBVyxLQUFhO1lBQ3RCLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLENBQUM7OztPQUpBO0lBTUQsc0JBQUksMEJBQUk7YUFBUjtZQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ3BCLENBQUM7YUFFRCxVQUFTLEtBQVU7WUFDakIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDckIsQ0FBQzs7O09BSkE7SUFLSCxlQUFDO0FBQUQsQ0F2QkEsQUF1QkMsSUFBQTtBQUNELGlCQUFTLFFBQVEsQ0FBQyIsImZpbGUiOiJhcHAvYXBwbGljYXRpb25Qcm9qZWN0L2ludGVyY2VwdG9yL3Jlc3BvbnNlL1Jlc3BvbnNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgUmVzcG9uc2Uge1xyXG4gIHByaXZhdGUgX3N0YXR1czogbnVtYmVyO1xyXG4gIHByaXZhdGUgX2RhdGE6IGFueTtcclxuICBjb25zdHJ1Y3RvcihzdGF0dXM6IG51bWJlciwgZGF0YTogYW55KSB7XHJcbiAgICB0aGlzLl9kYXRhID0gZGF0YTtcclxuICAgIHRoaXMuX3N0YXR1cyA9IHN0YXR1cztcclxuICB9XHJcblxyXG4gIGdldCBzdGF0dXMoKTogbnVtYmVyIHtcclxuICAgIHJldHVybiB0aGlzLl9zdGF0dXM7XHJcbiAgfVxyXG5cclxuICBzZXQgc3RhdHVzKHZhbHVlOiBudW1iZXIpIHtcclxuICAgIHRoaXMuX3N0YXR1cyA9IHZhbHVlO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGRhdGEoKTogYW55IHtcclxuICAgIHJldHVybiB0aGlzLl9kYXRhO1xyXG4gIH1cclxuXHJcbiAgc2V0IGRhdGEodmFsdWU6IGFueSkge1xyXG4gICAgdGhpcy5fZGF0YSA9IHZhbHVlO1xyXG4gIH1cclxufVxyXG5leHBvcnQgPSBSZXNwb25zZTtcclxuIl19
