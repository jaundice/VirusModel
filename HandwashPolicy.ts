import { RunningConfig } from './RunningConfig';
import { Person } from './Person';
import { Environment } from './Environment';
import { Model } from './Model';
import { Policy } from './Policy';


export class HandwashPolicy extends Policy {

    private _modifyFactor:number;

    protected ModifyRunningConfigInternal(runningConfig: RunningConfig): RunningConfig {
        runningConfig.InterpersonalContactFactorModifier.forEach((a,b)=> runningConfig.InterpersonalContactFactorModifier.set(b, a* this._modifyFactor));
        return runningConfig;
    }
    protected CanPeopleMeetInEnvironmentInternal(person1: Person, person2: Person, model: Model, environment: Environment): boolean {
        return true;
    }
    public UpdateModel(model: Model): void {
        
    }

    constructor(modifyFactor:number){
        super();
        this._modifyFactor = modifyFactor;
    }

}
