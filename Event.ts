import { Time } from "./Time";

export abstract class Event{

    private _elapsedTime:Time ;

    get ElapsedTime():Time{
        return this._elapsedTime;
    } 
    

}