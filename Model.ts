import { HealthService } from "./HealthService";
import { Policies } from "./Policies";
import { Triggers } from "./Triggers";
import { RunningConfig } from "./RunningConfig";
import { Result } from "./Result";
import { Trigger } from "./Trigger";
import { Policy } from "./Policy";
import { Households } from "./Household";

export class Model {
    private _healthService: HealthService;
    private _policies: Policies = new Policies();
    private _triggers: Triggers = new Triggers();
    private _runningConfig: RunningConfig;
    private _households:Households = new Households();

    private _result: Result;

    get Households(){
        return this._households;
    }

    get Result(): Result {
        return this._result;
    }

    get RunningConfig(): RunningConfig {
        return this._runningConfig;
    }

    constructor(healthService: HealthService, triggers: Trigger[], policies: Policy[]) {
        this._healthService = healthService;
        for (var i = 0; i < triggers.length; i++) {
            this._triggers.AddTrigger(triggers[i]);
        }
        for (var j = 0; j < policies.length; j++) {
            this._policies.AddPolicy(policies[j]);
        }

    }

    private UpdateModel() {
        this._triggers.FireTriggers(this);
        this._runningConfig = this._policies.ApplyPolicies(this._runningConfig);
        this._healthService.UpdateProperties(this);
        this._healthService.UpdateFactors();
    }

    private UpdateResult() {

    }

    TimeElapsed() {
        this.UpdateModel()

        this.DoTimeInterval();

        this.UpdateResult()
    }


    private DoTimeInterval() {

    }

}