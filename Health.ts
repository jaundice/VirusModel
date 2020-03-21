export class BasicHealth {
    private _heartdisease: boolean;
    private _asthma: boolean;
    private _autoImmune: boolean;
    private _diabetes: boolean;
    private _cancer: boolean;
    private _healthScore: number;
    constructor(heartDisease: boolean, asthma: boolean, autoImmune: boolean, diabetes: boolean, cancer: boolean) {
        this._heartdisease = heartDisease;
        this._asthma = asthma;
        this._autoImmune = autoImmune;
        this._diabetes = diabetes;
        this._cancer = cancer;
        var neg: number = 0;
        if (this.HasAsthma) {
            neg += 100;
        }
        if (this.HasAutoImmune) {
            neg += 100;
        }
        if (this.HasCancer) {
            neg += 100;
        }
        if (this.HasDiabetes) {
            neg += 100;
        }
        if (this.HasHeartDisease) {
            neg += 100;
        }
        this._healthScore = 1 - (Math.sqrt(neg) / 22.36);
    }
    /* breaking these out in case futher info becomes available about relative outcomes */
    get HasCancer(): boolean {
        return this._cancer;
    }
    get HasDiabetes() {
        return this._diabetes;
    }
    get HasAutoImmune() {
        return this._autoImmune;
    }
    get HasAsthma() {
        return this._asthma;
    }
    get HasHeartDisease() {
        return this._heartdisease;
    }
    get HealthScore() {
        return this._healthScore;
    }
}
