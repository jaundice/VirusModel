import { AppInitConfig } from './AppInitConfig';
import { App } from './App';
import { EnvironmentType } from './EnvironmentType';
import { Status } from './Status';


function Run() {

    var c = new AppInitConfig();
    c.PopulationSize = 50000;

    c.ReinfectionProbability = 0.008;
    c.RandomInfectionProbability = 0.000005;
    c.PersonalSuceptabilityDeviation = 0.015;
    c.MeanPersonalSusceptability = 0.5;

    c.MeanInterpersonalContactFactors.set(EnvironmentType.Home, 0.6);
    c.MeanInterpersonalDeviation.set(EnvironmentType.Home, 0.15);

    c.MeanInterpersonalContactFactors.set(EnvironmentType.Office, 0.3);
    c.MeanInterpersonalDeviation.set(EnvironmentType.Office, 0.15);

    c.MeanInterpersonalContactFactors.set(EnvironmentType.Entertainment, 0.4);
    c.MeanInterpersonalDeviation.set(EnvironmentType.Entertainment, 0.1);

    c.MeanInterpersonalContactFactors.set(EnvironmentType.School, 0.6);
    c.MeanInterpersonalDeviation.set(EnvironmentType.School, 0.1);

    c.MeanInterpersonalContactFactors.set(EnvironmentType.Retail, 0.2);
    c.MeanInterpersonalDeviation.set(EnvironmentType.Retail, 0.1);

    c.MeanInterpersonalContactFactors.set(EnvironmentType.Outdoors, 0.2);
    c.MeanInterpersonalDeviation.set(EnvironmentType.Outdoors, 0.1);

    c.MeanInterpersonalContactFactors.set(EnvironmentType.Factory, 0.2);
    c.MeanInterpersonalDeviation.set(EnvironmentType.Factory, 0.1);

    c.MeanInterpersonalContactFactors.set(EnvironmentType.Logistics, 0.2);
    c.MeanInterpersonalDeviation.set(EnvironmentType.Logistics, 0.1);

    c.MeanInterpersonalContactFactors.set(EnvironmentType.Hospital, 0.2);
    c.MeanInterpersonalDeviation.set(EnvironmentType.Hospital, 0.1);


    c.EnvironmentKeyWorkerRatio.set(EnvironmentType.Entertainment, 0.001); //news broadcasters etc
    c.EnvironmentKeyWorkerRatio.set(EnvironmentType.Factory, 0.1); // manufacture of critical components
    c.EnvironmentKeyWorkerRatio.set(EnvironmentType.Home, 0); // homeworlers don't need to travel
    c.EnvironmentKeyWorkerRatio.set(EnvironmentType.Hospital,  530000 / 4515000); //frontline staff vs total staff
    c.EnvironmentKeyWorkerRatio.set(EnvironmentType.Logistics, 0.2); // delivery drivers supplying food and medical supplies
    c.EnvironmentKeyWorkerRatio.set(EnvironmentType.Office, 0.1); // governmental infrastructure
    c.EnvironmentKeyWorkerRatio.set(EnvironmentType.Outdoors, 0.1); // farming, maintainance of roads and infrastructure
    c.EnvironmentKeyWorkerRatio.set(EnvironmentType.Retail, 0.1); // food and pharmacy
    c.EnvironmentKeyWorkerRatio.set(EnvironmentType.School, 0.5); // teachers looking after keyworker children

    c.NumberOfHouseholds = 13000;

    c.SocialEveningFactor = 0.08; //proportion of adults socialising at night
    c.SocialLunchFactor = 0.1; // proprtion of adults socialising at lunch;
    c.RetailLunchtimeFactor = 0.3; // proportion of adults shopping at lunchtime;
    c.SocialChildFactor = 0.2; // proportion of children socializing after school

    c.ChildRetailFactor = 0.1; //children shopping out of school hours


    c.AvailableBeds =200;
    c.AvailableICU = 20;
    c.AvailableVentilators = 25;
    c.EnvironmentCount = 900;
    

    var app = new App();
    app.Init(c);

   


    console.log(JSON.stringify(c));

    console.log();

    console.log("Day,Hour,TotalHours,clearCount,incubatorCount,asymptomaticCount,mildCount,seriousCount,recoveredCount,deadCount,medicsCritical,bedsCritical,ICUCritical,ventilatorsCritical");

    for (var i = 0; i < 11000; i++) {
        app.TimeElapsed();

        reporter(app);
    }

};

Run();

function reporter (a: App)  {
   //console.log(`Day  ${a.Time.Day},\tHour  ${a.Time.Hour};\tClear ${clearCount};\tAsymptomatic ${asymptomaticCount};\tMild ${mildCount};\tSevere ${seriousCount};\tRecovered ${recoveredCount};\tDead ${deadCount}`);
    console.log(`${a.Model.Time.Day},${a.Model.Time.Hour},${a.Model.Time.Day *24 + a.Model.Time.Hour},${a.Model.Result.Counts.get(Status.Clear)},${a.Model.Result.Counts.get(Status.Incubation)},${a.Model.Result.Counts.get(Status.Asymptomatic)},${a.Model.Result.Counts.get(Status.MildlyIll)},${a.Model.Result.Counts.get(Status.SeriouslyIll)},${a.Model.Result.Counts.get(Status.Recovered)},${a.Model.Result.Counts.get(Status.Dead)},${a.Model.HealthService.MedicsCritical},${a.Model.HealthService.BedsCritical},${a.Model.HealthService.ICUCritical},${a.Model.HealthService.VentilatorsCritical}`);
};