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
var RepositoryBase = require("./base/repository.base");
var ShareLinkSchema = require("../schemas/share-link.schema");
var ShareLinkRepository = (function (_super) {
    __extends(ShareLinkRepository, _super);
    function ShareLinkRepository() {
        return _super.call(this, ShareLinkSchema) || this;
    }
    return ShareLinkRepository;
}(RepositoryBase));
Object.seal(ShareLinkRepository);
module.exports = ShareLinkRepository;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L3NoYXJlLWxpbmsucmVwb3NpdG9yeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLHVEQUEwRDtBQUUxRCw4REFBaUU7QUFHakU7SUFBa0MsdUNBQXlCO0lBQ3pEO2VBQ0Usa0JBQU0sZUFBZSxDQUFDO0lBQ3hCLENBQUM7SUFDSCwwQkFBQztBQUFELENBSkEsQUFJQyxDQUppQyxjQUFjLEdBSS9DO0FBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBQ2pDLGlCQUFTLG1CQUFtQixDQUFDIiwiZmlsZSI6ImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L3NoYXJlLWxpbmsucmVwb3NpdG9yeS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZXBvc2l0b3J5QmFzZSA9IHJlcXVpcmUoXCIuL2Jhc2UvcmVwb3NpdG9yeS5iYXNlXCIpO1xyXG5pbXBvcnQgU2hhcmVMaW5rID0gcmVxdWlyZShcIi4uL21vbmdvb3NlL3NoYXJlLWxpbmtcIik7XHJcbmltcG9ydCBTaGFyZUxpbmtTY2hlbWEgPSByZXF1aXJlKFwiLi4vc2NoZW1hcy9zaGFyZS1saW5rLnNjaGVtYVwiKTtcclxuXHJcblxyXG5jbGFzcyBTaGFyZUxpbmtSZXBvc2l0b3J5IGV4dGVuZHMgUmVwb3NpdG9yeUJhc2U8U2hhcmVMaW5rPiB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICBzdXBlcihTaGFyZUxpbmtTY2hlbWEpO1xyXG4gIH1cclxufVxyXG5PYmplY3Quc2VhbChTaGFyZUxpbmtSZXBvc2l0b3J5KTtcclxuZXhwb3J0ID0gU2hhcmVMaW5rUmVwb3NpdG9yeTtcclxuIl19
