import { Model } from "./Model";

export abstract class Trigger{
    abstract ShouldFire(model:Model):boolean;

    abstract FireInternal(model:Model):void;

    Fire(model:Model){
        if(this.ShouldFire(model)){
            this.FireInternal(model);
        }
    }

}