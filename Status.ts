/*

Clear -> 
            Incubation ->
                            Asymptomatic -> Recovered
                            MildyIll     -> Recovered                            
                                            SeriouslyIll -> Recovered
                                                            Dead

*/


export enum Status {
    Clear,
    Incubation,
    Asymptomatic,
    MildlyIll,
    SeriouslyIll,
    Dead,
    Recovered
};
