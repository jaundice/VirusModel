import { Status } from "./Status";

export class Result{
    Counts:Map<Status, number>;
    constructor(){
        this.Counts = new Map<Status, number>();
        this.Counts.set(Status.Clear, 0);
        this.Counts.set(Status.Incubation, 0);
        this.Counts.set(Status.Asymptomatic, 0);
        this.Counts.set(Status.MildlyIll, 0);
        this.Counts.set(Status.SeriouslyIll, 0);
        this.Counts.set(Status.Recovered, 0);
        this.Counts.set(Status.Dead, 0);
    }
}