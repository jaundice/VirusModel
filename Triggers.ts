import { List } from "./List";
import { Trigger } from "./Trigger";
import { Model } from "./Model";

export class Triggers {
    private _triggers: List<Trigger> = new List<Trigger>();

    AddTrigger(trigger: Trigger) {
        this._triggers.add(trigger);
    }

    FireTriggers(model: Model) {
        for (var i = 0; i < this._triggers.size; i++) {
            this._triggers.get(i).Fire(model);
        }
    }
}