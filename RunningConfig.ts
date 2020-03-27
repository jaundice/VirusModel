import { AppInitConfig } from "./AppInitConfig";
import { EnvironmentType } from "./EnvironmentType";

export class RunningConfig {
    ReinfectionProbability: number;
    RandomInfectionProbability: number;
    RetailLunchtimeFactor: number;
    SocialLunchFactor: number;
    ChildRetailFactor: number;
    SocialEveningFactor: number;
    
    InterpersonalContactFactorModifier:Map<EnvironmentType, number>;
    
    constructor(initConfig: AppInitConfig | RunningConfig) {
        this.ReinfectionProbability = initConfig.ReinfectionProbability;
        this.RandomInfectionProbability = initConfig.RandomInfectionProbability;
        this.RetailLunchtimeFactor = initConfig.RetailLunchtimeFactor;
        this.SocialEveningFactor = initConfig.SocialEveningFactor;
        this.ChildRetailFactor = initConfig.ChildRetailFactor;
        this.SocialLunchFactor = initConfig.SocialLunchFactor;

        this.InterpersonalContactFactorModifier = new Map<EnvironmentType, number>();
        this.InterpersonalContactFactorModifier.set(EnvironmentType.Entertainment, 1);
        this.InterpersonalContactFactorModifier.set(EnvironmentType.Factory, 1);
        this.InterpersonalContactFactorModifier.set(EnvironmentType.Home, 1);
        this.InterpersonalContactFactorModifier.set(EnvironmentType.Hospital, 1);
        this.InterpersonalContactFactorModifier.set(EnvironmentType.Logistics, 1);
        this.InterpersonalContactFactorModifier.set(EnvironmentType.Office, 1);
        this.InterpersonalContactFactorModifier.set(EnvironmentType.Outdoors, 1);
        this.InterpersonalContactFactorModifier.set(EnvironmentType.Retail, 1);
        this.InterpersonalContactFactorModifier.set(EnvironmentType.School, 1);
    
    }
}