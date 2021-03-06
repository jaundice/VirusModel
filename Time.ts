export class Time {
    private _day: number = 0;
    private _hour: number = 0;
    get Day() {
        return this._day;
    }
    get Hour() {
        return this._hour;
    }
    set Day(d: number) {
        this._day = d;
    }

    set Hour(h: number) {
        this._hour = h;
    }
    Reset() {
        this._day = 0;
        this._hour = 0;
    }
    Tick() {
        this._hour++;
        if (this._hour > 23) {
            this._day++;
            this._hour = 0;
        }
    }
};
