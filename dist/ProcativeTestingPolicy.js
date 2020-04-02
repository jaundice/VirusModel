(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./Policy", "./Status", "./Stats"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Policy_1 = require("./Policy");
    const Status_1 = require("./Status");
    const Stats_1 = require("./Stats");
    class ProcativeTestingPolicy extends Policy_1.Policy {
        constructor(testingRatio) {
            super();
            this._testingRatio = testingRatio;
        }
        UpdateModel(model) {
            model.People.AllPeople.filter(a => [Status_1.Status.Asymptomatic, Status_1.Status.Incubation].indexOf(a.Disease.Status) > -1).forEach(b => {
                if (Stats_1.Stats.getUniform(0, 1) < this._testingRatio) {
                    var day = b.Disease.Time.Day;
                    var hour = b.Disease.Time.Hour;
                    var infectiousness = b.Disease.Infectiousness;
                    b.Disease.Status = Status_1.Status.MildlyIll;
                    b.Disease.Infectiousness = infectiousness;
                    b.Disease.Time.Hour = hour;
                    b.Disease.Time.Day = day;
                }
            });
        }
        ModifyRunningConfigInternal(runningConfig) {
            return runningConfig;
        }
        CanPeopleMeetInEnvironmentInternal(person1, person2, model, environment) {
            return true;
        }
    }
    exports.ProcativeTestingPolicy = ProcativeTestingPolicy;
});
//# sourceMappingURL=ProcativeTestingPolicy.js.map