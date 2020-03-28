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
            //ProportionOfChildren: number = 0.15;
            //EnvironmentCounts: Map<EnvironmentType, number> = new Map<EnvironmentType, number>();
            this.MeanInterpersonalContactFactors = new Map();
            this.MeanInterpersonalDeviation = new Map();
            this.MeanPersonalSusceptability = 0.6;
            this.PersonalSuceptabilityDeviation = 0.15;
            //AsymptomaticTime: number = 7;
            //RecoveryTime: number = 14;
            //SeriousIllnessRatio: number = 1 / 8;
            //DeathRatio: number = 0.2;
            this.RandomInfectionProbability = 0.001; //a chance factor to be infected by a person external to the test e.g visit from infected family member / business road warrior / postman
            this.ReinfectionProbability = 0.01;
            this.ChildProgressionFactor = 0.2; //proportion of children who develop full symptoms;
            //MildSymptomsQuarantineFactor: number = 0.6;
            this.RetailLunchtimeFactor = 0.4; //proportion of office workers doing retail activity at lunch;
            this.SocialLunchFactor = 0.1; //proportion of office workers doing social activity at lunchtime ;
            this.SocialChildFactor = 0.3;
            this.SocialEveningFactor = 0.15;
            this.ChildRetailFactor = 0.2;
            this.EnvironmentCount = 30;
            this.MedicalStaffCount = 15;
            this.AvailableBeds = 30;
            this.AvailableICU = 5;
            this.AvailableVentilators = 8;
            this.EnvironmentKeyWorkerRatio = new Map();
        }
    }
    exports.AppInitConfig = AppInitConfig;
    ;
});
//# sourceMappingURL=AppInitConfig.js.map