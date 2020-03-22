import { Person } from "./Person";
import { List } from "./List";

export class Household {
    private _members: List<Person> = new List<Person>();
    get Members() {
        return this._members;
    }
}

export class Households{
    private _households:List<Household> = new List<Household>();

    get Households(){
        return this._households;
    }
}