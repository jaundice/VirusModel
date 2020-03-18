define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Status;
    (function (Status) {
        Status[Status["Clear"] = 0] = "Clear";
        Status[Status["Asymptomatic"] = 1] = "Asymptomatic";
        Status[Status["MildlyIll"] = 2] = "MildlyIll";
        Status[Status["SeriouslyIll"] = 3] = "SeriouslyIll";
        Status[Status["Dead"] = 4] = "Dead";
        Status[Status["Recovered"] = 5] = "Recovered";
    })(Status = exports.Status || (exports.Status = {}));
    ;
});
//# sourceMappingURL=Status.js.map