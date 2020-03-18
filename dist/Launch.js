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
        c.ProportionOfChildren = 0.3;
        c.SeriousIllnessRatio = 1 / 8; //anticipated serious illness is 1 in 8 of the population 
        c.ReinfectionProbability = 0.08;
        c.RandomInfectionProbability = 0.000005;
        c.PersonalSuceptabilityDeviation = 0.015;
        c.MeanPersonalSusceptability = 0.3;
        c.MeanInterpersonalContactFactors.set(EnvironmentType_1.EnvironmentType.Home, 0.6);
        c.MeanInterpersonalDeviation.set(EnvironmentType_1.EnvironmentType.Home, 0.15);
        c.MeanInterpersonalContactFactors.set(EnvironmentType_1.EnvironmentType.Office, 0.3);
        c.MeanInterpersonalDeviation.set(EnvironmentType_1.EnvironmentType.Office, 0.15);
        c.MeanInterpersonalContactFactors.set(EnvironmentType_1.EnvironmentType.Social, 0.4);
        c.MeanInterpersonalDeviation.set(EnvironmentType_1.EnvironmentType.Social, 0.2);
        c.MeanInterpersonalContactFactors.set(EnvironmentType_1.EnvironmentType.School, 0.6);
        c.MeanInterpersonalDeviation.set(EnvironmentType_1.EnvironmentType.School, 0.1);
        //number of different types of environment
        c.EnvironmentCounts.set(EnvironmentType_1.EnvironmentType.School, 5);
        c.EnvironmentCounts.set(EnvironmentType_1.EnvironmentType.Office, 100);
        c.EnvironmentCounts.set(EnvironmentType_1.EnvironmentType.Retail, 20);
        c.EnvironmentCounts.set(EnvironmentType_1.EnvironmentType.Social, 20);
        c.EnvironmentCounts.set(EnvironmentType_1.EnvironmentType.Home, 1); //dummy: represents homeworkers, housebound, stay at home parents etc
        c.NumberOfHouseholds = 13000;
        c.RecoveryTime = 14; //days
        c.AsymptomaticTime = 7; //days
        c.DeathRatio = 0.2; //proportion of severe cases that are terminal
        c.SocialEveningFactor = 0.08; //proportion of adults socialising at night
        c.SocialLunchFactor = 0.1; // proprtion of adults socialising at lunch;
        c.RetailLunchtimeFactor = 0.3; // proportion of adults shopping at lunchtime;
        c.SocialChildFactor = 0.2; // proportion of children socializing after school
        c.ChildRetailFactor = 0.1; //children shopping out of school hours
        c.MildSymptomsQuarantineFactor = 0.2; //proportion of mild cases going into quarantine
        c.QuarantineWholeHouseholdOnInfection = true; //quarantine whole household if any housemember is quarantined
        var app = new App_1.App();
        app.Init(c);
        var reporter = (a) => {
            var clearCount = 0;
            var deadCount = 0;
            var mildCount = 0;
            var seriousCount = 0;
            var recoveredCount = 0;
            var asymptomaticCount = 0;
            a.People.forEach(p => {
                switch (p.statusHandler.Status) {
                    case Status_1.Status.Asymptomatic:
                        asymptomaticCount++;
                        break;
                    case Status_1.Status.Clear:
                        clearCount++;
                        break;
                    case Status_1.Status.Dead:
                        deadCount++;
                        break;
                    case Status_1.Status.MildlyIll:
                        mildCount++;
                        break;
                    case Status_1.Status.SeriouslyIll:
                        seriousCount++;
                        break;
                    case Status_1.Status.Recovered:
                        recoveredCount++;
                        break;
                }
            });
            //console.log(`Day  ${a.Time.Day},\tHour  ${a.Time.Hour};\tClear ${clearCount};\tAsymptomatic ${asymptomaticCount};\tMild ${mildCount};\tSevere ${seriousCount};\tRecovered ${recoveredCount};\tDead ${deadCount}`);
            console.log(`${a.Time.Day},${a.Time.Hour},${a.Time.Day * 24 + a.Time.Hour},${clearCount},${asymptomaticCount},${mildCount},${seriousCount},${recoveredCount},${deadCount}`);
        };
        console.log(JSON.stringify(c));
        console.log();
        console.log("Day,Hour,TotalHours,clearCount,asymptomaticCount,mildCount,seriousCount,recoveredCount,deadCount");
        for (var i = 0; i < 11000; i++) {
            app.TimeElapsed();
            reporter(app);
        }
    }
    ;
    Run();
});
//# sourceMappingURL=Launch.js.map