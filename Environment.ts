import { EnvironmentType } from "./EnvironmentType";

export class Environment {
    private _environmentType: EnvironmentType;
    private _interpersonalContactFactor: number;
    get environmentType() {
        return this._environmentType;
    }
    set environmentType(environmentType: EnvironmentType) {
        this._environmentType = environmentType;
    }
    get interpersonalContactFactor(): number {
        return this._interpersonalContactFactor;
    }
    set interpersonalContactFactor(factor: number) {
        this._interpersonalContactFactor = factor;
    }
};
