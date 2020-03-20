export abstract class Policy {
    private _isActive: boolean;
    
    get isActive() {
        return this._isActive;
    }
    set isActive(active: boolean) {
        this._isActive = active;
    }

}