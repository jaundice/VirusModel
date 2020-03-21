import { AppInitConfig } from './AppInitConfig';
import { App } from './App';
import { EnvironmentType } from './EnvironmentType';
import { Status } from './Status';


function Run() {

    var c = new AppInitConfig();
    c.PopulationSize = 50000;
    //c.ProportionOfChildren = 0.3;
    c.SeriousIllnessRatio = 1 / 8; //anticipated serious illness is 1 in 8 of the population 
    c.ReinfectionProbability = 0.008;
    c.RandomInfectionProbability = 0.000005;
    c.PersonalSuceptabilityDeviation = 0.015;
    c.MeanPersonalSusceptability = 0.3;

    c.MeanInterpersonalContactFactors.set(EnvironmentType.Home, 0.6);
    c.MeanInterpersonalDeviation.set(EnvironmentType.Home, 0.15);

    c.MeanInterpersonalContactFactors.set(EnvironmentType.Office, 0.3);
    c.MeanInterpersonalDeviation.set(EnvironmentType.Office, 0.15);

    c.MeanInterpersonalContactFactors.set(EnvironmentType.Social, 0.4);
    c.MeanInterpersonalDeviation.set(EnvironmentType.Social, 0.2);

    c.MeanInterpersonalContactFactors.set(EnvironmentType.School, 0.6);
    c.MeanInterpersonalDeviation.set(EnvironmentType.School, 0.1);

    c.MeanInterpersonalContactFactors.set(EnvironmentType.Retail, 0.2);
    c.MeanInterpersonalDeviation.set(EnvironmentType.Retail, 0.1);

    //number of different types of environment
    c.EnvironmentCounts.set(EnvironmentType.School, 5);
    c.EnvironmentCounts.set(EnvironmentType.Office, 100);
    c.EnvironmentCounts.set(EnvironmentType.Retail, 20);
    c.EnvironmentCounts.set(EnvironmentType.Social, 20);
    c.EnvironmentCounts.set(EnvironmentType.Home, 1); //dummy: represents homeworkers, housebound, stay at home parents etc


    c.NumberOfHouseholds = 13000;

    c.RecoveryTime = 14; //days
    c.AsymptomaticTime = 7; //days
    c.DeathRatio = 0.2; //proportion of severe cases that are terminal

    c.SocialEveningFactor = 0.08; //proportion of adults socialising at night
    c.SocialLunchFactor = 0.1; // proprtion of adults socialising at lunch;
    c.RetailLunchtimeFactor = 0.3; // proportion of adults shopping at lunchtime;
    c.SocialChildFactor = 0.2; // proportion of children socializing after school

    c.ChildRetailFactor = 0.1; //children shopping out of school hours

    c.MildSymptomsQuarantineFactor = 0.75; //proportion of mild cases going into quarantine
    c.QuarantineWholeHouseholdOnInfection = false; //quarantine whole household if any housemember is quarantined

    var app = new App();
    app.Init(c);

   


    console.log(JSON.stringify(c));

    console.log();

    console.log("Day,Hour,TotalHours,clearCount,asymptomaticCount,mildCount,seriousCount,recoveredCount,deadCount");

    for (var i = 0; i < 11000; i++) {
        app.TimeElapsed();

        reporter(app);
    }

};

Run();

function reporter (a: App)  {

    var clearCount = 0;
    var deadCount = 0;
    var mildCount = 0;
    var seriousCount = 0;
    var recoveredCount = 0;
    var asymptomaticCount = 0;

    a.People.forEach(p => {
        switch (p.StatusHandler.Status) {
            case Status.Asymptomatic:
                asymptomaticCount++;
                break;
            case Status.Clear:
                clearCount++;
                break;
            case Status.Dead:
                deadCount++;
                break;
            case Status.MildlyIll:
                mildCount++;
                break;
            case Status.SeriouslyIll:
                seriousCount++;
                break;
            case Status.Recovered:
                recoveredCount++;
                break;
        }
    });

    //console.log(`Day  ${a.Time.Day},\tHour  ${a.Time.Hour};\tClear ${clearCount};\tAsymptomatic ${asymptomaticCount};\tMild ${mildCount};\tSevere ${seriousCount};\tRecovered ${recoveredCount};\tDead ${deadCount}`);
    console.log(`${a.Time.Day},${a.Time.Hour},${a.Time.Day *24 + a.Time.Hour},${clearCount},${asymptomaticCount},${mildCount},${seriousCount},${recoveredCount},${deadCount}`);
};