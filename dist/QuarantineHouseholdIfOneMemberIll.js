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
    class QuarantineHouseholdIfOneMemberIll extends Policy_1.Policy {
        ModifyRunningConfigInternal(runningConfig) {
            return runningConfig;
        }
        CanPeopleMeetInEnvironmentInternal(person1, person2, model, environment) {
            return !model.Households.Households.get(person1.HouseholdIndex).Members.any(a => [Status_1.Status.MildlyIll, Status_1.Status.SeriouslyIll].indexOf(a.Disease.Status) > 1 || (a.Disease.Status == Status_1.Status.Recovered && a.Disease.Time.Day < 7));
        }
    }
    exports.QuarantineHouseholdIfOneMemberIll = QuarantineHouseholdIfOneMemberIll;
});
//# sourceMappingURL=QuarantineHouseholdIfOneMemberIll.js.map