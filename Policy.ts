import { RunningConfig } from './RunningConfig';
import { Person } from './Person';
import { Environment } from './Environment';
import { Model } from './Model';

export abstract class Policy {

    private _publicAdherance: number = 1;

    private _isActive: boolean;

    get IsActive() {
        return this._isActive;
    }
    set IsActive(active: boolean) {
        this._isActive = active;
    }

    get PublicAdherance() {
        return this._publicAdherance;
    }

    set PublicAdherance(adherance: number) {
        this._publicAdherance = adherance;
    }


    ModifyRunningConfig(runningConfig: RunningConfig) {
        if (!this.IsActive) {
            return runningConfig;
        }

        return this.ModifyRunningConfigInternal(runningConfig);
    }

    CanPeopleMeetInEnvironment(person1: Person, person2: Person, model: Model, environment: Environment): boolean {
        if (!this.IsActive)
            return true;

        return this.CanPeopleMeetInEnvironmentInternal(person1, person2, model, environment);
    }

    protected abstract ModifyRunningConfigInternal(runningConfig: RunningConfig): RunningConfig;

    protected abstract CanPeopleMeetInEnvironmentInternal(person1: Person, person2: Person, model: Model, environment: Environment): boolean;

    public abstract  UpdateModel(model:Model):void;

}



