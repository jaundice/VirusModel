/*

Clear ->
            Incubation ->
                            Asymptomatic -> Recovered
                            MildyIll     -> Recovered
                                            SeriouslyIll -> Recovered
                                                            Dead

*/
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Status;
    (function (Status) {
        Status[Status["Clear"] = 0] = "Clear";
        Status[Status["Incubation"] = 1] = "Incubation";
        Status[Status["Asymptomatic"] = 2] = "Asymptomatic";
        Status[Status["MildlyIll"] = 3] = "MildlyIll";
        Status[Status["SeriouslyIll"] = 4] = "SeriouslyIll";
        Status[Status["Dead"] = 5] = "Dead";
        Status[Status["Recovered"] = 6] = "Recovered";
    })(Status = exports.Status || (exports.Status = {}));
    ;
});
//# sourceMappingURL=Status.js.map