export class List<T> implements Iterable<T>{
    private items: Array<T>;

    constructor(copy: List<T> = null) {
        this.items = [];

        if ((copy)) {
            copy.forEach(a => this.add(a));
        }

    }
    [Symbol.iterator](): Iterator<T, void, T> {
        var arr = this.items;
        function* iter (){
            for(var i=0;i<arr.length;i++){
                yield arr[i];
            }
        };
        return iter();
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

    any(callback: (e: T) => boolean){
        for(var i=0;i<this.items.length;i++){
            if(callback(this.items[i]))
                return true;
        }
        return false;
    }
};


