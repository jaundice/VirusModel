import { StatusHandler } from "./StatusHandler";
import { Environment } from './Environment';
import { AgeDemographic } from './Demographic';
import { BasicHealth } from './Health';
import { Disease } from "./Disease";
import { Status } from "./Status";


export class Person {
    private _statusHandler: StatusHandler;
    //private _susceptability: number;
    private _householdIndex: number;
    private _usualDaytimeEnvironment: Environment;
    private _isQuarantined: boolean;

    private _ageDemographic: AgeDemographic;
    private _health: BasicHealth;
    private _isKeyWorker:boolean;

    private _disease:Disease = new Disease(Status.Clear);
    
    get Disease():Disease{
        return this._disease;
    }

    set Disease(disease:Disease){
        this._disease = disease;
    }

    get IsKeyWorker(){
        return this._isKeyWorker;
    }

    get AgeDemographic() {
        return this._ageDemographic;
    }

    get Health(): BasicHealth {
        return this._health;
    }

    get StatusHandler(): StatusHandler {
        return this._statusHandler;
    }

    set StatusHandler(statusHandler: StatusHandler) {
        this._statusHandler = statusHandler;
    }

    get Susceptability(): number {
        return 1.0 - this.Health.HealthScore;  //this._susceptability;
    }

    // set susceptability(susceptability: number) {
    //     this._susceptability = susceptability;
    // }

    get HouseholdIndex(): number {
        return this._householdIndex;
    }

    set HouseholdIndex(index: number) {
        this._householdIndex = index;
    }

    get UsualDaytimeEnvironment() {
        return this._usualDaytimeEnvironment;
    }

    set UsualDaytimeEnvironment(env: Environment) {
        this._usualDaytimeEnvironment = env;
    }

    get IsQuarantined() {
        return this._isQuarantined;
    }

    set IsQuarantined(q: boolean) {
        this._isQuarantined = q;
    }

    constructor(ageDemographic: AgeDemographic, health: BasicHealth) {
        this._health = health;
        this._ageDemographic = ageDemographic;
    }
};