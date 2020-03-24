import { AppInitConfig } from "./AppInitConfig";

export class RunningConfig {
    ReinfectionProbability: number;
    RandomInfectionProbability: number;
    RetailLunchtimeFactor: number;
    SocialLunchFactor: number;
    ChildRetailFactor: number;
    SocialEveningFactor: number;
    InterpersonalContactFactorModifier: number;
    
    constructor(initConfig: AppInitConfig | RunningConfig) {
        this.ReinfectionProbability = initConfig.ReinfectionProbability;
        this.RandomInfectionProbability = initConfig.RandomInfectionProbability;
        this.RetailLunchtimeFactor = initConfig.RetailLunchtimeFactor;
        this.SocialEveningFactor = initConfig.SocialEveningFactor;
        this.ChildRetailFactor = initConfig.ChildRetailFactor;
        this.SocialLunchFactor = initConfig.SocialLunchFactor;
    }
}