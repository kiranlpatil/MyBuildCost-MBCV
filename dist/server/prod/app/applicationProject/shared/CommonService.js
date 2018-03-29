"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants = require("./constants");
var CommonService = (function () {
    function CommonService() {
    }
    CommonService.prototype.decimalConversion = function (value) {
        return parseFloat((value).toFixed(constants.NUMBER_OF_FRACTION_DIGIT));
    };
    return CommonService;
}());
exports.CommonService = CommonService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hcHBsaWNhdGlvblByb2plY3Qvc2hhcmVkL0NvbW1vblNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx1Q0FBMEM7QUFFMUM7SUFBQTtJQUtBLENBQUM7SUFIQyx5Q0FBaUIsR0FBakIsVUFBa0IsS0FBYztRQUM5QixNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUM7SUFDekUsQ0FBQztJQUNILG9CQUFDO0FBQUQsQ0FMQSxBQUtDLElBQUE7QUFMWSxzQ0FBYSIsImZpbGUiOiJhcHAvYXBwbGljYXRpb25Qcm9qZWN0L3NoYXJlZC9Db21tb25TZXJ2aWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNvbnN0YW50cyA9IHJlcXVpcmUoJy4vY29uc3RhbnRzJyk7XHJcblxyXG5leHBvcnQgY2xhc3MgQ29tbW9uU2VydmljZSB7XHJcblxyXG4gIGRlY2ltYWxDb252ZXJzaW9uKHZhbHVlIDogbnVtYmVyKSB7XHJcbiAgICByZXR1cm4gcGFyc2VGbG9hdCgodmFsdWUpLnRvRml4ZWQoY29uc3RhbnRzLk5VTUJFUl9PRl9GUkFDVElPTl9ESUdJVCkpO1xyXG4gIH1cclxufVxyXG4iXX0=
