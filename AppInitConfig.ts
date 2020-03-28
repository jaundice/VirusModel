import { EnvironmentType } from "./EnvironmentType";
export class AppInitConfig {
    PopulationSize: number = 3000;
    NumberOfHouseholds: number = 900;
    //ProportionOfChildren: number = 0.15;
    //EnvironmentCounts: Map<EnvironmentType, number> = new Map<EnvironmentType, number>();
    MeanInterpersonalContactFactors: Map<EnvironmentType, number> = new Map<EnvironmentType, number>();
    MeanInterpersonalDeviation: Map<EnvironmentType, number> = new Map<EnvironmentType, number>();
    MeanPersonalSusceptability: number = 0.6;
    PersonalSuceptabilityDeviation: number = 0.15;
    //AsymptomaticTime: number = 7;
    //RecoveryTime: number = 14;
    //SeriousIllnessRatio: number = 1 / 8;
    //DeathRatio: number = 0.2;
    RandomInfectionProbability: number = 0.001; //a chance factor to be infected by a person external to the test e.g visit from infected family member / business road warrior / postman
    ReinfectionProbability: number = 0.01;
    ChildProgressionFactor: number = 0.2; //proportion of children who develop full symptoms;
    //MildSymptomsQuarantineFactor: number = 0.6;
    RetailLunchtimeFactor: number = 0.4; //proportion of office workers doing retail activity at lunch;
    SocialLunchFactor: number = 0.1; //proportion of office workers doing social activity at lunchtime ;
    SocialChildFactor: number = 0.3;
    SocialEveningFactor: number = 0.15;

    ChildRetailFactor: number = 0.2;

    EnvironmentCount: number = 30;
    MedicalStaffCount: number = 15;
    AvailableBeds: number = 30;
    AvailableICU: number = 5;
    AvailableVentilators: number = 8;
    EnvironmentKeyWorkerRatio: Map<EnvironmentType, number> =  new Map<EnvironmentType, number>();

};
