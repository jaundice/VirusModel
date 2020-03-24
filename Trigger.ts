import { Model } from "./Model";
import { Policy } from "./Policy";

export abstract class TriggerBase {
    abstract ShouldFire(model: Model): boolean;

    protected abstract FireInternal(model: Model): void;

    abstract Fire(model: Model): void;
}


export class PolicyTrigger extends TriggerBase {

    ShouldFire(model: Model): boolean {
        return this._shouldFireDelegate(model);
    }

    protected FireInternal(model: Model): void {
        this._policy.IsActive = this.ShouldFire(model);
    }

    Fire(model: Model) {
        this.FireInternal(model);
    }

    private _policy: Policy;
    private _shouldFireDelegate: (model: Model) => boolean;
    get Policy(): Policy {
        return this._policy;
    }

    constructor(policy: Policy, shouldFireDelegate: (model: Model) => boolean) {
        super();
        this._policy = policy;
        this._shouldFireDelegate = shouldFireDelegate;
    }

}