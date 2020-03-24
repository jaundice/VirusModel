import { List } from "./List";
import { TriggerBase } from "./Trigger";
import { Model } from "./Model";

export class Triggers {
    private _triggers: List<TriggerBase> = new List<TriggerBase>();

    AddTrigger(trigger: TriggerBase) {
        this._triggers.add(trigger);
    }

    FireTriggers(model: Model) {
        for (var i = 0; i < this._triggers.size; i++) {
            this._triggers.get(i).Fire(model);
        }
    }
}