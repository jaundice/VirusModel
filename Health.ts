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
            neg += 1.073 * 1.073;
        }
        if (this.HasAutoImmune || this.HasCancer) {
            neg += 1.056 * 1.056;
        }
        // if (this.HasCancer) {
        //     neg += 100;
        // }
        if (this.HasDiabetes) {
            neg += 1.063 * 1.063;
        }
        if (this.HasHeartDisease) {
            neg += 1.106 * 1.106;
        }
        this._healthScore = 1 - (Math.sqrt(neg) / 2.1493);
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
