import { Status } from './Status';
import { Person } from './Person';
import { Environment } from './Environment';
import { Time } from './Time';


export abstract class StatusHandler {
    private _status: Status;
    protected _infectiousness:number;

    private _time:Time = new Time(); 

    get Time (): Time{
        return this._time;
    }

    get Status(): Status {
        return this._status;
    }
    protected constructor(status:Status){
        this._status = status;
    }
  
    abstract get Infectiousness():number; 

    Tick(){
        this.Time.Tick();
    }
};


export class CleanStatusHandler extends StatusHandler{

    public constructor(){
        super(Status.Clear);
        this._infectiousness = 0;
    }
  
    get Infectiousness(){
        return this._infectiousness;
    }

    Tick(){
        super.Tick();
        //do nothing
    }
};

export class IncubatorStatusHandler extends StatusHandler{
    get Infectiousness(): number {
        return this._infectiousness;
    }

    constructor(){
        super(Status.Incubation)
        this._infectiousness = 0.6;
    }
    
    Tick(){
        super.Tick();
        //do nothing
    }
}

export class AsymptomaticStatusHandler extends StatusHandler{

    public constructor(){
        super(Status.Asymptomatic);
        this._infectiousness = 0.8;
    }
  
    get Infectiousness(){
        return this._infectiousness;
    }

    Tick(){
        super.Tick();
        this._infectiousness *= 0.95; //todo vary infectiousness by time;
    }
};

export class DeadStatusHandler extends StatusHandler{

    public constructor(){
        super(Status.Dead);
    }
  
    get Infectiousness(){
        return 0;
    }

    Tick(){
        //still dead
    }

};

export class MildStatusHandler extends StatusHandler{

    public constructor(){
        super(Status.MildlyIll);
        this._infectiousness = 0.6;
    }
  
    get Infectiousness(){
        return this._infectiousness;
    }

    Tick(){ //todo vary infectiousness by time;
        super.Tick();
    }
};

export class SeriousStatusHandler extends StatusHandler{

    public constructor(){
        super(Status.SeriouslyIll);
        this._infectiousness = 1;
    }
  
    get Infectiousness(){
        return this._infectiousness;
    }

    Tick(){
        super.Tick(); //todo vary infectiousness by time;
    }
};


export class RecoveredStatusHandler extends StatusHandler{

    public constructor(){
        super(Status.Recovered);
        this._infectiousness = 0;
    }
  
    get Infectiousness(){
        return this._infectiousness;
    }

    Tick(){
        super.Tick(); //todo vary infectiousness by time;
    }
};