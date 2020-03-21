import { HealthService } from "./HealthService";
import { Policies } from "./Policies";
import { Triggers } from "./Triggers";
import { RunningConfig } from "./RunningConfig";
import { Result } from "./Result";

export class Model {
    private _healthService: HealthService;
    private _policies: Policies;
    private _triggers: Triggers;
    private _runningConfig: RunningConfig;

    private _result: Result;

    get Result(): Result {
        return this._result;
    }

    get RunningConfig(): RunningConfig {
        return this._runningConfig;
    }

    UpdateModel() {
        this._triggers.FireTriggers(this);
        this._runningConfig = this._policies.ApplyPolicies(this._runningConfig);
        this._healthService.Update(this);
        this._healthService.UpdateFactors();
    }

    UpdateResult() {

    }

    TimeElapsed() {
        this.UpdateModel()

        this.DoTimeInterval();

        this.UpdateResult()
    }


    private DoTimeInterval() {

    }

}