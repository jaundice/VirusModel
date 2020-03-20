import { Model } from "./Model";

export abstract class Trigger{
    abstract ShouldFire(model:Model):boolean;
}