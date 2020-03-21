import { RunningConfig } from './RunningConfig';
import { Person } from './Person';
import { Environment } from './Environment';

export abstract class Policy {
    private _isActive: boolean;

    get IsActive() {
        return this._isActive;
    }
    set IsActive(active: boolean) {
        this._isActive = active;
    }

    ModifyRunningConfig(runningConfig: RunningConfig) {
        if (!this.IsActive) {
            return runningConfig;
        }

        return this.ModifyRunningConfigInternal(runningConfig);
    }

    CanPeopleMeetInEnvironment(person1: Person, person2: Person, environment: Environment): boolean {
        if (!this.IsActive)
            return true;

        return this.CanPeopleMeetInEnvironmentInternal(person1, person2, environment);
    }

    protected abstract ModifyRunningConfigInternal(runningConfig: RunningConfig): RunningConfig;

    protected abstract CanPeopleMeetInEnvironmentInternal(person1: Person, person2: Person, environment: Environment): boolean;


}