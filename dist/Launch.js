(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./AppInitConfig", "./App", "./EnvironmentType", "./Status"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const AppInitConfig_1 = require("./AppInitConfig");
    const App_1 = require("./App");
    const EnvironmentType_1 = require("./EnvironmentType");
    const Status_1 = require("./Status");
    function Run() {
        var c = new AppInitConfig_1.AppInitConfig();
        c.PopulationSize = 50000;
        c.ReinfectionProbability = 0.008;
        c.RandomInfectionProbability = 0.000005;
        c.PersonalSuceptabilityDeviation = 0.015;
        c.MeanPersonalSusceptability = 0.5;
        c.MeanInterpersonalContactFactors.set(EnvironmentType_1.EnvironmentType.Home, 0.6);
        c.MeanInterpersonalDeviation.set(EnvironmentType_1.EnvironmentType.Home, 0.15);
        c.MeanInterpersonalContactFactors.set(EnvironmentType_1.EnvironmentType.Office, 0.3);
        c.MeanInterpersonalDeviation.set(EnvironmentType_1.EnvironmentType.Office, 0.15);
        c.MeanInterpersonalContactFactors.set(EnvironmentType_1.EnvironmentType.Entertainment, 0.4);
        c.MeanInterpersonalDeviation.set(EnvironmentType_1.EnvironmentType.Entertainment, 0.1);
        c.MeanInterpersonalContactFactors.set(EnvironmentType_1.EnvironmentType.School, 0.6);
        c.MeanInterpersonalDeviation.set(EnvironmentType_1.EnvironmentType.School, 0.1);
        c.MeanInterpersonalContactFactors.set(EnvironmentType_1.EnvironmentType.Retail, 0.2);
        c.MeanInterpersonalDeviation.set(EnvironmentType_1.EnvironmentType.Retail, 0.1);
        c.MeanInterpersonalContactFactors.set(EnvironmentType_1.EnvironmentType.Outdoors, 0.2);
        c.MeanInterpersonalDeviation.set(EnvironmentType_1.EnvironmentType.Outdoors, 0.1);
        c.MeanInterpersonalContactFactors.set(EnvironmentType_1.EnvironmentType.Factory, 0.2);
        c.MeanInterpersonalDeviation.set(EnvironmentType_1.EnvironmentType.Factory, 0.1);
        c.MeanInterpersonalContactFactors.set(EnvironmentType_1.EnvironmentType.Logistics, 0.2);
        c.MeanInterpersonalDeviation.set(EnvironmentType_1.EnvironmentType.Logistics, 0.1);
        c.MeanInterpersonalContactFactors.set(EnvironmentType_1.EnvironmentType.Hospital, 0.2);
        c.MeanInterpersonalDeviation.set(EnvironmentType_1.EnvironmentType.Hospital, 0.1);
        c.EnvironmentKeyWorkerRatio.set(EnvironmentType_1.EnvironmentType.Entertainment, 0.05);
        c.EnvironmentKeyWorkerRatio.set(EnvironmentType_1.EnvironmentType.Factory, 0.3);
        c.EnvironmentKeyWorkerRatio.set(EnvironmentType_1.EnvironmentType.Home, 0);
        c.EnvironmentKeyWorkerRatio.set(EnvironmentType_1.EnvironmentType.Hospital, 0.8);
        c.EnvironmentKeyWorkerRatio.set(EnvironmentType_1.EnvironmentType.Logistics, 0.2);
        c.EnvironmentKeyWorkerRatio.set(EnvironmentType_1.EnvironmentType.Office, 0.1);
        c.EnvironmentKeyWorkerRatio.set(EnvironmentType_1.EnvironmentType.Outdoors, 0.2);
        c.EnvironmentKeyWorkerRatio.set(EnvironmentType_1.EnvironmentType.Retail, 0.1);
        c.EnvironmentKeyWorkerRatio.set(EnvironmentType_1.EnvironmentType.School, 0.5);
        c.NumberOfHouseholds = 13000;
        c.SocialEveningFactor = 0.08; //proportion of adults socialising at night
        c.SocialLunchFactor = 0.1; // proprtion of adults socialising at lunch;
        c.RetailLunchtimeFactor = 0.3; // proportion of adults shopping at lunchtime;
        c.SocialChildFactor = 0.2; // proportion of children socializing after school
        c.ChildRetailFactor = 0.1; //children shopping out of school hours
        c.AvailableBeds = 200;
        c.AvailableICU = 20;
        c.AvailableVentilators = 25;
        c.EnvironmentCount = 900;
        var app = new App_1.App();
        app.Init(c);
        console.log(JSON.stringify(c));
        console.log();
        console.log("Day,Hour,TotalHours,clearCount,incubatorCount,asymptomaticCount,mildCount,seriousCount,recoveredCount,deadCount,medicsCritical,bedsCritical,ICUCritical,ventilatorsCritical");
        for (var i = 0; i < 11000; i++) {
            app.TimeElapsed();
            reporter(app);
        }
    }
    ;
    Run();
    function reporter(a) {
        //console.log(`Day  ${a.Time.Day},\tHour  ${a.Time.Hour};\tClear ${clearCount};\tAsymptomatic ${asymptomaticCount};\tMild ${mildCount};\tSevere ${seriousCount};\tRecovered ${recoveredCount};\tDead ${deadCount}`);
        console.log(`${a.Model.Time.Day},${a.Model.Time.Hour},${a.Model.Time.Day * 24 + a.Model.Time.Hour},${a.Model.Result.Counts.get(Status_1.Status.Clear)},${a.Model.Result.Counts.get(Status_1.Status.Incubation)},${a.Model.Result.Counts.get(Status_1.Status.Asymptomatic)},${a.Model.Result.Counts.get(Status_1.Status.MildlyIll)},${a.Model.Result.Counts.get(Status_1.Status.SeriouslyIll)},${a.Model.Result.Counts.get(Status_1.Status.Recovered)},${a.Model.Result.Counts.get(Status_1.Status.Dead)},${a.Model.HealthService.MedicsCritical},${a.Model.HealthService.BedsCritical},${a.Model.HealthService.ICUCritical},${a.Model.HealthService.VentilatorsCritical}`);
    }
    ;
});
//# sourceMappingURL=Launch.js.map