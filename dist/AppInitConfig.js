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
    class AppInitConfig {
        constructor() {
            this.PopulationSize = 3000;
            this.NumberOfHouseholds = 900;
            this.ProportionOfChildren = 0.15;
            this.EnvironmentCounts = new Map();
            this.MeanInterpersonalContactFactors = new Map();
            this.MeanInterpersonalDeviation = new Map();
            this.MeanPersonalSusceptability = 0.6;
            this.PersonalSuceptabilityDeviation = 0.15;
            this.AsymptomaticTime = 7;
            this.RecoveryTime = 14;
            this.SeriousIllnessRatio = 1 / 8;
            this.DeathRatio = 0.2;
            this.RandomInfectionProbability = 0.1; //a chance factor to be infected by a person external to the test e.g visit from infected family member / business road warrior / postman
            this.ReinfectionProbability = 0.1;
            this.ChildProgressionFactor = 0.2; //proportion of children who develop full symptoms;
            this.MildSymptomsQuarantineFactor = 0.6;
            this.RetailLunchtimeFactor = 0.4; //proportion of office workers doing retail activity at lunch;
            this.SocialLunchFactor = 0.1; //proportion of office workers doing social activity at lunchtime ;
            this.SocialChildFactor = 0.3;
            this.SocialEveningFactor = 0.15;
            this.ChildRetailFactor = 0.2;
            this.QuarantineWholeHouseholdOnInfection = false;
        }
    }
    exports.AppInitConfig = AppInitConfig;
    ;
});
//# sourceMappingURL=AppInitConfig.js.map