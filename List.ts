export class List<T> {
    private items: Array<T>;
    constructor(copy: List<T> = null) {
        this.items = [];

        if ((copy)) {
            copy.forEach(a => this.add(a));
        }

    }



    get size(): number {
        return this.items.length;
    }
    add(value: T): void {
        this.items.push(value);
    }
    get(index: number): T {
        return this.items[index];
    }

    set(index: number, value: T) {
        this.items[index] = value;
    }



    forEach(callback: (e: T) => void) {
        for (var i = 0; i < this.size; i++) {
            callback(this.get(i));
        }
    }
};
