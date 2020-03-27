(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./EnvironmentType", "./Stats", "./Policy", "./Demographic"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const EnvironmentType_1 = require("./EnvironmentType");
    const Stats_1 = require("./Stats");
    const Policy_1 = require("./Policy");
    const Demographic_1 = require("./Demographic");
    class PolicyLockdown extends Policy_1.Policy {
        ModifyRunningConfigInternal(runningConfig) {
            return runningConfig;
        }
        CanPeopleMeetInEnvironmentInternal(person1, person2, model, environment) {
            switch (environment.EnvironmentType) {
                case EnvironmentType_1.EnvironmentType.Home:
                    return person1.HouseholdIndex == person2.HouseholdIndex;
                case EnvironmentType_1.EnvironmentType.School:
                    {
                        if (person1.UsualDaytimeEnvironment != environment || person2.UsualDaytimeEnvironment != environment)
                            return false;
                        if (person1.AgeDemographic == Demographic_1.AgeDemographic.Under10) {
                            if (!model.Households.Households.get(person1.HouseholdIndex).Members.any(a => a.IsKeyWorker))
                                return false;
                        }
                        if (person2.AgeDemographic == Demographic_1.AgeDemographic.Under10) {
                            if (!model.Households.Households.get(person2.HouseholdIndex).Members.any(a => a.IsKeyWorker))
                                return false;
                        }
                        return true;
                    }
                default:
                    return environment.IsKeyInfrastructure || Stats_1.Stats.getUniform(0, 1) > this.PublicAdherance;
            }
        }
    }
    exports.PolicyLockdown = PolicyLockdown;
});
//# sourceMappingURL=LockdownPolicy.js.map