import { Policy } from "./Policy";
import { List } from "./List";
import { RunningConfig } from "./RunningConfig";

export class Policies{
    private _policies:List<Policy> = new List<Policy>();


    AddPolicy(policy:Policy){
        this._policies.add(policy);
    }


    ApplyPolicies(runningConfig:RunningConfig):RunningConfig{
        var c = runningConfig;
        for(var i=0;i<this._policies.size; i++) {
         c = this._policies.get(i).ModifyRunningConfig(c);   
        };

        return c;
    }

}