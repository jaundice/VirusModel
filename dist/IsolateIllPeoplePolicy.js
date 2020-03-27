(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./Status", "./Policy"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Status_1 = require("./Status");
    const Policy_1 = require("./Policy");
    class IsolateIllPeoplePolicy extends Policy_1.Policy {
        ModifyRunningConfigInternal(runningConfig) {
            return runningConfig;
        }
        CanPeopleMeetInEnvironmentInternal(person1, person2, model, environment) {
            return !(person2.Disease.Status == Status_1.Status.MildlyIll || person2.Disease.Status == Status_1.Status.SeriouslyIll);
        }
    }
    exports.IsolateIllPeoplePolicy = IsolateIllPeoplePolicy;
});
//# sourceMappingURL=IsolateIllPeoplePolicy.js.map