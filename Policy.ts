import { RunningConfig } from './RunningConfig';

export abstract class Policy {
    private _isActive: boolean;

    get IsActive() {
        return this._isActive;
    }
    set IsActive(active: boolean) {
        this._isActive = active;
    }

    ModifyRunningConfig(runningConfig:RunningConfig){
        if(!this.IsActive){
            return runningConfig;
        }

        return this.ModifyRunningConfigInternal(runningConfig);
    }

    protected abstract  ModifyRunningConfigInternal(runningConfig:RunningConfig ): RunningConfig; 

}