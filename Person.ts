import { StatusHandler } from "./StatusHandler";
import { Environment } from './Environment';


export class Person {
    private _statusHandler: StatusHandler;
    private _susceptability: number;
    private _householdIndex: number;
    private _usualDaytimeEnvironment: Environment;
    private _isQuarantined: boolean;

    get statusHandler(): StatusHandler {
        return this._statusHandler;
    }

    set statusHandler(statusHandler: StatusHandler) {
        this._statusHandler = statusHandler;
    }

    get susceptability(): number {
        return this._susceptability;
    }

    set susceptability(susceptability: number) {
        this._susceptability = susceptability;
    }

    get householdIndex(): number {
        return this._householdIndex;
    }

    set householdIndex(index: number) {
        this._householdIndex = index;
    }

    get usualDaytimeEnvironment() {
        return this._usualDaytimeEnvironment;
    }

    set usualDaytimeEnvironment(env: Environment) {
        this._usualDaytimeEnvironment = env;
    }

    get isQuarantined(){
        return this._isQuarantined;
    }

    set isQuarantined(q: boolean) {
        this._isQuarantined = q;
    }
};