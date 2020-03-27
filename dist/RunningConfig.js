(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./EnvironmentType"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const EnvironmentType_1 = require("./EnvironmentType");
    class RunningConfig {
        constructor(initConfig) {
            this.ReinfectionProbability = initConfig.ReinfectionProbability;
            this.RandomInfectionProbability = initConfig.RandomInfectionProbability;
            this.RetailLunchtimeFactor = initConfig.RetailLunchtimeFactor;
            this.SocialEveningFactor = initConfig.SocialEveningFactor;
            this.ChildRetailFactor = initConfig.ChildRetailFactor;
            this.SocialLunchFactor = initConfig.SocialLunchFactor;
            this.InterpersonalContactFactorModifier = new Map();
            this.InterpersonalContactFactorModifier.set(EnvironmentType_1.EnvironmentType.Entertainment, 1);
            this.InterpersonalContactFactorModifier.set(EnvironmentType_1.EnvironmentType.Factory, 1);
            this.InterpersonalContactFactorModifier.set(EnvironmentType_1.EnvironmentType.Home, 1);
            this.InterpersonalContactFactorModifier.set(EnvironmentType_1.EnvironmentType.Hospital, 1);
            this.InterpersonalContactFactorModifier.set(EnvironmentType_1.EnvironmentType.Logistics, 1);
            this.InterpersonalContactFactorModifier.set(EnvironmentType_1.EnvironmentType.Office, 1);
            this.InterpersonalContactFactorModifier.set(EnvironmentType_1.EnvironmentType.Outdoors, 1);
            this.InterpersonalContactFactorModifier.set(EnvironmentType_1.EnvironmentType.Retail, 1);
            this.InterpersonalContactFactorModifier.set(EnvironmentType_1.EnvironmentType.School, 1);
        }
    }
    exports.RunningConfig = RunningConfig;
});
//# sourceMappingURL=RunningConfig.js.map