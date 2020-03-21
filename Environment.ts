import { EnvironmentType } from "./EnvironmentType";

export class Environment {
    private _environmentType: EnvironmentType;
    private _interpersonalContactFactor: number;
    private _isKeyInfrastructure: boolean;

    get EnvironmentType() {
        return this._environmentType;
    }
    set EnvironmentType(environmentType: EnvironmentType) {
        this._environmentType = environmentType;
    }
    get InterpersonalContactFactor(): number {
        return this._interpersonalContactFactor;
    }
    set InterpersonalContactFactor(factor: number) {
        this._interpersonalContactFactor = factor;
    }
    get IsKeyInfrastructure() {
        return this._isKeyInfrastructure;
    }
    set IsKeyInfrastructure(isKey: boolean) {
        this._isKeyInfrastructure = isKey;
    }
};
