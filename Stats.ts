export class Stats {
    static getGaussianRandomGenerator(mean:number, standardDeviation:number): () => number {
        return () => {
            let q, u, v, p;
            do {
                u = 2.0 * Math.random() - 1.0;
                v = 2.0 * Math.random() - 1.0;
                q = u * u + v * v;
            } while (q >= 1.0 || q === 0);

            p = Math.sqrt(-2.0 * Math.log(q) / q);
            return mean + standardDeviation * u * p;
        };
    }

    static getUniform(min:number, max:number){
        return (Math.random() * (max - min))+min;
    }
};