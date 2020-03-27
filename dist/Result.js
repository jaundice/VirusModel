(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./Status"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Status_1 = require("./Status");
    class Result {
        constructor() {
            this.Counts = new Map();
            this.Counts.set(Status_1.Status.Clear, 0);
            this.Counts.set(Status_1.Status.Incubation, 0);
            this.Counts.set(Status_1.Status.Asymptomatic, 0);
            this.Counts.set(Status_1.Status.MildlyIll, 0);
            this.Counts.set(Status_1.Status.SeriouslyIll, 0);
            this.Counts.set(Status_1.Status.Recovered, 0);
            this.Counts.set(Status_1.Status.Dead, 0);
        }
    }
    exports.Result = Result;
});
//# sourceMappingURL=Result.js.map