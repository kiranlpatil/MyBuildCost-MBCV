"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var CostControllException = (function (_super) {
    __extends(CostControllException, _super);
    function CostControllException(message, cause, httpStatus) {
        var _this = _super.call(this, message) || this;
        _this._cause = cause;
        _this._httpStatus = httpStatus;
        return _this;
    }
    Object.defineProperty(CostControllException.prototype, "cause", {
        get: function () {
            return this._cause;
        },
        set: function (value) {
            this._cause = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CostControllException.prototype, "httpStatus", {
        get: function () {
            return this._httpStatus;
        },
        set: function (value) {
            this._httpStatus = value;
        },
        enumerable: true,
        configurable: true
    });
    CostControllException.prototype.errorDetails = function () {
        var errorMessage = this.message;
        var httpStatus = null;
        var causeStack = this.message;
        if (this.cause) {
            causeStack = this.cause.stack;
        }
        if (this.httpStatus) {
            httpStatus = this.httpStatus;
        }
        var error = {
            message: errorMessage,
            cause: causeStack,
            status: httpStatus
        };
        return error;
    };
    return CostControllException;
}(Error));
module.exports = CostControllException;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hcHBsaWNhdGlvblByb2plY3QvZXhjZXB0aW9uL0Nvc3RDb250cm9sbEV4Y2VwdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBO0lBQW9DLHlDQUFLO0lBa0J2QywrQkFBWSxPQUFlLEVBQUUsS0FBWSxFQUFFLFVBQWtCO1FBQTdELFlBQ0Usa0JBQU0sT0FBTyxDQUFDLFNBR2Y7UUFGQyxLQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztRQUNwQixLQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQzs7SUFDaEMsQ0FBQztJQW5CRCxzQkFBSSx3Q0FBSzthQUFUO1lBQ0UsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDckIsQ0FBQzthQUVELFVBQVUsS0FBWTtZQUNwQixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztRQUN0QixDQUFDOzs7T0FKQTtJQU1ELHNCQUFJLDZDQUFVO2FBQWQ7WUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztRQUMxQixDQUFDO2FBRUQsVUFBZSxLQUFhO1lBQzFCLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO1FBQzNCLENBQUM7OztPQUpBO0lBVUQsNENBQVksR0FBWjtRQUNFLElBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDaEMsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDO1FBQ3RCLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDOUIsRUFBRSxDQUFBLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDZCxVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7UUFDaEMsQ0FBQztRQUNELEVBQUUsQ0FBQSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQ25CLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO1FBQy9CLENBQUM7UUFDRCxJQUFJLEtBQUssR0FBRztZQUNWLE9BQU8sRUFBRyxZQUFZO1lBQ3RCLEtBQUssRUFBRSxVQUFVO1lBQ2pCLE1BQU0sRUFBRSxVQUFVO1NBQ25CLENBQUE7UUFDRCxNQUFNLENBQUMsS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUNILDRCQUFDO0FBQUQsQ0F4Q0EsQUF3Q0MsQ0F4Q21DLEtBQUssR0F3Q3hDO0FBQ0QsaUJBQVMscUJBQXFCLENBQUMiLCJmaWxlIjoiYXBwL2FwcGxpY2F0aW9uUHJvamVjdC9leGNlcHRpb24vQ29zdENvbnRyb2xsRXhjZXB0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgQ29zdENvbnRyb2xsRXhjZXB0aW9uIGV4dGVuZHMgRXJyb3Ige1xyXG4gIHByaXZhdGUgX2NhdXNlOiBFcnJvcjtcclxuICBwcml2YXRlIF9odHRwU3RhdHVzOiBudW1iZXI7XHJcbiAgZ2V0IGNhdXNlKCk6IEVycm9yIHtcclxuICAgIHJldHVybiB0aGlzLl9jYXVzZTtcclxuICB9XHJcblxyXG4gIHNldCBjYXVzZSh2YWx1ZTogRXJyb3IpIHtcclxuICAgIHRoaXMuX2NhdXNlID0gdmFsdWU7XHJcbiAgfVxyXG5cclxuICBnZXQgaHR0cFN0YXR1cygpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIHRoaXMuX2h0dHBTdGF0dXM7XHJcbiAgfVxyXG5cclxuICBzZXQgaHR0cFN0YXR1cyh2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICB0aGlzLl9odHRwU3RhdHVzID0gdmFsdWU7XHJcbiAgfVxyXG4gIGNvbnN0cnVjdG9yKG1lc3NhZ2U6IHN0cmluZywgY2F1c2U6IEVycm9yLCBodHRwU3RhdHVzPzpudW1iZXIpIHtcclxuICAgIHN1cGVyKG1lc3NhZ2UpO1xyXG4gICAgdGhpcy5fY2F1c2UgPSBjYXVzZTtcclxuICAgIHRoaXMuX2h0dHBTdGF0dXMgPSBodHRwU3RhdHVzO1xyXG4gIH1cclxuICBlcnJvckRldGFpbHMoKSB7XHJcbiAgICBsZXQgZXJyb3JNZXNzYWdlID0gdGhpcy5tZXNzYWdlO1xyXG4gICAgbGV0IGh0dHBTdGF0dXMgPSBudWxsO1xyXG4gICAgbGV0IGNhdXNlU3RhY2sgPSB0aGlzLm1lc3NhZ2U7XHJcbiAgICBpZih0aGlzLmNhdXNlKSB7XHJcbiAgICAgIGNhdXNlU3RhY2sgPSB0aGlzLmNhdXNlLnN0YWNrO1xyXG4gICAgfVxyXG4gICAgaWYodGhpcy5odHRwU3RhdHVzKSB7XHJcbiAgICAgIGh0dHBTdGF0dXMgPSB0aGlzLmh0dHBTdGF0dXM7XHJcbiAgICB9XHJcbiAgICBsZXQgZXJyb3IgPSB7XHJcbiAgICAgIG1lc3NhZ2UgOiBlcnJvck1lc3NhZ2UsXHJcbiAgICAgIGNhdXNlOiBjYXVzZVN0YWNrLFxyXG4gICAgICBzdGF0dXM6IGh0dHBTdGF0dXNcclxuICAgIH1cclxuICAgIHJldHVybiBlcnJvcjtcclxuICB9XHJcbn1cclxuZXhwb3J0ID0gQ29zdENvbnRyb2xsRXhjZXB0aW9uO1xyXG5cclxuIl19
