import { Policy } from "./Policy";
import { List } from "./List";
import { RunningConfig } from "./RunningConfig";
import { Person } from "./Person";
import { Model } from "./Model";
import { Environment } from "./Environment";

export class Policies {
    private _policies: List<Policy> = new List<Policy>();


    AddPolicy(policy: Policy) {
        this._policies.add(policy);
    }


    ApplyPolicies(runningConfig: RunningConfig): RunningConfig {
        var c = runningConfig;

        var p = this._policies.filter(a=>a.IsActive);

        for (var i = 0; i < p.size; i++) {
            c = p.get(i).ModifyRunningConfig(c);
        };

        return c;
    }

    UpdateModelFromPolicy(model:Model){
        this._policies.filter(a=>a.IsActive).forEach(a=> a.UpdateModel(model));
    }

    CanPeopleMeetInEnvironment(person1: Person, person2: Person, model: Model, environment: Environment): boolean {
        return this._policies.filter(a=>a.IsActive).all(p => p.CanPeopleMeetInEnvironment(person1, person2, model, environment));
    }

}